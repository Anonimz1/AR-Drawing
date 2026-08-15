import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Lock, HardDrive, Flower2, Landmark, User } from 'lucide-react';
import './HomeScreen.css';

export const HomeScreen = ({ onOpenLibrary, onImportImage, onStartDrawing }) => {
  const [mockOpacity, setMockOpacity] = useState(100);
  const [activeCategory, setActiveCategory] = useState('architecture');
  const mainRef = useRef(null);

  useEffect(() => {
    const nodes = mainRef.current?.querySelectorAll('.reveal');
    if (!nodes || nodes.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-screen">
      {/* Ornate Frame Layers */}
      <div className="frame-outer">
        <div className="frame-inner"></div>
      </div>
      
      {/* Header */}
      <header className="home-header">
        <div className="home-logo-wrap">
          <div className="logo-sunflower-icon"></div>
          <div className="logo-text">
            <h1>AR DRAW</h1>
            <p>See it. Trace it. Draw it.</p>
          </div>
        </div>
        
        <div className="header-ornament">
          <div className="line-horizontal"></div>
          <div className="diamond"></div>
          <div className="flower-center"></div>
          <div className="diamond"></div>
          <div className="line-horizontal"></div>
        </div>

        <button className="btn-start-top" onClick={onImportImage}>
          Start <span>&rarr;</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="home-main" ref={mainRef}>
        {/* Hero Section (Image 3 layout) */}
        <section className="hero-section">
          <div className="hero-text-col">
            <h2 className="hero-title">Trace reference<br/>images naturally<br/>through your camera</h2>
            <div className="hero-divider"></div>
            <p className="hero-subtitle">
              Position your phone above paper.<br/>
              Overlay your reference. Adjust opacity. Draw.
            </p>
          </div>
          
          <div className="hero-image-col">
            <div className="polaroid-wrapper">
              <div className="pin"></div>
              <div className="polaroid">
                <div className="polaroid-grid"></div>
                <img src="/logo-ar-draw.svg" alt="AR Draw Logo" className="polaroid-img logo-spin" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories / Actions (Image 3 bottom) */}
        <section className="categories-section">
          <div
            className={`category-card reveal${activeCategory === 'botanical' ? ' active' : ''}`}
            onClick={() => setActiveCategory('botanical')}
          >
            <Flower2 className="cat-icon" size={32} />
            <span>Botanical</span>
          </div>
          <div
            className={`category-card reveal${activeCategory === 'architecture' ? ' active' : ''}`}
            onClick={() => setActiveCategory('architecture')}
          >
            <Landmark className="cat-icon" size={32} />
            <span>Architecture</span>
          </div>
          <div
            className={`category-card reveal${activeCategory === 'portraits' ? ' active' : ''}`}
            onClick={() => setActiveCategory('portraits')}
          >
            <User className="cat-icon" size={32} />
            <span>Portraits</span>
          </div>
        </section>

        {/* Demo Section (Image 2 layout) */}
        <section className="demo-section reveal">
          <div className="slider-badge">
            <div className="sunflower-mini"></div>
            <span>{mockOpacity}% opacity</span>
          </div>
          
          <div className="slider-card">
            <div className="slider-header">
              <span className="slider-label">OPACITY</span>
              <span className="slider-value">{mockOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mockOpacity}
              onChange={(e) => setMockOpacity(Number(e.target.value))}
              className="vintage-slider"
            />
            
            <div className="live-preview-box">
              <div className="preview-label">
                <div className="flower-outline-left"></div>
                <span>LIVE PREVIEW</span>
              </div>
              <p>Six reference types orbit around &mdash; adjust the slider to control overlay opacity</p>
              <div className="flower-outline-right"></div>
            </div>
            
            <button className="btn-minimize">-</button>
          </div>

          <div className="action-buttons">
            <button className="btn-import" onClick={onImportImage}>
              <span className="icon-upload"></span> Import Reference
            </button>
            <button className="btn-library" onClick={onOpenLibrary}>
              <span className="icon-book"></span> Open Library
            </button>
          </div>
        </section>

        {/* Specs (Image 1 middle) */}
        <section className="specs-section reveal">
          <div className="spec-item">
            <div className="spec-icon"><Camera size={24} /></div>
            <span className="spec-label">CAMERA</span>
            <span className="spec-val">Real-time overlay</span>
          </div>
          <div className="spec-divider-dot"></div>
          <div className="spec-item">
            <div className="spec-icon"><Lock size={24} /></div>
            <span className="spec-label">CONTROL</span>
            <span className="spec-val">Transform & lock</span>
          </div>
          <div className="spec-divider-dot"></div>
          <div className="spec-item">
            <div className="spec-icon"><HardDrive size={24} /></div>
            <span className="spec-label">STORAGE</span>
            <span className="spec-val">Local only</span>
          </div>
        </section>

        <div className="ornate-divider reveal"></div>

        {/* Features (Image 1 bottom) */}
        <section className="features-section reveal">
          <div className="feature-card">
            <div className="feature-line"></div>
            <div className="feature-content">
              <h3>What it does</h3>
              <p>Overlays your reference image on the camera feed. You control position, scale, rotation, and transparency. Lock it when ready. Trace naturally with your hand and pencil. No gimmicks.</p>
            </div>
            <div className="stamp-sunflower"></div>
          </div>
          
          <div className="feature-card">
            <div className="feature-line"></div>
            <div className="feature-content">
              <h3>What it doesn't do</h3>
              <p>No AI enhancement. No automatic tracing. No cloud storage. No tracking. This is a digital light table, not a drawing app. Your hand does the work.</p>
            </div>
            <div className="stamp-sunflower"></div>
          </div>
        </section>

        <div className="ornate-divider bottom reveal"></div>

        <footer className="home-footer">
          <p>Free &bull; No signup &bull; Images stay on your device</p>
          <div className="leaf-footer"></div>
        </footer>
      </main>
      
      {/* Corner Illustrations - portal ke body agar fixed bekerja */}
      {createPortal(
        <>
          <div className="sunflower-corner bottom-left"></div>
          <div className="sunflower-corner bottom-right"></div>
        </>,
        document.body
      )}
      
      {/* Background writing */}
      <div className="bg-script top-left"></div>
      <div className="bg-script mid-right"></div>
    </div>
  );
};/* Updated: 20260815132339 */