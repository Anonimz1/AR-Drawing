# AR Draw - Design Rationale

## Design Brief Execution

Following the **frontend-design** skill guidelines to create a distinctive, non-templated design specifically for AR Draw.

---

## Subject & Audience

**Product:** AR Draw - Camera-based drawing assistant  
**Audience:** Artists, sketchers, hobbyists who trace references  
**Page Job:** Convince them this is a practical tool they'll use daily

**Subject World:** Physical art materials - pencils, paper, sketchbooks, light tables, tracing paper, drawing boards. The vernacular of construction lines, opacity adjustments, grid overlays, and natural hand movements.

---

## Design Decisions

### Color Palette: Artist's Workspace

**Avoided:** AI-default palettes
- ❌ Cream (#F4F1EA) + Terracotta (#D97757) - Claude's defaults
- ❌ Near-black + Acid green - Generic AI look
- ❌ Broadsheet newspaper style - Not appropriate for this subject

**Chosen:** Materials from an actual artist's desk
```css
--canvas: #FAF8F5        /* Paper white, warm not clinical */
--graphite: #2B2B2B      /* Pencil lead, strong contrast */
--sketch-blue: #6B9CC3   /* Construction line blue (non-photo blue) */
--warm-wood: #B8956A     /* Drawing board wood tone */
--red-conte: #C85A54     /* Conté crayon annotation red */
--light-grid: #E8E5DF    /* Tracing paper subtle texture */
```

**Rationale:** These colors exist in the physical world of drawing. They're recognizable to anyone who's used art supplies. The palette signals "tool for making art" not "tech product."

---

### Typography: Engineering Meets Craft

**Display:** Space Grotesk (700)
- Geometric but warm, not cold like typical sans-serifs
- Reads as precise without being robotic
- Appropriate weight for technical tool that respects craft

**Body:** Inter (400-600)
- Clarity without sterility
- Excellent screen rendering
- Wide weight range for hierarchy

**Utility:** JetBrains Mono
- Monospace for technical specs (opacity %, angles)
- Signals precision where appropriate
- Used sparingly - only for data

**Rationale:** Display face shows this is a designed tool, not default UI. Body face prioritizes readability. Monospace appears only where fixed-width matters (technical values). No decorative type - everything serves the content.

---

### Layout: Show Don't Tell

**Hero Structure:**
```
[Header: Simple, out of the way]

Headline: Describes what you actually do
    ↓
Interactive Camera Mockup ← SIGNATURE ELEMENT
    ↓
Actions: Import / Library
```

**Rationale:** Lead with the actual product experience. The interactive mockup shows what AR Draw does better than any amount of marketing copy could explain.

---

### Signature Element: Interactive Camera Mockup

**What it is:**
- Actual working camera viewport preview
- Overlay image with adjustable opacity (working slider)
- Visible grid system
- Control bar showing real UI

**What it's not:**
- Static screenshot
- Decorative illustration
- Stock photo
- Generic "features" list

**Rationale:** 
This is what makes AR Draw distinctive from every other tool. Users need to understand: "phone above paper + transparent overlay + your hand drawing" before they'll try it. The mockup demonstrates this instantly. The working opacity slider proves it's a real tool, not vaporware.

Making the slider actually functional (not just decorative) respects the user's intelligence and creates a micro-commitment moment - they're already interacting with the product.

---

### Copy Strategy: Active Voice, No Marketing Fluff

**Avoided:**
- ❌ "Supercharge your creativity"
- ❌ "Experience the future of drawing"
- ❌ "Unlock your artistic potential"

**Used:**
- ✅ "Trace reference images naturally through your camera"
- ✅ "Position your phone above paper. Overlay your reference. Adjust opacity. Draw."
- ✅ "Your hand does the work."

**Rationale:** Artists hate being sold to. They want to know: does this tool solve my problem? The copy describes exactly what happens, using verbs that match the physical actions (position, overlay, adjust, draw, trace).

---

### Information Architecture

1. **Hero**: What you do with it (trace through camera)
2. **Interactive Demo**: How it actually works (visible, touchable)
3. **Specs**: Technical capabilities (camera, control, storage)
4. **What It Does / Doesn't Do**: Setting realistic expectations
5. **Footer**: Practical info (free, no signup, local storage)

**No numbered steps (01/02/03)** because this isn't a sequential process - you adjust things live while drawing.

**No "features" cards** because features can be listed. What matters is the interaction model.

**Rationale:** Users need to understand the interaction model (camera overlay) before caring about features. The demo shows this immediately. Everything else supports that understanding.

---

### Restraint & Critique

**Spent boldness on:** Interactive camera mockup with working opacity control

**Kept quiet:**
- Header (minimal, sticky, unobtrusive)
- Typography (clear hierarchy, no decorative treatments)
- Spacing (generous but not wasteful)
- Buttons (solid, clear, no glow effects)

**Cut entirely:**
- Floating decorative shapes
- Generic feature cards
- Marketing badges
- Testimonials
- Animated blobs
- Excessive shadows
- Numbered markers for non-sequential content

**Rationale:** The signature element (mockup) needs attention. Everything else should support it without competing. Good design is mostly about what you don't include.

---

### Technical Execution

**CSS Architecture:**
- Tokens derived from design plan (not arbitrary)
- Semantic naming (--canvas not --bg-light)
- Minimal specificity conflicts
- Mobile-first responsive

**Component Structure:**
- Functional camera mockup (useState for opacity)
- Semantic HTML (header, main, section, footer)
- Accessible controls (proper labels, focus states)
- No prop drilling

**Performance:**
- Web fonts: Space Grotesk, Inter, JetBrains Mono (display: swap)
- SVG icons inline (no HTTP requests)
- CSS transforms for hover states (GPU-accelerated)
- Grid layout (modern, efficient)

---

## Design Quality Checklist

✅ **Distinctive:** Palette and mockup are specific to drawing/art supplies  
✅ **Intentional:** Every choice serves the subject matter  
✅ **Not templated:** Doesn't match AI-default patterns  
✅ **Appropriate risk:** Interactive mockup could fail if poorly executed  
✅ **Subject-grounded:** Materials palette from actual art tools  
✅ **Shows don't tell:** Mockup demonstrates product better than text  
✅ **Restrained:** One bold element, everything else disciplined  
✅ **Accessible:** Semantic HTML, keyboard focus, reduced motion respected  
✅ **Responsive:** Mobile-first, tested viewport sizes  
✅ **Quality floor:** Professional without announcing it  

---

## What Makes This Not Look AI-Generated

1. **Palette from real materials** - Not default cream/terracotta or black/acid-green
2. **Working interactive mockup** - Not floating decorative shapes
3. **No numbered markers** - Content isn't actually sequential
4. **Plain language copy** - Not "supercharge" or "unlock" marketing speak
5. **Monospace only for data** - Not decorative typographic treatment
6. **One signature element** - Not scattered micro-interactions
7. **Minimal header** - Not oversized navigation
8. **Left-aligned text** - Not center-aligned marketing page
9. **Realistic expectations** - "What it doesn't do" section
10. **Subject-specific choices** - Every decision traces back to drawing/art

---

## If This Were Generic AI Output

It would have:
- Cream background (#F4F1EA) with terracotta accent
- Big gradient text treatment
- Numbered steps (01, 02, 03) for non-sequential content
- "Features" cards in a grid
- Floating decorative shapes
- "Supercharge your creativity" copy
- Huge hero section with centered text
- Generic "fast, powerful, secure" messaging
- No working interactive elements
- Oversized navigation bar

Instead, this design:
- Uses artist materials palette
- Shows actual product interface
- Describes real workflow
- Demonstrates interaction model
- Respects user intelligence
- Signals tool not toy

---

## Success Metrics

**User understands:**
1. What AR Draw does (camera overlay for tracing)
2. How to control it (opacity, position, lock)
3. When to use it (reference image + paper + pencil)
4. What it's not (not AI, not automatic, not cloud)

**User feels:**
1. This is for people who actually draw
2. It's a practical tool not a gimmick
3. They can trust it (local storage, no signup)
4. Worth trying (low commitment, clear value)

---

## Future Considerations

**Could add:**
- Video of actual drawing session (if authentic footage available)
- Examples of traced work (if we have permissions)
- Keyboard shortcuts reference
- Comparison to physical light table

**Should not add:**
- More decorative elements
- Marketing copy
- Social proof without substance
- Features that don't exist yet

---

**Design Completed:** August 14, 2026  
**Approach:** Subject-grounded, intentional, non-templated  
**Signature Element:** Interactive camera mockup with working opacity control
