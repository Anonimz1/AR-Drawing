# AR Draw - Development Guide

## Architecture Overview

### Component Structure

```
src/
├── components/          # React components
│   ├── CameraView       # Camera feed display
│   ├── ReferenceOverlay # Image overlay with Canvas
│   ├── DrawingControls  # UI controls (opacity, transform, etc.)
│   ├── DrawingScreen    # Main drawing interface
│   ├── HomeScreen       # Landing page
│   ├── ImageLibrary     # Local image management
│   └── GridOverlay      # Grid system
├── hooks/               # Custom React hooks
│   ├── useCamera        # Camera management
│   ├── useImageTransform # Transform logic
│   └── useLocalStorage  # IndexedDB wrapper
├── services/            # Business logic
│   ├── cameraService    # Camera utilities
│   ├── imageProcessing  # Image filters
│   └── storageService   # IndexedDB operations
└── utils/               # Helpers
    ├── deviceDetection  # Device capabilities
    └── imageUtils       # Image manipulation
```

## Key Features Implementation

### 1. Camera System

**File:** `src/hooks/useCamera.js`

- Uses `navigator.mediaDevices.getUserMedia()`
- Prioritizes rear camera with `facingMode: 'environment'`
- Handles permission errors gracefully
- Supports camera switching
- Optional torch/flash control

**Important:** Camera requires HTTPS in production (localhost works in dev).

### 2. Image Transform System

**File:** `src/hooks/useImageTransform.js`

Handles:
- **Move:** Single touch drag
- **Zoom:** Pinch gesture (two-finger)
- **Rotate:** Two-finger rotation
- **Flip:** Horizontal/vertical flip
- **Reset:** Return to default state
- **Lock:** Prevent accidental changes

Transform state:
```javascript
{
  x: 0,           // X position offset
  y: 0,           // Y position offset
  scale: 1,       // Zoom level
  rotation: 0,    // Rotation in degrees
  flipX: false,   // Horizontal flip
  flipY: false    // Vertical flip
}
```

### 3. Reference Overlay Rendering

**File:** `src/components/ReferenceOverlay.jsx`

- Uses Canvas API for high-performance rendering
- Supports `devicePixelRatio` for sharp images on Retina displays
- Applies transforms with canvas context transformations
- Filters processed separately to avoid re-processing

**Performance Optimization:**
- Uses `requestAnimationFrame` for smooth updates
- Only re-renders when transform changes
- Filters cached in `filteredCanvasRef`

### 4. Image Processing

**File:** `src/services/imageProcessing.js`

Filters implemented:
- **Grayscale:** Average RGB values
- **High Contrast:** Contrast adjustment algorithm
- **Edge Detection:** Sobel operator
- **Line Art:** Threshold-based binarization
- **Sketch:** Inverted grayscale
- **Invert:** RGB inversion
- **Posterize:** Color quantization

All processing done client-side using Canvas ImageData.

### 5. Local Storage (IndexedDB)

**File:** `src/hooks/useLocalStorage.js`

Stores:
- **images:** Reference images with metadata
- **sessions:** Drawing sessions
- **settings:** User preferences

Schema:
```javascript
{
  id: auto-increment,
  url: blob URL,
  name: string,
  category: string,
  favorite: boolean,
  timestamp: number
}
```

### 6. Grid System

**File:** `src/components/GridOverlay.jsx`

Types:
- **Square:** Regular grid pattern
- **Rule of Thirds:** Photography composition guide
- **Perspective:** Vanishing point grid

Configurable:
- Size/spacing
- Opacity
- Color
- Line thickness

## Performance Considerations

### Rendering Pipeline

```
Camera Stream
    ↓
Video Element (Hardware Accelerated)
    ↓
Reference Canvas (GPU if available)
    ↓
Grid Canvas
    ↓
UI Layer
```

### Optimization Strategies

1. **Avoid unnecessary re-renders:**
   - Use `useRef` for transform data during gestures
   - Only update state when gesture ends
   - Memoize expensive computations

2. **Canvas performance:**
   - Single canvas per layer
   - Clear and redraw only when needed
   - Use `willReadFrequently: true` for ImageData operations

3. **Image loading:**
   - Load once, cache reference
   - Apply filters to canvas, not original image
   - Use high-quality downsampling when necessary

4. **Touch handling:**
   - Use `touch-action: none` to prevent browser gestures
   - Implement gesture recognition efficiently
   - Throttle/debounce when appropriate

## Browser Compatibility

### Required APIs

- **Camera:** `navigator.mediaDevices.getUserMedia()`
- **Canvas:** 2D context with ImageData
- **Storage:** IndexedDB
- **PWA:** Service Worker, Web App Manifest
- **Touch:** Touch Events or Pointer Events

### Fallbacks

```javascript
// Camera not available → Image-only mode
// IndexedDB unavailable → localStorage
// Service Worker unavailable → Online only
// WebGL unavailable → Canvas 2D
```

## Testing Locally

### Development Server

```bash
npm run dev
```

Access at: `http://localhost:5173`

### Testing on Mobile

#### Option 1: ngrok
```bash
npm install -g ngrok
npm run dev
ngrok http 5173
```

Use the HTTPS URL on your phone.

#### Option 2: Local Network
```bash
# Find your local IP (e.g., 192.168.1.x)
# Access from mobile: http://192.168.1.x:5173
```

**Note:** Camera won't work over HTTP (except localhost). Use HTTPS or ngrok.

### Build for Production

```bash
npm run build
npm run preview
```

## Common Issues & Solutions

### Issue: Camera not working

**Possible causes:**
1. Not using HTTPS (except localhost)
2. Permission denied
3. Camera in use by another app
4. Unsupported browser

**Solution:**
- Check console for error messages
- Use `CameraService.getErrorMessage()` for user-friendly errors
- Test on different browsers

### Issue: Blurry images

**Causes:**
- Not accounting for `devicePixelRatio`
- Using low-quality image source
- Scaling canvas incorrectly

**Solution:**
```javascript
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

### Issue: Poor performance on mobile

**Causes:**
- High-resolution camera feed
- Too many re-renders
- Heavy image processing

**Solutions:**
- Reduce camera resolution for low-end devices
- Use `DeviceDetection.getPerformanceTier()`
- Throttle gesture updates
- Move heavy processing to Web Workers (future)

### Issue: Touch gestures not working

**Causes:**
- Browser default gestures interfering
- Event listeners not properly attached
- `touch-action` not set correctly

**Solutions:**
```css
.overlay {
  touch-action: none;
}
```

```javascript
event.preventDefault(); // In touch handlers
```

## Future Enhancements

### Phase 2 Features
- [ ] Background removal (client-side AI)
- [ ] Timelapse recording (MediaRecorder API)
- [ ] More filters (artistic styles)
- [ ] Custom grid patterns
- [ ] Drawing annotations

### Phase 3 Features
- [ ] WebGL rendering for better performance
- [ ] Web Workers for image processing
- [ ] WebXR for true AR on supported devices
- [ ] Cloud sync (optional)
- [ ] Sharing features

### Performance Targets
- 60 FPS on mid-range devices
- <2s initial load time
- <100ms gesture response time
- <500ms filter application

## Contributing

1. Follow React best practices
2. Keep components modular and reusable
3. Add JSDoc comments for complex functions
4. Test on multiple devices before PR
5. Optimize for mobile-first

## Resources

- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [React Documentation](https://react.dev)
- [Canvas API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

**Questions?** Open an issue on GitHub.
