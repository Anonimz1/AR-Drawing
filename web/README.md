# AR Draw - See it. Trace it. Draw it.

A professional AR Drawing Web Application built with React. Turn your camera into a digital drawing assistant.

## Features

- **Real-time Camera Overlay** - Use your device camera as a drawing canvas
- **High-Quality Image Rendering** - Sharp, clear reference images with devicePixelRatio support
- **Transform Controls** - Move, zoom, rotate, flip reference images
- **Multi-Touch Gestures** - Pinch to zoom, two-finger rotate, drag to move
- **Drawing Filters** - Grayscale, edge detection, line art, sketch, and more
- **Grid System** - Square, rule of thirds, and perspective grids
- **Camera Lock** - Lock position to prevent accidental changes while drawing
- **Offline-First** - Works without internet connection
- **PWA Support** - Install as a native-like app
- **IndexedDB Storage** - Save your reference images locally
- **Privacy-First** - All processing happens on your device

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Canvas API** - Image processing and rendering
- **WebRTC** - Camera access
- **IndexedDB** - Local storage
- **Service Worker** - Offline functionality
- **PWA** - Progressive Web App

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser (preferably Chrome or Safari for best camera support).

**Note:** Camera access requires HTTPS in production. Use `localhost` for development.

## Usage

1. **Import Image** - Click "Start Drawing" and select a reference image
2. **Adjust Opacity** - Use the opacity slider to see through the reference
3. **Transform** - Use gestures or controls to position the image
4. **Apply Filters** - Choose from various drawing filters
5. **Enable Grid** - Toggle grid overlay for better alignment
6. **Lock Camera** - Lock position when ready to draw
7. **Capture** - Take a screenshot of your work

## Mobile Gestures

- **1 finger drag** → Move image
- **2 finger pinch** → Zoom in/out
- **2 finger rotate** → Rotate image
- **2 finger drag** → Move image
- **Double tap** → Reset transform

## Browser Support

- Chrome/Edge (Desktop & Mobile) ✅
- Safari (iOS & macOS) ✅
- Firefox ✅
- Opera ✅

**Best Experience:** Chrome on Android, Safari on iOS

## Camera Permissions

The app requires camera access to function. Grant camera permission when prompted.

If camera access is denied:
1. Check browser settings
2. Ensure you're on HTTPS (or localhost)
3. Reload the page and try again

## Performance

Optimized for:
- 60 FPS rendering
- High-resolution displays (Retina/HiDPI)
- Low-memory devices
- Smooth gesture handling
- Efficient image processing

## Privacy

- **No uploads** - Images never leave your device
- **No tracking** - No analytics or tracking scripts
- **No accounts** - No sign-up required
- **Offline-first** - Works without internet

## Project Structure

```
web/
├── public/
│   ├── sw.js              # Service Worker
│   ├── manifest.json      # PWA Manifest
│   └── icons.svg          # Icons
├── src/
│   ├── components/
│   │   ├── CameraView.jsx
│   │   ├── ReferenceOverlay.jsx
│   │   ├── DrawingControls.jsx
│   │   ├── DrawingScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── ImageLibrary.jsx
│   │   └── GridOverlay.jsx
│   ├── hooks/
│   │   ├── useCamera.js
│   │   ├── useImageTransform.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   └── imageProcessing.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

## Building for Production

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

**Important:** Ensure HTTPS is enabled for camera access.

## License

Free to use for personal and commercial projects.

## Contributing

Contributions welcome! Feel free to submit issues and pull requests.

## Roadmap

- [ ] Background removal
- [ ] Timelapse recording
- [ ] More filter options
- [ ] Custom grid patterns
- [ ] Image annotations
- [ ] Drawing history
- [ ] Export options (SVG, PDF)
- [ ] Multi-image layers

## Support

For issues or questions, please open a GitHub issue.

---

**AR Draw** - Made with ❤️ for artists and creators
