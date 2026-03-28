# Requirements Document

## Introduction

This document specifies the requirements for HERMANOSBARBER2, a new landing page featuring a scroll-driven frame animation effect. The page will display 50 pre-rendered animation frames that change based on scroll position, creating an immersive hero experience. The landing page will maintain the existing HERMANOS BARBER brand identity (black/yellow color scheme, Bebas Neue and Montserrat fonts) and include all content sections from the original landing page.

## Glossary

- **Frame_Animation_System**: The system responsible for displaying and transitioning between the 50 animation frames based on scroll position
- **Landing_Page**: The complete HERMANOSBARBER2 website including all sections
- **Animation_Hero_Section**: The full-page section containing the scroll-driven frame animation
- **Frame_Sequence**: The ordered collection of 50 frames (ezgif-frame-001.jpg through ezgif-frame-050.jpg)
- **Scroll_Progress**: The normalized scroll position value (0 to 1) used to determine which frame to display
- **Frame_Preloader**: The system responsible for loading animation frames into memory
- **Content_Sections**: The sections following the animation hero (videos, about, gallery, services, contact)
- **Mobile_Viewport**: A viewport with width less than 768px
- **Desktop_Viewport**: A viewport with width of 768px or greater

## Requirements

### Requirement 1: Frame Animation Display

**User Story:** As a visitor, I want to see smooth frame-by-frame animation as I scroll, so that I experience an engaging visual introduction to the barbershop.

#### Acceptance Criteria

1. WHEN the Landing_Page loads, THE Frame_Animation_System SHALL display frame 001 as the initial frame
2. WHEN a user scrolls down within the Animation_Hero_Section, THE Frame_Animation_System SHALL display the frame corresponding to the current Scroll_Progress
3. THE Frame_Animation_System SHALL calculate the displayed frame number as: floor(Scroll_Progress × 49) + 1
4. WHEN Scroll_Progress is 0, THE Frame_Animation_System SHALL display frame 001
5. WHEN Scroll_Progress is 1, THE Frame_Animation_System SHALL display frame 050
6. WHEN a user scrolls up within the Animation_Hero_Section, THE Frame_Animation_System SHALL display frames in reverse order
7. THE Animation_Hero_Section SHALL occupy 100% of the viewport height
8. THE Frame_Animation_System SHALL update the displayed frame within 16ms of scroll position change

### Requirement 2: Frame Preloading Strategy

**User Story:** As a visitor, I want the animation to start quickly and play smoothly, so that I don't experience delays or stuttering.

#### Acceptance Criteria

1. WHEN the Landing_Page loads, THE Frame_Preloader SHALL immediately load frames 001 through 010
2. WHILE frames 001-010 are loading, THE Frame_Preloader SHALL load frames 011 through 050 in the background
3. WHEN frame 010 is displayed, THE Frame_Preloader SHALL have loaded at least 75% of all frames
4. THE Frame_Preloader SHALL use Image objects to preload frames into browser cache
5. WHEN all frames are loaded, THE Frame_Preloader SHALL emit a "frames-ready" event
6. IF a frame is not yet loaded when needed, THEN THE Frame_Animation_System SHALL display the most recently loaded frame

### Requirement 3: Animation Hero Section Layout

**User Story:** As a visitor, I want to see the frame animation as the main hero element, so that I immediately understand the creative nature of the barbershop.

#### Acceptance Criteria

1. THE Animation_Hero_Section SHALL be positioned as the first section after navigation
2. THE Animation_Hero_Section SHALL display frames at full viewport width and height
3. THE Animation_Hero_Section SHALL maintain frame aspect ratio using object-fit cover
4. THE Animation_Hero_Section SHALL include a scroll indicator at the bottom
5. WHEN the Animation_Hero_Section is active, THE Frame_Animation_System SHALL pin the section until all 50 frames have been displayed
6. THE Animation_Hero_Section SHALL create scroll distance equivalent to 300vh (3 times viewport height)

### Requirement 4: Content Sections Integration

**User Story:** As a visitor, I want to access all barbershop information after the animation, so that I can learn about services and contact the business.

#### Acceptance Criteria

1. THE Landing_Page SHALL include video sections with pinned and overlay animations
2. THE Landing_Page SHALL include an about section with image, text, and statistics
3. THE Landing_Page SHALL include a gallery section with horizontal scroll
4. THE Landing_Page SHALL include a services section with service cards
5. THE Landing_Page SHALL include a contact section with information and embedded map
6. THE Landing_Page SHALL include a footer with branding and copyright
7. WHEN a user scrolls past the Animation_Hero_Section, THE Landing_Page SHALL display Content_Sections in order: videos, about, gallery, services, contact, footer

### Requirement 5: Brand Consistency

**User Story:** As the business owner, I want the new landing page to match the existing brand identity, so that customers recognize the HERMANOS BARBER brand.

#### Acceptance Criteria

