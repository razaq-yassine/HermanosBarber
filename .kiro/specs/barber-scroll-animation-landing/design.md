# Design Document: Barber Scroll Animation Landing

## Overview

This design document specifies the technical implementation for HERMANOSBARBER2, a scroll-driven frame animation landing page. The system will display 50 pre-rendered animation frames that transition based on scroll position, creating an immersive hero experience before presenting traditional content sections.

The implementation leverages GSAP ScrollTrigger for scroll-linked animations, maintains the existing HERMANOS BARBER brand identity (black/yellow color scheme, Bebas Neue and Montserrat fonts), and preserves all content sections from the original landing page while adding the new frame animation system as the hero section.

### Key Design Goals

- Smooth 60fps frame animation on desktop, 30fps minimum on mobile
- Progressive loading strategy: first 10 frames immediately, remaining 40 in background
- 300vh scroll distance on desktop, 200vh on mobile
- Seamless integration with existing GSAP ScrollTrigger animations
- Maintain brand consistency with existing HermanosBarber codebase

## Architecture

### System Components

The system consists of three primary components:

1. **Frame Animation System**: Manages frame display, scroll tracking, and frame transitions
2. **Frame Preloader**: Handles progressive image loading and caching
3. **Content Integration Layer**: Coordinates the animation hero with existing content sections

### Component Interaction Flow

```
User Scroll Event
    ↓
GSAP ScrollTrigger (tracks scroll progress)
    ↓
Frame Animation System (calculates frame index)
    ↓
Frame Preloader (provides cached frame)
    ↓
DOM Update (displays frame)
```

### Technology Stack

- **Animation Engine**: GSAP 3.12.5 with ScrollTrigger plugin
- **Frame Format**: JPEG images (ezgif-frame-001.jpg through ezgif-frame-050.jpg)
- **Styling**: CSS3 with GPU-accelerated transforms
- **JavaScript**: ES6+ with requestAnimationFrame for smooth updates

## Components and Interfaces

### 1. Frame Animation System

**Responsibility**: Display the correct frame based on scroll position and manage the animation hero section.

**Key Methods**:

```javascript
class FrameAnimationSystem {
  constructor(config) {
    // config: { frameCount, scrollDistance, container, frameBasePath }
  }
  
  init() {
    // Initialize GSAP ScrollTrigger
    // Set up scroll-linked animation
    // Register frame update callback
  }
  
  calculateFrameIndex(scrollProgress) {
    // Returns: floor(scrollProgress × 49) + 1
    // scrollProgress: 0 to 1
  }
  
  updateFrame(frameIndex) {
    // Updates DOM to display the specified frame
    // Uses CSS transform for GPU acceleration
  }
  
  destroy() {
    // Cleanup ScrollTrigger instances
  }
}
```

**Configuration**:
- `frameCount`: 50
- `scrollDistance`: "300vh" (desktop), "200vh" (mobile)
- `container`: DOM element for animation hero section
- `frameBasePath`: "./assets/frames/"

**ScrollTrigger Configuration**:
```javascript
{
  trigger: animationHeroSection,
  start: "top top",
  end: "+=300vh", // or "+=200vh" on mobile
  pin: true,
  scrub: true,
  onUpdate: (self) => updateFrame(calculateFrameIndex(self.progress))
}
```

### 2. Frame Preloader

**Responsibility**: Load animation frames progressively to ensure smooth playback.

**Key Methods**:

```javascript
class FramePreloader {
  constructor(config) {
    // config: { frameCount, frameBasePath, priorityFrames }
  }
  
  async loadPriorityFrames() {
    // Loads frames 1-10 immediately
    // Returns Promise that resolves when priority frames are loaded
  }
  
  loadRemainingFrames() {
    // Loads frames 11-50 in background
    // Uses Image objects for browser caching
  }
  
  getFrame(index) {
    // Returns cached Image object or most recent loaded frame
  }
  
  getLoadProgress() {
    // Returns: { loaded: number, total: number, percentage: number }
  }
  
  on(event, callback) {
    // Event emitter for "frames-ready", "progress", "error"
  }
}
```

