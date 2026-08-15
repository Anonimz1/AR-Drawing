import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { ImageProcessor } from '../services/imageProcessing';
import './ReferenceOverlay.css';

export const ReferenceOverlay = ({
  imageUrl,
  opacity,
  transform,
  filter,
  onTouchStart,
  onTouchMove,
  onTouchEnd
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
    
    // Use lower DPR on mobile for better performance
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
    
    // Only apply rotation and scale to canvas
    // Position (x, y) will be handled by CSS transform
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(
      transform.scale * (transform.flipX ? -1 : 1),
      transform.scale * (transform.flipY ? -1 : 1)
    );
    
    const sourceCanvas = filteredCanvasRef.current || image;
    const imgWidth = sourceCanvas.width || image.naturalWidth;
    const imgHeight = sourceCanvas.height || image.naturalHeight;
    
    if (imgWidth > 0 && imgHeight > 0) {
      ctx.drawImage(
        sourceCanvas,
        -imgWidth / 2,
        -imgHeight / 2,
        imgWidth,
        imgHeight
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

  // Handle transform changes - Only redraw for rotation/scale/flip
  // Position (x,y) handled by CSS transform
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

  // Apply x/y position directly to the DOM instead of through JSX's
  // `style` prop. useLayoutEffect fires synchronously right after React
  // commits, before the browser paints — so the position is always in
  // sync with the latest touch/mouse event with zero extra frame delay.
  // Writing straight to node.style also skips React's style-object
  // diffing on every drag tick, which is a big part of what causes
  // "patah-patah" dragging when this fires dozens of times per second.
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
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
    >
      <canvas ref={canvasRef} className="reference-canvas" />
    </div>
  );
};