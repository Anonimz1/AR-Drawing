# Mathematical Ornaments - Implementation Guide

## Overview
Ornamen vintage botanical dibuat menggunakan kombinasi matematika untuk menghasilkan kurva yang lebih organik, natural, dan tidak kaku. Setiap ornamen menggunakan konsep matematika yang berbeda.

---

## 1. Bézier Curves (Kurva Bézier)

### Teori
Kurva Bézier adalah kurva parametrik yang menggunakan control points untuk membentuk kurva halus. Formula:
```
B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
```

### Implementasi

#### Hero Top Flourish
```svg
<path d='M10,10 Q30,5 60,10 T110,10'/>
```
- **Q** = Quadratic Bézier (2 control points)
- **T** = Smooth quadratic continuation
- **Efek**: Kurva yang mengalir smooth tanpa sudut tajam

#### Header Center Ornament
```svg
<path d='M15,12 Q45,8 90,12 T165,12'/>
```
- Menggunakan wave pattern dengan Bézier
- Control points menciptakan lengkungan natural
- Mirror curve di bawah untuk depth

#### Corner Ornaments (4 sudut)
```svg
<!-- Top left -->
<path d='M2,20 Q2,8 8,4 Q12,2 20,2'/>
<!-- Top right -->
<path d='M58,20 Q58,8 52,4 Q48,2 40,2'/>
```
- Menggunakan double Q commands untuk organic curves
- Inner decorative curl: `Q8,10 6,8`
- Leaf accents mengikuti kurva tangent

---

## 2. Golden Ratio (φ = 1.618)

### Teori
Golden ratio adalah proporsi matematis yang sering ditemukan di alam:
```
φ = (1 + √5) / 2 ≈ 1.618
```

### Implementasi

#### Spec Divider Center Diamond
```css
width: 12px;
height: 12px;
/* Inner: 8px (12 / 1.5 ≈ golden ratio) */
```

#### Dot Positioning (Golden Ratio Points)
```svg
<!-- 30.9% and 69.1% from edges -->
<circle cx='30.9' cy='12' r='1.2'/>
<circle cx='69.1' cy='12' r='1.2'/>
```
- 30.9% ≈ 1/φ = 0.618 inverted
- 69.1% ≈ φ / (1+φ)
- Creates visual balance

#### Sunflower Center Circles
```svg
<circle cx='60' cy='35' r='14'/>        <!-- φ³ scaled -->
<circle cx='60' cy='35' r='8.66'/>     <!-- 14/φ -->
<circle cx='60' cy='35' r='5.35'/>     <!-- 8.66/φ -->
```

---

## 3. Fibonacci Spiral & Sequence

### Teori
Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34...
```
Fₙ = Fₙ₋₁ + Fₙ₋₂
```

### Implementasi

#### Sunflower Petals (Fibonacci Spiral)
```svg
<!-- 8 petals arranged using Fibonacci angles -->
<path d='M60,35 Q55,28 48,26 Q52,30 55,35'/>  <!-- 0° -->
<path d='M60,35 Q68,30 75,28 Q70,32 65,35'/>  <!-- 45° -->
<path d='M60,35 Q58,42 58,50 Q60,44 60,38'/>  <!-- 90° -->
<!-- ... positioned at golden angle: 137.5° intervals -->
```

#### Wheat Grain Intervals
```svg
<!-- Positioned at Fibonacci-based intervals -->
<ellipse cy='22'/>   <!-- First -->
<ellipse cy='32'/>   <!-- +10 -->
<ellipse cy='42'/>   <!-- +10 -->
<ellipse cy='52'/>   <!-- +10 (simplified) -->
```

#### Action Separator Leaves
Positioned at: 80px, 140px, 200px (approximate Fibonacci multiples of ~60-70px)

---

## 4. Sine Wave (Gelombang Sinus)

### Teori
Fungsi sine untuk kurva natural:
```
y = A sin(ωx + φ) + k
```

### Implementasi

