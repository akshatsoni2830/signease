import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useAuth } from "../contexts/AuthContext";

const videoConstraints = { width: 640, height: 480, facingMode: "user" };

// Local storage functions for custom signs
const CUSTOM_SIGNS_KEY = 'customSigns';

const saveCustomSignsToLocal = (signs) => {
  try {
    localStorage.setItem(CUSTOM_SIGNS_KEY, JSON.stringify(signs));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadCustomSignsFromLocal = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_SIGNS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

export default function CreateCustomSign() {
  const webcamRef = useRef(null);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [customSigns, setCustomSigns] = useState({});
  const { currentUser, isGuest } = useAuth();

  // Load existing custom signs on component mount
  useEffect(() => {
    loadCustomSigns();
  }, []);

  const loadCustomSigns = () => {
    try {
      const savedSigns = loadCustomSignsFromLocal();
      setCustomSigns(savedSigns);
    } catch (error) {
      console.log("No custom signs found or error loading:", error);
      setCustomSigns({});
    }
  };

  const captureBase64 = () => webcamRef.current?.getScreenshot();

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

  const collectAndSave = async () => {
    const L = label.trim().toUpperCase();
    if (!L) { 
      setMsg("Enter a label (e.g., HOW_ARE_YOU)"); 
      return; 
    }
    
    setSaving(true); 
    setMsg("Collecting 10 samples... Hold your pose steady.");
    setProgress(0);

    const samples = [];
    
    for (let i = 0; i < 10; i++) {
      const dataUrl = captureBase64();
      if (dataUrl) {
        const blob = await fetch(dataUrl).then(r => r.blob());
        
        const form = new FormData();
        form.append("frame", blob, "f.jpg");
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/extract`, {
            method: 'POST',
            body: form
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (data.vec) {
            samples.push(data.vec);
            console.log(`Sample ${i + 1} collected successfully`);
          }
        } catch (e) { 
          console.log(`Error collecting sample ${i + 1}:`, e);
        }
      }
      setProgress(((i + 1) / 10) * 100);
      await new Promise(r => setTimeout(r, 500)); // Increased delay for better capture
    }

    if (samples.length < 5) {
      setSaving(false);
      setMsg(`Only ${samples.length} usable samples. Re-try with better lighting and steady hand.`);
      setProgress(0);
      return;
    }

    try {
      console.log(`Saving ${samples.length} samples for label: ${L}`);
      
      // Calculate prototype (average of all samples)
      const prototype = samples[0].map((_, index) => 
        samples.reduce((sum, sample) => sum + sample[index], 0) / samples.length
      );
      
      // Save to local storage
      const updatedSigns = {
        ...customSigns,
        [L]: {
          samples: samples,
          prototype: prototype
        }
      };
      
      setCustomSigns(updatedSigns);
      saveCustomSignsToLocal(updatedSigns);
      
      // Sync to backend for live translation
      await syncCustomSignsToBackend(updatedSigns);
      
      setSaving(false);
      setMsg(`✅ Saved ${samples.length} samples for ${L}. Try it in the live translator!`);
      setProgress(0);
      setLabel(""); // Clear input
    } catch (error) {
      console.error("Error saving custom sign:", error);
      setSaving(false);
      setMsg(`❌ Error saving: ${error.message}`);
      setProgress(0);
    }
  };

  const deleteCustomSignHandler = async (signLabel) => {
    try {
      // Delete from local storage
      const updatedSigns = { ...customSigns };
      delete updatedSigns[signLabel];
      
      setCustomSigns(updatedSigns);
      saveCustomSignsToLocal(updatedSigns);
      
      // Sync to backend for live translation
      await syncCustomSignsToBackend(updatedSigns);
      
      setMsg(`✅ Deleted custom sign: ${signLabel}`);
    } catch (error) {
      console.error("Error deleting custom sign:", error);
      setMsg(`❌ Error deleting ${signLabel}: ${error.message}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-8)',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: 'var(--space-6)',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow)',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: 'var(--fs-h2)',
          fontWeight: '700',
          color: 'var(--text)',
          margin: '0 0 var(--space-4) 0',
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
        }}>
          🤟 Create Custom Sign
        </h2>
        
        <p style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          {isGuest ? 'Guest Mode - Signs stored locally' : 'Your custom signs will be saved to your account'}
        </p>

        {/* Input Section */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter sign label (e.g., HELLO)"
            style={{
              padding: 'var(--space-3)',
              fontSize: 'var(--fs-body)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              color: 'var(--text)',
              minWidth: '200px',
            }}
          />
          
          <button
            onClick={collectAndSave}
            disabled={saving || !label.trim()}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'white',
              background: saving ? 'var(--text-muted)' : 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition)',
            }}
          >
            {saving ? 'Creating...' : 'Create Sign'}
          </button>
        </div>

        {/* Progress Bar */}
        {saving && (
          <div style={{
            marginBottom: 'var(--space-4)',
          }}>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--border-light)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--primary)',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{
              fontSize: 'var(--fs-small)',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: 'var(--space-2)',
            }}>
              {Math.round(progress)}% Complete
            </div>
          </div>
        )}

        {/* Message */}
        {msg && (
          <div style={{
            padding: 'var(--space-4)',
            background: msg.includes('Error') ? 'var(--error-light)' : 'var(--accent)',
            border: `1px solid ${msg.includes('Error') ? 'var(--error)' : 'var(--border-light)'}`,
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--space-6)',
            textAlign: 'center',
            fontSize: 'var(--fs-body)',
            color: msg.includes('Error') ? 'var(--error)' : 'var(--text)',
          }}>
            {msg}
          </div>
        )}

        {/* Webcam */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <div style={{
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--bg)',
          }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={videoConstraints}
              screenshotFormat="image/jpeg"
              style={{
                width: '640px',
                height: '480px',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'var(--accent)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}>
          <h3 style={{
            fontSize: 'var(--fs-h3)',
            fontWeight: '600',
            color: 'var(--text)',
            margin: '0 0 var(--space-3) 0',
          }}>
            📋 Instructions
          </h3>
          <ul style={{
            fontSize: 'var(--fs-body)',
            color: 'var(--text-muted)',
            margin: 0,
            paddingLeft: 'var(--space-4)',
          }}>
            <li>Enter a label for your custom sign</li>
            <li>Hold your hand gesture steady in front of the camera</li>
            <li>Click "Create Sign" to capture 10 samples</li>
            <li>Use good lighting and keep your hand clearly visible</li>
            <li>Your custom sign will be available in live translation</li>
          </ul>
        </div>

        {/* Manage Signs Section */}
        {Object.keys(customSigns).length > 0 && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow)',
          }}>
            <h3 style={{
              fontSize: 'var(--fs-h3)',
              fontWeight: '600',
              color: 'var(--text)',
              margin: '0 0 var(--space-4) 0',
            }}>
              📚 Manage Your Signs ({Object.keys(customSigns).length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--space-3)',
            }}>
              {Object.keys(customSigns).map((signLabel) => (
                <div
                  key={signLabel}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-3)',
                    background: 'var(--accent)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: 'var(--fs-body)',
                      fontWeight: '600',
                      color: 'var(--text)',
                    }}>
                      {signLabel}
                    </div>
                    <div style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--text-muted)',
                    }}>
                      {customSigns[signLabel].samples.length} samples
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCustomSignHandler(signLabel)}
                    style={{
                      padding: 'var(--space-1) var(--space-2)',
                      fontSize: 'var(--fs-small)',
                      fontWeight: '600',
                      color: 'var(--error)',
                      background: 'var(--error-light)',
                      border: '1px solid var(--error)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      transition: 'all var(--transition)',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