**Loading Strategy**:
1. **Phase 1 (Immediate)**: Load frames 1-10 sequentially
2. **Phase 2 (Background)**: Load frames 11-50 in parallel (max 5 concurrent)
3. **Fallback**: If frame not loaded, display most recently loaded frame

**Mobile Optimization**:
- Reduce image quality to 80% for faster loading
- Load frames 1-5 immediately, then 6-50 in background

### 3. Content Integration Layer

**Responsibility**: Coordinate the animation hero section with existing content sections and navigation.

**Key Functions**:

```javascript
function initializeContentSections() {
  // Preserve existing GSAP animations for:
  // - Pinned video sections
  // - Horizontal gallery scroll
  // - Staggered card reveals
  // - About section animations
}

function setupNavigation() {
  // Fixed navigation with scroll class toggle
  // Smooth scroll to sections
  // Scroll indicator in animation hero
}

function handleResponsiveLayout() {
  // Adjust scroll distances based on viewport
  // Toggle mobile/desktop layouts
  // Refresh ScrollTrigger on resize
}
```

## Data Models

### Frame Configuration

```javascript
const frameConfig = {
  frameCount: 50,
  frameBasePath: "./assets/frames/",
  framePattern: "ezgif-frame-{index}.jpg", // {index} padded to 3 digits
  scrollDistance: {
    desktop: "300vh",
    mobile: "200vh"
  },
  preloadStrategy: {
    priorityFrames: 10,
    maxConcurrent: 5
  },
  performance: {
    targetFPS: {
      desktop: 60,
      mobile: 30
    },
    updateThrottle: 16 // ms (60fps)
  }
};
```

### Frame State

```javascript
const frameState = {
  currentFrame: 1,
  loadedFrames: new Set(), // Set of loaded frame indices
  frameCache: new Map(), // Map<index, Image>
  isReady: false,
  loadProgress: {
    loaded: 0,
    total: 50,
    percentage: 0
  }
};
```

### Scroll State

