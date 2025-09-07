import cv2
import mediapipe as mp
import numpy as np
import os
from tqdm import tqdm

# Paths
DATA_DIR = "A:/projects/signease/backend/data/asl_alphabet_train"
OUTPUT_X = "A:/projects/signease/backend/processed/X.npy"
OUTPUT_Y = "A:/projects/signease/backend/processed/y.npy"

# Mediapipe hands setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

X, y = [], []
labels = sorted(os.listdir(DATA_DIR))  # A, B, C ... Z, DELETE, SPACE, NOTHING
label_map = {label: idx for idx, label in enumerate(labels)}

print("Labels:", label_map)

for label in labels:
    folder = os.path.join(DATA_DIR, label)
    if not os.path.isdir(folder):
        continue

    for file in tqdm(os.listdir(folder), desc=f"Processing {label}"):
        path = os.path.join(folder, file)
        img = cv2.imread(path)
        if img is None:
            continue

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)

        if results.multi_hand_landmarks:
            landmarks = []
            for lm in results.multi_hand_landmarks[0].landmark:
                landmarks.extend([lm.x, lm.y, lm.z])
            X.append(landmarks)
            y.append(label_map[label])

X = np.array(X)
y = np.array(y)

os.makedirs("processed", exist_ok=True)
np.save(OUTPUT_X, X)
np.save(OUTPUT_Y, y)

print("✅ Preprocessing complete")
print("X shape:", X.shape, "y shape:", y.shape)
