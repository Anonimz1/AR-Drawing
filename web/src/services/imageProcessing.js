export const ImageFilters = {
  ORIGINAL: 'original',
  GRAYSCALE: 'grayscale',
  HIGH_CONTRAST: 'highContrast',
  EDGE_DETECTION: 'edgeDetection',
  LINE_ART: 'lineArt',
  SKETCH: 'sketch',
  INVERT: 'invert',
  POSTERIZE: 'posterize'
};

export class ImageProcessor {
  static applyFilter(imageElement, filter) {
    if (!imageElement) return null;
    if (!filter || filter === ImageFilters.ORIGINAL || filter === 'original') {
      return null;
    }

    let width = imageElement.naturalWidth || imageElement.width || 800;
    let height = imageElement.naturalHeight || imageElement.height || 600;

    if (width <= 0 || height <= 0) return null;

    // Cap processing resolution for fast, lag-free performance (< 10ms)
    const maxDim = 1600;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return null;

    ctx.drawImage(imageElement, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    switch (filter) {
      case ImageFilters.GRAYSCALE:
        this.grayscale(data);
        break;
      case ImageFilters.HIGH_CONTRAST:
        this.highContrast(data);
        break;
      case ImageFilters.EDGE_DETECTION:
        return this.edgeDetection(canvas, ctx, imageData);
      case ImageFilters.LINE_ART:
        this.lineArt(data);
        break;
      case ImageFilters.SKETCH:
        this.sketch(data);
        break;
      case ImageFilters.INVERT:
        this.invert(data);
        break;
      case ImageFilters.POSTERIZE:
        this.posterize(data);
        break;
      default:
        return null;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  static grayscale(data) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  }

  static highContrast(data) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      const contrast = 1.8;
      const val = Math.max(0, Math.min(255, (gray - 128) * contrast + 128));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  }

  static edgeDetection(canvas, ctx, imageData) {
    const width = canvas.width;
    const height = canvas.height;
    const data = imageData.data;
    const gray = new Uint8ClampedArray(width * height);

    for (let i = 0; i < data.length; i += 4) {
      gray[i / 4] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    }

    const edges = new Uint8ClampedArray(width * height);

    // Sobel operator
    for (let y = 1; y < height - 1; y++) {
      const rowOffset = y * width;
      const prevRow = rowOffset - width;
      const nextRow = rowOffset + width;

      for (let x = 1; x < width - 1; x++) {
        const idx = rowOffset + x;
        
        const gx = 
          -gray[prevRow + x - 1] + gray[prevRow + x + 1] +
          -2 * gray[rowOffset + x - 1] + 2 * gray[rowOffset + x + 1] +
          -gray[nextRow + x - 1] + gray[nextRow + x + 1];
        
        const gy = 
          -gray[prevRow + x - 1] - 2 * gray[prevRow + x] - gray[prevRow + x + 1] +
          gray[nextRow + x - 1] + 2 * gray[nextRow + x] + gray[nextRow + x + 1];
        
        const mag = Math.min(255, Math.hypot(gx, gy) * 1.5);
        edges[idx] = mag;
      }
    }

    // High-contrast dark edge contours on transparent/white background for easy tracing
    for (let i = 0; i < edges.length; i++) {
      const val = Math.max(0, 255 - edges[i] * 1.6);
      data[i * 4] = val;
      data[i * 4 + 1] = val;
      data[i * 4 + 2] = val;
      data[i * 4 + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  static lineArt(data) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      const val = gray > 135 ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
  }

  static sketch(data) {
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      // Pencil sketch curve
      const val = Math.max(0, Math.min(255, 255 - Math.pow((255 - gray) / 255, 1.4) * 255));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
  }

  static invert(data) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
  }

  static posterize(data) {
    const levels = 4;
    const step = 255 / levels;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / step) * step;
      data[i + 1] = Math.floor(data[i + 1] / step) * step;
      data[i + 2] = Math.floor(data[i + 2] / step) * step;
    }
  }

  static compressImage(imageElement, maxWidth = 1920, maxHeight = 1080, quality = 0.9) {
    const canvas = document.createElement('canvas');
    let width = imageElement.naturalWidth || imageElement.width;
    let height = imageElement.naturalHeight || imageElement.height;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        },
        'image/jpeg',
        quality
      );
    });
  }
}
