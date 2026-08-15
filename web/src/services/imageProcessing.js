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
  static createCanvas(width, height, pixelRatio = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return canvas;
  }

  static applyFilter(imageElement, filter) {
    const canvas = this.createCanvas(
      imageElement.naturalWidth,
      imageElement.naturalHeight,
      window.devicePixelRatio
    );
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    if (filter === ImageFilters.ORIGINAL) {
      return canvas;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  static grayscale(data) {
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
  }

  static highContrast(data) {
    this.grayscale(data);
    const contrast = 1.5;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128;
      data[i + 1] = factor * (data[i + 1] - 128) + 128;
      data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }
  }

  static edgeDetection(canvas, ctx, imageData) {
    const gray = new Uint8ClampedArray(imageData.data.length / 4);
    const data = imageData.data;
    
    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
      gray[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    }

    const width = canvas.width;
    const height = canvas.height;
    const edges = new Uint8ClampedArray(gray.length);

    // Sobel operator
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        
        const gx = 
          -1 * gray[idx - width - 1] + 1 * gray[idx - width + 1] +
          -2 * gray[idx - 1] + 2 * gray[idx + 1] +
          -1 * gray[idx + width - 1] + 1 * gray[idx + width + 1];
        
        const gy = 
          -1 * gray[idx - width - 1] - 2 * gray[idx - width] - 1 * gray[idx - width + 1] +
          1 * gray[idx + width - 1] + 2 * gray[idx + width] + 1 * gray[idx + width + 1];
        
        edges[idx] = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      }
    }

    // Convert back to RGBA
    for (let i = 0; i < edges.length; i++) {
      const val = 255 - edges[i]; // Invert for better visibility
      data[i * 4] = val;
      data[i * 4 + 1] = val;
      data[i * 4 + 2] = val;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  static lineArt(data) {
    this.grayscale(data);
    const threshold = 128;
    
    for (let i = 0; i < data.length; i += 4) {
      const val = data[i] > threshold ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  }

  static sketch(data) {
    this.grayscale(data);
    
    for (let i = 0; i < data.length; i += 4) {
      const val = 255 - data[i];
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
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
    let width = imageElement.naturalWidth;
    let height = imageElement.naturalHeight;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
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
