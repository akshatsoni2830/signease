import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadHistory();
    }
  }, [currentUser]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your backend
      // For now, we'll simulate some history data
      const mockHistory = [
        {
          id: 1,
          prediction: 'HELLO',
          confidence: 0.95,
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          mode: 'translate',
          processing_time: 120
        },
        {
          id: 2,
          prediction: 'THANK YOU',
          confidence: 0.87,
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          mode: 'translate',
          processing_time: 95
        },
        {
          id: 3,
          prediction: 'A',
          confidence: 0.92,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          mode: 'learn',
          processing_time: 80
        },
        {
          id: 4,
          prediction: 'HOW ARE YOU',
          confidence: 0.78,
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          mode: 'translate',
          processing_time: 150
        }
      ];
      
      setHistory(mockHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'var(--success)';
    if (confidence >= 0.7) return 'var(--warning)';
    return 'var(--error)';
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'translate': return '🗣️';
      case 'learn': return '📚';
      case 'calibrate': return '⚙️';
      default: return '📝';
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.mode === filter;
    const matchesSearch = item.prediction.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signease_history_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '2px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-lg)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-6)',
      }}>
        <div>
          <h3 style={{
            fontSize: 'var(--fs-h3)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-2) 0',
          }}>
            Translation History
          </h3>
          <p style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            {filteredHistory.length} entries • Last 30 days
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
        }}>
          <button
            onClick={exportHistory}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: 'var(--fs-small)',
              cursor: 'pointer',
            }}
          >
            📥 Export
          </button>
          <button
            onClick={clearHistory}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--error)',
              background: 'var(--surface)',
              color: 'var(--error)',
              fontSize: 'var(--fs-small)',
              cursor: 'pointer',
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}>
        <input
          type="text"
          placeholder="Search predictions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontSize: 'var(--fs-small)',
          }}
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontSize: 'var(--fs-small)',
          }}
        >
          <option value="all">All Modes</option>
          <option value="translate">Translate</option>
          <option value="learn">Learn</option>
          <option value="calibrate">Calibrate</option>
        </select>
      </div>

      {/* History List */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius)',
        background: 'var(--bg)',
      }}>
        {loading ? (
          <div style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}>
            Loading history...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>📝</div>
            <div style={{ fontSize: 'var(--fs-body)', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
              No history yet
            </div>
            <div style={{ fontSize: 'var(--fs-small)' }}>
              Start using SignEase to see your translation history here
            </div>
          </div>
        ) : (
          <div>
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                {/* Mode Icon */}
                <div style={{
                  fontSize: '24px',
                  width: '40px',
                  textAlign: 'center',
                }}>
                  {getModeIcon(item.mode)}
                </div>
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 'var(--fs-body)',
                    fontWeight: '600',
                    color: 'var(--text)',
                    marginBottom: 'var(--space-1)',
                  }}>
                    {item.prediction}
                  </div>
                  <div style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--text-muted)',
                  }}>
                    {formatTimestamp(item.timestamp)} • {item.processing_time}ms
                  </div>
                </div>
                
                {/* Confidence */}
                <div style={{
                  textAlign: 'right',
                }}>
                  <div style={{
                    fontSize: 'var(--fs-small)',
                    fontWeight: '600',
                    color: getConfidenceColor(item.confidence),
                  }}>
                    {(item.confidence * 100).toFixed(0)}%
                  </div>
                  <div style={{
                    fontSize: 'var(--fs-caption)',
                    color: 'var(--text-subtle)',
                  }}>
                    Confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {filteredHistory.length > 0 && (
        <div style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-4)',
          background: 'var(--accent)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-light)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)',
          }}>
            <div>
              <div style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '700',
                color: 'var(--text)',
              }}>
                {filteredHistory.length}
              </div>
              <div style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--text-muted)',
              }}>
                Total Entries
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '700',
                color: 'var(--text)',
              }}>
                {(filteredHistory.reduce((sum, item) => sum + item.confidence, 0) / filteredHistory.length * 100).toFixed(1)}%
              </div>
              <div style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--text-muted)',
              }}>
                Avg Confidence
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '700',
                color: 'var(--text)',
              }}>
                {Math.round(filteredHistory.reduce((sum, item) => sum + item.processing_time, 0) / filteredHistory.length)}ms
              </div>
              <div style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--text-muted)',
              }}>
                Avg Response
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

