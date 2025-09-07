import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { api } from "../api";
import AIAgent from "./AIAgent";

// ---- CONFIG: set your lesson id & video path ----
const LESSON_ID = "A"; // instead of "lesson1"
// this is the label/id your backend will evaluate against
const VIDEO_SRC = "/coach/lesson1.mp4";

const videoConstraints = { width: 640, height: 480, facingMode: "user" };

export default function LearnMode() {
  const camRef = useRef(null);
  const vidRef = useRef(null);

  const [sim, setSim] = useState(0);
  const [status, setStatus] = useState("IDLE"); // IDLE | TRY | ALMOST | GOOD | PERFECT | CORRECT | NO_HAND
  const [running, setRunning] = useState(false);
  const [currentSign, setCurrentSign] = useState(LESSON_ID);
  const [userSign, setUserSign] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [confidence, setConfidence] = useState(0);

  // Improved grading config for better accuracy
  const BUF = 8;                        // Reduced buffer for faster response
  const [buf, setBuf] = useState([]);   // recent similarities
  const BASE_THRESH = 0.82;             // Lowered base threshold for better detection
  const CALIBRATION_BONUS = 0.03;       // Increased bonus for personal prototypes
  const hasPersonalProto = false;
  const [tune, setTune] = useState(0.02);  // Slightly more lenient default
  const THRESHOLD = BASE_THRESH - (hasPersonalProto ? CALIBRATION_BONUS : 0) + tune;

  const grade = (s) => {
    if (s >= THRESHOLD + 0.08) return { tag: "PERFECT", color: "#22c55e" };
    if (s >= THRESHOLD + 0.05) return { tag: "GOOD",    color: "#84cc16" };
    if (s >= THRESHOLD)        return { tag: "ALMOST",  color: "#f59e0b" };
    return { tag: "TRY", color: "#ef4444" };
  };

  const evalOnce = async () => {
    if (!camRef.current) return;
    const dataUrl = camRef.current.getScreenshot();
    if (!dataUrl) return;

    const blob = await fetch(dataUrl).then(r => r.blob());
    const form = new FormData();
    form.append("frame", blob, "f.jpg");

    try {
      const { data } = await api.post(`/learn/eval?label=${encodeURIComponent(LESSON_ID)}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!data.ok) {
        setStatus("NO_HAND");
        setSim(0);
        setBuf([]);
        setUserSign('');
        setIsCorrect(false);
        setConfidence(0);
        return;
      }

      const s = data.similarity;
      setSim(s);
      setConfidence(s);
      setUserSign(LESSON_ID);

      setBuf(prev => {
        const next = [...prev, s].slice(-BUF);
        const median = next.slice().sort((a,b)=>a-b)[Math.floor(next.length/2)];
        const passCount = next.filter(v => v >= THRESHOLD).length;
        // More lenient acceptance criteria
        const accepted = (passCount >= Math.ceil(BUF * 0.5)) || (median >= THRESHOLD - 0.02);

        if (accepted) {
          setStatus("CORRECT");
          setIsCorrect(true);
        } else {
          setStatus(grade(s).tag);
          setIsCorrect(false);
        }

        return next;
      });
    } catch (error) {
      console.error('Evaluation error:', error);
      setStatus("NO_HAND");
      setSim(0);
      setUserSign('');
      setIsCorrect(false);
      setConfidence(0);
    }
  };

  // Continuous mode (Start/Stop)
  useEffect(() => {
    let id;
    if (running) id = setInterval(evalOnce, 250); // Faster evaluation
    return () => clearInterval(id);
  }, [running]);

  const handleNextSign = () => {
    // Reset for next sign
    setStatus("IDLE");
    setSim(0);
    setBuf([]);
    setUserSign('');
    setIsCorrect(false);
    setConfidence(0);
    // For now, just cycle through A-Z
    const nextChar = String.fromCharCode(currentSign.charCodeAt(0) + 1);
    if (nextChar <= 'Z') {
      setCurrentSign(nextChar);
    } else {
      setCurrentSign('A'); // Loop back to A
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-8)',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'var(--space-6)',
    }}>
      {/* Left Column - Learning Interface */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow)',
      }}>
        <h2 style={{
          fontSize: 'var(--fs-h2)',
          fontWeight: '700',
          color: 'var(--text)',
          margin: '0 0 var(--space-6) 0',
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
        }}>
          Learn Sign Language
        </h2>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => setRunning(!running)}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--primary-contrast)',
              background: running ? 'var(--error)' : 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {running ? "Stop Auto-Check" : "Start Auto-Check"}
          </button>

          <button
            onClick={evalOnce}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--surface)';
            }}
          >
            Check Now
          </button>

          <button
            onClick={() => vidRef.current?.play()}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--surface)';
            }}
          >
            Replay
          </button>
        </div>

        {/* Video Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}>
          {/* Coach Video */}
          <div style={{
            textAlign: 'center',
          }}>
            <h3 style={{
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              margin: '0 0 var(--space-2) 0',
            }}>
              Coach Video
            </h3>
            <video
              ref={vidRef}
              src={VIDEO_SRC}
              style={{
                width: '100%',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
              }}
              controls
              loop
              muted
            />
          </div>

          {/* User Camera */}
          <div style={{
            textAlign: 'center',
          }}>
            <h3 style={{
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              margin: '0 0 var(--space-2) 0',
            }}>
              Your Camera
            </h3>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
            }}>
              <Webcam
                ref={camRef}
                audio={false}
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 'var(--radius)',
                }}
              />
              {/* Status Ring */}
              <div style={{
                position: 'absolute',
                top: 'var(--space-2)',
                right: 'var(--space-2)',
                width: 'var(--space-4)',
                height: 'var(--space-4)',
                borderRadius: '50%',
                background: status === 'CORRECT' ? 'var(--success)' : 
                           status === 'PERFECT' ? '#22c55e' :
                           status === 'GOOD' ? '#84cc16' :
                           status === 'ALMOST' ? '#f59e0b' :
                           status === 'TRY' ? '#ef4444' : 'var(--text-muted)',
                border: '2px solid var(--surface)',
                transition: 'all var(--transition)',
              }} />
            </div>
          </div>
        </div>

        {/* Similarity and Tolerance */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          padding: 'var(--space-3)',
          background: 'var(--accent)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-light)',
        }}>
          <div>
            <span style={{
              fontSize: 'var(--fs-small)',
              color: 'var(--text-muted)',
            }}>
              Similarity:
            </span>
            <span style={{
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              marginLeft: 'var(--space-2)',
            }}>
              {(sim * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{
              fontSize: 'var(--fs-small)',
              color: 'var(--text-muted)',
            }}>
              Tolerance:
            </span>
            <span style={{
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              marginLeft: 'var(--space-2)',
            }}>
              {(THRESHOLD * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Status Message */}
        <div style={{
          padding: 'var(--space-4)',
          background: status === 'CORRECT' ? 'var(--success-light)' : 
                     status === 'PERFECT' ? 'rgba(34, 197, 94, 0.1)' :
                     status === 'GOOD' ? 'rgba(132, 204, 22, 0.1)' :
                     status === 'ALMOST' ? 'var(--warning-light)' :
                     status === 'TRY' ? 'var(--error-light)' : 'var(--accent)',
          border: `1px solid ${status === 'CORRECT' ? 'var(--success)' : 
                              status === 'PERFECT' ? '#22c55e' :
                              status === 'GOOD' ? '#84cc16' :
                              status === 'ALMOST' ? 'var(--warning)' :
                              status === 'TRY' ? 'var(--error)' : 'var(--border-light)'}`,
          borderRadius: 'var(--radius)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: status === 'CORRECT' ? 'var(--success)' : 
                   status === 'PERFECT' ? '#22c55e' :
                   status === 'GOOD' ? '#84cc16' :
                   status === 'ALMOST' ? 'var(--warning)' :
                   status === 'TRY' ? 'var(--error)' : 'var(--text)',
            margin: 0,
          }}>
            {status === 'IDLE' && 'Ready to learn! Position your hand in the camera.'}
            {status === 'TRY' && 'Keep trying! Adjust your hand position and try again.'}
            {status === 'ALMOST' && 'Almost there! You\'re getting closer to the correct sign.'}
            {status === 'GOOD' && 'Good job! Your sign is looking much better.'}
            {status === 'PERFECT' && 'Excellent! That\'s a perfect sign!'}
            {status === 'CORRECT' && 'Perfect! You\'ve mastered this sign!'}
            {status === 'NO_HAND' && 'No hand detected. Please position your hand clearly in the camera.'}
          </p>
        </div>
      </div>

      {/* Right Column - AI Agent */}
      <div>
        <AIAgent
          currentSign={currentSign}
          userSign={userSign}
          isCorrect={isCorrect}
          confidence={confidence}
          onNextSign={handleNextSign}
          isLearning={true}
        />
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .learn-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-6) !important;
          }
          
          .video-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
