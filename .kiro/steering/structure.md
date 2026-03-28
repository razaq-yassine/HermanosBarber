# Project Structure

## Repository Organization

This repository contains two separate implementations of the Hermanos Barber landing page:

### HermanosBarber/
Traditional GSAP-based landing page with standard scroll animations.

```
HermanosBarber/
├── index.html              # Main HTML page
├── style.css               # Complete stylesheet
├── script.js               # GSAP animations and interactions
├── assets/                 # Media files
│   ├── PHOTO-*.jpg        # Gallery images (6 images)
│   └── VIDEO-*.mp4        # Video backgrounds (3 videos)
├── .kiro/                  # Kiro configuration
│   ├── specs/             # Feature specifications
│   └── steering/          # Project steering documents
└── README.md              # Project documentation
```

### HERMANOSBARBER2/
Advanced implementation with scroll-driven frame animation system.

```
HERMANOSBARBER2/
├── index.html                      # Main HTML with accessibility features
├── style.css                       # Complete stylesheet with responsive design
├── script.js                       # Frame animation system + GSAP animations
├── animation-config.js             # Frame animation configuration
├── assets/
│   ├── frames/                     # Desktop frames (ezgif-frame-001.webp to 250.webp)
│   ├── frames-mobile/              # Mobile frames (ezgif-frame-001.webp to 250.webp)
│   ├── PHOTO-*.jpg                # Gallery images
│   └── VIDEO-*.mp4                # Video backgrounds
├── IMPLEMENTATION-COMPLETE.md      # Implementation details
├── VERIFICATION-CHECKLIST.html     # Testing checklist
└── README.md                       # Project documentation
```

## Code Organization

### HTML Structure
- Semantic HTML5 elements (nav, main, section, article, footer)
- Accessibility features (ARIA labels, skip links, roles)
- Sections: Hero/Animation, Videos (3), About, Gallery, Services, Contact, Footer

### CSS Architecture
- CSS custom properties for colors and spacing
- Mobile-first responsive design with media queries
- Utility classes for common patterns
- Component-based styling (nav, hero, video-section, gallery, services, contact, footer)
- Animations and transitions using CSS and GSAP

### JavaScript Architecture

#### HermanosBarber/script.js
- GSAP plugin registration
- Navigation scroll effects
- Hero animations (title, subtitle, CTA)
- Pinned video sections with ScrollTrigger
- About section animations (image, content, border)
- Horizontal gallery scroll
- Service cards animations
- Contact section animations
- Smooth scroll for navigation
- Video auto-play/pause with IntersectionObserver
- Cursor glow effect
- Performance optimizations

#### HERMANOSBARBER2/script.js
- **FramePreloader Class**: Progressive frame loading with event emitter pattern
  - Priority loading (frames 1-10)
  - Background loading (frames 11-250)
  - Retry logic and error handling
  - Mobile/desktop frame detection
- **FrameAnimationSystem Class**: Scroll-driven frame display
  - ScrollTrigger integration
  - Snap scroll support
  - Discrete scroll mode (one frame per scroll)
  - Text overlay management
  - GPU-accelerated rendering
- Content section animations (same as HermanosBarber)
- Reduced motion support
- Initialization flow with error handling

## Key Patterns

### Animation Pattern
```javascript
// GSAP ScrollTrigger pattern
gsap.from(element, {
    scrollTrigger: {
        trigger: element,
        start: 'top 70%',
        end: 'top 30%',
        scrub: 1
    },
    opacity: 0,
    y: 100
});
```

### Frame Animation Pattern
```javascript
// Frame preloader usage
const preloader = new FramePreloader({
    frameCount: 250,
    frameBasePath: './assets/frames/',
    priorityFrames: 10
});

await preloader.loadPriorityFrames();
preloader.loadRemainingFrames(5);

// Frame animation system
const frameSystem = new FrameAnimationSystem({
    frameCount: 250,
    scrollDistance: '300vh',
    container: document.querySelector('.animation-container')
});

frameSystem.init(preloader);
```

### Responsive Pattern
```css
/* Mobile-first approach */
.element {
    /* Mobile styles */
}

@media (min-width: 768px) {
    .element {
        /* Desktop styles */
    }
}
```

## Naming Conventions

### Files
- HTML: `index.html`, `kebab-case.html`
- CSS: `style.css`, `kebab-case.css`
- JS: `script.js`, `animation-config.js`, `kebab-case.js`
- Assets: `PHOTO-YYYY-MM-DD-HH-MM-SS.jpg`, `VIDEO-YYYY-MM-DD-HH-MM-SS.mp4`
- Frames: `ezgif-frame-001.webp` to `ezgif-frame-250.webp` (zero-padded)

### CSS Classes
- BEM-inspired: `.component`, `.component-element`, `.component--modifier`
- Examples: `.nav`, `.nav-logo`, `.nav-menu`, `.nav-link`, `.nav.scrolled`

### JavaScript
- Classes: PascalCase (`FramePreloader`, `FrameAnimationSystem`)
- Functions: camelCase (`loadPriorityFrames`, `updateFrame`)
- Constants: UPPER_SNAKE_CASE (rare, prefer const camelCase)
- Private methods: `_methodName` (underscore prefix)

## Section Structure

All sections follow this pattern:
```html
<section id="section-id" class="section section-name" aria-label="Description">
    <div class="section-container">
        <!-- Section content -->
    </div>
</section>
```

## Asset Management

### Images
- Gallery: JPEG format, optimized for web
- Frames: WebP format for better compression
- Separate mobile/desktop frames for performance

### Videos
- Format: MP4 (H.264 codec)
- Attributes: `autoplay muted loop playsinline`
- Auto-play/pause controlled by IntersectionObserver

## Configuration Files

### animation-config.js (HERMANOSBARBER2)
Contains frame animation configuration:
- Frame count
- Scroll distance (desktop/mobile)
- Snap scroll settings
- Text overlays
- Discrete scroll mode

## Documentation Files

- `README.md`: Project overview, features, usage instructions
- `IMPLEMENTATION-COMPLETE.md`: Technical implementation details
- `VERIFICATION-CHECKLIST.html`: Interactive testing checklist
- `*-COMPLETE.md`: Task completion documentation
- `.kiro/steering/*.md`: AI assistant steering documents
