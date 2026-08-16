import { useState, useCallback, useRef } from 'react';

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

  // Active pointers map: pointerId -> { x, y }
  const pointersRef = useRef(new Map());
  
  // Tracking metrics between frames
  const gestureStateRef = useRef({
    prevDist: 0,
    prevAngle: 0,
    prevCenter: { x: 0, y: 0 },
    prevSingle: { x: 0, y: 0 }
  });

  // Double tap detection
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });

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
      const newScale = Math.max(0.1, Math.min(10, +(prev.scale + delta).toFixed(3)));
      return { ...prev, scale: newScale };
    });
  }, [isLocked]);

  const rotate = useCallback((angle) => {
    if (isLocked) return;
    setTransform(prev => ({
      ...prev,
      rotation: Math.round((prev.rotation + angle) % 360)
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

  // Helper to calculate distance, angle, and center of two pointers
  const getTwoPointerMetrics = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return {
      dist: Math.hypot(dx, dy),
      angle: Math.atan2(dy, dx) * (180 / Math.PI),
      center: {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
      }
    };
  };

  const handlePointerDown = useCallback((e) => {
    if (isLocked) return;

    // Capture pointer to continue tracking even outside the element
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore if capture not supported
    }

    const pointers = pointersRef.current;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      // Check for double tap
      const now = Date.now();
      const last = lastTapRef.current;
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      if (now - last.time < 300 && dist < 30) {
        reset();
        lastTapRef.current = { time: 0, x: 0, y: 0 };
        return;
      }
      lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };

      gestureStateRef.current.prevSingle = { x: e.clientX, y: e.clientY };
    } else if (pointers.size === 2) {
      // 2 pointers down: initialize pinch metrics
      const pts = Array.from(pointers.values());
      const metrics = getTwoPointerMetrics(pts[0], pts[1]);
      gestureStateRef.current.prevDist = metrics.dist;
      gestureStateRef.current.prevAngle = metrics.angle;
      gestureStateRef.current.prevCenter = metrics.center;
    }
  }, [isLocked, reset]);

  const handlePointerMove = useCallback((e) => {
    if (isLocked) return;
    const pointers = pointersRef.current;
    if (!pointers.has(e.pointerId)) return;

    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      // 1-finger / mouse pan
      const prev = gestureStateRef.current.prevSingle;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;

      if (dx !== 0 || dy !== 0) {
        setTransform(t => ({
          ...t,
          x: t.x + dx,
          y: t.y + dy
        }));
        gestureStateRef.current.prevSingle = { x: e.clientX, y: e.clientY };
      }
    } else if (pointers.size === 2) {
      // 2-finger pinch zoom + rotate + pan
      const pts = Array.from(pointers.values());
      const { dist, angle, center } = getTwoPointerMetrics(pts[0], pts[1]);
      const state = gestureStateRef.current;

      if (state.prevDist > 0 && dist > 0) {
        const scaleFactor = dist / state.prevDist;
        const angleDiff = angle - state.prevAngle;
        const panX = center.x - state.prevCenter.x;
        const panY = center.y - state.prevCenter.y;

        setTransform(t => {
          const newScale = Math.max(0.1, Math.min(10, +(t.scale * scaleFactor).toFixed(4)));
          const newRotation = (t.rotation + angleDiff) % 360;
          return {
            ...t,
            scale: newScale,
            rotation: newRotation,
            x: t.x + panX,
            y: t.y + panY
          };
        });
      }

      state.prevDist = dist;
      state.prevAngle = angle;
      state.prevCenter = center;
    }
  }, [isLocked]);

  const handlePointerUp = useCallback((e) => {
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }

    const pointers = pointersRef.current;
    pointers.delete(e.pointerId);

    if (pointers.size === 1) {
      // Transition from 2 fingers to 1 finger: calibrate single pointer position
      const remaining = pointers.values().next().value;
      if (remaining) {
        gestureStateRef.current.prevSingle = { x: remaining.x, y: remaining.y };
      }
    } else if (pointers.size === 0) {
      gestureStateRef.current.prevDist = 0;
      gestureStateRef.current.prevAngle = 0;
    }
  }, []);

  const handleWheel = useCallback((e) => {
    if (isLocked) return;
    if (e.cancelable) {
      e.preventDefault();
    }

    let zoomDelta = 0;
    if (e.ctrlKey) {
      // Trackpad pinch-to-zoom
      zoomDelta = -e.deltaY * 0.015;
    } else {
      // Mouse scroll wheel zoom
      zoomDelta = -Math.sign(e.deltaY) * 0.1;
    }

    setTransform(t => {
      const newScale = Math.max(0.1, Math.min(10, +(t.scale + zoomDelta).toFixed(3)));
      return {
        ...t,
        scale: newScale
      };
    });
  }, [isLocked]);

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
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel: handlePointerUp,
    handleWheel
  };
};
