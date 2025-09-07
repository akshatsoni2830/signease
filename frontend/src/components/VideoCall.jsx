import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function VideoCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteStream, setRemoteStream] = useState(null);
  const { currentUser } = useAuth();
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    if (isCallActive) {
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle incoming streams
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current = pc;
      setIsCallActive(true);

      // Simulate remote connection (in real app, this would be signaling)
      setTimeout(() => {
        setRemoteStream(new MediaStream());
      }, 2000);

    } catch (error) {
      console.error('Error starting call:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setRemoteStream(null);
    setIsCallActive(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '2px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-6)',
      }}>
        <div>
          <h3 style={{
            fontSize: 'var(--fs-h3)',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 var(--space-2) 0',
          }}>
            Video Call
          </h3>
          <p style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            {isCallActive ? `Call in progress - ${formatDuration(callDuration)}` : 'Start a video call'}
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isCallActive ? 'var(--success)' : 'var(--text-subtle)',
            animation: isCallActive ? 'pulse 2s infinite' : 'none',
          }} />
          <span style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--text-muted)',
          }}>
            {isCallActive ? 'Connected' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Video Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        background: 'var(--bg)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* Local Video (Picture-in-Picture) */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          width: '120px',
          height: '90px',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          border: '2px solid var(--surface)',
          boxShadow: 'var(--shadow)',
        }}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Connection Status Overlay */}
        {!isCallActive && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>📹</div>
            <div style={{ fontSize: 'var(--fs-body)', fontWeight: '600' }}>
              Camera Ready
            </div>
            <div style={{ fontSize: 'var(--fs-small)' }}>
              Click "Start Call" to begin
            </div>
          </div>
        )}

        {/* Call Controls Overlay */}
        {isCallActive && (
          <div style={{
            position: 'absolute',
            bottom: 'var(--space-4)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 'var(--space-3)',
          }}>
            <button
              onClick={toggleMute}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                background: isMuted ? 'var(--error)' : 'var(--surface)',
                color: isMuted ? 'white' : 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: 'var(--shadow)',
              }}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            
            <button
              onClick={toggleVideo}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                background: !isVideoOn ? 'var(--error)' : 'var(--surface)',
                color: !isVideoOn ? 'white' : 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: 'var(--shadow)',
              }}
            >
              {!isVideoOn ? '📷' : '📹'}
            </button>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-4)',
      }}>
        {!isCallActive ? (
          <button
            onClick={startCall}
            style={{
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              background: 'var(--success)',
              color: 'white',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              boxShadow: 'var(--shadow)',
            }}
          >
            📞 Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            style={{
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              background: 'var(--error)',
              color: 'white',
              fontSize: 'var(--fs-body)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              boxShadow: 'var(--shadow)',
            }}
          >
            📞 End Call
          </button>
        )}
      </div>

      {/* Features Info */}
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
          Video Call Features
        </h5>
        <ul style={{
          fontSize: 'var(--fs-small)',
          color: 'var(--text-muted)',
          margin: 0,
          paddingLeft: 'var(--space-4)',
        }}>
          <li>High-quality video and audio</li>
          <li>Mute/unmute microphone</li>
          <li>Turn camera on/off</li>
          <li>Picture-in-picture view</li>
          <li>Real-time connection status</li>
        </ul>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
