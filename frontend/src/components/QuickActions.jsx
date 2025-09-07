import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function QuickActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, isGuest } = useAuth();

  const handleHelp = async () => {
    setIsLoading(true);
    try {
      // Send SMS using Twilio or similar service
      // For now, we'll use a simple approach with WhatsApp Web API
      const message = encodeURIComponent(
        `🚨 EMERGENCY HELP NEEDED 🚨\n\n` +
        `A SignEase user needs immediate assistance!\n` +
        `User: ${userProfile?.displayName || 'Guest User'}\n` +
        `Time: ${new Date().toLocaleString()}\n` +
        `Location: ${navigator.geolocation ? 'Available' : 'Not available'}\n\n` +
        `Please respond immediately!`
      );
      
      // Try to open WhatsApp with the message
      const whatsappUrl = `https://wa.me/919409450190?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      // Also try to send SMS if possible
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Emergency Help Needed',
            text: `A SignEase user needs immediate assistance! Please call +91 9409450190`,
            url: 'tel:+919409450190'
          });
        } catch (error) {
          console.log('Share API not supported');
        }
      }
      
      // Show success message
      alert('Help message sent! Emergency contacts have been notified.');
    } catch (error) {
      console.error('Error sending help message:', error);
      alert('Error sending help message. Please try calling directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallAmbulance = () => {
    // Direct call to emergency number
    window.location.href = 'tel:+919409450190';
  };

  const handleCallFamily = () => {
    const familyNumber = userProfile?.familyContact || '+91 9409450190';
    window.location.href = `tel:${familyNumber}`;
  };

  const actions = [
    {
      id: 'help',
      title: 'HELP',
      icon: '🆘',
      color: 'var(--error)',
      bgColor: 'var(--error-light)',
      onClick: handleHelp,
      description: 'Send emergency message'
    },
    {
      id: 'ambulance',
      title: 'AMBULANCE',
      icon: '🚑',
      color: 'var(--warning)',
      bgColor: 'var(--warning-light)',
      onClick: handleCallAmbulance,
      description: 'Call emergency services'
    },
    {
      id: 'family',
      title: 'CALL FAMILY',
      icon: '👨‍👩‍👧‍👦',
      color: 'var(--success)',
      bgColor: 'var(--success-light)',
      onClick: handleCallFamily,
      description: isGuest ? 'Call emergency contact' : 'Call family member'
    }
  ];

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow)',
    }}>
      <h3 style={{
        fontSize: 'var(--fs-h3)',
        fontWeight: '700',
        color: 'var(--text)',
        margin: '0 0 var(--space-4) 0',
        textAlign: 'center',
        fontFamily: 'var(--font-display)',
      }}>
        🚨 Emergency Quick Actions
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={isLoading}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-4)',
              background: action.bgColor,
              border: `2px solid ${action.color}`,
              borderRadius: 'var(--radius)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition)',
              minHeight: '120px',
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <div style={{
              fontSize: '32px',
              marginBottom: 'var(--space-2)',
            }}>
              {action.icon}
            </div>
            <div style={{
              fontSize: 'var(--fs-body)',
              fontWeight: '700',
              color: action.color,
              marginBottom: 'var(--space-1)',
            }}>
              {action.title}
            </div>
            <div style={{
              fontSize: 'var(--fs-small)',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}>
              {action.description}
            </div>
          </button>
        ))}
      </div>

      {/* Status Info */}
      <div style={{
        marginTop: 'var(--space-4)',
        padding: 'var(--space-3)',
        background: 'var(--accent)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-light)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
        }}>
          <span style={{ fontSize: '16px' }}>ℹ️</span>
          <span style={{
            fontSize: 'var(--fs-small)',
            fontWeight: '600',
            color: 'var(--text)',
          }}>
            Emergency Contact Information
          </span>
        </div>
        <div style={{
          fontSize: 'var(--fs-small)',
          color: 'var(--text-muted)',
          lineHeight: '1.4',
        }}>
          {isGuest ? (
            <>
              <strong>Guest Mode:</strong> All emergency actions will contact the default emergency number (+91 9409450190).
              <br />
              <strong>Sign up</strong> to set your personal family contact for the "Call Family" feature.
            </>
          ) : (
            <>
              <strong>Family Contact:</strong> {userProfile?.familyContact || 'Not set'}
              <br />
              <strong>Emergency Number:</strong> +91 9409450190 (Ambulance/Help)
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--surface)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: 'var(--space-3)',
            }}>
              📡
            </div>
            <div style={{
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: 'var(--space-2)',
            }}>
              Sending Emergency Message...
            </div>
            <div style={{
              fontSize: 'var(--fs-small)',
              color: 'var(--text-muted)',
            }}>
              Please wait while we notify emergency contacts
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
