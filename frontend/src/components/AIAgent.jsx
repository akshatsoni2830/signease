import React, { useState, useEffect } from 'react';

export default function AIAgent({ 
  currentSign, 
  userSign, 
  isCorrect, 
  confidence, 
  onNextSign,
  isLearning = false 
}) {
  const [message, setMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [agentMood, setAgentMood] = useState('helpful'); // helpful, excited, encouraging
  const [showDropdown, setShowDropdown] = useState(false);

  // Pre-trained speech responses
  const responses = {
    correct: [
      "Excellent! That's the perfect sign for {sign}! You're doing amazing!",
      "Fantastic work! You nailed the {sign} sign! Keep it up!",
      "Brilliant! That's exactly right for {sign}. You're a natural!",
      "Perfect! You've got the {sign} sign down perfectly!",
      "Outstanding! That's the correct sign for {sign}. You're learning so fast!"
    ],
    incorrect: [
      "Almost there! For {sign}, try adjusting your hand position slightly. You've got this!",
      "Good effort! The {sign} sign is a bit different. Let me show you the correct way.",
      "Not quite right, but you're close! For {sign}, remember to keep your fingers together.",
      "Nice try! The {sign} sign needs a different hand shape. Don't give up!",
      "You're getting warmer! For {sign}, try this hand position instead."
    ],
    encouragement: [
      "You're doing great! Learning sign language takes practice, and you're making excellent progress!",
      "Keep going! Every attempt brings you closer to mastering sign language!",
      "Don't worry about mistakes - they're part of learning! You're doing fantastic!",
      "You've got this! Your dedication to learning is inspiring!",
      "Remember, practice makes perfect! You're already showing great improvement!"
    ],
    welcome: [
      "Welcome to SignEase! I'm here to help you learn sign language. Let's start with the basics!",
      "Hi there! Ready to learn some amazing sign language? I'll guide you through every step!",
      "Hello! I'm excited to help you master sign language. Let's begin this wonderful journey together!"
    ],
    // Pre-trained responses as requested in the image
    pretrained: [
      "PLEASE Hello",
      "How are you?",
      "Thank you",
      "You're welcome",
      "Good morning",
      "Good night",
      "Nice to meet you",
      "See you later",
      "I love you",
      "Help me",
      "I need help",
      "Can you help me?",
      "What's your name?",
      "My name is...",
      "Where is the bathroom?",
      "I'm hungry",
      "I'm thirsty",
      "I'm tired",
      "I'm happy",
      "I'm sad"
    ]
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher pitch for enthusiasm
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const getRandomResponse = (type) => {
    const responseArray = responses[type];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const formatMessage = (template, sign) => {
    return template.replace(/{sign}/g, sign);
  };

  const handlePretrainedResponse = (response) => {
    setMessage(response);
    speak(response);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (!isLearning) {
      const welcomeMsg = getRandomResponse('welcome');
      setMessage(welcomeMsg);
      speak(welcomeMsg);
      setAgentMood('helpful');
    }
  }, [isLearning]);

  useEffect(() => {
    if (currentSign && userSign) {
      let newMessage = '';
      let newMood = 'helpful';

      if (isCorrect && confidence > 0.8) {
        newMessage = formatMessage(getRandomResponse('correct'), currentSign);
        newMood = 'excited';
      } else if (isCorrect && confidence > 0.6) {
        newMessage = formatMessage(getRandomResponse('correct'), currentSign);
        newMood = 'encouraging';
      } else {
        newMessage = formatMessage(getRandomResponse('incorrect'), currentSign);
        newMood = 'helpful';
      }

      setMessage(newMessage);
      setAgentMood(newMood);
      speak(newMessage);

      // Auto-advance after a delay for correct answers
      if (isCorrect && confidence > 0.7) {
        setTimeout(() => {
          onNextSign?.();
        }, 3000);
      }
    }
  }, [currentSign, userSign, isCorrect, confidence, onNextSign]);

  const getAgentIcon = () => {
    switch (agentMood) {
      case 'excited':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        );
      case 'encouraging':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
            <path d="M12 2v4"/>
            <path d="M12 18v4"/>
            <path d="M4.93 4.93l2.83 2.83"/>
            <path d="M16.24 16.24l2.83 2.83"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        );
    }
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* AI Agent Header */}
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
          background: 'var(--ai-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          animation: isSpeaking ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}>
          {getAgentIcon()}
        </div>
        
        <div>
          <h3 style={{
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: 'var(--text)',
            margin: '0 0 var(--space-1) 0',
          }}>
            AI Learning Assistant
          </h3>
          <p style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-subtle)',
            margin: 0,
          }}>
            {isSpeaking ? 'Speaking...' : 'Ready to help'}
          </p>
        </div>

        {/* Pre-trained Responses Dropdown */}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--fs-small)',
              fontWeight: '500',
              color: 'var(--primary)',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--primary-light)';
              e.target.style.color = 'var(--primary)';
            }}
          >
            💬 Quick Responses
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-2)',
              marginTop: 'var(--space-2)',
              minWidth: '200px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
            }}>
              {responses.pretrained.map((response, index) => (
                <button
                  key={index}
                  onClick={() => handlePretrainedResponse(response)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                    textAlign: 'left',
                    fontSize: 'var(--fs-small)',
                    color: 'var(--text)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                  }}
                >
                  {response}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      <div style={{
        background: 'var(--accent)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
        border: '1px solid var(--border-light)',
      }}>
        <p style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--text)',
          margin: 0,
          lineHeight: 'var(--lh)',
        }}>
          {message}
        </p>
      </div>

      {/* Current Sign Display */}
      {currentSign && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3)',
          background: 'var(--surface-hover)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-light)',
        }}>
          <span style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
          }}>
            Current Sign:
          </span>
          <span style={{
            fontSize: 'var(--fs-body)',
            fontWeight: '600',
            color: 'var(--text)',
          }}>
            {currentSign}
          </span>
        </div>
      )}

      {/* Confidence Indicator */}
      {confidence > 0 && (
        <div style={{
          marginTop: 'var(--space-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <span style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
          }}>
            Confidence:
          </span>
          <div style={{
            flex: 1,
            height: '8px',
            background: 'var(--border-light)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${confidence * 100}%`,
              background: isCorrect ? 'var(--success)' : 'var(--warning)',
              borderRadius: '4px',
              transition: 'width var(--transition)',
            }} />
          </div>
          <span style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            minWidth: '40px',
            textAlign: 'right',
          }}>
            {Math.round(confidence * 100)}%
          </span>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
