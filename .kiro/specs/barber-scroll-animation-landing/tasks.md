# Implementation Plan: Barber Scroll Animation Landing

## Overview

This implementation plan breaks down the HERMANOSBARBER2 landing page into discrete coding tasks. The feature adds a scroll-driven frame animation system as the hero section, displaying 50 pre-rendered frames that transition based on scroll position. The implementation uses GSAP ScrollTrigger for scroll tracking, maintains the existing brand identity, and integrates seamlessly with existing content sections.

## Tasks

- [x] 1. Set up project structure and asset organization
  - Create HERMANOSBARBER2 directory structure
  - Create assets/frames/ directory for animation frames
  - Copy existing brand assets (logos, fonts) from HermanosBarber/assets
  - Extract and organize 50 animation frames (ezgif-frame-001.jpg through ezgif-frame-050.jpg)
  - _Requirements: 11.1, 11.2_

- [x] 2. Create HTML structure and base layout
  - Create index.html with semantic HTML5 structure
  - Add navigation section with logo, menu links, and phone button
  - Add animation hero section container with canvas/image element
  - Add scroll indicator in animation hero section
  - Add content sections: videos, about, gallery, services, contact, footer
  - Include GSAP and ScrollTrigger CDN links
  - Add accessibility elements: skip-to-content link, aria-labels, alt text
  - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 10.1, 12.6, 12.7_

- [x] 3. Implement base CSS styling and brand identity
  - Create style.css with CSS custom properties for colors (--black, --yellow)
  - Import Bebas Neue and Montserrat fonts
  - Style navigation with fixed positioning and scroll effects
  - Style animation hero section with 100vh height and full-width layout
  - Add yellow glow effects to titles using text-shadow
  - Implement responsive breakpoints for mobile (<768px) and desktop (≥768px)
  - Style scroll indicator
  - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.7, 6.4, 10.1, 10.4_

- [x] 4. Implement Frame Preloader class
  - [x] 4.1 Create FramePreloader class with constructor and configuration
    - Implement constructor accepting frameCount, frameBasePath, priorityFrames
    - Initialize frame cache (Map) and loaded frames tracking (Set)
    - Set up event emitter for "frames-ready", "progress", "error" events
    - _Requirements: 2.4, 11.5_
  
  - [x] 4.2 Implement priority frame loading (frames 1-10)
    - Create loadPriorityFrames() async method
    - Load frames 1-10 sequentially using Image objects
    - Use img.decode() to ensure frames are ready
    - Return Promise that resolves when priority frames loaded
    - _Requirements: 2.1_
  
  - [x] 4.3 Implement background frame loading (frames 11-50)
    - Create loadRemainingFrames() method
    - Load frames 11-50 in parallel with max 5 concurrent requests
    - Update load progress and emit "progress" events
    - Emit "frames-ready" event when all frames loaded
    - _Requirements: 2.2, 2.5_
  
  - [x] 4.4 Implement frame retrieval and fallback logic
    - Create getFrame(index) method
    - Return cached Image object if frame is loaded
    - Return most recently loaded frame if requested frame not available
    - Implement getLoadProgress() method returning loaded/total/percentage
    - _Requirements: 2.6_
  
  - [x] 4.5 Implement frame loading error handling and retry logic
    - Add try-catch blocks in frame loading methods
    - Retry failed frame loads up to 3 times with 2-second delay
    - Log errors to console with frame index
    - Emit "error" events for failed frames
    - Continue loading remaining frames if individual frame fails
    - _Requirements: 2.6_
  
  - [x] 4.6 Write unit tests for FramePreloader
    - Test priority frames load first
    - Test frames-ready event emission
    - Test fallback frame display when frame not loaded
    - Test retry logic for failed frame loads
    - Test load progress calculation
    - _Requirements: 2.1, 2.2, 2.5, 2.6_

