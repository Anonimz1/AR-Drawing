import { useState, useRef, useEffect, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [capabilities, setCapabilities] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Keeps the <video> element's srcObject in sync with `stream` reactively.
  // Fixes the case where the <video> tag is conditionally rendered (e.g.
  // `{stream && <video ref={videoRef} />}`) and isn't mounted yet at the
  // exact moment startCamera() assigns srcObject the first time.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = useCallback(async (preferredFacingMode = 'environment') => {
    setIsLoading(true);
    setError(null);

    const applyStream = (mediaStream) => {
      if (!isMountedRef.current) {
        // Unmounted while getUserMedia was pending - don't leak the stream.
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    };

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Note: focusMode/exposureMode/whiteBalanceMode are intentionally NOT
      // requested here. They aren't reliably recognized as top-level
      // getUserMedia constraints across browsers and can trigger an
      // OverconstrainedError on stricter implementations. They're applied
      // afterwards via applyConstraints({ advanced }) once we know the
      // track actually supports them (see below).
      const constraints = {
        video: {
          facingMode: { ideal: preferredFacingMode },
          width: { min: 1280, ideal: 1920, max: 4096 },
          height: { min: 720, ideal: 1080, max: 2160 },
          frameRate: { min: 24, ideal: 30, max: 60 },
          aspectRatio: { ideal: 16 / 9 },
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const trackCapabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        if (isMountedRef.current) setCapabilities(trackCapabilities);

        const advancedConstraints = {};
        if (trackCapabilities.focusMode?.includes('continuous')) {
          advancedConstraints.focusMode = 'continuous';
        }
        if (trackCapabilities.exposureMode?.includes('continuous')) {
          advancedConstraints.exposureMode = 'continuous';
        }
        if (trackCapabilities.whiteBalanceMode?.includes('continuous')) {
          advancedConstraints.whiteBalanceMode = 'continuous';
        }

        if (Object.keys(advancedConstraints).length > 0) {
          try {
            await videoTrack.applyConstraints({ advanced: [advancedConstraints] });
          } catch (err) {
            console.log('Could not apply advanced constraints:', err);
          }
        }
      }

      applyStream(mediaStream);
      if (isMountedRef.current) {
        setFacingMode(preferredFacingMode);
        setIsLoading(false);
      }
      return mediaStream;
    } catch (err) {
      console.error('Camera error:', err);

      // Fallback to basic HD if high quality fails
      try {
        const fallbackConstraints = {
          video: {
            facingMode: { ideal: preferredFacingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        };

        const fallbackStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        applyStream(fallbackStream);
        if (isMountedRef.current) setIsLoading(false);
        return fallbackStream;
      } catch (fallbackErr) {
        if (isMountedRef.current) {
          setError(fallbackErr.message || 'Failed to access camera');
          setIsLoading(false);
        }
        return null;
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const switchCamera = useCallback(() => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(newMode);
  }, [facingMode, startCamera]);

  const toggleTorch = useCallback(async (enabled) => {
    if (streamRef.current && capabilities?.torch) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        try {
          await videoTrack.applyConstraints({ advanced: [{ torch: enabled }] });
          return true;
        } catch (err) {
          console.error('Torch error:', err);
        }
      }
    }
    return false;
  }, [capabilities]);

  const setZoomLevel = useCallback(async (zoomValue) => {
    if (streamRef.current && capabilities?.zoom) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      // Clamp to the device's supported range - requesting a value outside
      // it throws and silently no-ops the zoom instead of clamping itself.
      const { min = 1, max = 1 } = capabilities.zoom;
      const clamped = Math.max(min, Math.min(max, zoomValue));
      try {
        await videoTrack.applyConstraints({ advanced: [{ zoom: clamped }] });
        return true;
      } catch (err) {
        console.error('Zoom error:', err);
      }
    }
    return false;
  }, [capabilities]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    facingMode,
    capabilities,
    startCamera,
    stopCamera,
    switchCamera,
    toggleTorch,
    setZoomLevel
  };
};