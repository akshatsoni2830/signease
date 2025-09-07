import React from 'react';

export default function AboutUs() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-6)',
        textAlign: 'center',
      }}>
        {/* Hero Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'var(--fs-h1)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-6) 0',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
          }}>
            About SignEase
          </h1>

          <p style={{
            fontSize: 'var(--fs-body)',
            lineHeight: 'var(--lh)',
            color: 'var(--text-muted)',
            margin: '0 0 var(--space-6) 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}>
            SignEase is a revolutionary AI-powered platform designed to bridge the communication gap between hearing and hearing-impaired communities. Our mission is to make sign language accessible to everyone through cutting-edge technology.
          </p>
        </div>

        {/* Mission, Vision, Values Section */}
        <div style={{
          marginBottom: 'var(--space-8)',
        }}>
          <h2 style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-6) 0',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
          }}>
            Our Core Values
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-6)',
            flexWrap: 'nowrap',
          }}>
            <div style={{
              background: 'var(--surface)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow)',
              flex: '1',
              maxWidth: '300px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 'var(--space-12)',
                height: 'var(--space-12)',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto',
                color: 'white',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2v4"/>
                  <path d="M12 18v4"/>
                  <path d="M4.93 4.93l2.83 2.83"/>
                  <path d="M16.24 16.24l2.83 2.83"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '600',
                color: 'var(--text)',
                margin: '0 0 var(--space-3) 0',
                textAlign: 'center',
              }}>
                Our Mission
              </h3>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--lh)',
                margin: 0,
                textAlign: 'center',
              }}>
                To create an inclusive world where communication barriers are eliminated through innovative AI technology.
              </p>
            </div>

            <div style={{
              background: 'var(--surface)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow)',
              flex: '1',
              maxWidth: '300px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 'var(--space-12)',
                height: 'var(--space-12)',
                borderRadius: '50%',
                background: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto',
                color: 'white',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '600',
                color: 'var(--text)',
                margin: '0 0 var(--space-3) 0',
                textAlign: 'center',
              }}>
                Our Vision
              </h3>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--lh)',
                margin: 0,
                textAlign: 'center',
              }}>
                A future where sign language is universally understood and accessible to everyone, everywhere.
              </p>
            </div>

            <div style={{
              background: 'var(--surface)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow)',
              flex: '1',
              maxWidth: '300px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 'var(--space-12)',
                height: 'var(--space-12)',
                borderRadius: '50%',
                background: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto',
                color: 'white',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: '600',
                color: 'var(--text)',
                margin: '0 0 var(--space-3) 0',
                textAlign: 'center',
              }}>
                Our Values
              </h3>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--lh)',
                margin: 0,
                textAlign: 'center',
              }}>
                Innovation, inclusivity, accessibility, and community-driven development guide everything we do.
              </p>
            </div>
          </div>
        </div>

        {/* Future Scopes & Innovation Section */}
        <div style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow)',
          marginBottom: 'var(--space-8)',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-6) 0',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
          }}>
            🚀 Future Scopes & Innovation
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-6)',
            flexWrap: 'nowrap',
          }}>
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-4)',
              background: 'var(--accent)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-light)',
              flex: '1',
              maxWidth: '200px',
            }}>
              <div style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: 'var(--space-2)',
              }}>
                🥽
              </div>
              <h4 style={{
                fontSize: 'var(--fs-body)',
                fontWeight: '600',
                color: 'var(--text)',
                margin: '0 0 var(--space-2) 0',
                textAlign: 'center',
              }}>
                Holographic Displays
              </h4>
              <p style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--text-muted)',
                margin: 0,
                textAlign: 'center',
              }}>
                Immersive 3D sign language visualization
              </p>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-4)',
              background: 'var(--accent)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-light)',
              flex: '1',
              maxWidth: '200px',
            }}>
              <div style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: '700',
                color: 'var(--success)',
                marginBottom: 'var(--space-2)',
              }}>
                🤖
              </div>
              <h4 style={{
                fontSize: 'var(--fs-body)',
                fontWeight: '600',
                color: 'var(--text)',
                margin: '0 0 var(--space-2) 0',
                textAlign: 'center',
              }}>
                Advanced AI
              </h4>
              <p style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--text-muted)',
                margin: 0,
                textAlign: 'center',
              }}>
                Real-time emotion and context recognition
              </p>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-4)',
              background: 'var(--accent)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-light)',
              flex: '1',
              maxWidth: '200px',
            }}>
              <div style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: '700',
                color: 'var(--warning)',
                marginBottom: 'var(--space-2)',
              }}>
                🌐
              </div>
              <h4 style={{
                fontSize: 'var(--fs-body)',
                fontWeight: '600',
                color: 'var(--text)',
                margin: '0 0 var(--space-2) 0',
                textAlign: 'center',
              }}>
                Global Reach
              </h4>
              <p style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--text-muted)',
                margin: 0,
                textAlign: 'center',
              }}>
                Support for 100+ sign language dialects
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow)',
          marginBottom: 'var(--space-8)',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-6) 0',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
          }}>
            Key Features
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-6)',
            flexWrap: 'nowrap',
          }}>
            <div style={{ 
              textAlign: 'center',
              flex: '1',
              maxWidth: '200px',
            }}>
              <div style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: 'var(--space-2)',
              }}>
                99%
              </div>
              <div style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                Accuracy Rate
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              flex: '1',
              maxWidth: '200px',
            }}>
              <div style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: '700',
                color: 'var(--success)',
                marginBottom: 'var(--space-2)',
              }}>
                24/7
              </div>
              <div style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                Availability
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              flex: '1',
              maxWidth: '200px',
            }}>
              <div style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: '700',
                color: 'var(--warning)',
                marginBottom: 'var(--space-2)',
              }}>
                AI
              </div>
              <div style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                Powered Learning
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              flex: '1',
              maxWidth: '200px',
            }}>
              <div style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: '700',
                color: 'var(--ai-primary)',
                marginBottom: 'var(--space-2)',
              }}>
                🌍
              </div>
              <div style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--text-muted)',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                Multi-Language
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div style={{
          background: 'var(--accent)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 'var(--fs-h2)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-4) 0',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
          }}>
            Get Started Today
          </h2>
          <p style={{
            fontSize: 'var(--fs-body)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--lh)',
            margin: '0 0 var(--space-6) 0',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}>
            Join thousands of users who are already breaking down communication barriers with SignEase. Start your journey towards inclusive communication today.
          </p>
          <button
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
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary-hover)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--primary)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Start Learning Now
          </button>
        </div>
      </div>
    </div>
  );
}
