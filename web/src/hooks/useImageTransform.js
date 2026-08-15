import { useState, useCallback, useRef, useEffect } from 'react';

export const useImageTransform = () => {
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false
  });

  const [isLocked, setIsLocked] = useState(false);
  const lastTouchRef = useRef(null);
  const initialDistanceRef = useRef(null);
  const initialRotationRef = useRef(null);
  const initialTransformRef = useRef(null);
  const isDraggingRef = useRef(false);

  const move = useCallback((deltaX, deltaY) => {
    if (isLocked) return;
    setTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  }, [isLocked]);

  const zoom = useCallback((delta) => {
    if (isLocked) return;
    setTransform(prev => {
      const newScale = Math.max(0.1, Math.min(10, prev.scale + delta));
      return { ...prev, scale: newScale };
    });
  }, [isLocked]);

  const rotate = useCallback((angle) => {
    if (isLocked) return;
    setTransform(prev => ({
      ...prev,
      rotation: (prev.rotation + angle) % 360
    }));
  }, [isLocked]);

  const flipHorizontal = useCallback(() => {
    if (isLocked) return;
    setTransform(prev => ({
      ...prev,
      flipX: !prev.flipX
    }));
  }, [isLocked]);

  const flipVertical = useCallback(() => {
    if (isLocked) return;
    setTransform(prev => ({
      ...prev,
      flipY: !prev.flipY
    }));
  }, [isLocked]);

  const reset = useCallback(() => {
    setTransform({
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      flipX: false,
      flipY: false
    });
  }, []);

  const toggleLock = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

  // Touch gesture handlers
  const handleTouchStart = useCallback((e) => {
    if (isLocked) return;

    // Handle both touch and mouse events
    const touches = e.touches || [{ clientX: e.clientX, clientY: e.clientY }];
    
    if (touches.length === 1) {
      isDraggingRef.current = true;
      lastTouchRef.current = {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    } else if (touches.length === 2) {
      isDraggingRef.current = false;
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialDistanceRef.current = distance;
      
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * 180 / Math.PI;
      initialRotationRef.current = angle;
      
      initialTransformRef.current = { ...transform };
      
      lastTouchRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
    }
  }, [isLocked, transform]);

  const handleTouchMove = useCallback((e) => {
    if (isLocked) return;
    
    // Prevent default to avoid scrolling while dragging
    if (isDraggingRef.current || (e.touches && e.touches.length > 1)) {
      e.preventDefault();
    }

    // Handle both touch and mouse events
    const touches = e.touches || (e.buttons === 1 ? [{ clientX: e.clientX, clientY: e.clientY }] : []);
    
    if (!touches.length && !e.buttons) {
      isDraggingRef.current = false;
      return;
    }

    if (touches.length === 1 && lastTouchRef.current && isDraggingRef.current) {
      const deltaX = touches[0].clientX - lastTouchRef.current.x;
      const deltaY = touches[0].clientY - lastTouchRef.current.y;
      
      move(deltaX, deltaY);
      
      lastTouchRef.current = {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    } else if (touches.length === 2) {
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      // Pinch to zoom
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      if (initialDistanceRef.current && initialTransformRef.current) {
        const scaleChange = distance / initialDistanceRef.current;
        const newScale = initialTransformRef.current.scale * scaleChange;
        setTransform(prev => ({
          ...prev,
          scale: Math.max(0.1, Math.min(10, newScale))
        }));
      }
      
      // Two finger rotation
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * 180 / Math.PI;
      if (initialRotationRef.current !== null && initialTransformRef.current) {
        const rotationChange = angle - initialRotationRef.current;
        setTransform(prev => ({
          ...prev,
          rotation: (initialTransformRef.current.rotation + rotationChange) % 360
        }));
      }
      
      // Two finger drag
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      if (lastTouchRef.current) {
        const deltaX = centerX - lastTouchRef.current.x;
        const deltaY = centerY - lastTouchRef.current.y;
        move(deltaX, deltaY);
      }
      lastTouchRef.current = { x: centerX, y: centerY };
    }
  }, [isLocked, move]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    lastTouchRef.current = null;
    initialDistanceRef.current = null;
    initialRotationRef.current = null;
    initialTransformRef.current = null;
  }, []);

  // Add passive event listener for better performance
  useEffect(() => {
    const preventDefaultTouch = (e) => {
      if (isDraggingRef.current || (e.touches && e.touches.length > 1)) {
        e.preventDefault();
      }
    };

    // Use passive: false to allow preventDefault
    document.addEventListener('touchmove', preventDefaultTouch, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefaultTouch);
    };
  }, []);

  return {
    transform,
    isLocked,
    move,
    zoom,
    rotate,
    flipHorizontal,
    flipVertical,
    reset,
    toggleLock,
    setTransform,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