- [x] 5. Implement Frame Animation System class
  - [x] 5.1 Create FrameAnimationSystem class with constructor
    - Implement constructor accepting config (frameCount, scrollDistance, container, frameBasePath)
    - Store references to DOM elements (container, image element)
    - Initialize frame state tracking (currentFrame, lastFrameIndex)
    - _Requirements: 1.1, 3.2_
  
  - [x] 5.2 Implement frame index calculation logic
    - Create calculateFrameIndex(scrollProgress) method
    - Return floor(scrollProgress × 49) + 1
    - Ensure result is clamped between 1 and 50
    - _Requirements: 1.2, 1.3, 1.4, 1.5_
  
  - [x] 5.3 Implement frame display and DOM update
    - Create updateFrame(frameIndex) method
    - Get frame from FramePreloader cache
    - Update image src with GPU-accelerated CSS transforms
    - Track currentFrame in state
    - Use requestAnimationFrame for smooth updates
    - _Requirements: 1.2, 1.8, 9.2, 9.3_
  
  - [x] 5.4 Implement GSAP ScrollTrigger integration
    - Create init() method to set up ScrollTrigger
    - Configure trigger, start, end, pin, and scrub properties
    - Register onUpdate callback to call updateFrame
    - Handle bidirectional scrolling (up and down)
    - _Requirements: 1.6, 3.5, 7.1, 7.2, 7.6_
  
  - [x] 5.5 Implement responsive scroll distance adjustment
    - Detect viewport width on initialization
    - Use 300vh scroll distance for desktop (≥768px)
    - Use 200vh scroll distance for mobile (<768px)
    - Update scroll distance on window resize
    - _Requirements: 6.2, 6.3_
  
  - [x] 5.6 Implement cleanup and destroy method
    - Create destroy() method to remove ScrollTrigger instances
    - Clean up event listeners
    - Clear frame references
    - _Requirements: 7.5_
  
  - [x] 5.7 Write property test for frame index calculation
    - **Property 1: Frame Index Calculation and Display**
    - **Validates: Requirements 1.2, 1.3**
    - Test with random scroll progress values (0 to 1)
    - Verify frame index is always between 1 and 50
    - Verify calculation: floor(scrollProgress × 49) + 1
  
  - [x] 5.8 Write property test for bidirectional frame display
    - **Property 2: Bidirectional Frame Display**
    - **Validates: Requirements 1.6**
    - Test with random descending scroll position sequences
    - Verify frames display in reverse numerical order
  
  - [x] 5.9 Write property test for frame update response time
    - **Property 3: Frame Update Response Time**
    - **Validates: Requirements 1.8**
    - Test with random scroll progress values
    - Verify frame updates complete within 16ms
  
  - [x] 5.10 Write property test for fallback frame display
    - **Property 4: Fallback Frame Display**
    - **Validates: Requirements 2.6**
    - Test with random frame requests where some frames not loaded
    - Verify most recently loaded frame is displayed
  
  - [x] 5.11 Write unit tests for FrameAnimationSystem
    - Test initial frame is 001
    - Test scroll progress 0 displays frame 001
    - Test scroll progress 1 displays frame 050
    - Test frame clamping at boundaries
    - Test ScrollTrigger initialization
    - _Requirements: 1.1, 1.4, 1.5_

- [x] 6. Checkpoint - Ensure core animation system works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement loading indicator and initialization flow
  - Create loading indicator UI component (spinner or progress bar)
  - Display loading indicator on page load
  - Initialize FramePreloader and load priority frames
  - Hide loading indicator when first 10 frames ready
  - Start background loading of remaining frames
  - Initialize FrameAnimationSystem after priority frames loaded
  - _Requirements: 2.1, 9.1_

- [x] 8. Implement navigation functionality
  - Add scroll event listener for navigation scroll effect (add "scrolled" class at 100px)
  - Implement smooth scroll for navigation links
  - Add click handler for scroll indicator to scroll to first content section
  - Ensure navigation is fixed and stays at top
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [x] 9. Integrate content sections with existing animations
  - Copy video sections HTML structure from HermanosBarber/index.html
  - Copy about section HTML structure with image, text, and statistics
  - Copy gallery section HTML structure with horizontal scroll
  - Copy services section HTML structure with service cards
  - Copy contact section HTML structure with map and contact info
  - Copy footer HTML structure
  - Ensure sections appear in correct order after animation hero
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 10. Implement content section animations using GSAP
  - Set up pinned video section animations with ScrollTrigger
  - Set up video overlay animations with stagger effects
  - Set up about section animations (image slide-in, content fade-in)
  - Set up gallery horizontal scroll with ScrollTrigger pin
  - Set up services card stagger animations
  - Set up contact section animations
  - Preserve animation patterns from original HermanosBarber/script.js
  - _Requirements: 7.3, 7.4_

