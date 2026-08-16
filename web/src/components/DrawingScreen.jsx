import { useState, useEffect, useRef } from 'react';
import { X, Info, SwitchCamera } from 'lucide-react';
import { CameraView } from './CameraView';
import { ReferenceOverlay } from './ReferenceOverlay';
import { DrawingControls } from './DrawingControls';
import { GridOverlay } from './GridOverlay';
import { useCamera } from '../hooks/useCamera';
import { useImageTransform } from '../hooks/useImageTransform';
import './DrawingScreen.css';

export const DrawingScreen = ({ imageUrl, imageName, onClose, onCapture }) => {
  const { videoRef, stream, error, startCamera, stopCamera, switchCamera } = useCamera();
  const {
    transform,
    isLocked,
    zoom,
    rotate,
    flipHorizontal,
    flipVertical,
    reset,
    toggleLock,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleWheel
  } = useImageTransform();

  const [opacity, setOpacity] = useState(0.5);
  const [filter, setFilter] = useState('original');
  const [showGrid, setShowGrid] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      onCapture?.(url);
      
      // Download
      const link = document.createElement('a');
      link.href = url;
      link.download = `ar-draw-${Date.now()}.jpg`;
      link.click();
    }, 'image/jpeg', 0.95);
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return (
    <div className="drawing-screen">
      {/* Camera Layer */}
      <CameraView videoRef={videoRef} stream={stream} error={error} />

      {/* Reference Image Layer */}
      {imageUrl && (
        <ReferenceOverlay
          imageUrl={imageUrl}
          opacity={opacity}
          transform={transform}
          filter={filter}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onWheel={handleWheel}
          ref={overlayRef}
        />
      )}

      {/* Grid Layer */}
      <GridOverlay show={showGrid} type="square" opacity={0.3} size={50} />

      {/* Top Bar */}
      <div
        className="drawing-top-bar"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button className="top-btn" onClick={onClose} title="Close">
          <X size={24} />
        </button>

        <div className="top-title">
          {imageName || 'Drawing Mode'}
          {isLocked && (
            <span className="lock-indicator">
              <span className="lock-icon">🔒</span> Locked
            </span>
          )}
        </div>

        <div className="top-actions">
          <button
            className="top-btn"
            onClick={() => setShowInfo(!showInfo)}
            title="Info"
          >
            <Info size={20} />
          </button>
          {stream && (
            <button className="top-btn" onClick={switchCamera} title="Switch Camera">
              <SwitchCamera size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div
          className="info-panel"
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <h4>Gestures & Controls</h4>
          <ul>
            <li>1 finger / mouse drag → Move</li>
            <li>2 fingers pinch → Zoom</li>
            <li>2 fingers rotate → Rotate</li>
            <li>Mouse wheel / trackpad → Zoom</li>
            <li>Double tap → Reset</li>
          </ul>
          <p className="info-tip">
            💡 Lock the camera to prevent accidental changes while drawing
          </p>
        </div>
      )}

      {/* Controls */}
      <DrawingControls
        opacity={opacity}
        onOpacityChange={setOpacity}
        transform={transform}
        onZoom={zoom}
        onRotate={rotate}
        onFlipHorizontal={flipHorizontal}
        onFlipVertical={flipVertical}
        onReset={reset}
        isLocked={isLocked}
        onToggleLock={toggleLock}
        onCapture={handleCapture}
        filter={filter}
        onFilterChange={setFilter}
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
      />
    </div>
  );
};
