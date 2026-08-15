# 🎨 AR Draw - Camera-Based Drawing Assistant

Transform your device camera into a natural tracing tool for learning and practicing drawing techniques.

![AR Draw](web/src/assets/hero.png)

## ✨ Features

- **📸 Live Camera Overlay** - See reference images overlaid on your physical drawing surface
- **🎯 Precise Controls** - Scale, rotate, flip, and position images exactly where you need them
- **🎨 Image Filters** - Apply grayscale, sepia, or invert filters for better tracing
- **📏 Grid Overlay** - Optional grid for accurate proportions
- **📚 Image Library** - Save and organize your reference images using IndexedDB
- **🎭 Vintage Design** - Beautiful botanical-themed UI with mathematical ornaments
- **📱 Mobile-First** - Optimized for smartphones and tablets
- **🔒 Privacy-First** - All processing happens locally, no data sent to servers

## 🚀 Live Demo

**Coming soon!** App will be deployed on Vercel.

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **Vite** - Lightning-fast build tool
- **Lucide Icons** - Beautiful, consistent icons
- **IndexedDB** - Client-side storage for images
- **MediaStream API** - Camera access
- **Canvas API** - Image processing

## 📋 Requirements

- Modern browser with camera support
- HTTPS connection (required for camera access on mobile)
- Minimum 2GB RAM
- Camera permission

## 🏃 Quick Start

### Installation

```bash
cd web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Usage

1. **Grant Camera Permission** - Allow camera access when prompted
2. **Upload Reference Image** - Choose an image from your device
3. **Adjust Image** - Use controls to position, scale, and rotate
4. **Apply Filters** (optional) - Enhance visibility with filters
5. **Enable Grid** (optional) - Display grid for accurate proportions
6. **Start Drawing!** - Trace the overlaid image on your physical paper

## 🎯 Use Cases

- **Art Students** - Learn drawing techniques by tracing masterpieces
- **Hobbyists** - Improve drawing skills with guided practice
- **Designers** - Quick sketching and ideation
- **Portrait Artists** - Accurate facial proportion mapping
- **Architects** - Sketch building perspectives
- **Botanical Illustrators** - Trace complex flower structures

## 🎨 Categories

- 🖼️ **Botanical** - Flowers, plants, natural forms
- 🏛️ **Architecture** - Buildings, structures, perspectives
- 👤 **Portrait** - Faces, figures, human anatomy

## 🔒 Privacy & Security

- ✅ All image processing happens in your browser
- ✅ No data sent to external servers
- ✅ Images stored locally using IndexedDB
- ✅ Camera stream never recorded or transmitted
- ✅ Full control over your data

## 📦 Project Structure

```
web/
├── public/           # Static assets
│   ├── logo-ar-draw.svg
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── components/   # React components
│   │   ├── HomeScreen.jsx
│   │   ├── DrawingScreen.jsx
│   │   ├── CameraView.jsx
│   │   ├── ReferenceOverlay.jsx
│   │   ├── DrawingControls.jsx
│   │   ├── GridOverlay.jsx
│   │   └── ImageLibrary.jsx
│   ├── hooks/        # Custom React hooks
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   └── App.jsx       # Main app component
├── vercel.json       # Vercel configuration
└── vite.config.js    # Vite configuration
```

## 🚀 Deployment

This app is configured for easy deployment on Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel

# Deploy to production
vercel --prod
```

See [DEPLOYMENT_GUIDE.md](web/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and personal use.

## 🙏 Acknowledgments

- Mathematical ornaments inspired by golden ratio and Fibonacci sequences
- Vintage botanical design inspired by 19th-century botanical illustrations
- Built with modern web standards and best practices

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ by developers who love art and technology**

🎨 Happy Drawing! ✨
