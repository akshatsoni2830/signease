import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Auth from './pages/Auth';

function AppContent() {
  const { currentUser, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-6)',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: 'var(--space-4)',
            animation: 'spin 1s linear infinite',
          }}>
            🤟
          </div>
          <h2 style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-2) 0',
            fontFamily: 'var(--font-display)',
          }}>
            SignEase
          </h2>
          <p style={{
            fontSize: 'var(--fs-body)',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            Loading...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show auth page if not logged in and not guest
  if (!currentUser && !isGuest) {
    return <Auth />;
  }

  // Show main app if logged in or guest
  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
