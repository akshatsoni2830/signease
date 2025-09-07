import os, json
from pathlib import Path
import numpy as np
import mediapipe as mp
import tensorflow as tf
import cv2

BASE = Path(__file__).resolve().parent.parent   # .../backend
MODEL_DIR = BASE / "models"
MODEL_PATH  = MODEL_DIR / "asl_model.h5"
LABELS_PATH = MODEL_DIR / "labels.json"
NORM_PATH   = MODEL_DIR / "norm.json"

# Load assets once
model = tf.keras.models.load_model(MODEL_PATH)
with open(LABELS_PATH, "r") as f: LABELS = json.load(f)
with open(NORM_PATH, "r") as f:
    norm = json.load(f)
X_MEAN = np.array(norm["mean"], dtype=np.float32).reshape(1, -1)
X_STD  = np.array(norm["std"],  dtype=np.float32).reshape(1, -1)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1,
                       min_detection_confidence=0.5, min_tracking_confidence=0.5)

hands_calib = mp_hands.Hands(static_image_mode=True, max_num_hands=1,
                             min_detection_confidence=0.6, min_tracking_confidence=0.5)

def _normalize(vec63: np.ndarray) -> np.ndarray:
    return (vec63 - X_MEAN) / X_STD

def extract_landmarks_from_bgr_image(bgr_image):
    rgb = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)
    res = hands.process(rgb)
    if not res.multi_hand_landmarks:
        return None
    lm = res.multi_hand_landmarks[0]
    vec = []
    for p in lm.landmark:
        vec.extend([p.x, p.y, p.z])
    return np.array(vec, dtype=np.float32).reshape(1, -1)

def predict_from_landmarks(landmark_vec):
    if landmark_vec is None:
        return ("NOTHING", 0.0)
    v = _normalize(landmark_vec)
    preds = model.predict(v, verbose=0)
    idx = int(preds.argmax(axis=1)[0])
    conf = float(preds[0, idx])
    label = LABELS[idx] if 0 <= idx < len(LABELS) else "UNKNOWN"
    if conf < 0.60:
        return ("NOTHING", conf)
    return (label, conf)

def normalize_vec(vec63_batch: np.ndarray) -> np.ndarray:
    # vec63_batch: (N,63) or (1,63)
    return (vec63_batch - X_MEAN) / X_STD

def extract_landmarks_static(bgr_image):
    rgb = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)
    res = hands_calib.process(rgb)
    if not res.multi_hand_landmarks:
        return None
    lm = res.multi_hand_landmarks[0]
    vec = []
    for p in lm.landmark:
        vec.extend([p.x, p.y, p.z])
    return np.array(vec, dtype=np.float32).reshape(1, -1)
