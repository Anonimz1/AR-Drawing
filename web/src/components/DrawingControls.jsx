import { useState } from 'react';
import {
  Droplet,
  Maximize2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  RefreshCw,
  Lock,
  Unlock,
  Camera,
  Grid as GridIcon,
  Palette,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Minimize2,
  RotateCcw,
  X
} from 'lucide-react';
import './DrawingControls.css';

export const DrawingControls = ({
  opacity,
  onOpacityChange,
  transform,
  onZoom,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onReset,
  isLocked,
  onToggleLock,
  onCapture,
  filter,
  onFilterChange,
  showGrid,
  onToggleGrid
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const filters = [
    { id: 'original', name: 'Original' },
    { id: 'grayscale', name: 'Grayscale' },
    { id: 'highContrast', name: 'High Contrast' },
    { id: 'edgeDetection', name: 'Edge Detection' },
    { id: 'lineArt', name: 'Line Art' },
    { id: 'sketch', name: 'Sketch' },
    { id: 'invert', name: 'Invert' },
    { id: 'posterize', name: 'Posterize' }
  ];

  return (
    <>
      {/* Floating Toggle Visibility FAB */}
      <button
        className={`toggle-visibility-fab ${!controlsVisible ? 'floating-hidden' : ''}`}
        onClick={() => setControlsVisible(!controlsVisible)}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={controlsVisible ? 'Hide controls' : 'Show controls'}
        title={controlsVisible ? 'Hide controls' : 'Show controls'}
      >
        {controlsVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        {!controlsVisible && <span className="fab-label">Controls</span>}
      </button>

      {/* Bottom Toolbar */}
      <div
        className={`drawing-controls ${expanded ? 'expanded' : ''} ${!controlsVisible ? 'controls-hidden' : ''}`}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {controlsVisible && (
          <>
            {/* Expand / Collapse Header Handle */}
            <div
              className="controls-header"
              onClick={() => setExpanded(!expanded)}
              role="button"
              tabIndex={0}
              aria-label={expanded ? 'Show basic controls' : 'Show more controls'}
            >
              <div className="expand-handle">
                <span className="handle-bar"></span>
                <div className="handle-content">
                  {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  <span className="handle-text">{expanded ? 'Less Controls' : 'More Controls'}</span>
                </div>
              </div>
            </div>

            <div className="controls-content">
              {/* Opacity Slider */}
              <div className="control-group">
                <label className="control-label">
                  <Droplet size={18} />
                  <span>Opacity</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                  className="control-slider opacity-slider"
                  disabled={isLocked}
                />
                <span className="control-value">{Math.round(opacity * 100)}%</span>
              </div>

              {/* Scale Controls */}
              <div className="control-group">
                <label className="control-label">
                  <Maximize2 size={18} />
                  <span>Scale</span>
                </label>
                <div className="scale-controls">
                  <button
                    className="zoom-btn"
                    onClick={() => onZoom(-0.15)}
                    disabled={isLocked || transform.scale <= 0.1}
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.05"
                    value={transform.scale}
                    onChange={(e) => onZoom(parseFloat(e.target.value) - transform.scale)}
                    className="control-slider scale-slider"
                    disabled={isLocked}
                  />
                  <button
                    className="zoom-btn"
                    onClick={() => onZoom(0.15)}
                    disabled={isLocked || transform.scale >= 5}
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn size={18} />
                  </button>
                </div>
                <span className="control-value">{Math.round(transform.scale * 100)}%</span>
              </div>

              {/* Expanded Extra Controls */}
              {expanded && (
                <>
                  {/* Rotation & Flip */}
                  <div className="control-buttons">
                    <button
                      className="control-btn"
                      onClick={() => onRotate(90)}
                      disabled={isLocked}
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw size={18} />
                      <span className="btn-label">+90°</span>
                    </button>
                    <button
                      className="control-btn"
                      onClick={() => onRotate(-90)}
                      disabled={isLocked}
                      title="Rotate 90° Counter-Clockwise"
                    >
                      <RotateCcw size={18} />
                      <span className="btn-label">-90°</span>
                    </button>
                    <button
                      className="control-btn"
                      onClick={onFlipHorizontal}
                      disabled={isLocked}
                      title="Flip Horizontal"
                    >
                      <FlipHorizontal size={18} />
                      <span className="btn-label">Flip H</span>
                    </button>
                    <button
                      className="control-btn"
                      onClick={onFlipVertical}
                      disabled={isLocked}
                      title="Flip Vertical"
                    >
                      <FlipVertical size={18} />
                      <span className="btn-label">Flip V</span>
                    </button>
                  </div>

                  {/* Quick Zoom Presets */}
                  <div className="control-group zoom-presets">
                    <label className="control-label">
                      <Minimize2 size={18} />
                      <span>Quick Zoom</span>
                    </label>
                    <div className="preset-buttons">
                      <button
                        className="preset-btn"
                        onClick={() => onZoom(0.5 - transform.scale)}
                        disabled={isLocked}
                        title="50%"
                      >
                        50%
                      </button>
                      <button
                        className="preset-btn"
                        onClick={() => onZoom(1 - transform.scale)}
                        disabled={isLocked}
                        title="100%"
                      >
                        100%
                      </button>
                      <button
                        className="preset-btn"
                        onClick={() => onZoom(1.5 - transform.scale)}
                        disabled={isLocked}
                        title="150%"
                      >
                        150%
                      </button>
                      <button
                        className="preset-btn"
                        onClick={() => onZoom(2 - transform.scale)}
                        disabled={isLocked}
                        title="200%"
                      >
                        200%
                      </button>
                    </div>
                  </div>

                  {/* Secondary Actions */}
                  <div className="control-buttons secondary-actions">
                    <button
                      className="control-btn reset-btn"
                      onClick={onReset}
                      title="Reset All Transforms"
                    >
                      <RefreshCw size={18} />
                      <span className="btn-label">Reset</span>
                    </button>
                    <button
                      className={`control-btn ${showGrid ? 'active' : ''}`}
                      onClick={onToggleGrid}
                      title="Toggle Grid Overlay"
                    >
                      <GridIcon size={18} />
                      <span className="btn-label">Grid</span>
                    </button>
                    <button
                      className={`control-btn ${showFilters ? 'active' : ''}`}
                      onClick={() => setShowFilters(!showFilters)}
                      title="Image Filters"
                    >
                      <Palette size={18} />
                      <span className="btn-label">Filters</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Actions Bar (Lock & Capture) */}
            <div className="control-actions">
              <button
                className={`control-btn lock-btn ${isLocked ? 'locked' : 'unlocked'}`}
                onClick={onToggleLock}
                title={isLocked ? 'Unlock transform' : 'Lock transform'}
                aria-label={isLocked ? 'Unlock transform' : 'Lock transform'}
              >
                {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                <span className="action-btn-text">{isLocked ? 'Locked' : 'Lock'}</span>
              </button>
              <button
                className="control-btn capture-btn"
                onClick={onCapture}
                title="Capture & Save Artwork"
                aria-label="Capture & Save Artwork"
              >
                <Camera size={20} />
                <span className="action-btn-text">Capture</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Filter Panel Modal */}
      {showFilters && (
        <div
          className="filter-panel"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="filter-header">
            <h3>Image Filters</h3>
            <button
              className="filter-close-btn"
              onClick={() => setShowFilters(false)}
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>
          <div className="filter-grid">
            {filters.map(f => (
              <button
                key={f.id}
                className={`filter-btn ${filter === f.id ? 'active' : ''}`}
                onClick={() => onFilterChange(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