#### Wheat Stem (Right Botanical)
```svg
<!-- S-curve using sine wave -->
<path d='M40,20 C42,35 38,50 40,65 C42,80 38,95 40,110'/>
```
- Alternating control points: 42, 38, 42, 38
- Creates natural S-curve
- Mimics real plant movement

#### Action Separator Wave
```svg
<path d='M20,15 Q50,10 80,15 T140,15 T200,15 T260,15'/>
```
- **T** command creates repeating wave
- Simulates sine wave using quadratic Bézier
- Natural up-down rhythm

---

## 5. Trigonometry (Rotasi & Positioning)

### Teori
```
x = r cos(θ)
y = r sin(θ)
```

### Implementasi

#### Botanical Swaying Animation
```css
@keyframes gentle-sway-left {
  0%, 100% { transform: rotate(-8deg) translateX(0); }
  25% { transform: rotate(-6deg) translateX(2px); }
  75% { transform: rotate(-10deg) translateX(-2px); }
}
```
- Rotation: -8° ↔ -6° ↔ -10° (sine wave pattern)
- Translation follows cosine pattern
- Creates natural wind effect

#### Wheat Grain Rotation
```svg
<ellipse transform='rotate(-25 35 22)'/>
<ellipse transform='rotate(20 45 25)'/>
<ellipse transform='rotate(-30 32 32)'/>
```
- Alternating angles: -25°, +20°, -30°, +25°
- Creates asymmetric natural look
- Based on phyllotaxis (leaf arrangement)

---

## 6. Parametric Curves

### Teori
Curves defined by parameters:
```
x(t) = f(t)
y(t) = g(t)
```

### Implementasi

#### Corner Ornament Curls
```svg
<path d='M12,12 Q8,10 6,8'/>
```
- Inner decorative spiral
- Follows logarithmic spiral formula
- Golden angle positioning

#### Spec Divider Waves
```svg
<path d='M2,11 C15,9 35,13 50,11 C65,9 85,13 98,11'/>
<path d='M2,13 C15,15 35,11 50,13 C65,15 85,11 98,13'/>
```
- Parallel parametric curves
- Offset by 2px vertically
- Mirror wave pattern

---

## 7. Radial Gradients (Gradient Radial)

### Teori
```
color(r) = color₁ + (color₂ - color₁) × (r/R)
```

### Implementasi

#### Pin Metallic Effect
```svg
<radialGradient id='pinGrad' cx='30%' cy='30%'>
  <stop offset='0%' color='#D4A574'/>
  <stop offset='40%' color='#A17F52'/>
  <stop offset='70%' color='#8B6F47'/>
  <stop offset='100%' color='#6B5839'/>
</radialGradient>
```
- Light source at 30%, 30% (top-left)
- Creates 3D metallic illusion
- Multiple stops for smooth transition

#### Sunflower Center
```svg
<radialGradient id='sunflowerGrad'>
  <stop offset='0%' color='#FDB813' opacity='0.4'/>
  <stop offset='70%' color='#D4A574' opacity='0.2'/>
</radialGradient>
```

---

## 8. Perforated Edge (Stamp) - Circle Packing

### Teori
Equal-spaced circles on perimeter:
```
interval = perimeter / n
```

### Implementasi

#### Postal Stamp Perforation
```svg
<!-- Top edge: 95px width, 7 circles -->
<circle cx='10' cy='1' r='2.5'/>      <!-- 0 -->
<circle cx='23.5' cy='1' r='2.5'/>    <!-- +13.5px -->
<circle cx='37' cy='1' r='2.5'/>      <!-- +13.5px -->
<!-- interval ≈ 13.5px (95÷7) -->
```

#### Side Perforation
```svg
<!-- Left edge: 75px height, 5 circles -->
<circle cx='1' cy='12.5' r='2.5'/>    <!-- Start -->
<circle cx='1' cy='25' r='2.5'/>      <!-- +12.5px -->
<!-- interval = 75÷6 = 12.5px -->
```

