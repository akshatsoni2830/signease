import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function EmergencyKit() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const { userProfile } = useAuth();

  const emergencyMessages = [
    "I need help immediately",
    "Call 911",
    "I'm having a medical emergency",
    "I need an ambulance",
    "I'm lost and need assistance",
    "I need to contact my family",
    "I'm in danger",
    "I need a translator",
    "I can't speak right now",
    "Please call my emergency contact"
  ];

  const familyContact = userProfile?.family_contact || 'Not set';

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    // Here you could integrate with SMS, email, or other communication services
    console.log('Emergency message selected:', message);
    
    // Simulate sending the message
    setTimeout(() => {
      alert(`Emergency message sent: "${message}"\nContact: ${familyContact}`);
      setSelectedMessage('');
    }, 1000);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '2px solid var(--error)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Emergency Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}>
        <div style={{
          width: 'var(--space-8)',
          height: 'var(--space-8)',
          borderRadius: '50%',
          background: 'var(--error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          animation: 'pulse 2s infinite',
        }}>
          🚨
        </div>
        
        <div>
          <h3 style={{
            fontSize: 'var(--fs-h3)',
            fontWeight: '700',
            color: 'var(--error)',
            margin: '0 0 var(--space-1) 0',
          }}>
            Emergency Communication Kit
          </h3>
          <p style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            Quick access to emergency messages and contacts
          </p>
        </div>
      </div>

      {/* Emergency Contact */}
      <div style={{
        background: 'var(--error-light)',
        border: '1px solid var(--error)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
      }}>
        <div style={{
          fontSize: 'var(--fs-small)',
          fontWeight: '600',
          color: 'var(--error)',
          marginBottom: 'var(--space-2)',
        }}>
          Emergency Contact
        </div>
        <div style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
        }}>
          {familyContact}
        </div>
      </div>

      {/* Quick Messages */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}>
          <h4 style={{
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: 'var(--text)',
            margin: 0,
          }}>
            Quick Emergency Messages
          </h4>
          <button
            onClick={handleExpand}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: 'var(--fs-small)',
              fontWeight: '600',
            }}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-3)',
          maxHeight: isExpanded ? 'none' : '200px',
          overflow: 'hidden',
        }}>
          {emergencyMessages.slice(0, isExpanded ? emergencyMessages.length : 6).map((message, index) => (
            <button
              key={index}
              onClick={() => handleMessageSelect(message)}
              disabled={selectedMessage === message}
              style={{
                background: selectedMessage === message ? 'var(--primary)' : 'var(--surface)',
                border: `2px solid ${selectedMessage === message ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: 'var(--space-3)',
                cursor: selectedMessage === message ? 'default' : 'pointer',
                color: selectedMessage === message ? 'white' : 'var(--text)',
                fontSize: 'var(--fs-small)',
                textAlign: 'left',
                transition: 'var(--transition)',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                if (selectedMessage !== message) {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.background = 'var(--primary-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMessage !== message) {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.background = 'var(--surface)';
                }
              }}
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: 'var(--space-6)',
        padding: 'var(--space-4)',
        background: 'var(--accent)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-light)',
      }}>
        <h5 style={{
          fontSize: 'var(--fs-small)',
          fontWeight: '600',
          color: 'var(--text)',
          margin: '0 0 var(--space-2) 0',
        }}>
          How to Use
        </h5>
        <ul style={{
          fontSize: 'var(--fs-small)',
          color: 'var(--text-muted)',
          margin: 0,
          paddingLeft: 'var(--space-4)',
        }}>
          <li>Click any message to send it to your emergency contact</li>
          <li>Messages are sent via SMS, email, or app notification</li>
          <li>Your location may be included automatically</li>
          <li>Update your emergency contact in your profile settings</li>
        </ul>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