```javascript
const scrollState = {
  progress: 0, // 0 to 1
  direction: "down", // "up" or "down"
  isInAnimationSection: false,
  lastFrameIndex: 1
};
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Frame Index Calculation and Display

*For any* scroll progress value between 0 and 1, the Frame_Animation_System should calculate the frame index as floor(scrollProgress × 49) + 1 and display the corresponding frame.

**Validates: Requirements 1.2, 1.3**

### Property 2: Bidirectional Frame Display

*For any* sequence of scroll positions that decreases (scrolling up), the Frame_Animation_System should display frames in reverse numerical order.

**Validates: Requirements 1.6**

### Property 3: Frame Update Response Time

*For any* scroll position change, the Frame_Animation_System should update the displayed frame within 16ms of the scroll event.

**Validates: Requirements 1.8**

### Property 4: Fallback Frame Display

*For any* requested frame that is not yet loaded, the Frame_Animation_System should display the most recently loaded frame instead of showing a blank or broken image.

**Validates: Requirements 2.6**

### Property 5: Desktop Frame Rate Performance

*For any* scroll interaction on a viewport with width greater than 768px, the Frame_Animation_System should maintain a frame rate of at least 60fps.

**Validates: Requirements 6.6**

### Property 6: Mobile Frame Rate Performance

*For any* scroll interaction on a viewport with width less than 768px, the Frame_Animation_System should maintain a frame rate of at least 30fps.

**Validates: Requirements 6.7**

### Property 7: Scroll Event Throttling

*For any* rapid scroll sequence, the Frame_Animation_System should not process more than 60 frame updates per second.

**Validates: Requirements 9.7**

## Error Handling

### Frame Loading Errors

**Scenario**: Individual frame fails to load due to network error or missing file.

**Handling Strategy**:
1. Log error to console with frame index
2. Continue using most recently loaded frame (fallback behavior)
3. Retry failed frame load after 2 seconds (max 3 retries)
4. If all retries fail, mark frame as permanently unavailable
5. Display error indicator in developer console only (not visible to users)

**Implementation**:
```javascript
async function loadFrame(index) {
  let retries = 0;
  while (retries < 3) {
    try {
      const img = new Image();
      img.src = getFramePath(index);
      await img.decode();
      return img;
    } catch (error) {
      console.error(`Failed to load frame ${index}, retry ${retries + 1}/3`);
      retries++;
      await sleep(2000);
    }
  }
  console.error(`Frame ${index} permanently unavailable`);
  return null;
}
```

### ScrollTrigger Initialization Errors

**Scenario**: GSAP or ScrollTrigger fails to load or initialize.

**Handling Strategy**:
1. Check for GSAP and ScrollTrigger availability before initialization
2. If unavailable, display static fallback image (frame 025)
3. Log error message to console
4. Disable all scroll-linked animations
5. Show user-friendly message: "Animation unavailable, displaying static content"

**Implementation**:
```javascript
function initializeAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not available');
    displayFallbackImage();
    return false;
  }
  
  try {
    gsap.registerPlugin(ScrollTrigger);
    setupFrameAnimation();
    return true;
  } catch (error) {
    console.error('Failed to initialize animations:', error);
    displayFallbackImage();
    return false;
  }
}
```

### Viewport Resize During Animation

**Scenario**: User resizes browser window while scrolling through animation.

**Handling Strategy**:
1. Debounce resize events (250ms delay)
2. Recalculate scroll distances based on new viewport dimensions
3. Call ScrollTrigger.refresh() to update all scroll positions
4. Preserve current frame index during resize
5. Smoothly transition to new layout without jarring jumps

**Implementation**:
```javascript
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const currentFrame = frameState.currentFrame;
    updateScrollDistances();
    ScrollTrigger.refresh();
    // Restore frame position after refresh
    setFrame(currentFrame);
  }, 250);
});
```

### Reduced Motion Preference

**Scenario**: User has enabled "prefers-reduced-motion" in their system settings.

**Handling Strategy**:
1. Detect reduced motion preference on page load
2. Display static image (frame 025) instead of scroll animation
3. Disable all GSAP scroll-linked animations
4. Maintain all content sections and navigation functionality
5. Provide accessible alternative experience

**Implementation**:
```javascript
function checkReducedMotion() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  
  if (prefersReducedMotion) {
    displayStaticFrame(25);
    disableScrollAnimations();
    return true;
  }
  return false;
}
```

### Mobile Performance Degradation

**Scenario**: Frame rate drops below 30fps on mobile device.

**Handling Strategy**:
1. Monitor frame rate using performance.now()
2. If frame rate drops below 30fps for 2 consecutive seconds:
   - Reduce frame count by skipping every other frame (25 frames total)
   - Increase scroll throttle to 33ms (30fps)
   - Disable non-essential animations
3. Log performance degradation to console
4. Maintain core functionality

**Implementation**:
```javascript
function monitorPerformance() {
  let frameCount = 0;
  let lastTime = performance.now();
  
  function checkFPS() {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= 1000) {
      const fps = frameCount;
      frameCount = 0;
      lastTime = currentTime;
      
      if (fps < 30 && window.innerWidth < 768) {
        enablePerformanceMode();
      }
    }
    requestAnimationFrame(checkFPS);
  }
  
  requestAnimationFrame(checkFPS);
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, integration points, and error conditions
- **Property tests**: Verify universal properties across all inputs using randomized test data

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Library**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: **Feature: barber-scroll-animation-landing, Property {number}: {property_text}**

**Property Test Examples**:

