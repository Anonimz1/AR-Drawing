import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { ImageProcessor } from '../services/imageProcessing';
import './ReferenceOverlay.css';

export const ReferenceOverlay = ({
  imageUrl,
  opacity,
  transform,
  filter,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onWheel
}) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const filteredCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const renderImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image || !image.complete) return;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: false
    });
    
    if (!ctx) return;
    
    // DPR for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    
    ctx.save();
    
    // Safe visible viewport calculations (accounting for top bar & bottom controls)
    const topBarHeight = 70;
    const bottomControlsHeight = 180;
    const availableH = Math.max(200, height - topBarHeight - bottomControlsHeight);
    const availableW = Math.max(200, width - 48);
    
    // Center point in visible viewport
    const centerX = width / 2;
    const centerY = topBarHeight + availableH / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(
      transform.scale * (transform.flipX ? -1 : 1),
      transform.scale * (transform.flipY ? -1 : 1)
    );
    
    const sourceCanvas = filteredCanvasRef.current || image;
    const naturalW = sourceCanvas.width || image.naturalWidth;
    const naturalH = sourceCanvas.height || image.naturalHeight;
    
    if (naturalW > 0 && naturalH > 0) {
      // Comfortable baseline size (70% of available workspace area)
      const maxW = availableW * 0.7;
      const maxH = availableH * 0.7;
      const aspect = naturalW / naturalH;
      let drawW = maxW;
      let drawH = maxW / aspect;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = maxH * aspect;
      }

      ctx.drawImage(
        sourceCanvas,
        -drawW / 2,
        -drawH / 2,
        drawW,
        drawH
      );
    }
    
    ctx.restore();
  }, [transform.rotation, transform.scale, transform.flipX, transform.flipY]);

  // Handle filter changes
  useEffect(() => {
    if (!imageRef.current || !imageRef.current.complete) return;

    const processFilter = async () => {
      try {
        const filtered = ImageProcessor.applyFilter(imageRef.current, filter);
        filteredCanvasRef.current = filtered;
        renderImage();
      } catch (error) {
        console.error('Filter error:', error);
      }
    };

    processFilter();
  }, [filter, renderImage]);

  // Redraw on transform changes
  useEffect(() => {
    renderImage();
  }, [renderImage]);

  // Handle image load
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      filteredCanvasRef.current = null;
      renderImage();
    };
    img.src = imageUrl;
  }, [imageUrl, renderImage]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      renderImage();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderImage]);

  // Non-passive wheel event listener for trackpad & mouse wheel zoom
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !onWheel) return;

    const handleWheelEvent = (e) => {
      onWheel(e);
    };

    node.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => {
      node.removeEventListener('wheel', handleWheelEvent);
    };
  }, [onWheel]);

  // Hardware-accelerated smooth translate
  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }, [transform.x, transform.y]);

  return (
    <div
      ref={containerRef}
      className="reference-overlay"
      style={{ opacity }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <canvas ref={canvasRef} className="reference-canvas" />
    </div>
  );
};