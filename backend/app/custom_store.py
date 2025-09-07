import json
from pathlib import Path
import numpy as np

BASE = Path(__file__).resolve().parent.parent  # .../backend
STORE_DIR = BASE / "custom_store"
STORE_DIR.mkdir(parents=True, exist_ok=True)

def _user_path(user_id: str) -> Path:
    return STORE_DIR / f"{user_id}.json"

def load_user(user_id: str):
    p = _user_path(user_id)
    if not p.exists():
        return {"labels": {}}  # {label: {"samples":[[...]], "prototype":[...]}}
    with open(p, "r") as f:
        return json.load(f)

def save_user(user_id: str, data: dict):
    with open(_user_path(user_id), "w") as f:
        json.dump(data, f)

def add_samples(user_id: str, label: str, samples: list):
    """samples: list of normalized 63-d vectors (lists of floats)"""
    data = load_user(user_id)
    labels = data.setdefault("labels", {})
    entry = labels.setdefault(label, {"samples": [], "prototype": None})
    entry["samples"].extend(samples)
    arr = np.array(entry["samples"], dtype=np.float32)
    entry["prototype"] = arr.mean(axis=0).tolist()  # simple prototype = mean
    save_user(user_id, data)

def get_prototypes(user_id: str):
    data = load_user(user_id)
    out = {}
    for label, info in data.get("labels", {}).items():
        proto = info.get("prototype")
        if proto is not None:
            out[label] = np.array(proto, dtype=np.float32)
    return out

def list_labels(user_id: str):
    data = load_user(user_id)
    return sorted(list(data.get("labels", {}).keys()))
