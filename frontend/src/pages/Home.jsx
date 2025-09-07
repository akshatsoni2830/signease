import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import ModeCard from '../components/ModeCard';
import QuickActions from '../components/QuickActions';
import History from '../components/History';
import MascotAssistant from '../components/MascotAssistant';
import WebcamCapture from '../components/WebcamCapture';
import LearnMode from '../components/LearnMode';
import CreateCustomSign from '../components/CreateCustomSign';
import AboutUs from './AboutUs';
import HistoryPage from './History';

export default function Home() {
  const [currentMode, setCurrentMode] = useState('home');
  const { currentUser, isGuest } = useAuth();

  const handleNavigate = (mode) => {
    setCurrentMode(mode);
  };

  const renderModeContent = () => {
    switch (currentMode) {
      case 'home':
        return (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'var(--space-6)',
          }}>
            {/* Main Content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
              textAlign: 'center',
            }}>
              {/* Hero Section with Background Banner */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: 'var(--space-4)',
              }}>
                {/* Video Background Banner */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}>
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 1.0,
                    }}
                  >
                    <source src="/videos/background-banner.mp4" type="video/mp4" />
                    <source src="/videos/background-banner.webm" type="video/webm" />
                    {/* Fallback to image if video fails to load */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: 'url(/images/pattern.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.8,
                    }} />
                  </video>
                </div>
                
                {/* Hero Content with Invisible Border */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: 'var(--space-8)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid transparent',
                  // backdropFilter: 'blur(10px)',
                }}>
                  <Hero 
                    onStartTranslate={() => handleNavigate('translate')}
                    onTryLearn={() => handleNavigate('learn')}
                  />
                </div>
              </div>
              
              {/* Mode Cards */}
              <div>
                <h2 style={{
                  fontSize: 'var(--fs-h2)',
                  fontWeight: '700',
                  color: 'var(--text)',
                  margin: '0 0 var(--space-4) 0',
                  textAlign: 'center',
                  fontFamily: 'var(--font-display)',
                }}>
                  Choose Your Path
                </h2>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-4)',
                  flexWrap: 'nowrap',
                }}>
                  <ModeCard
                    title="Live Translation"
                    description="Real-time sign language to text conversion"
                    icon="🗣️"
                    onClick={() => handleNavigate('translate')}
                  />
                  <ModeCard
                    title="Learning Module"
                    description="Practice and improve your sign language skills"
                    icon="📚"
                    onClick={() => handleNavigate('learn')}
                  />
                  <ModeCard
                    title="Custom Signs"
                    description="Create and manage your own custom signs"
                    icon="⚙️"
                    onClick={() => handleNavigate('custom')}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ textAlign: 'center' }}>
                <QuickActions />
              </div>
            </div>
          </div>
        );
      
      case 'translate':
        return (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'var(--space-6)',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-6)',
              height: 'calc(100vh - 200px)',
            }}>
              {/* Left - Live Translation */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h2 style={{
                  fontSize: 'var(--fs-h2)',
                  fontWeight: '700',
                  color: 'var(--text)',
                  margin: '0 0 var(--space-4) 0',
                  textAlign: 'center',
                  fontFamily: 'var(--font-display)',
                }}>
                  🎥 Live Translation
                </h2>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <WebcamCapture />
                </div>
              </div>

              {/* Right - Translation Output */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h2 style={{
                  fontSize: 'var(--fs-h2)',
                  fontWeight: '700',
                  color: 'var(--text)',
                  margin: '0 0 var(--space-4) 0',
                  textAlign: 'center',
                  fontFamily: 'var(--font-display)',
                }}>
                  📝 Translation Output
                </h2>
                <div style={{ 
                  flex: 1, 
                  overflow: 'auto',
                  background: 'var(--accent)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-light)',
                }}>
                  <History />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'learn':
        return <LearnMode />;
      
      case 'custom':
        return <CreateCustomSign />;
      
      case 'about':
        return <AboutUs />;
      
      case 'history':
        return <HistoryPage />;
      
      default:
        return null;
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navigation onNavigate={handleNavigate} />
      {renderModeContent()}
      <MascotAssistant onNavigate={handleNavigate} />
    </div>
  );
}
