import React from 'react';

export default function ModeCard({ title, subtitle, icon, onClick, isActive = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all var(--transition-slow)',
        textAlign: 'left',
        width: '100%',
        minHeight: '160px',
        boxShadow: 'var(--shadow)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-4px)';
        e.target.style.boxShadow = 'var(--shadow-xl)';
        e.target.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'var(--shadow)';
        e.target.style.borderColor = 'var(--border)';
      }}
    >
      {/* Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'var(--space-12)',
        height: 'var(--space-12)',
        borderRadius: 'var(--radius)',
        background: 'var(--primary)',
        color: 'var(--primary-contrast)',
        marginBottom: 'var(--space-2)',
      }}>
        {icon}
      </div>
      
      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        flex: 1,
      }}>
        <h3 style={{
          fontSize: 'var(--fs-body)',
          fontWeight: '700',
          color: 'var(--text)',
          margin: 0,
        }}>
          {title}
        </h3>
        
        <p style={{
          fontSize: 'var(--fs-small)',
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: 'var(--lh)',
        }}>
          {subtitle}
        </p>
      </div>

      {/* Hover effect overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(96, 165, 250, 0.05) 100%)',
        opacity: 0,
        transition: 'opacity var(--transition)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
