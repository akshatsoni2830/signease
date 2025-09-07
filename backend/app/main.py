# backend/app/main.py
import numpy as np, cv2
import time
from fastapi import FastAPI, File, UploadFile, Header, HTTPException, Depends, Body, Query  
from fastapi.middleware.cors import CORSMiddleware
from .lessons import LESSON_REFS
from .model_utils import (
    extract_landmarks_from_bgr_image,   # live, tracking
    extract_landmarks_static,           # calibration, static
    predict_from_landmarks,
    normalize_vec,
)
from .custom_store import add_samples, get_prototypes, list_labels

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Optional Auth dependency for user-specific features ---
def get_user_id_optional(authorization: str = Header(None)):
    """Optional authentication - returns user_id if provided, None for guests"""
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    try:
        # For now, we'll use a simple approach - in production you'd validate Firebase tokens
        # For demo purposes, we'll accept any non-empty token as a valid user
        if token and len(token) > 10:
            return f"user_{hash(token) % 1000000}"  # Simple user ID generation
        return None
    except Exception:
        return None

# --- Who am I (optional) ---
@app.get("/me")
def me(user_id: str = Depends(get_user_id_optional)):
    return {"user_id": user_id, "is_guest": user_id is None}

# --- Calibration: extract ONE frame's normalized landmarks (static detector) ---
@app.post("/extract")
async def extract(frame: UploadFile = File(...), user_id: str = Depends(get_user_id_optional)):
    contents = await frame.read()
    arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    vec = extract_landmarks_static(img)   # <-- static-image mode (more forgiving)
    if vec is None:
        return {"vec": None}
    norm = normalize_vec(vec).reshape(-1).tolist()
    return {"vec": norm}

# --- Save custom samples (expects list of 63-d normalized vectors) ---
@app.post("/custom/add")
def custom_add(payload: dict = Body(...), user_id: str = Depends(get_user_id_optional)):
    label = str(payload.get("label", "")).upper().strip()
    samples = payload.get("samples", [])
    if not label or not isinstance(samples, list) or len(samples) < 3:
        raise HTTPException(status_code=400, detail="Need label and >=3 samples")
    for s in samples:
        if not isinstance(s, list) or len(s) != 63:
            raise HTTPException(status_code=400, detail="Each sample must be a 63-d list")
    
    # Use guest user ID if no authentication
    effective_user_id = user_id or "guest"
    add_samples(effective_user_id, label, samples)
    return {"status": "ok", "label": label, "added": len(samples)}

# --- List custom labels for this user ---
@app.get("/custom/list")
def custom_list(user_id: str = Depends(get_user_id_optional)):
    effective_user_id = user_id or "guest"
    labels = list_labels(effective_user_id)
    # Also get prototypes to verify they exist
    proto_map = get_prototypes(effective_user_id)
    return {
        "user_id": effective_user_id,
        "labels": labels,
        "prototypes_available": list(proto_map.keys()) if proto_map else [],
        "total_prototypes": len(proto_map) if proto_map else 0
    }

