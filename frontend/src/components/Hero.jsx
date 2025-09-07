import React from 'react';

export default function Hero({ onStartTranslate, onTryLearn }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        alignItems: 'center',
      }}>
        <h1 style={{
          fontSize: 'var(--fs-h1)',
          fontWeight: '700',
          lineHeight: 'var(--lh-tight)',
          color: 'var(--text)',
          margin: 0,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
        }}>
          Breaking Barriers with AI-powered Sign Language Communication
        </h1>
        
        <p style={{
          fontSize: 'var(--fs-body)',
          lineHeight: 'var(--lh)',
          color: 'var(--text-muted)',
          margin: 0,
          maxWidth: '500px',
          textAlign: 'center',
        }}>
          Connect, communicate, and understand. SignEase uses advanced AI to bridge the gap between hearing and hearing-impaired communities through real-time sign language translation and also encouraging women safety.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        width: 'fit-content',
        margin: '0 auto',
      }}>
        <button
          onClick={onStartTranslate}
          style={{
            padding: 'var(--space-4) var(--space-8)',
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: 'var(--primary-contrast)',
            background: 'var(--primary)',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow)',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary-hover)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'var(--shadow)';
          }}
        >
          Start Conversation
        </button>
        
        <button
          onClick={onTryLearn}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            fontSize: 'var(--fs-body)',
            fontWeight: '500',
            color: 'var(--primary)',
            background: 'transparent',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'var(--primary-contrast)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--primary)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Try Learning Mode
        </button>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-6)',
        marginTop: 'var(--space-8)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--primary)',
            marginBottom: 'var(--space-2)',
          }}>
            10k+
          </div>
          <div style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            fontWeight: '500',
          }}>
            Active Users
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--success)',
            marginBottom: 'var(--space-2)',
          }}>
            99%
          </div>
          <div style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            fontWeight: '500',
          }}>
            Accuracy
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--warning)',
            marginBottom: 'var(--space-2)',
          }}>
            24/7
          </div>
          <div style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            fontWeight: '500',
          }}>
            Available
          </div>
        </div>
      </div>
    </div>
  );
}
