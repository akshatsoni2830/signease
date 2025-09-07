import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function History() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useLocalStorage('se.history', []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to add new translation to history
  const addToHistory = (translation) => {
    const newEntry = {
      text: translation.prediction || translation.text,
      confidence: translation.confidence || 0,
      timestamp: new Date().toISOString(),
      type: 'translation'
    };
    
    setHistory(prev => {
      const updated = [...prev, newEntry].slice(-20); // Keep last 20 entries
      return updated;
    });
  };

  // Listen for translation events from other components
  useEffect(() => {
    const handleTranslation = (event) => {
      if (event.detail && event.detail.prediction) {
        addToHistory(event.detail);
      }
    };

    window.addEventListener('translation-complete', handleTranslation);
    return () => window.removeEventListener('translation-complete', handleTranslation);
  }, []);

  const recentHistory = history.slice(-5).reverse();

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: 'var(--space-4)',
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: 'var(--text)',
          fontSize: 'var(--fs-body)',
          fontWeight: '500',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'none';
        }}
      >
        <span>Recent Translations</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition)',
          }}
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      {isExpanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
          {recentHistory.length > 0 ? (
            <div style={{ padding: 'var(--space-4)' }}>
              {recentHistory.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: 'var(--space-3)',
                    borderBottom: index < recentHistory.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-1)',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 'var(--space-2)',
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: 'var(--fs-body)',
                      color: 'var(--text)',
                      fontWeight: '500',
                    }}>
                      {item.text || 'Translation'}
                    </p>
                    <span style={{
                      fontSize: 'var(--fs-caption)',
                      color: 'var(--text-subtle)',
                      whiteSpace: 'nowrap',
                    }}>
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  {item.confidence && (
                    <p style={{
                      margin: 0,
                      fontSize: 'var(--fs-small)',
                      color: 'var(--text-muted)',
                    }}>
                      Confidence: {Math.round(item.confidence * 100)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--space-3)' }}>
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3z"/>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3z"/>
                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3z"/>
                <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3z"/>
              </svg>
              <p style={{ margin: 0, fontSize: 'var(--fs-small)' }}>
                Your translations will appear here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
