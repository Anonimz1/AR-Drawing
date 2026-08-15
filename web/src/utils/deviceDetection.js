export class DeviceDetection {
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  static isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  static isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  static isTablet() {
    return /iPad|Android/i.test(navigator.userAgent) && 
           window.innerWidth >= 768;
  }

  static isDesktop() {
    return !this.isMobile();
  }

  static isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  static getDeviceType() {
    if (this.isTablet()) return 'tablet';
    if (this.isMobile()) return 'mobile';
    return 'desktop';
  }

  static getScreenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1
    };
  }

  static getOrientation() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  static supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  static getPerformanceTier() {
    const { width, height, ratio } = this.getScreenSize();
    const pixels = width * height * ratio;
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 4;

    // High-end device
    if (cores >= 8 && memory >= 8 && pixels <= 1920 * 1080 * 2) {
      return 'high';
    }

    // Low-end device
    if (cores <= 4 || memory <= 2 || pixels > 1920 * 1080 * 3) {
      return 'low';
    }

    // Mid-range device
    return 'medium';
  }

  static getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edge') === -1) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edge') > -1) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }

    return { name: browserName, version: browserVersion };
  }

  static checkFeatureSupport() {
    return {
      camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      indexedDB: 'indexedDB' in window,
      serviceWorker: 'serviceWorker' in navigator,
      canvas: !!document.createElement('canvas').getContext,
      webgl: this.supportsWebGL(),
      offscreenCanvas: typeof OffscreenCanvas !== 'undefined',
      webWorkers: typeof Worker !== 'undefined',
      touchEvents: this.isTouchDevice(),
      pointerEvents: 'PointerEvent' in window
    };
  }

  static getDeviceInfo() {
    return {
      type: this.getDeviceType(),
      mobile: this.isMobile(),
      ios: this.isIOS(),
      android: this.isAndroid(),
      tablet: this.isTablet(),
      desktop: this.isDesktop(),
      touch: this.isTouchDevice(),
      screen: this.getScreenSize(),
      orientation: this.getOrientation(),
      performance: this.getPerformanceTier(),
      browser: this.getBrowserInfo(),
      features: this.checkFeatureSupport()
    };
  }

  static logDeviceInfo() {
    console.log('📱 Device Info:', this.getDeviceInfo());
  }
}
