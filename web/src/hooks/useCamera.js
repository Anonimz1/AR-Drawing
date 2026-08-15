import { useState, useRef, useEffect, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [capabilities, setCapabilities] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async (preferredFacingMode = 'environment') => {
    setIsLoading(true);
    setError(null);

    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: { ideal: preferredFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setFacingMode(preferredFacingMode);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Get camera capabilities
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const trackCapabilities = videoTrack.getCapabilities();
        setCapabilities(trackCapabilities);
      }

      setIsLoading(false);
      return mediaStream;
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to access camera');
      setIsLoading(false);
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && capabilities?.torch) {
        try {
          await videoTrack.applyConstraints({
            advanced: [{ torch: enabled }]
          });
          return true;
        } catch (err) {
          console.error('Torch error:', err);
          return false;
        }
      }
    }
    return false;
  }, [capabilities]);

  const setZoomLevel = useCallback(async (zoomValue) => {
    if (streamRef.current && capabilities?.zoom) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      try {
        await videoTrack.applyConstraints({
          advanced: [{ zoom: zoomValue }]
        });
        return true;
      } catch (err) {
        console.error('Zoom error:', err);
        return false;
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
