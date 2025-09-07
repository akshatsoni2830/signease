# backend/train.py
import os, json
from pathlib import Path
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

BASE = Path(__file__).resolve().parent
X_PATH = BASE / "processed" / "X.npy"
Y_PATH = BASE / "processed" / "y.npy"
DATA_DIR = BASE / "data" / "asl_alphabet_train"
MODEL_DIR = BASE / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH  = MODEL_DIR / "asl_model.h5"
LABELS_PATH = MODEL_DIR / "labels.json"
NORM_PATH   = MODEL_DIR / "norm.json"

# ---- Load data
X = np.load(X_PATH).astype("float32")   # (N,63)
y = np.load(Y_PATH).astype("int64")
num_classes = int(y.max() + 1)
print(f"Loaded X: {X.shape}, y: {y.shape}, classes: {num_classes}")

# ---- Normalize (z-score) and save stats
X_mean = X.mean(axis=0, keepdims=True)
X_std  = X.std(axis=0, keepdims=True) + 1e-6
X_norm = (X - X_mean) / X_std

# ---- Split
X_tr, X_val, y_tr, y_val = train_test_split(X_norm, y, test_size=0.15, random_state=42, stratify=y)

# ---- Class weights (handles imbalance)
classes = np.arange(num_classes)
class_weights = compute_class_weight(class_weight="balanced", classes=classes, y=y_tr)
class_weights = {i: float(w) for i, w in enumerate(class_weights)}
print("Class weights:", class_weights)

# ---- Model
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(63,)),
    tf.keras.layers.Dense(256, activation="relu"),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(num_classes, activation="softmax"),
])
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

callbacks = [
    tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=5, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-5, verbose=1),
]

history = model.fit(
    X_tr, y_tr,
    validation_data=(X_val, y_val),
    epochs=40,
    batch_size=128,
    class_weight=class_weights,
    callbacks=callbacks,
    verbose=1
)

val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
print(f"Validation accuracy: {val_acc:.4f}")

# ---- Save model & artifacts
model.save(MODEL_PATH)
print(f"Saved model to {MODEL_PATH}")

norm = {"mean": X_mean.reshape(-1).tolist(), "std": X_std.reshape(-1).tolist()}
with open(NORM_PATH, "w") as f: json.dump(norm, f)
print(f"Saved normalization to {NORM_PATH}")

# labels must match preprocess order
labels = sorted([d for d in os.listdir(DATA_DIR) if (DATA_DIR/d).is_dir()])
with open(LABELS_PATH, "w") as f: json.dump(labels, f)
print(f"Saved labels to {LABELS_PATH}")
