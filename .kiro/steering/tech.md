# Technology Stack

## Core Technologies

- **HTML5**: Semantic markup with accessibility features (ARIA labels, skip links, semantic elements)
- **CSS3**: Custom properties, animations, transforms, media queries
- **JavaScript (ES6+)**: Classes, async/await, modules, event emitters
- **GSAP 3.12.5**: Animation library for scroll-driven animations
- **ScrollTrigger**: GSAP plugin for scroll-linked animations

## Build System

No build system required - vanilla HTML/CSS/JS served directly.

## Development Setup

### Local Development Server

```bash
# Python 3
python3 -m http.server 8000

# PHP
php -S localhost:8000

# Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Key Libraries

### GSAP (GreenSock Animation Platform)
- **Version**: 3.12.5
- **CDN**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- **ScrollTrigger Plugin**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- **Usage**: All scroll-driven animations, pinned sections, horizontal scrolling, parallax effects

### Google Fonts
- **Bebas Neue**: Display font for headings and titles
- **Montserrat**: Sans-serif font for body text (weights: 300, 400, 600, 700)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- **GPU Acceleration**: CSS transforms with `translateZ(0)` and `will-change` hints
- **requestAnimationFrame**: Smooth frame updates at 60fps
- **IntersectionObserver**: Video auto-play/pause based on viewport visibility
- **Throttled Events**: Scroll events throttled to prevent jank
- **Progressive Loading**: Priority frames (1-10) load first, remaining frames load in background
- **Image Format**: WebP for frames (better compression than JPEG)
- **Lazy Loading**: Videos and images load on demand

## Common Commands

### Testing
```bash
# Open in browser
open index.html

# Or use local server (recommended)
python3 -m http.server 8000
```

### Validation
```bash
# Check console for initialization
# Should see: "✓ HERMANOSBARBER2 initialized successfully!"
```

### Performance Testing
- Use Chrome DevTools Performance tab
- Target: 60fps on desktop, 30fps+ on mobile
- Monitor frame loading progress in console

## File Structure

```
assets/
├── frames/              # Desktop frames (250 WebP images)
├── frames-mobile/       # Mobile frames (250 WebP images)
├── PHOTO-*.jpg         # Gallery images
└── VIDEO-*.mp4         # Video files

*.html                  # HTML pages
*.css                   # Stylesheets
*.js                    # JavaScript files
animation-config.js     # Frame animation configuration
```

## Accessibility Features

- Semantic HTML5 elements (nav, main, section, article, footer)
- ARIA labels and roles
- Skip-to-content link
- Keyboard navigation support (Tab, Enter, Space)
- Screen reader support with descriptive alt text
- Reduced motion support via CSS media query
- High contrast ratio (4.5:1 minimum)
