/**
 * HERMANOSBARBER2 - Frame Animation Configuration
 * 
 * This file contains the configuration for the scroll-driven frame animation system.
 * You can easily customize the snap scrolling behavior and text overlays here.
 * 
 * SCROLL MODES:
 * 1. Discrete Scroll (enabled in script.js) - One frame per scroll event
 * 2. Smooth Scroll (snapScroll.enabled: false) - Continuous scrolling through all frames
 * 3. Snap Scroll (snapScroll.enabled: true) - Snap to specific frames with text overlays
 */

const ANIMATION_CONFIG = {
  // ===================================
  // SNAP SCROLL CONFIGURATION
  // ===================================
  snapScroll: {
    // Enable or disable snap scrolling
    // true = snap to specific frames with text overlays
    // false = smooth continuous scrolling through all frames
    enabled: false,
    
    // Mode: 'auto' or 'manual'
    // 'auto' = automatically divide frames evenly by maxScrollSteps
    // 'manual' = use specific frame indices from frameStops array
    mode: 'auto',
    
    // For AUTO mode: Number of scroll steps (snapping points)
    // Example: 5 steps will divide 50 frames into 5 equal segments
    // Step 1: frame 1, Step 2: frame 13, Step 3: frame 25, Step 4: frame 38, Step 5: frame 50
    maxScrollSteps: 3,
    
    // For MANUAL mode: Specific frame indices where scrolling stops
    // Uncomment and customize this array when using mode: 'manual'
    // frameStops: [1, 12, 25, 38, 50],
    
    // Text overlays for each scroll step
    // Each text object has:
    // - content: The text to display
    // - side: 'left' or 'right' (optional, defaults to alternating)
    // - position: 'top', 'center', 'bottom' (optional, defaults to center)
    // - mobilePosition: 'top', 'center', 'bottom' (optional, overrides position on mobile)
    // - showAtProgress: 0-1 value indicating when to show (0 = start, 1 = end)
    texts: [
      { content: 'HERMANOS BARBER', side: 'left', position: 'top', showAtProgress: 0.1 },
      { content: 'STYLE & TRADITION', side: 'left', position: 'bottom', showAtProgress: 0.5 },
      { content: 'RÉSERVEZ MAINTENANT', side: 'center', position: 'bottom', showAtProgress: 0.85 }
    ]
  }
};

// ===================================
// EXAMPLE CONFIGURATIONS
// ===================================

// Example 1: Smooth scrolling (no snapping)
/*
const ANIMATION_CONFIG = {
  snapScroll: {
    enabled: false
  }
};
*/

// Example 2: Auto mode with 7 scroll steps
/*
const ANIMATION_CONFIG = {
  snapScroll: {
    enabled: true,
    mode: 'auto',
    maxScrollSteps: 7,
    texts: [
      { content: 'WELCOME' },
      { content: 'PREMIUM CUTS' },
      { content: 'EXPERT STYLING' },
      { content: 'TRADITIONAL' },
      { content: 'MODERN' },
      { content: 'PROFESSIONAL' },
      { content: 'HERMANOS BARBER' }
    ]
  }
};
*/

// Example 3: Manual mode with specific frame stops
/*
const ANIMATION_CONFIG = {
  snapScroll: {
    enabled: true,
    mode: 'manual',
    frameStops: [1, 10, 20, 35, 50],
    texts: [
      { content: 'WELCOME', side: 'left' },
      { content: 'PREMIUM CUTS', side: 'right' },
      { content: 'EXPERT STYLING', side: 'left' },
      { content: 'TRADITIONAL SERVICE', side: 'right' },
      { content: 'HERMANOS BARBER', side: 'left' }
    ]
  }
};
*/

// Example 4: More scroll steps with shorter texts
/*
const ANIMATION_CONFIG = {
  snapScroll: {
    enabled: true,
    mode: 'auto',
    maxScrollSteps: 10,
    texts: [
      { content: 'WELCOME' },
      { content: 'CUTS' },
      { content: 'STYLE' },
      { content: 'BEARD' },
      { content: 'SHAVE' },
      { content: 'COLOR' },
      { content: 'FADE' },
      { content: 'CLASSIC' },
      { content: 'MODERN' },
      { content: 'HERMANOS' }
    ]
  }
};
*/
