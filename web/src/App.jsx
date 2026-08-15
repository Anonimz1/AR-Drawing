import { useState, useRef } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { DrawingScreen } from './components/DrawingScreen';
import { ImageLibrary } from './components/ImageLibrary';
import { useIndexedDB } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, drawing, library
  const [currentImage, setCurrentImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const fileInputRef = useRef(null);
  const { saveImage } = useIndexedDB();

  const handleImportImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

    // Save to IndexedDB
    try {
      await saveImage({
        url: imageUrl,
        name: name,
        category: 'imported',
        favorite: false
      });
    } catch (error) {
      console.error('Error saving image:', error);
    }

    setCurrentImage(imageUrl);
    setImageName(name);
    setCurrentView('drawing');
  };

  const handleOpenLibrary = () => {
    setCurrentView('library');
  };

  const handleSelectImage = (image) => {
    setCurrentImage(image.url);
    setImageName(image.name);
    setCurrentView('drawing');
  };

  const handleClose = () => {
    setCurrentView('home');
    setCurrentImage(null);
    setImageName('');
  };

  const handleCapture = (captureUrl) => {
    console.log('Captured:', captureUrl);
    // Could save to library or show preview
  };

  return (
    <div className="app">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {currentView === 'home' && (
        <HomeScreen
          onImportImage={handleImportImage}
          onOpenLibrary={handleOpenLibrary}
          onStartDrawing={handleImportImage}
        />
      )}

      {currentView === 'drawing' && currentImage && (
        <DrawingScreen
          imageUrl={currentImage}
          imageName={imageName}
          onClose={handleClose}
          onCapture={handleCapture}
        />
      )}

      {currentView === 'library' && (
        <ImageLibrary
          onClose={handleClose}
          onSelectImage={handleSelectImage}
        />
      )}
    </div>
  );
}

export default App;
