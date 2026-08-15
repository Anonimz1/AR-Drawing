import { useEffect, useRef } from 'react';
import './CameraView.css';

export const CameraView = ({ videoRef, stream, error }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  if (error) {
    return (
      <div className="camera-error">
        <div className="camera-error-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
          <h3>Camera Unavailable</h3>
          <p>{error}</p>
          <p className="camera-error-hint">
            Please check your browser permissions and try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-container" ref={containerRef}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-video"
      />
    </div>
  );
};
