# AR Draw — Web Design Specification

## 1. Design Direction

AR Draw should feel like a real creative utility made for people who actually draw, not like a generic AI-generated landing page.

The visual direction should be:

- Dark, focused, and practical.
- Premium without looking expensive or corporate.
- Clean and slightly playful.
- Strong typography, but not oversized everywhere.
- Purple/indigo used as an accent instead of flooding the entire interface.
- Subtle borders and depth instead of excessive glassmorphism.
- Real UI density: enough information to feel like a real product.
- The camera/drawing workspace is the most important screen and must receive most of the visual attention.

### Avoid the "AI-generated UI" look

Do **not** rely heavily on:

- Huge glowing gradients.
- Multiple glassmorphism cards stacked inside each other.
- Excessive rounded cards.
- Large empty hero sections.
- Giant gradient text.
- Decorative blobs with no functional purpose.
- Excessive shadows.
- Neon borders everywhere.
- Generic "Features / Fast / Powerful / Secure" marketing blocks.
- Repeating the same card pattern for every section.

The page should look designed by a product designer for an actual tool.

---

# 2. Brand

## Product Name

**AR DRAW**

## Tagline

**See it. Trace it. Draw it.**

## Supporting message

Turn your camera into a practical drawing assistant.

The interface should communicate that AR Draw is a tool first, not a marketing website.

---

# 3. Logo Direction

Use the provided AR Draw logo as the visual reference for the brand mark.

Keep the logo:

- Simple.
- Monochrome or near-monochrome when possible.
- High contrast.
- Small enough to work naturally in navigation.
- Never surrounded by unnecessary glow effects.

The logo should be treated like a real brand asset rather than a decorative centerpiece.

Recommended placement:

- Top-left on desktop.
- Compact top bar on mobile.
- Drawing workspace should use a smaller version to preserve screen space.

---

# 4. Core Visual Language

### Background

Use a very dark neutral background rather than pure black.

Suggested base:

```css
--background: #10111A;
--surface: #171924;
--surface-2: #1D1F2C;
--surface-3: #242638;
```

The background should have subtle tonal variation, not visible gradient decoration.

### Primary Accent

Use a muted purple/indigo:

```css
--primary: #7C6CF2;
--primary-hover: #8C7DF7;
--primary-soft: rgba(124, 108, 242, 0.14);
```

### Text

```css
--text-primary: #F5F5F7;
--text-secondary: #A8A9B8;
--text-muted: #747688;
```

### Borders

```css
--border: rgba(255, 255, 255, 0.08);
--border-strong: rgba(255, 255, 255, 0.14);
```

Borders should usually be 1px and low contrast.

---

# 5. Typography

Use a modern neutral sans-serif.

Preferred:

- Inter
- Geist
- DM Sans

Typography should feel like a real software product.

### Recommended scale

```text
Hero title:        48–64px desktop
Hero title mobile: 36–42px
Section title:     26–32px
Card title:        17–20px
Body:              14–16px
Small metadata:    12–13px
```

Do not make every heading huge.

The most prominent typography should be reserved for:

- Product name.
- Main page title.
- Drawing workspace status.

---

# 6. Spacing System

Use a consistent 4px / 8px spacing rhythm.

```text
4
8
12
16
20
24
32
40
48
64
80
```

Cards and controls should have enough breathing room without becoming oversized.

---

# 7. Home Page

The homepage should be much more compact and product-oriented than a typical AI landing page.

## Header

Desktop:

```text
┌──────────────────────────────────────────────────────┐
│  [AR DRAW]              Library   Tutorial   [Start] │
└──────────────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────────────────┐
│ [AR DRAW]                        ☰   │
└──────────────────────────────────────┘
```

Header should remain around 56–72px tall.

Avoid a huge navigation bar.

---

# 8. Hero Section

The hero should be visually strong but compact.

Recommended structure:

```text
                     AR DRAW

              See it. Trace it. Draw it.

       A camera-based drawing assistant that
       helps you trace reference images naturally.

             [ Start Drawing ]   [ Library ]

              No signup · Free · Private
```

The main title can use a subtle purple accent, but avoid a huge gradient text treatment.

