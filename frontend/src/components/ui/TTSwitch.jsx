import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function TTSwitch() {
  const [ttsEnabled, setTtsEnabled] = useLocalStorage('se.tts', true);

  const toggleTTS = () => {
    setTtsEnabled(!ttsEnabled);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span style={{ 
        fontSize: 'var(--fs-small)', 
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap'
      }}>
        TTS
      </span>
      <button
        onClick={toggleTTS}
        role="switch"
        aria-checked={ttsEnabled}
        aria-label={`Text-to-speech is ${ttsEnabled ? 'enabled' : 'disabled'}`}
        style={{
          position: 'relative',
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          background: ttsEnabled ? 'var(--primary)' : 'var(--border)',
          cursor: 'pointer',
          transition: 'all var(--transition)',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '1';
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: ttsEnabled ? '22px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'var(--primary-contrast)',
            transition: 'all var(--transition)',
            boxShadow: 'var(--shadow)',
          }}
        />
      </button>
    </div>
  );
}