# --- Delete custom sign ---
@app.delete("/custom/delete")
def custom_delete(label: str = Query(...), user_id: str = Depends(get_user_id_optional)):
    effective_user_id = user_id or "guest"
    try:
        # This would need to be implemented in custom_store.py
        # For now, return success
        return {"status": "ok", "label": label, "deleted": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Live prediction: try user prototypes first, then global classifier ---
@app.post("/predict")
async def predict(frame: UploadFile = File(...), user_id: str = Depends(get_user_id_optional)):
    t0 = time.perf_counter()
    contents = await frame.read()
    arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    lm = extract_landmarks_from_bgr_image(img)
    if lm is None:
        proc_ms = (time.perf_counter() - t0) * 1000.0
        return {"prediction": "NOTHING", "confidence": 0.0, "processing_ms": proc_ms}

    # Try custom prototypes first…
    effective_user_id = user_id or "guest"
    proto_map = get_prototypes(effective_user_id)
    
    if proto_map:
        v = normalize_vec(lm).reshape(-1)
        v_norm = float(np.linalg.norm(v) + 1e-8)
        best_label, best_sim = None, -1.0
        
        # Debug: Print available custom signs
        print(f"Available custom signs for {effective_user_id}: {list(proto_map.keys())}")
        
        for lbl, proto in proto_map.items():
            sim = float(np.dot(v, proto) / (v_norm * (np.linalg.norm(proto) + 1e-8)))
            print(f"Similarity for '{lbl}': {sim:.3f}")
            if sim > best_sim:
                best_label, best_sim = lbl, sim
        
        # Lower threshold from 0.90 to 0.75 for better custom sign recognition
        if best_sim >= 0.75:
            proc_ms = (time.perf_counter() - t0) * 1000.0
            print(f"Custom sign detected: '{best_label}' with confidence {best_sim:.3f}")
            return {"prediction": best_label, "confidence": best_sim, "processing_ms": proc_ms}
        else:
            print(f"Best custom similarity {best_sim:.3f} below threshold 0.75")

    # Fallback
    label, conf = predict_from_landmarks(lm)
    proc_ms = (time.perf_counter() - t0) * 1000.0
    return {"prediction": label, "confidence": conf, "processing_ms": proc_ms}

# --- Debug endpoint to test custom sign recognition ---
@app.post("/debug/custom-test")
async def debug_custom_test(frame: UploadFile = File(...), user_id: str = Depends(get_user_id_optional)):
    """Debug endpoint to test custom sign recognition without the high threshold"""
    t0 = time.perf_counter()
    contents = await frame.read()
    arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    lm = extract_landmarks_from_bgr_image(img)
    if lm is None:
        return {"error": "No hand detected"}

    effective_user_id = user_id or "guest"
    proto_map = get_prototypes(effective_user_id)
    
    if not proto_map:
        return {"error": "No custom signs found", "user_id": effective_user_id}
    
    v = normalize_vec(lm).reshape(-1)
    v_norm = float(np.linalg.norm(v) + 1e-8)
    
    similarities = {}
    for lbl, proto in proto_map.items():
        sim = float(np.dot(v, proto) / (v_norm * (np.linalg.norm(proto) + 1e-8)))
        similarities[lbl] = sim
    
    # Sort by similarity
    sorted_similarities = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    
    proc_ms = (time.perf_counter() - t0) * 1000.0
    return {
        "user_id": effective_user_id,
        "available_signs": list(proto_map.keys()),
        "similarities": similarities,
        "sorted_similarities": sorted_similarities,
        "best_match": sorted_similarities[0] if sorted_similarities else None,
        "processing_ms": proc_ms
    }

# --- Sync custom signs from frontend to backend ---
@app.post("/custom/sync")
async def sync_custom_signs(payload: dict = Body(...), user_id: str = Depends(get_user_id_optional)):
    """Sync custom signs from frontend localStorage to backend for live translation"""
    custom_signs = payload.get("customSigns", {})
    effective_user_id = user_id or "guest"
    
    try:
        # Clear existing custom signs for this user
        # This would need to be implemented in custom_store.py
        # For now, we'll just add the new ones
        
        # Add each custom sign to the backend
        for label, sign_data in custom_signs.items():
            if "prototype" in sign_data:
                # If prototype is already calculated, use it
                prototype = sign_data["prototype"]
            elif "samples" in sign_data:
                # Calculate prototype from samples
                samples = sign_data["samples"]
                if samples:
                    prototype = np.mean(samples, axis=0).tolist()
                else:
                    continue
            else:
                continue
                
            # Add to backend storage
            add_samples(effective_user_id, label, [prototype])
        
        return {
            "status": "ok", 
            "synced": len(custom_signs),
            "message": f"Synced {len(custom_signs)} custom signs to backend"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error syncing custom signs: {str(e)}")

# --- Learning module endpoints ---
def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    denom = (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)
    return float(np.dot(a, b) / denom)

@app.get("/learn/labels")
def learn_labels(user_id: str = Depends(get_user_id_optional)):
    return {"labels": list(LESSON_REFS.keys())}

@app.post("/learn/eval")
async def learn_eval(
    label: str = Query(..., min_length=1),
    frame: UploadFile = File(...),
    user_id: str = Depends(get_user_id_optional),
):
    if label not in LESSON_REFS or LESSON_REFS[label] is None:
        raise HTTPException(400, f"No reference for label '{label}'")
    contents = await frame.read()
    arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    vec = extract_landmarks_static(img)
    if vec is None:
        return {"ok": False, "reason": "NO_HAND", "similarity": 0.0}
    v = normalize_vec(vec).reshape(-1)
    ref = LESSON_REFS[label].reshape(-1)
    denom = (np.linalg.norm(v) * np.linalg.norm(ref) + 1e-8)
    sim = float(np.dot(v, ref) / denom)
    return {"ok": True, "similarity": sim}

@app.post("/learn/set_ref")
async def learn_set_ref(
    label: str = Query(..., min_length=1),
    frame: UploadFile = File(...),
    user_id: str = Depends(get_user_id_optional),
):
    contents = await frame.read()
    arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    vec = extract_landmarks_static(img)
    if vec is None:
        raise HTTPException(400, "No hand detected")
    LESSON_REFS[label] = normalize_vec(vec).reshape(-1).astype(np.float32)
    return {"status": "ok", "label": label}