```javascript
// Property 1: Frame Index Calculation and Display
// Feature: barber-scroll-animation-landing, Property 1: Frame index calculation and display
test('frame index calculation for all scroll progress values', () => {
  fc.assert(
    fc.property(
      fc.float({ min: 0, max: 1 }),
      (scrollProgress) => {
        const expectedFrame = Math.floor(scrollProgress * 49) + 1;
        const actualFrame = calculateFrameIndex(scrollProgress);
        return actualFrame === expectedFrame && 
               actualFrame >= 1 && 
               actualFrame <= 50;
      }
    ),
    { numRuns: 100 }
  );
});

// Property 2: Bidirectional Frame Display
// Feature: barber-scroll-animation-landing, Property 2: Bidirectional frame display
test('frames display in reverse when scrolling up', () => {
  fc.assert(
    fc.property(
      fc.array(fc.float({ min: 0, max: 1 }), { minLength: 2, maxLength: 10 }),
      (scrollPositions) => {
        const sortedDesc = [...scrollPositions].sort((a, b) => b - a);
        const frames = sortedDesc.map(calculateFrameIndex);
        
        // Check that frames are in descending or equal order
        for (let i = 1; i < frames.length; i++) {
          if (frames[i] > frames[i - 1]) {
            return false;
          }
        }
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

// Property 3: Frame Update Response Time
// Feature: barber-scroll-animation-landing, Property 3: Frame update response time
test('frame updates within 16ms', async () => {
  fc.assert(
    fc.asyncProperty(
      fc.float({ min: 0, max: 1 }),
      async (scrollProgress) => {
        const startTime = performance.now();
        await updateFrame(calculateFrameIndex(scrollProgress));
        const endTime = performance.now();
        const elapsed = endTime - startTime;
        return elapsed <= 16;
      }
    ),
    { numRuns: 100 }
  );
});

// Property 4: Fallback Frame Display
// Feature: barber-scroll-animation-landing, Property 4: Fallback frame display
test('displays most recent frame when requested frame not loaded', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 50 }),
      fc.integer({ min: 1, max: 50 }),
      (loadedFrame, requestedFrame) => {
        // Simulate only loadedFrame being available
        frameState.loadedFrames.clear();
        frameState.loadedFrames.add(loadedFrame);
        frameState.currentFrame = loadedFrame;
        
        const displayedFrame = getFrameToDisplay(requestedFrame);
        
        // Should display loaded frame if requested is not available
        if (!frameState.loadedFrames.has(requestedFrame)) {
          return displayedFrame === loadedFrame;
        }
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

// Property 7: Scroll Event Throttling
// Feature: barber-scroll-animation-landing, Property 7: Scroll event throttling
test('scroll events throttled to max 60 per second', async () => {
  fc.assert(
    fc.asyncProperty(
      fc.array(fc.float({ min: 0, max: 1 }), { minLength: 100, maxLength: 200 }),
      async (scrollEvents) => {
        let updateCount = 0;
        const startTime = performance.now();
        
        for (const scrollProgress of scrollEvents) {
          await simulateScroll(scrollProgress);
          updateCount++;
        }
        
        const endTime = performance.now();
        const elapsed = (endTime - startTime) / 1000; // seconds
        const updatesPerSecond = updateCount / elapsed;
        
        return updatesPerSecond <= 60;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Framework**: Jest with jsdom for DOM testing

**Test Categories**:

1. **Initial State Tests**:
   - Page loads with frame 001 displayed
   - Animation hero section positioned first after navigation
   - Loading indicator appears during initial load
   - All content sections present in correct order

2. **Edge Case Tests**:
   - Scroll progress 0 displays frame 001
   - Scroll progress 1 displays frame 050
   - Empty frame cache displays fallback
   - Viewport exactly 768px uses desktop settings

3. **Integration Tests**:
   - GSAP ScrollTrigger initializes correctly
   - Frame preloader loads priority frames first
   - Navigation smooth scrolls to sections
   - Resize triggers ScrollTrigger refresh

4. **Error Condition Tests**:
   - Missing frame file triggers retry logic
   - GSAP unavailable displays fallback image
   - Reduced motion preference disables animations
   - Network error during preload continues with loaded frames

5. **Responsive Behavior Tests**:
   - Mobile viewport uses 200vh scroll distance
   - Desktop viewport uses 300vh scroll distance
   - Navigation menu hidden on mobile
   - Two-column layouts stack on mobile

6. **Accessibility Tests**:
   - All images have alt text
   - Interactive elements have aria-labels
   - Keyboard navigation works for all controls
   - Color contrast meets WCAG 4.5:1 ratio
   - Skip-to-content link present

**Example Unit Tests**:

```javascript
describe('Frame Animation System', () => {
  test('displays frame 001 on initial load', () => {
    const system = new FrameAnimationSystem(frameConfig);
    system.init();
    expect(system.getCurrentFrame()).toBe(1);
  });
  
  test('scroll progress 0 displays frame 001', () => {
    const frameIndex = calculateFrameIndex(0);
    expect(frameIndex).toBe(1);
  });
  
  test('scroll progress 1 displays frame 050', () => {
    const frameIndex = calculateFrameIndex(1);
    expect(frameIndex).toBe(50);
  });
  
  test('animation hero section is first after navigation', () => {
    const nav = document.querySelector('.nav');
    const hero = document.querySelector('.animation-hero-section');
    expect(hero.previousElementSibling).toBe(nav);
  });
});

