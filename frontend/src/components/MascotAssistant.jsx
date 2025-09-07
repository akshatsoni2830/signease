import React, { useState, useEffect } from "react";

const MascotAssistant = ({ onNavigate }) => {
  const poses = [
    { 
      img: "/mascot/mascot 1.png", 
      text: "👋 Hi! Want to learn Sign Language? Click here to start learning!", 
      action: 'learn' 
    },
    { 
      img: "/mascot/mascot 2.png", 
      text: "✌️ Want to create your own gestures? Click here for Custom Signs!", 
      action: 'custom' 
    },
    { 
      img: "/mascot/mascot 3.png", 
      text: "👍 Want live translation? Click here to start conversation!", 
      action: 'translate' 
    },
    { 
      img: "/mascot/mascot 4.png", 
      text: "📝 Need help? Click here to explore learning modules!", 
      action: 'learn' 
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % poses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSpeechBubbleClick = () => {
    if (onNavigate && poses[index].action) {
      onNavigate(poses[index].action);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--space-6)',
      right: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 50,
    }}>
      <img 
        src={poses[index].img} 
        alt="Mascot" 
        style={{
          width: '180px', // Increased from 128px
          height: 'auto',
          filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))', // Enhanced shadow
        }}
      />
      
      <div 
        onClick={handleSpeechBubbleClick}
        style={{
          position: 'relative',
          marginTop: 'var(--space-3)',
          background: 'white',
          border: '3px solid var(--primary)', // Thicker border
          color: 'var(--primary)',
          padding: 'var(--space-4) var(--space-5)', // More padding
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', // Enhanced shadow
          fontSize: '16px', // Larger font size
          fontWeight: '600', // Bolder font
          maxWidth: '280px', // Wider speech bubble
          textAlign: 'center',
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', // Modern font
          lineHeight: '1.4', // Better line spacing
          letterSpacing: '0.5px', // Slight letter spacing for readability
          cursor: 'pointer', // Make it clickable
          transition: 'all 0.3s ease', // Smooth transition
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px) scale(1.02)';
          e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
          e.target.style.borderColor = 'var(--primary-hover)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
          e.target.style.borderColor = 'var(--primary)';
        }}
      >
        {poses[index].text}
        <div style={{
          fontSize: '12px',
          marginTop: '4px',
          opacity: 0.7,
          fontStyle: 'italic',
        }}>
          Click to navigate →
        </div>
        <div style={{
          position: 'absolute',
          bottom: '-12px', // Adjusted for thicker border
          left: '40px',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent', // Bigger triangle
          borderRight: '10px solid transparent',
          borderTop: '10px solid var(--primary)',
        }}></div>
      </div>
    </div>
  );
};

export default MascotAssistant;
