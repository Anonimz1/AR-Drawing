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
  Move,
  Minimize2,
  RotateCcw
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
      {/* Bottom Toolbar */}
      <div className={`drawing-controls ${expanded ? 'expanded' : ''} ${!controlsVisible ? 'controls-hidden' : ''}`}>
        {/* Toggle Visibility Button */}
        <button
          className="toggle-visibility-btn"
          onClick={() => setControlsVisible(!controlsVisible)}
          aria-label={controlsVisible ? 'Hide controls' : 'Show controls'}
          title={controlsVisible ? 'Hide controls' : 'Show controls'}
        >
          {controlsVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {controlsVisible && (
          <>
            <div className="controls-header">
              <button
                className="expand-button"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>

            <div className="controls-content">
              {/* Primary Controls */}
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
                  className="control-slider"
                  disabled={isLocked}
                />
                <span className="control-value">{Math.round(opacity * 100)}%</span>
              </div>

              <div className="control-group">
                <label className="control-label">
                  <Maximize2 size={18} />
                  <span>Scale</span>
                </label>
                <div className="scale-controls">
                  <button
                    className="zoom-btn"
                    onClick={() => onZoom(-0.2)}
                    disabled={isLocked || transform.scale <= 0.1}
                    title="Zoom Out"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={transform.scale}
                    onChange={(e) => onZoom(parseFloat(e.target.value) - transform.scale)}
                    className="control-slider"
                    disabled={isLocked}
                  />
                  <button
                    className="zoom-btn"
                    onClick={() => onZoom(0.2)}
                    disabled={isLocked || transform.scale >= 5}
                    title="Zoom In"
                  >
                    <ZoomIn size={18} />
                  </button>
                </div>
                <span className="control-value">{Math.round(transform.scale * 100)}%</span>
              </div>

              {/* Transform Buttons */}
              {expanded && (
                <>
                  <div className="control-buttons">
                    <button
                      className="control-btn"
                      onClick={() => onRotate(90)}
                      disabled={isLocked}
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw size={20} />
                    </button>
                    <button
                      className="control-btn"
                      onClick={() => onRotate(-90)}
                      disabled={isLocked}
                      title="Rotate 90° Counter-Clockwise"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      className="control-btn"
                      onClick={onFlipHorizontal}
                      disabled={isLocked}
                      title="Flip Horizontal"
                    >
                      <FlipHorizontal size={20} />
                    </button>
                    <button
                      className="control-btn"
                      onClick={onFlipVertical}
                      disabled={isLocked}
                      title="Flip Vertical"
                    >
                      <FlipVertical size={20} />
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

                  <div className="control-buttons">
                    <button
                      className="control-btn"
                      onClick={onReset}
                      title="Reset All Transforms"
                    >
                      <RefreshCw size={20} />
                      <span className="btn-label">Reset</span>
                    </button>
                  </div>

                  {/* Additional Controls */}
                  <div className="control-buttons">
                    <button
                      className={`control-btn ${showGrid ? 'active' : ''}`}
                      onClick={onToggleGrid}
                      title="Toggle Grid Overlay"
                    >
                      <GridIcon size={20} />
                      <span className="btn-label">Grid</span>
                    </button>
                    <button
                      className={`control-btn ${showFilters ? 'active' : ''}`}
                      onClick={() => setShowFilters(!showFilters)}
                      title="Image Filters"
                    >
                      <Palette size={20} />
                      <span className="btn-label">Filters</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="control-actions">
              <button
                className={`control-btn lock-btn ${isLocked ? 'locked' : ''}`}
                onClick={onToggleLock}
                title={isLocked ? 'Unlock' : 'Lock'}
              >
                {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
              </button>
              <button
                className="control-btn capture-btn"
                onClick={onCapture}
                title="Capture"
              >
                <Camera size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Effects</h3>
            <button onClick={() => setShowFilters(false)}>✕</button>
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
