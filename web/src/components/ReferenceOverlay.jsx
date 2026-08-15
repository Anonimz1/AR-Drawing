import { useEffect, useRef, useCallback } from 'react';
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
  const rafRef = useRef(null);

  const renderImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image || !image.complete) return;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true // Better performance
    });
    
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    
    // Save context state
    ctx.save();
    
    // Apply transforms from center
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.translate(centerX + transform.x, centerY + transform.y);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(
      transform.scale * (transform.flipX ? -1 : 1),
      transform.scale * (transform.flipY ? -1 : 1)
    );
    
    // Draw filtered image or original
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
  }, [transform]);

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

  // Handle transform changes with RAF for smooth animation
  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      renderImage();
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [transform, renderImage]);

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

  return (
    <div
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