Example:

```text
AR
DRAW
```

is acceptable, but the wordmark should not consume half the screen.

---

# 9. Hero Visual

Instead of using many decorative cards, show one meaningful product preview.

Create a realistic drawing workspace preview:

- Camera frame.
- Reference image.
- Opacity control.
- Small toolbar.
- Paper/drawing area.
- A subtle indication that the reference is locked to the camera.

The preview should look like a screenshot of the actual application.

This is much more credible than a collection of floating UI cards.

---

# 10. Primary Call To Action

Primary CTA:

**Start Drawing**

Style:

- Solid accent background.
- Slightly rounded 10–12px corners.
- Medium height.
- Strong text.
- Small hover/press motion.

Do not use excessive glow.

Secondary CTA:

**Open Library**

Use an outlined or low-contrast surface button.

---

# 11. Product Features Section

Do not use a large collection of identical cards.

Instead use a compact editorial layout:

```text
DRAW WITHOUT
DISTRACTIONS

A camera overlay designed for
real-world tracing.

──────────────

01  Precise Overlay
    Position, scale and rotate
    reference images naturally.

02  Sharp Rendering
    Keep your reference clear
    while zooming.

03  Camera Lock
    Lock your setup and draw
    without accidental movement.
```

Use numbers, dividers, and text rather than six large floating cards.

---

# 12. Home Page Information Architecture

Recommended order:

```text
Header
   ↓
Hero
   ↓
Product Preview
   ↓
Core Features
   ↓
How It Works
   ↓
Privacy / Offline message
   ↓
Final Start Drawing CTA
   ↓
Footer
```

Keep the homepage relatively short.

The user should reach the actual drawing tool quickly.

---

# 13. How It Works

Use three simple steps:

```text
01
Choose a reference

02
Position and adjust

03
Lock and draw
```

Each step can have a small visual preview.

Do not put each step inside a giant glass card.

---

# 14. Privacy Section

Present privacy as a product quality feature rather than a marketing slogan.

Example:

```text
YOUR REFERENCES STAY YOURS

Images are processed locally whenever possible.
No account is required to start drawing.
Your local library stays on your device.
```

Use a simple lock/device icon.

Avoid excessive security badges.

---

# 15. Drawing Workspace

This screen is the most important part of the entire application.

The interface should feel closer to a creative tool than a dashboard.

## Layout

### Desktop

```text
┌─────────────────────────────────────────────────────────┐
│ AR DRAW        filename.png                 [•••]       │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ TOOL     │               CAMERA                        │
│ PANEL    │                                              │
│          │          + REFERENCE OVERLAY                │
│ Ref      │                                              │
│ Opacity  │                                              │
│ Transform│                                              │
│ Effects  │                                              │
│ Grid     │                                              │
│          │                                              │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
│ Status: Camera ready     [Lock]   [Capture]   [Finish] │
└─────────────────────────────────────────────────────────┘
```

### Mobile

The camera should occupy almost the entire screen.

```text
┌──────────────────────────────┐
│ ←      AR DRAW        ⋮      │
│                              │
│                              │
│         CAMERA               │
│        + OVERLAY             │
│                              │
│                              │
│                              │
│                              │
│ ──────────────────────────── │
│ [Ref][Opacity][Transform]    │
│ [Effects][Grid][Lock][Save]  │
└──────────────────────────────┘
```

---

# 16. Drawing Workspace Rules

The workspace should:

- Prioritize camera area.
- Keep controls reachable with one hand.
- Never cover the center of the reference unnecessarily.
- Use compact controls.
- Show state clearly.
- Keep transitions fast.

No marketing copy should appear inside the workspace.

---

# 17. Toolbar Design

Use compact controls with icon + optional label.

Example:

```text
Reference
Opacity
Transform
Effects
Grid
Lock
Capture
```

Selected tool:

- Slightly brighter surface.
- Accent border or icon.
- No giant glow.

Unselected tool:

- Neutral surface.
- Muted icon.

---

# 18. Controls

Use controls that look familiar.

### Opacity

```text
Reference Opacity
[────────●──────]
          52%
```

### Zoom

```text
−     1.0x     +
```

