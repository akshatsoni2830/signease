import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation({ onNavigate }) {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, userProfile, isGuest, logout } = useAuth();

  const features = [
    {
      name: "Live Translation",
      description: "Real-time sign language to text conversion",
      icon: "🗣️",
      action: () => onNavigate('translate')
    },
    {
      name: "Learning Module",
      description: "Practice and improve your sign language skills",
      icon: "📚",
      action: () => onNavigate('learn')
    },
    {
      name: "Custom Sign Calibration",
      description: "Create and manage your own custom signs",
      icon: "⚙️",
      action: () => onNavigate('custom')
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsFeaturesOpen(false);
      setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      background: 'var(--surface)',
      borderBottom: '2px solid var(--border)',
      padding: 'var(--space-4) var(--space-6)',
      boxShadow: 'var(--shadow)',
      zIndex: 1000,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}>
          <div style={{
            fontSize: '32px',
            cursor: 'pointer',
          }} onClick={() => onNavigate('home')}>
            🤟
          </div>
          <h1 style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
          }} onClick={() => onNavigate('home')}>
            SignEase
          </h1>
        </div>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          {/* Home */}
          <button
            onClick={() => onNavigate('home')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            🏠 Home
          </button>

          {/* Features Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFeaturesOpen(!isFeaturesOpen);
                setIsUserMenuOpen(false);
              }}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--fs-body)',
                fontWeight: '600',
                color: 'var(--text)',
                background: isFeaturesOpen ? 'var(--accent)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              ⚡ Features
              <span style={{
                transform: isFeaturesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition)',
              }}>
                ▼
              </span>
            </button>

            {isFeaturesOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '280px',
                zIndex: 1001,
                marginTop: 'var(--space-1)',
              }}>
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      feature.action();
                      setIsFeaturesOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--fs-body)',
                      fontWeight: '600',
                      color: 'var(--text)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{feature.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>{feature.name}</div>
                      <div style={{
                        fontSize: 'var(--fs-small)',
                        color: 'var(--text-muted)',
                        fontWeight: '400',
                      }}>
                        {feature.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          <button
            onClick={() => onNavigate('history')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            📚 History
          </button>

          {/* About Us */}
          <button
            onClick={() => onNavigate('about')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            ℹ️ About Us
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsFeaturesOpen(false);
              }}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--fs-body)',
                fontWeight: '600',
                color: 'var(--text)',
                background: isUserMenuOpen ? 'var(--accent)' : 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <span style={{ fontSize: '18px' }}>
                {isGuest ? '👤' : '👤'}
              </span>
              {isGuest ? 'Guest' : (userProfile?.displayName || currentUser?.displayName || 'User')}
              <span style={{
                transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition)',
              }}>
                ▼
              </span>
            </button>

            {isUserMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '200px',
                zIndex: 1001,
                marginTop: 'var(--space-1)',
              }}>
                {isGuest ? (
                  <>
                    <div style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderBottom: '1px solid var(--border-light)',
                    }}>
                      <div style={{
                        fontSize: 'var(--fs-body)',
                        fontWeight: '600',
                        color: 'var(--text)',
                      }}>
                        Guest User
                      </div>
                      <div style={{
                        fontSize: 'var(--fs-small)',
                        color: 'var(--text-muted)',
                      }}>
                        Limited features available
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // Redirect to auth page
                        window.location.reload();
                      }}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        fontSize: 'var(--fs-body)',
                        fontWeight: '600',
                        color: 'var(--primary)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      🔐 Sign In / Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderBottom: '1px solid var(--border-light)',
                    }}>
                      <div style={{
                        fontSize: 'var(--fs-body)',
                        fontWeight: '600',
                        color: 'var(--text)',
                      }}>
                        {userProfile?.displayName || currentUser?.displayName}
                      </div>
                      <div style={{
                        fontSize: 'var(--fs-small)',
                        color: 'var(--text-muted)',
                      }}>
                        {currentUser?.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        fontSize: 'var(--fs-body)',
                        fontWeight: '600',
                        color: 'var(--error)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--error-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