describe('Frame Preloader', () => {
  test('loads frames 1-10 immediately', async () => {
    const preloader = new FramePreloader(frameConfig);
    await preloader.loadPriorityFrames();
    
    for (let i = 1; i <= 10; i++) {
      expect(preloader.isFrameLoaded(i)).toBe(true);
    }
  });
  
  test('emits frames-ready event when all loaded', async () => {
    const preloader = new FramePreloader(frameConfig);
    const readyPromise = new Promise(resolve => {
      preloader.on('frames-ready', resolve);
    });
    
    await preloader.loadAllFrames();
    await readyPromise;
    
    expect(preloader.getLoadProgress().percentage).toBe(100);
  });
  
  test('retries failed frame load up to 3 times', async () => {
    const preloader = new FramePreloader(frameConfig);
    const loadSpy = jest.spyOn(preloader, 'loadFrame');
    
    // Simulate network failure
    global.fetch = jest.fn(() => Promise.reject('Network error'));
    
    await preloader.loadFrame(25);
    
    expect(loadSpy).toHaveBeenCalledTimes(3);
  });
});

describe('Responsive Behavior', () => {
  test('mobile viewport uses 200vh scroll distance', () => {
    global.innerWidth = 375;
    const scrollDistance = getScrollDistance();
    expect(scrollDistance).toBe('200vh');
  });
  
  test('desktop viewport uses 300vh scroll distance', () => {
    global.innerWidth = 1920;
    const scrollDistance = getScrollDistance();
    expect(scrollDistance).toBe('300vh');
  });
});

describe('Error Handling', () => {
  test('displays fallback image when GSAP unavailable', () => {
    delete window.gsap;
    const result = initializeAnimations();
    expect(result).toBe(false);
    expect(document.querySelector('.fallback-image')).toBeTruthy();
  });
  
  test('disables animations with reduced motion preference', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));
    
    const result = checkReducedMotion();
    expect(result).toBe(true);
    expect(document.querySelector('.static-frame')).toBeTruthy();
  });
});
```

### Performance Testing

**Tools**: Lighthouse, Chrome DevTools Performance panel

**Metrics**:
- Desktop Lighthouse score: ≥80
- Mobile Lighthouse score: ≥70
- Frame rate: 60fps desktop, 30fps mobile minimum
- First Contentful Paint: <2s
- Time to Interactive: <3.5s

**Test Procedure**:
1. Run Lighthouse in Chrome DevTools
2. Record performance profile during scroll
3. Analyze frame rate using Performance panel
4. Verify no layout thrashing or forced reflows
5. Check memory usage stays below 100MB

### Browser Compatibility Testing

**Test Matrix**:
- Chrome 90+ (Windows, macOS, Android)
- Firefox 88+ (Windows, macOS)
- Safari 14+ (macOS, iOS)
- Edge 90+ (Windows)

**Test Cases**:
- Frame animation plays smoothly
- ScrollTrigger pinning works correctly
- Images load and cache properly
- Fallback displays in unsupported browsers

### Continuous Integration

**CI Pipeline**:
1. Run unit tests (Jest)
2. Run property tests (fast-check)
3. Run linting (ESLint)
4. Build production bundle
5. Run Lighthouse CI
6. Deploy to staging environment

**Test Coverage Target**: 85% code coverage minimum