### Rotation

```text
↶    0°    ↷
```

### Lock

```text
[ 🔓 Unlock ]
```

When locked:

```text
[ 🔒 Locked ]
```

---

# 19. Reference Image Panel

When the user taps Reference:

Open a small bottom sheet on mobile or side panel on desktop.

Contents:

```text
Reference
────────────────────
[ Import image ]

Recent
[image] [image] [image]

Library
[image] [image] [image]

[ Choose from device ]
```

Do not open a full-screen modal unless necessary.

---

# 20. Effects Panel

Use a simple list:

```text
Original
Grayscale
High Contrast
Line Art
Edge
Sketch
Invert
```

Each option should show a miniature preview when possible.

Avoid complicated editing interfaces.

---

# 21. Library Page

The library should feel like a real file browser.

Header:

```text
My Library                        + Add
```

Controls:

```text
Search        Sort: Recent
```

Grid:

```text
┌───────┐ ┌───────┐ ┌───────┐
│ image │ │ image │ │ image │
│       │ │       │ │       │
└───────┘ └───────┘ └───────┘
Name      Name      Name
```

Use subtle metadata.

Avoid oversized cards.

---

# 22. Empty State

When no images exist:

```text
No references yet

Import an image and start your first
drawing session.

[ Import Image ]
```

Use a small illustration or line icon, not a giant decorative graphic.

---

# 23. Tutorial Page

Keep tutorials visual and short.

Example:

```text
HOW TO DRAW WITH AR DRAW

1. Place your phone
2. Choose a reference
3. Adjust opacity
4. Lock the image
5. Start tracing
```

Use screenshots from the actual product whenever possible.

Do not use generic stock illustrations.

---

# 24. Settings

Keep settings practical.

Sections:

### Appearance

- Dark
- Light
- System

### Performance

- High Quality
- Balanced
- Performance

### Camera

- Default camera
- Resolution preference
- Mirror front camera

### Storage

- Clear cache
- Clear library

### Privacy

- Local processing
- Permissions

---

# 25. Buttons

Button language should be direct.

Prefer:

- Start Drawing
- Import Image
- Save Reference
- Lock Camera
- Capture
- Delete
- Reset

Avoid:

- Let's Get Started!
- Experience the Future
- Unlock Creativity
- Supercharge Your Art

The interface should sound like useful software.

---

# 26. Border Radius

Do not round everything excessively.

Recommended:

```text
Buttons: 10–12px
Inputs: 10px
Panels: 14–16px
Large preview: 16–20px
Images: 12–14px
```

Avoid 24–32px radius on every component.

---

# 27. Shadows

Use shadows sparingly.

Prefer depth from:

- Surface differences.
- Borders.
- Layering.

Example:

```css
box-shadow:
  0 12px 30px rgba(0, 0, 0, 0.18);
```

Only use large shadows for major floating elements.

---

# 28. Glassmorphism

Glass effect should be limited to:

- Mobile bottom toolbar.
- Floating control panels.
- Temporary overlays.

Do not make the entire page glass.

Example:

```css
background: rgba(23, 25, 36, 0.86);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.08);
```

The content behind the panel should remain readable.

---

# 29. Animation

Animations should communicate interaction, not decorate the page.

Use:

- 120–180ms for controls.
- 180–250ms for panels.
- Smooth transform transitions.
- Small scale on button press.

Avoid:

- Constant floating animations.
- Giant hero animations.
- Pulsing borders.
- Excessive particle effects.
- Long entrance animations.

Respect:

```css
prefers-reduced-motion
```

---

# 30. Icons

Use one consistent icon system.

Recommended:

- Lucide
- Phosphor

Icons should generally use 18–22px.

Do not mix several icon styles.

---

# 31. Responsive Breakpoints

Recommended:

```text
Mobile:       < 640px
Large mobile: 640–767px
Tablet:       768–1023px
Desktop:      1024–1279px
Large desktop: >= 1280px
```

The layout should adapt rather than simply shrink.

---

# 32. Mobile Priority

On mobile:

1. Camera visibility.
2. Reference visibility.
3. Opacity.
4. Lock.
5. Transform.
6. Capture.

