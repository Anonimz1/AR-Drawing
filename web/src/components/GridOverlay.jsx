import { useEffect, useRef } from 'react';
import './GridOverlay.css';

export const GridOverlay = ({ type = 'square', opacity = 0.3, size = 50, show = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = 1;

    const width = rect.width;
    const height = rect.height;

    switch (type) {
      case 'square':
        drawSquareGrid(ctx, width, height, size);
        break;
      case 'ruleOfThirds':
        drawRuleOfThirds(ctx, width, height);
        break;
      case 'perspective':
        drawPerspectiveGrid(ctx, width, height, size);
        break;
      default:
        drawSquareGrid(ctx, width, height, size);
    }
  }, [type, opacity, size, show]);

  const drawSquareGrid = (ctx, width, height, gridSize) => {
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawRuleOfThirds = (ctx, width, height) => {
    ctx.lineWidth = 2;

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(width / 3, 0);
    ctx.lineTo(width / 3, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((width / 3) * 2, 0);
    ctx.lineTo((width / 3) * 2, height);
    ctx.stroke();

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, height / 3);
    ctx.lineTo(width, height / 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (height / 3) * 2);
    ctx.lineTo(width, (height / 3) * 2);
    ctx.stroke();
  };

  const drawPerspectiveGrid = (ctx, width, height, gridSize) => {
    const vanishingPointX = width / 2;
    const vanishingPointY = height / 2;

    // Draw lines to vanishing point
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(vanishingPointX, vanishingPointY);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = vanishingPointY; y <= height; y += gridSize / 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  if (!show) return null;

  return (
    <div className="grid-overlay">
      <canvas ref={canvasRef} className="grid-canvas" />
    </div>
  );
};
