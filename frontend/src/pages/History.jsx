import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function History() {
  const [activeTab, setActiveTab] = useState('translation');
  const [translationHistory, setTranslationHistory] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const { currentUser, isGuest } = useAuth();

  // Mock data for demonstration - in real app this would come from Firebase
  useEffect(() => {
    // Load translation history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('se.history') || '[]');
    setTranslationHistory(storedHistory);

    // Mock call history
    const mockCallHistory = [
      {
        id: 1,
        type: 'emergency',
        number: '+91 9409450190',
        duration: '2:30',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed'
      },
      {
        id: 2,
        type: 'family',
        number: '+91 9876543210',
        duration: '5:45',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'completed'
      },
      {
        id: 3,
        type: 'ambulance',
        number: '+91 9409450190',
        duration: '1:15',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        status: 'missed'
      }
    ];
    setCallHistory(mockCallHistory);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getCallTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return '🆘';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'ambulance': return '🚑';
      default: return '📞';
    }
  };

  const getCallStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'missed': return 'var(--error)';
      case 'ongoing': return 'var(--warning)';
      default: return 'var(--text-muted)';
    }
  };

  const clearHistory = (type) => {
    if (type === 'translation') {
      localStorage.removeItem('se.history');
      setTranslationHistory([]);
    } else {
      setCallHistory([]);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'var(--space-6)',
      background: 'var(--bg)',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        <h1 style={{
          fontSize: 'var(--fs-h1)',
          fontWeight: '700',
          color: 'var(--text)',
          margin: '0 0 var(--space-2) 0',
          fontFamily: 'var(--font-display)',
        }}>
          📚 History & Records
        </h1>
        <p style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          {isGuest ? 'Guest Mode - History stored locally' : 'Your complete activity history'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 'var(--space-6)',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-2)',
        border: '1px solid var(--border)',
        maxWidth: '400px',
        margin: '0 auto var(--space-6) auto',
      }}>
        <button
          onClick={() => setActiveTab('translation')}
          style={{
            flex: 1,
            padding: 'var(--space-3) var(--space-4)',
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: activeTab === 'translation' ? 'var(--primary-contrast)' : 'var(--text-muted)',
            background: activeTab === 'translation' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          🗣️ Translation History
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          style={{
            flex: 1,
            padding: 'var(--space-3) var(--space-4)',
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: activeTab === 'calls' ? 'var(--primary-contrast)' : 'var(--text-muted)',
            background: activeTab === 'calls' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          📞 Call History
        </button>
      </div>

      {/* Translation History */}
      {activeTab === 'translation' && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}>
            <h2 style={{
              fontSize: 'var(--fs-h2)',
              fontWeight: '700',
              color: 'var(--text)',
              margin: 0,
              fontFamily: 'var(--font-display)',
            }}>
              Translation History
            </h2>
            {translationHistory.length > 0 && (
              <button
                onClick={() => clearHistory('translation')}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
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
                Clear All
              </button>
            )}
          </div>

          {translationHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-8)',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>📝</div>
              <h3 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '600',
                margin: '0 0 var(--space-2) 0',
              }}>
                No Translation History
              </h3>
              <p style={{
                fontSize: 'var(--fs-body)',
                margin: 0,
              }}>
                Your translation history will appear here once you start using the live translation feature.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}>
              {translationHistory.slice().reverse().map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-3)',
                    background: 'var(--accent)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--fs-body)',
                      fontWeight: '600',
                      color: 'var(--text)',
                      marginBottom: 'var(--space-1)',
                    }}>
                      {item.text}
                    </div>
                    <div style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--text-muted)',
                    }}>
                      Confidence: {Math.round(item.confidence * 100)}% • {formatTime(item.timestamp)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--text-muted)',
                    marginLeft: 'var(--space-3)',
                  }}>
                    {formatDate(item.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Call History */}
      {activeTab === 'calls' && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}>
            <h2 style={{
              fontSize: 'var(--fs-h2)',
              fontWeight: '700',
              color: 'var(--text)',
              margin: 0,
              fontFamily: 'var(--font-display)',
            }}>
              Call History
            </h2>
            {callHistory.length > 0 && (
              <button
                onClick={() => clearHistory('calls')}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
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
                Clear All
              </button>
            )}
          </div>

          {callHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-8)',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>📞</div>
              <h3 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '600',
                margin: '0 0 var(--space-2) 0',
              }}>
                No Call History
              </h3>
              <p style={{
                fontSize: 'var(--fs-body)',
                margin: 0,
              }}>
                Your emergency and family calls will appear here.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}>
              {callHistory.map((call) => (
                <div
                  key={call.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--space-3)',
                    background: 'var(--accent)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    marginRight: 'var(--space-3)',
                  }}>
                    {getCallTypeIcon(call.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--fs-body)',
                      fontWeight: '600',
                      color: 'var(--text)',
                      marginBottom: 'var(--space-1)',
                    }}>
                      {call.number}
                    </div>
                    <div style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--text-muted)',
                    }}>
                      {call.duration} • {formatTime(call.timestamp)}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 'var(--space-1)',
                  }}>
                    <div style={{
                      fontSize: 'var(--fs-small)',
                      fontWeight: '600',
                      color: getCallStatusColor(call.status),
                      textTransform: 'capitalize',
                    }}>
                      {call.status}
                    </div>
                    <div style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--text-muted)',
                    }}>
                      {formatDate(call.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div style={{
        marginTop: 'var(--space-6)',
        padding: 'var(--space-4)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
        }}>
          <span style={{ fontSize: '20px' }}>ℹ️</span>
          <h3 style={{
            fontSize: 'var(--fs-h3)',
            fontWeight: '600',
            color: 'var(--text)',
            margin: 0,
          }}>
            About History
          </h3>
        </div>
        <div style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
        }}>
          {isGuest ? (
            <>
              <strong>Guest Mode:</strong> Your history is stored locally in your browser and will be lost if you clear your browser data.
              <br /><br />
              <strong>Sign up</strong> to sync your history across devices and keep it safe in the cloud.
            </>
          ) : (
            <>
              <strong>Cloud Sync:</strong> Your history is automatically synced across all your devices.
              <br /><br />
              <strong>Privacy:</strong> Your data is encrypted and only accessible to you.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
