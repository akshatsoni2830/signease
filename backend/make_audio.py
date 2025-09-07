# backend/make_audio.py
import os, json, wave
from piper import PiperVoice

MODEL_PATH = r"C:\piper\models\en-us-lessac-medium.onnx"   # <- your model
CONFIG_PATH = r"C:\piper\models\en-us-lessac-medium.onnx.json"                         # same name + .json
OUT_WAV = r"A:\projects\signease\backend\A.wav"  

# Help Piper find eSpeak-NG
os.environ.setdefault("ESPEAKNG_DATA_PATH", r"C:\piper\espeak-ng-data")

TEXT = (
    "This is the A S L letter A. "
    "Make a fist, with your thumb along the side of your index finger."
)

# Load config for sample rate
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    cfg = json.load(f)
SAMPLE_RATE = int(
    cfg.get("sample_rate")
    or (cfg.get("audio") or {}).get("sample_rate")
    or 22050
)

voice = PiperVoice.load(MODEL_PATH)

def synth_to_wav(text: str, wav_path: str, sr: int):
    pcm_chunks = []
    for chunk in voice.synthesize(text):
        # ✅ use built-in property
        pcm_chunks.append(chunk.audio_int16_bytes)

    pcm = b"".join(pcm_chunks)

    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1)       # mono
        wf.setsampwidth(2)       # 16-bit
        wf.setframerate(sr)
        wf.writeframes(pcm)

synth_to_wav(TEXT, OUT_WAV, SAMPLE_RATE)
print("✅ Wrote:", OUT_WAV, "| SR:", SAMPLE_RATE)
