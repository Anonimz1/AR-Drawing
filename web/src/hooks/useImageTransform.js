import { useState, useCallback, useRef, useEffect } from 'react';

// ---- Tunables ------------------------------------------------------------
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const DOUBLE_TAP_DELAY = 300;      // ms between taps to count as a double-tap
const TAP_MOVE_THRESHOLD = 10;     // px of movement before a touch stops being a "tap"
const ZOOM_STEP = 0.1;             // used by zoomIn/zoomOut helper buttons
const WHEEL_SENSITIVITY = 0.0015;  // desktop trackpad/mouse wheel zoom

const INITIAL_TRANSFORM = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  flipX: false,
  flipY: false,
};

const clampScale = (scale) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));

// Normalizes touch/mouse events into a plain array of {x, y} points.
const getPoints = (e) => {
  if (e.touches) return Array.from(e.touches).map((t) => ({ x: t.clientX, y: t.clientY }));
  return [{ x: e.clientX, y: e.clientY }];
};

export const useImageTransform = () => {
  const [transform, setTransform] = useState(INITIAL_TRANSFORM);
  const [isLocked, setIsLocked] = useState(false);

  // Attach this to the element that wraps the reference image, e.g.
  // <div ref={containerRef}>...</div>. All gesture listeners are bound here.
  const containerRef = useRef(null);

  // Mirror state into refs so the native listeners (attached once on mount)
  // always read fresh values without needing to be torn down/re-attached
  // every time transform changes (which would happen dozens of times a
  // second during a drag if these were plain closures over state).
  const transformRef = useRef(transform);
  const isLockedRef = useRef(isLocked);
  useEffect(() => { transformRef.current = transform; }, [transform]);
  useEffect(() => { isLockedRef.current = isLocked; }, [isLocked]);

  // Gesture bookkeeping
  const dragStartRef = useRef(null);        // anchor point when the gesture began
  const initialTransformRef = useRef(null); // transform snapshot when the gesture began
  const hasMovedRef = useRef(false);
  const initialDistanceRef = useRef(null);
  const initialAngleRef = useRef(null);
  const isTouchingRef = useRef(false);
  const lastTapRef = useRef(0);
  const rafRef = useRef(null);
  const pendingTransformRef = useRef(null);

  // Batches transform writes to at most once per animation frame so drag/
  // pinch/rotate stay smooth even on busy phones.
  const scheduleTransform = useCallback((partial) => {
    pendingTransformRef.current = { ...pendingTransformRef.current, ...partial };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const next = pendingTransformRef.current;
      pendingTransformRef.current = null;
      rafRef.current = null;
      if (next) setTransform((prev) => ({ ...prev, ...next }));
    });
  }, []);

  // ---- Public, button-driven controls ------------------------------------
  const move = useCallback((deltaX, deltaY) => {
    if (isLockedRef.current) return;
    setTransform((prev) => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
  }, []);

  const zoom = useCallback((delta) => {
    if (isLockedRef.current) return;
    setTransform((prev) => ({ ...prev, scale: clampScale(prev.scale + delta) }));
  }, []);

  const zoomIn = useCallback(() => zoom(ZOOM_STEP), [zoom]);
  const zoomOut = useCallback(() => zoom(-ZOOM_STEP), [zoom]);

  const setScale = useCallback((value) => {
    if (isLockedRef.current) return;
    setTransform((prev) => ({ ...prev, scale: clampScale(value) }));
  }, []);

  const rotate = useCallback((angle) => {
    if (isLockedRef.current) return;
    setTransform((prev) => ({ ...prev, rotation: (prev.rotation + angle) % 360 }));
  }, []);

  const flipHorizontal = useCallback(() => {
    if (isLockedRef.current) return;
    setTransform((prev) => ({ ...prev, flipX: !prev.flipX }));
  }, []);

  const flipVertical = useCallback(() => {
    if (isLockedRef.current) return;
    setTransform((prev) => ({ ...prev, flipY: !prev.flipY }));
  }, []);

  const reset = useCallback(() => {
    setTransform(INITIAL_TRANSFORM);
  }, []);

  const toggleLock = useCallback(() => {
    setIsLocked((prev) => !prev);
  }, []);

  // ---- Low-level gesture handling ----------------------------------------
  // Everything below reads/writes through refs only, so these callbacks
  // never change identity and the DOM-wiring effect further down only
  // needs to run once (no listener churn during drags).

  const beginGesture = useCallback((points) => {
    initialTransformRef.current = { ...transformRef.current };
    hasMovedRef.current = false;

    if (points.length === 1) {
      dragStartRef.current = points[0];
      initialDistanceRef.current = null;
      initialAngleRef.current = null;
    } else if (points.length >= 2) {
      const [p1, p2] = points;
      dragStartRef.current = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      initialDistanceRef.current = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      initialAngleRef.current = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    }
  }, []);

  const updateGesture = useCallback((points) => {
    if (isLockedRef.current || !initialTransformRef.current || !dragStartRef.current) return;

    if (points.length === 1) {
      const dx = points[0].x - dragStartRef.current.x;
      const dy = points[0].y - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > TAP_MOVE_THRESHOLD) hasMovedRef.current = true;

      scheduleTransform({
        x: initialTransformRef.current.x + dx,
        y: initialTransformRef.current.y + dy,
      });
    } else if (points.length >= 2) {
      hasMovedRef.current = true;
      const [p1, p2] = points;
      const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

      const update = {
        x: initialTransformRef.current.x + (center.x - dragStartRef.current.x),
        y: initialTransformRef.current.y + (center.y - dragStartRef.current.y),
      };

      if (initialDistanceRef.current) {
        const scaleChange = distance / initialDistanceRef.current;
        update.scale = clampScale(initialTransformRef.current.scale * scaleChange);
      }

      if (initialAngleRef.current !== null) {
        const rotationChange = angle - initialAngleRef.current;
        update.rotation = (initialTransformRef.current.rotation + rotationChange) % 360;
      }

      scheduleTransform(update);
    }
  }, [scheduleTransform]);

  const endGesture = useCallback((remainingPoints) => {
    if (remainingPoints.length > 0) {
      // A finger was lifted but others remain (e.g. pinch -> single drag): re-anchor.
      beginGesture(remainingPoints);
      isTouchingRef.current = true;
      return;
    }

    // No movement happened -> this was a tap. Check if it's the second tap
    // of a double-tap and reset the transform if so.
    if (!hasMovedRef.current) {
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        reset();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    }

    isTouchingRef.current = false;
    dragStartRef.current = null;
    initialTransformRef.current = null;
    initialDistanceRef.current = null;
    initialAngleRef.current = null;
  }, [beginGesture, reset]);

  // ---- DOM wiring ---------------------------------------------------------
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Stops the browser's native pinch-zoom/pan from hijacking the gesture
    // area. Without this, preventDefault() alone is not reliable enough on
    // mobile Safari/Chrome to stop a two-finger gesture from zooming the page.
    const previousTouchAction = el.style.touchAction;
    el.style.touchAction = 'none';

    const onTouchStart = (e) => {
      isTouchingRef.current = true;
      beginGesture(getPoints(e));
    };
    const onTouchMove = (e) => {
      if (!isTouchingRef.current) return;
      e.preventDefault();
      updateGesture(getPoints(e));
    };
    const onTouchEnd = (e) => {
      endGesture(getPoints(e)); // e.touches already excludes the finger that just lifted
    };

    // Desktop support: drag with mouse, wheel to zoom.
    const onMouseDown = (e) => {
      isTouchingRef.current = true;
      beginGesture([{ x: e.clientX, y: e.clientY }]);
    };
    const onMouseMove = (e) => {
      if (!isTouchingRef.current) return;
      updateGesture([{ x: e.clientX, y: e.clientY }]);
    };
    const onMouseUp = () => {
      if (!isTouchingRef.current) return;
      endGesture([]);
    };
    const onWheel = (e) => {
      if (isLockedRef.current) return;
      e.preventDefault();
      const delta = -e.deltaY * WHEEL_SENSITIVITY;
      setTransform((prev) => ({ ...prev, scale: clampScale(prev.scale + delta) }));
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.style.touchAction = previousTouchAction;
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [beginGesture, updateGesture, endGesture]);

  // Cleanup any pending RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    transform,
    isLocked,
    containerRef,
    move,
    zoom,
    zoomIn,
    zoomOut,
    setScale,
    rotate,
    flipHorizontal,
    flipVertical,
    reset,
    toggleLock,
    setTransform,
  };
};