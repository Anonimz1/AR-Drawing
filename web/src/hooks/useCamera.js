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

      // High-quality camera constraints
      const constraints = {
        video: {
          facingMode: { ideal: preferredFacingMode },
          width: { min: 1280, ideal: 1920, max: 4096 },
          height: { min: 720, ideal: 1080, max: 2160 },
          frameRate: { min: 24, ideal: 30, max: 60 },
          aspectRatio: { ideal: 16/9 },
          // Advanced quality settings
          focusMode: { ideal: 'continuous' },
          exposureMode: { ideal: 'continuous' },
          whiteBalanceMode: { ideal: 'continuous' }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Apply additional quality settings to video track
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const trackCapabilities = videoTrack.getCapabilities();
        setCapabilities(trackCapabilities);
        
        // Try to apply advanced constraints if supported
        const advancedConstraints = {};
        
        if (trackCapabilities.focusMode && trackCapabilities.focusMode.includes('continuous')) {
          advancedConstraints.focusMode = 'continuous';
        }
        
        if (trackCapabilities.exposureMode && trackCapabilities.exposureMode.includes('continuous')) {
          advancedConstraints.exposureMode = 'continuous';
        }
        
        if (trackCapabilities.whiteBalanceMode && trackCapabilities.whiteBalanceMode.includes('continuous')) {
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
      
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setFacingMode(preferredFacingMode);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsLoading(false);
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
        streamRef.current = fallbackStream;
        setStream(fallbackStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        
        setIsLoading(false);
        return fallbackStream;
      } catch (fallbackErr) {
        setError(fallbackErr.message || 'Failed to access camera');
        setIsLoading(false);
        return null;
      }
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
