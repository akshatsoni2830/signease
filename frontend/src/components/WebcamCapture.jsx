import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { predictFrame } from "../api";
import HUD from "./HUD";

const videoConstraints = { width: 640, height: 480, facingMode: "user" };

// Local storage functions for custom signs
const CUSTOM_SIGNS_KEY = 'customSigns';

const loadCustomSignsFromLocal = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_SIGNS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

export default function WebcamCapture() {
  const webcamRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [prediction, setPrediction] = useState("-");
  const [confidence, setConfidence] = useState(0);
  const [lastSpoken, setLastSpoken] = useState("");
  const [fps, setFps] = useState(0);
  const [rttMs, setRttMs] = useState(0);
  const [serverMs, setServerMs] = useState(0);
  const [customSigns, setCustomSigns] = useState({});
  const [backendError, setBackendError] = useState(false);

  // Load custom signs on component mount
  useEffect(() => {
    const savedSigns = loadCustomSignsFromLocal();
    setCustomSigns(savedSigns);
    
    // Sync custom signs to backend for live translation
    if (Object.keys(savedSigns).length > 0) {
      syncCustomSignsToBackend(savedSigns);
    }
  }, []);

  const syncCustomSignsToBackend = async (signs) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/custom/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customSigns: signs })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Custom signs synced to backend:', result.message);
      } else {
        console.error('Failed to sync custom signs to backend');
      }
    } catch (error) {
      console.error('Error syncing custom signs to backend:', error);
    }
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  };

  const tick = async () => {
    if (!webcamRef.current) return;
    const start = performance.now();

    const dataUrl = webcamRef.current.getScreenshot();
    if (!dataUrl) return;
    const blob = await fetch(dataUrl).then((r) => r.blob());

    try {
      const tSend = performance.now();
      const { prediction: label, confidence: conf, processing_ms } = await predictFrame(blob);
      const tRecv = performance.now();

      // Reset backend error if successful
      setBackendError(false);

      // Perf metrics
      const rtt = tRecv - tSend;         // total round-trip
      const frameDur = tRecv - start;    // capture + send + server + receive
      // Simple EMA for fps
      const instFps = 1000 / Math.max(frameDur, 1);
      setFps((prev) => prev ? prev * 0.8 + instFps * 0.2 : instFps);
      setRttMs(rtt);
      setServerMs(processing_ms ?? 0);

      // existing prediction UI + TTS...
      setPrediction(label);
      setConfidence(conf);
      
      // Dispatch translation event for history
      if (label && label !== "NOTHING") {
        window.dispatchEvent(new CustomEvent('translation-complete', {
          detail: { prediction: label, confidence: conf }
        }));
      }
      
      // speak if confident and changed...
      if (label && label !== "NOTHING" && conf >= 0.7 && label !== lastSpoken) {
        const spoken = label === "SPACE" ? "space" : label === "DELETE" ? "delete" : label;
        speak(spoken);
        setLastSpoken(label);
      }
    } catch (e) {
      console.error("Prediction error:", e?.message || e);
      setBackendError(true);
      setPrediction("Backend Error");
      setConfidence(0);
    }
  };

  useEffect(() => {
    let id;
    if (running) {
      id = setInterval(tick, 250); // ~4 fps; raise to 200ms if smooth
    }
    return () => clearInterval(id);
  }, [running]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-8)',
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'var(--space-6)',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow)',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: 'var(--fs-h2)',
          fontWeight: '700',
          color: 'var(--text)',
          textAlign: 'center',
          margin: '0 0 var(--space-6) 0',
        }}>
          Live Translation
        </h2>

        {/* Backend Error Warning */}
        {backendError && (
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--error-light)',
            border: '1px solid var(--error)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--space-6)',
            textAlign: 'center',
            fontSize: 'var(--fs-body)',
            color: 'var(--error)',
          }}>
            ⚠️ Backend server is not running. Please start the backend server for live translation.
          </div>
        )}

        {/* Custom Signs Info */}
        {Object.keys(customSigns).length > 0 && (
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--accent)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--space-6)',
            textAlign: 'center',
            fontSize: 'var(--fs-body)',
            color: 'var(--text)',
          }}>
            📚 {Object.keys(customSigns).length} custom sign(s) available: {Object.keys(customSigns).join(', ')}
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}>
          {/* Camera Feed */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: 'var(--radius-lg)',
              }}
            />
            
            {/* Status Overlay */}
            {running && (
              <div style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                background: backendError ? 'var(--error)' : 'var(--success)',
                color: 'white',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--fs-small)',
                fontWeight: '600',
              }}>
                {backendError ? 'ERROR' : 'LIVE'}
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}>
            <button
              onClick={() => setRunning((s) => !s)}
              disabled={backendError}
              style={{
                padding: 'var(--space-4) var(--space-8)',
                fontSize: 'var(--fs-body)',
                fontWeight: '600',
                color: 'var(--primary-contrast)',
                background: running ? 'var(--error)' : (backendError ? 'var(--text-muted)' : 'var(--primary)'),
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: backendError ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition)',
                minWidth: '200px',
                opacity: backendError ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!backendError) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {running ? "Stop Translation" : "Start Translation"}
            </button>

            <p style={{
              fontSize: 'var(--fs-small)',
              color: 'var(--text-muted)',
              textAlign: 'center',
              margin: 0,
            }}>
              {backendError 
                ? "Backend server is not running. Please start the backend server first."
                : running 
                ? "Translation is active. Perform sign language gestures in front of the camera."
                : "Click 'Start Translation' to begin real-time sign language recognition."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Output Display */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow)',
        width: '100%',
      }}>
        <h3 style={{
          fontSize: 'var(--fs-h2)',
          fontWeight: '600',
          color: 'var(--text)',
          textAlign: 'center',
          margin: '0 0 var(--space-4) 0',
        }}>
          Translation Output
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          <div style={{
            fontSize: 'var(--fs-h1)',
            fontWeight: '700',
            color: backendError ? 'var(--error)' : 'var(--primary)',
            textAlign: 'center',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {prediction}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}>
              <span style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
              }}>
                Confidence:
              </span>
              <span style={{
                fontSize: 'var(--fs-body)',
                fontWeight: '600',
                color: confidence > 0.7 ? 'var(--success)' : 'var(--warning)',
              }}>
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>

            {running && !backendError && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}>
                  <span style={{
                    fontSize: 'var(--fs-body)',
                    color: 'var(--text-muted)',
                  }}>
                    FPS:
                  </span>
                  <span style={{
                    fontSize: 'var(--fs-body)',
                    fontWeight: '600',
                    color: 'var(--text)',
                  }}>
                    {fps.toFixed(1)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}>
                  <span style={{
                    fontSize: 'var(--fs-body)',
                    color: 'var(--text-muted)',
                  }}>
                    Latency:
                  </span>
                  <span style={{
                    fontSize: 'var(--fs-body)',
                    fontWeight: '600',
                    color: 'var(--text)',
                  }}>
                    {rttMs.toFixed(0)}ms
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