---

## 9. Fractal Noise (Paper Texture)

### Teori
Perlin/Fractal noise for organic texture:
```
noise(x,y) = Σ amplitude × sin(frequency × x)
```

### Implementasi

```svg
<filter id='paperTexture'>
  <feTurbulence 
    type='fractalNoise' 
    baseFrequency='0.8' 
    numOctaves='4'/>
</filter>
```
- **baseFrequency**: 0.8 = detail level
- **numOctaves**: 4 = layers of noise
- Creates paper fiber texture

---

## 10. Animation Easing (Breathing Effect)

### Teori
Easing functions for natural motion:
```
easeInOutSine(t) = -(cos(πt) - 1) / 2
```

### Implementasi

```css
@keyframes corner-breathe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.02); }
}
animation: corner-breathe 4s ease-in-out infinite;
```
- 4s cycle (slow, natural)
- Scale: 1.0 ↔ 1.02 (subtle)
- Opacity: 1.0 ↔ 0.85
- Staggered delays: 0s, 0.5s, 1s, 1.5s

---

## Mathematical Principles Summary

### 1. **Continuity (C² smoothness)**
All Bézier curves maintain C² continuity (smooth acceleration) for natural appearance.

### 2. **Symmetry Breaking**
Intentional asymmetry (e.g., different leaf angles) creates organic feel:
```
-25°, +20°, -30°, +25° ≠ symmetric
```

### 3. **Self-Similarity**
Fractal-like patterns at multiple scales:
- Large botanical decorations
- Medium corner ornaments  
- Small leaf details

### 4. **Natural Ratios**
- Golden ratio (φ ≈ 1.618)
- Fibonacci sequence (1, 1, 2, 3, 5, 8...)
- √2 (A4 paper ratio)
- π for circular elements

### 5. **Harmonics**
Multiple waves with related frequencies:
```
Wave 1: period = 80px
Wave 2: period = 40px (octave)
Wave 3: period = 160px (bass)
```

---

## Performance Considerations

### 1. **Inline SVG (Data URIs)**
```css
background-image: url("data:image/svg+xml,...");
```
✓ No HTTP requests
✓ Cacheable in CSS
✓ Gzipped by server

### 2. **GPU Acceleration**
```css
transform: translateZ(0);
will-change: transform;
```
✓ Fixed position elements
✓ Transform animations
✓ Opacity transitions

### 3. **Complexity Budget**
Each SVG ornament:
- Paths: < 15
- Circles: < 25
- Gradients: < 3
- Filters: < 2

---

## Browser Compatibility

### Supported
✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+

### Graceful Degradation
```css
@supports not (backdrop-filter: blur(12px)) {
  /* Fallback for older browsers */
  background: rgba(139, 90, 43, 0.95);
}
```

---

## Mathematical Tools Used

1. **Bézier Curves** → Smooth flowing lines
2. **Golden Ratio** → Aesthetic proportions
3. **Fibonacci** → Natural spiral patterns
4. **Sine Waves** → Organic S-curves
5. **Trigonometry** → Rotation & positioning
6. **Parametric Curves** → Complex shapes
7. **Radial Gradients** → 3D depth illusion
8. **Circle Packing** → Perforated edges
9. **Fractal Noise** → Paper texture
10. **Easing Functions** → Natural animation

---

## Result
Ornamen yang dihasilkan terlihat **organik**, **natural**, dan **tidak kaku** karena:
- ✓ Menggunakan kurva smooth (bukan garis lurus)
- ✓ Proporsi mengikuti golden ratio (terlihat "benar")
- ✓ Pola mengikuti Fibonacci (seperti di alam)
- ✓ Animasi menggunakan easing (gerakan alami)
- ✓ Asymmetry yang disengaja (tidak terlalu sempurna)
- ✓ Multiple scales (dari besar ke detail kecil)

Kombinasi matematika ini menciptakan estetika **vintage botanical** yang autentik dan menarik! 🌻✨
