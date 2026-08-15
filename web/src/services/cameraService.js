export class CameraService {
  static async requestPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return { granted: true, error: null };
    } catch (error) {
      return { granted: false, error: error.message };
    }
  }

  static async getDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error enumerating devices:', error);
      return [];
    }
  }

  static async startStream(constraints = {}) {
    // High-quality default constraints
    const defaultConstraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { min: 1280, ideal: 1920, max: 4096 },
        height: { min: 720, ideal: 1080, max: 2160 },
        frameRate: { min: 24, ideal: 30, max: 60 },
        aspectRatio: { ideal: 16/9 },
        focusMode: { ideal: 'continuous' },
        exposureMode: { ideal: 'continuous' },
        whiteBalanceMode: { ideal: 'continuous' }
      }
    };

    const finalConstraints = {
      video: { ...defaultConstraints.video, ...constraints.video }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(finalConstraints);
      
      // Apply additional quality enhancements
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities();
        const settings = videoTrack.getSettings();
        
        console.log('Camera capabilities:', capabilities);
        console.log('Current settings:', settings);
      }
      
      return { stream, error: null };
    } catch (error) {
      console.error('Camera error:', error);
      
      // Fallback: try with HD quality
      if (error.name === 'OverconstrainedError' || error.name === 'NotReadableError') {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 }
            }
          });
          return { stream: fallbackStream, error: null };
        } catch (fallbackError) {
          // Last resort: basic constraints
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({
              video: true
            });
            return { stream: basicStream, error: null };
          } catch {
            return { stream: null, error: 'Camera not available' };
          }
        }
      }

      return { stream: null, error: error.message };
    }
  }

  static stopStream(stream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  static async hasCamera() {
    try {
      const devices = await this.getDevices();
      return devices.length > 0;
    } catch {
      return false;
    }
  }

  static isCameraSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  static getErrorMessage(error) {
    const errorMessages = {
      'NotAllowedError': 'Camera permission denied. Please allow camera access in your browser settings.',
      'NotFoundError': 'No camera found on this device.',
      'NotReadableError': 'Camera is already in use by another application.',
      'OverconstrainedError': 'Camera does not support the requested settings.',
      'SecurityError': 'Camera access is not allowed on insecure origins. Please use HTTPS.',
      'TypeError': 'Camera access error. Please check your browser settings.'
    };

    return errorMessages[error.name] || error.message || 'Failed to access camera';
  }
}
