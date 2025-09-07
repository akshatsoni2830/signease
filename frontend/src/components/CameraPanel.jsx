import React, { useState, useEffect } from 'react';

export default function CameraPanel({ onCameraReady, children }) {
  const [cameraState, setCameraState] = useState('not-granted'); // 'not-granted' | 'loading' | 'ready'
  const [stream, setStream] = useState(null);

  const requestCamera = async () => {
    setCameraState('loading');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      setCameraState('ready');
      onCameraReady?.(mediaStream);
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraState('not-granted');
    }
  };

  useEffect(() => {
    // Check if camera is already available
    if (stream) {
      setCameraState('ready');
    }
  }, [stream]);

  const renderCameraState = () => {
    switch (cameraState) {
      case 'not-granted':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            padding: 'var(--space-8)',
            background: 'var(--surface)',
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius)',
            minHeight: '300px',
            color: 'var(--text-muted)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 var(--space-2) 0', fontWeight: '500' }}>
                Enable camera
              </p>
              <p style={{ margin: 0, fontSize: 'var(--fs-small)' }}>
                Camera access is required for sign language translation
              </p>
            </div>
            <button
              onClick={requestCamera}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                fontSize: 'var(--fs-body)',
                fontWeight: '500',
                color: 'var(--primary-contrast)',
                background: 'var(--primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary)';
              }}
            >
              Enable Camera
            </button>
          </div>
        );

      case 'loading':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            padding: 'var(--space-8)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            minHeight: '300px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid var(--border)',
              borderTop: '3px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Accessing camera...
            </p>
          </div>
        );

      case 'ready':
        return (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            minHeight: '300px',
          }}>
            {children || (
              <video
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
                ref={(video) => {
                  if (video && stream) {
                    video.srcObject = stream;
                  }
                }}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {renderCameraState()}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