- [x] 11. Implement responsive behavior and mobile optimizations
  - Add media queries for mobile viewport (<768px)
  - Hide navigation menu on mobile, show only logo and phone button
  - Stack two-column layouts into single columns on mobile
  - Adjust animation hero scroll distance based on viewport
  - Reduce image quality to 80% for mobile frame loading
  - Configure ScrollTrigger for mobile performance (limitCallbacks, syncInterval)
  - _Requirements: 6.1, 6.4, 6.5, 9.6_
  
  - [x] 11.1 Write property test for desktop frame rate performance
    - **Property 5: Desktop Frame Rate Performance**
    - **Validates: Requirements 6.6**
    - Test with viewport width >768px
    - Verify frame rate ≥60fps during scroll
  
  - [x] 11.2 Write property test for mobile frame rate performance
    - **Property 6: Mobile Frame Rate Performance**
    - **Validates: Requirements 6.7**
    - Test with viewport width <768px
    - Verify frame rate ≥30fps during scroll

- [x] 12. Implement error handling and fallback mechanisms
  - Add GSAP/ScrollTrigger availability check before initialization
  - Implement displayFallbackImage() function to show static frame 025
  - Add reduced motion preference detection using matchMedia
  - Disable animations and show static frame if reduced motion preferred
  - Implement window resize debouncing and ScrollTrigger refresh
  - Add console error logging for debugging
  - _Requirements: 8.5, 12.5_
  
  - [x] 12.1 Write unit tests for error handling
    - Test GSAP unavailable displays fallback image
    - Test reduced motion preference disables animations
    - Test resize triggers ScrollTrigger refresh
    - Test frame loading errors trigger retry logic
    - _Requirements: 8.5, 12.5_

- [x] 13. Implement scroll event throttling and performance optimizations
  - Implement scroll event throttling to max 60 updates per second
  - Use requestAnimationFrame for frame updates
  - Use CSS transform and opacity for GPU acceleration
  - Prevent horizontal scrolling except in gallery section
  - Add will-change CSS property to animated elements
  - _Requirements: 9.2, 9.3, 9.7, 10.6_
  
  - [x] 13.1 Write property test for scroll event throttling
    - **Property 7: Scroll Event Throttling**
    - **Validates: Requirements 9.7**
    - Test with rapid scroll event sequences
    - Verify max 60 frame updates per second

- [x] 14. Checkpoint - Ensure all functionality works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Add accessibility features and semantic markup
  - Add alt text to all images including animation frames
  - Add aria-labels to interactive elements (buttons, links)
  - Ensure keyboard navigation works for all controls
  - Verify color contrast meets WCAG 4.5:1 ratio
  - Test skip-to-content link functionality
  - Verify semantic HTML5 elements used throughout
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.6, 12.7_

- [x] 16. Implement browser compatibility checks and polyfills
  - Test in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
  - Add feature detection for required JavaScript APIs
  - Implement fallback for unsupported browsers
  - Verify standard JavaScript APIs used (no vendor prefixes)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 17. Final integration and polish
  - Wire all components together in main initialization function
  - Add console success message on load
  - Verify all 50 frames display correctly during scroll
  - Verify smooth transitions between animation hero and content sections
  - Test navigation smooth scroll to all sections
  - Verify all GSAP animations work correctly
  - _Requirements: 1.1, 1.2, 4.7, 10.2_
  
  - [x] 17.1 Write integration tests for complete user flow
    - Test page load displays frame 001
    - Test scroll through all 50 frames
    - Test scroll indicator navigates to content
    - Test navigation links scroll to sections
    - Test responsive layout switches at 768px breakpoint
    - _Requirements: 1.1, 1.4, 1.5, 4.7, 10.5_

- [x] 18. Performance optimization and validation
  - Run Lighthouse performance audit on desktop and mobile
  - Optimize images if needed to meet performance targets
  - Verify First Contentful Paint <2s
  - Verify Time to Interactive <3.5s
  - Check memory usage stays below 100MB during scroll
  - Verify no layout thrashing or forced reflows
  - _Requirements: 9.4, 9.5_

- [x] 19. Final checkpoint - Complete testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation uses JavaScript with GSAP 3.12.5 and ScrollTrigger
- Frame animation system is the core feature, content sections reuse existing patterns
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and integration points
- Checkpoints ensure incremental validation at key milestones