1. THE Landing_Page SHALL use the color scheme: --black (#000000) and --yellow (#FFD700)
2. THE Landing_Page SHALL use Bebas Neue font for headings
3. THE Landing_Page SHALL use Montserrat font for body text
4. THE Landing_Page SHALL include navigation with logo, menu links (Accueil, À Propos, Galerie, Services, Contact), and phone button
5. THE Landing_Page SHALL apply yellow glow effects to titles using text-shadow
6. THE Landing_Page SHALL use the same logos and design elements from HermanosBarber/assets
7. THE Landing_Page SHALL maintain consistent spacing, border-radius, and transition timing with the original design

### Requirement 6: Mobile Responsiveness

**User Story:** As a mobile visitor, I want to experience the animation without performance issues, so that the page loads quickly and scrolls smoothly.

#### Acceptance Criteria

1. WHEN the Landing_Page is viewed on a Mobile_Viewport, THE Frame_Animation_System SHALL display one frame at a time stacked vertically
2. WHEN the Landing_Page is viewed on a Mobile_Viewport, THE Animation_Hero_Section SHALL reduce scroll distance to 200vh
3. WHEN the Landing_Page is viewed on a Desktop_Viewport, THE Frame_Animation_System SHALL use the full 300vh scroll distance
4. WHEN the Landing_Page is viewed on a Mobile_Viewport, THE Landing_Page SHALL hide the navigation menu and show only logo and phone button
5. WHEN the Landing_Page is viewed on a Mobile_Viewport, THE Landing_Page SHALL stack all two-column layouts into single columns
6. THE Frame_Animation_System SHALL maintain 60fps frame rate on devices with viewport width greater than 768px
7. THE Frame_Animation_System SHALL maintain 30fps minimum frame rate on Mobile_Viewport

### Requirement 7: GSAP ScrollTrigger Integration

**User Story:** As a developer, I want to use GSAP ScrollTrigger for all animations, so that the implementation is consistent with the existing codebase.

#### Acceptance Criteria

1. THE Frame_Animation_System SHALL use GSAP ScrollTrigger to track scroll position
2. THE Frame_Animation_System SHALL pin the Animation_Hero_Section during frame playback
3. THE Landing_Page SHALL use GSAP ScrollTrigger for all Content_Sections animations
4. THE Landing_Page SHALL preserve animation patterns from the original: pinned videos, horizontal gallery scroll, staggered card reveals
5. WHEN the window is resized, THE Frame_Animation_System SHALL call ScrollTrigger.refresh()
6. THE Frame_Animation_System SHALL use scrub: true for smooth scroll-linked animation

### Requirement 8: Browser Compatibility

**User Story:** As a visitor, I want the landing page to work in my browser, so that I can view the content regardless of my browser choice.

#### Acceptance Criteria

1. THE Landing_Page SHALL function correctly in Chrome version 90 or later
2. THE Landing_Page SHALL function correctly in Firefox version 88 or later
3. THE Landing_Page SHALL function correctly in Safari version 14 or later
4. THE Landing_Page SHALL function correctly in Edge version 90 or later
5. IF a browser does not support required features, THEN THE Landing_Page SHALL display a fallback static image
6. THE Frame_Animation_System SHALL use standard JavaScript APIs without vendor prefixes

### Requirement 9: Performance Optimization

**User Story:** As a visitor, I want the page to load and scroll smoothly, so that I have a pleasant browsing experience without lag.

#### Acceptance Criteria

1. WHEN the Landing_Page loads, THE Frame_Preloader SHALL display a loading indicator until the first 10 frames are ready
2. THE Frame_Animation_System SHALL use requestAnimationFrame for frame updates
3. THE Frame_Animation_System SHALL use CSS transform and opacity properties for GPU acceleration
4. THE Landing_Page SHALL achieve a Lighthouse performance score of 80 or higher on Desktop_Viewport
5. THE Landing_Page SHALL achieve a Lighthouse performance score of 70 or higher on Mobile_Viewport
6. WHEN the Landing_Page is viewed on a Mobile_Viewport, THE Frame_Preloader SHALL reduce image quality to 80% for faster loading
7. THE Frame_Animation_System SHALL debounce scroll events to maximum 60 updates per second

### Requirement 10: Navigation and Scroll Behavior

**User Story:** As a visitor, I want to navigate between sections smoothly, so that I can easily find the information I need.

#### Acceptance Criteria

1. THE Landing_Page SHALL include a fixed navigation bar at the top
2. WHEN a user clicks a navigation link, THE Landing_Page SHALL smooth scroll to the target section
3. WHEN scroll position exceeds 100px, THE Landing_Page SHALL add a "scrolled" class to the navigation
4. THE Landing_Page SHALL include a scroll indicator in the Animation_Hero_Section
5. WHEN a user clicks the scroll indicator, THE Landing_Page SHALL scroll to the first Content_Section
6. THE Landing_Page SHALL prevent horizontal scrolling except in the gallery section

### Requirement 11: Asset Management

**User Story:** As a developer, I want to organize assets properly, so that the project is maintainable and assets are easy to locate.

#### Acceptance Criteria

1. THE Landing_Page SHALL store all 50 animation frames in HERMANOSBARBER2/assets/frames/ directory
2. THE Landing_Page SHALL store logos and design elements in HERMANOSBARBER2/assets/ directory
3. THE Landing_Page SHALL store videos in HERMANOSBARBER2/assets/ directory
4. THE Landing_Page SHALL store gallery photos in HERMANOSBARBER2/assets/ directory
5. THE Frame_Animation_System SHALL reference frames using relative paths: ./assets/frames/ezgif-frame-XXX.jpg
6. THE Landing_Page SHALL include a README.md file documenting the project structure and setup instructions

### Requirement 12: Accessibility and User Experience

**User Story:** As a visitor with accessibility needs, I want to access the content without relying solely on scroll animations, so that I can use the website effectively.

#### Acceptance Criteria

1. THE Landing_Page SHALL include alt text for all images
2. THE Landing_Page SHALL include aria-labels for interactive elements
3. THE Landing_Page SHALL support keyboard navigation for all interactive elements
4. THE Landing_Page SHALL maintain color contrast ratio of 4.5:1 or higher for text
5. IF a user prefers reduced motion, THEN THE Frame_Animation_System SHALL display a static image instead of animating frames
6. THE Landing_Page SHALL include semantic HTML5 elements (nav, section, footer)
7. THE Landing_Page SHALL include a skip-to-content link for screen readers