Secondary tools can live inside bottom sheets.

Do not place 10+ controls permanently around the camera.

---

# 33. Desktop Priority

On desktop:

1. Camera preview.
2. Reference control panel.
3. Transform controls.
4. Effects.
5. Library access.
6. Session controls.

Use available horizontal space for useful controls rather than decorative empty areas.

---

# 34. Loading States

Loading UI should be simple.

Example:

```text
Preparing camera…
```

or:

```text
Processing image…
```

Use a small spinner.

Avoid skeleton screens for tiny operations.

---

# 35. Error States

Errors should be understandable.

Example:

```text
Camera access is unavailable.

Check your browser permission and try again.

[ Try Again ]
```

No raw stack traces.

No technical jargon unless necessary.

---

# 36. Design Tokens

Create centralized CSS variables.

Example:

```css
:root {
  --bg: #10111A;
  --surface: #171924;
  --surface-hover: #1D2030;

  --primary: #7C6CF2;
  --primary-hover: #8C7DF7;

  --text: #F5F5F7;
  --text-secondary: #A8A9B8;
  --text-muted: #747688;

  --border: rgba(255,255,255,0.08);

  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;

  --shadow-sm: 0 4px 16px rgba(0,0,0,0.12);
  --shadow-md: 0 12px 30px rgba(0,0,0,0.18);
}
```

Do not scatter random colors throughout the components.

---

# 37. Visual Hierarchy

The interface should communicate priority clearly.

### Highest priority

- Camera.
- Reference.
- Start Drawing.
- Lock.

### Medium priority

- Opacity.
- Transform.
- Effects.
- Grid.

### Low priority

- Settings.
- Tutorial.
- About.
- Advanced options.

The user should immediately understand what to do next.

---

# 38. Realistic Product Feel

The final interface should feel like an application that has been iterated on by real users.

Use:

- Compact controls.
- Practical labels.
- Sensible defaults.
- Clear state indicators.
- Useful empty states.
- Keyboard shortcuts on desktop.
- Touch gestures on mobile.
- Consistent spacing.

Avoid trying to make every area visually impressive.

A good product interface should feel calm and predictable.

---

# 39. Home Page Final Composition

Recommended visual composition:

```text
┌────────────────────────────────────────────────────────────┐
│ AR DRAW                         Library  Tutorial  Start   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                   AR DRAW                                  │
│                                                            │
│              See it. Trace it. Draw it.                    │
│                                                            │
│       Turn your camera into a drawing assistant.           │
│                                                            │
│           [ Start Drawing ]   [ Library ]                  │
│                                                            │
│       ┌───────────────────────────────────────┐             │
│       │                                       │             │
│       │       PRODUCT WORKSPACE PREVIEW       │             │
│       │                                       │             │
│       └───────────────────────────────────────┘             │
│                                                            │
│  Precise Overlay     Sharp Rendering     Camera Lock       │
│  Position naturally  Keep images clear    Draw confidently  │
│                                                            │
│                 How it works                               │
│                                                            │
│          01          02          03                         │
│        Choose      Position     Lock & Draw                 │
│                                                            │
│                  Your images stay local                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

This is preferable to a page filled with many glowing cards.

---

# 40. Final Design Goal

The result should be:

**Modern, but not futuristic.**

**Premium, but not flashy.**

**Minimal, but not empty.**

**Dark, but not monotonous.**

**Creative, but still practical.**

Most importantly, it should look like a real drawing tool rather than an AI-generated landing page.

The application should make users think:

> "This looks like an actual product I could use every day."

rather than:

> "This looks like a concept generated by AI."

---

# 41. Implementation Priority

When implementing this design in React:

1. Build the actual drawing workspace first.
2. Make camera rendering reliable.
3. Make image overlay accurate.
4. Make controls compact and usable.
5. Implement responsive mobile UI.
6. Build the homepage around the real product.
7. Add animation only where it improves interaction.
8. Refine spacing, typography, borders, and states.
9. Remove any decorative component that does not improve usability.
10. Test the design on a real smartphone before finalizing.

The final UI should always prioritize the drawing experience over visual decoration.
