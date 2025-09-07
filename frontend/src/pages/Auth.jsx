import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [familyContact, setFamilyContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, login, loginWithGoogle, continueAsGuest } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error('Display name is required');
        }
        if (!familyContact.trim()) {
          throw new Error('Family contact is required');
        }
        await signup(email, password, displayName, familyContact);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '400px',
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
            🤟 SignEase
          </h1>
          <p style={{
            fontSize: 'var(--fs-body)',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            {isLogin ? 'Welcome back!' : 'Join our community'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'var(--error-light)',
            border: '1px solid var(--error)',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            color: 'var(--error)',
            fontSize: 'var(--fs-small)',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-4)' }}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--fs-small)',
                  fontWeight: '600',
                  color: 'var(--text)',
                  marginBottom: 'var(--space-1)',
                }}>
                  Display Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--fs-body)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--fs-small)',
                  fontWeight: '600',
                  color: 'var(--text)',
                  marginBottom: 'var(--space-1)',
                }}>
                  Family Contact *
                </label>
                <input
                  type="tel"
                  value={familyContact}
                  onChange={(e) => setFamilyContact(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--fs-body)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                  placeholder="+91 9409450190"
                  required
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: 'var(--space-3)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-small)',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: 'var(--space-1)',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--fs-body)',
                background: 'var(--surface)',
                color: 'var(--text)',
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-small)',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: 'var(--space-1)',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--fs-body)',
                background: 'var(--surface)',
                color: 'var(--text)',
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--primary-contrast)',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all var(--transition)',
            }}
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'var(--border)',
          }} />
          <span style={{
            padding: '0 var(--space-3)',
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
          }}>
            or
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'var(--border)',
          }} />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: 'var(--text)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = 'var(--surface)';
          }}
        >
          <span style={{ fontSize: '18px' }}>🔍</span>
          Continue with Google
        </button>

        {/* Guest Mode */}
        <button
          onClick={handleGuestMode}
          disabled={loading}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: 'var(--text-muted)',
            background: 'var(--accent)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = 'var(--accent)';
          }}
        >
          👤 Continue as Guest
        </button>

        {/* Toggle Login/Signup */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border-light)',
        }}>
          <p style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: 'var(--fs-small)',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: 'var(--space-1)',
                textDecoration: 'underline',
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
