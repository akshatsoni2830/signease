# backend/app/lessons.py
import numpy as np

# Simple placeholder references (zeros). Replace at runtime or via admin UI.
# Key = label used by your classifier or custom gestures.
LESSON_REFS = {
    "A": np.zeros(63, dtype=np.float32),
    "B": np.zeros(63, dtype=np.float32),
    "HELLO": np.zeros(63, dtype=np.float32),
    "THANK_YOU": np.zeros(63, dtype=np.float32),
    # add more as you seed real vectors
}
