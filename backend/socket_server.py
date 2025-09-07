import asyncio
import json
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.model_utils import extract_landmarks_from_bgr_image, predict_from_landmarks, normalize_vec
from app.custom_store import get_prototypes

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "frame":
                # Process frame for sign language detection
                frame_data = message.get("frame")
                if frame_data:
                    # Convert base64 frame to numpy array
                    import base64
                    frame_bytes = base64.b64decode(frame_data.split(',')[1])
                    nparr = np.frombuffer(frame_bytes, np.uint8)
                    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    
                    # Extract landmarks and predict
                    landmarks = extract_landmarks_from_bgr_image(img)
                    if landmarks is not None:
                        # Try custom prototypes first
                        proto_map = get_prototypes("default")  # You might want to pass user_id here
                        if proto_map:
                            v = normalize_vec(landmarks).reshape(-1)
                            v_norm = float(np.linalg.norm(v) + 1e-8)
                            best_label, best_sim = None, -1.0
                            for lbl, proto in proto_map.items():
                                sim = float(np.dot(v, proto) / (v_norm * (np.linalg.norm(proto) + 1e-8)))
                                if sim > best_sim:
                                    best_label, best_sim = lbl, sim
                            if best_sim >= 0.90:
                                response = {
                                    "type": "prediction",
                                    "prediction": best_label,
                                    "confidence": best_sim
                                }
                                await manager.send_personal_message(json.dumps(response), websocket)
                                continue
                        
                        # Fallback to global classifier
                        label, conf = predict_from_landmarks(landmarks)
                        response = {
                            "type": "prediction",
                            "prediction": label,
                            "confidence": conf
                        }
                        await manager.send_personal_message(json.dumps(response), websocket)
                    else:
                        response = {
                            "type": "prediction",
                            "prediction": "NO_HAND",
                            "confidence": 0.0
                        }
                        await manager.send_personal_message(json.dumps(response), websocket)
            
            elif message.get("type") == "ping":
                await manager.send_personal_message(json.dumps({"type": "pong"}), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
