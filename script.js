/**
 * HERMANOSBARBER2 - Scroll-driven Frame Animation Landing Page
 * Frame Animation System with GSAP ScrollTrigger
 */

/**
 * FramePreloader Class
 * Manages progressive loading of animation frames with priority loading strategy
 * 
 * @class FramePreloader
 * @description Handles loading of 50 animation frames with priority loading (frames 1-10 first)
 *              and background loading (frames 11-50). Implements event emitter pattern for
 *              "frames-ready", "progress", and "error" events.
 */
class FramePreloader {
  /**
   * Creates a FramePreloader instance
   * 
   * @param {Object} config - Configuration object
   * @param {number} config.frameCount - Total number of frames to load (default: 50)
   * @param {string} config.frameBasePath - Base path for frame images (default: "./assets/frames/")
   * @param {number} config.priorityFrames - Number of priority frames to load first (default: 10)
   */
  constructor(config = {}) {
    // Configuration
    this.frameCount = config.frameCount || 50;
    this.frameBasePath = config.frameBasePath || "./assets/frames/";
    this.priorityFrames = config.priorityFrames || 10;
    
    // Frame cache - Map<frameIndex, Image>
    this.frameCache = new Map();
    
    // Loaded frames tracking - Set<frameIndex>
    this.loadedFrames = new Set();
    
    // Event emitter - Map<eventName, Set<callback>>
    this.eventListeners = new Map();
    this.eventListeners.set("frames-ready", new Set());
    this.eventListeners.set("progress", new Set());
    this.eventListeners.set("error", new Set());
  }
  
  /**
   * Event emitter: Register event listener
   * 
   * @param {string} event - Event name ("frames-ready", "progress", "error")
   * @param {Function} callback - Callback function to execute when event fires
   */
  on(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).add(callback);
    } else {
    }
  }
  
  /**
   * Event emitter: Remove event listener
   * 
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
    }
  }
  
  /**
   * Event emitter: Emit event to all registered listeners
   * 
   * @param {string} event - Event name
   * @param {*} data - Data to pass to event listeners
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
        }
      });
    }
  }
  
  /**
   * Get frame path with zero-padded index
   * Uses WebP format for better compression and quality
   * Automatically selects mobile or desktop frames based on device
   * 
   * @param {number} index - Frame index (1-250)
   * @returns {string} Full path to frame image (WebP)
   */
  getFramePath(index) {
    const paddedIndex = String(index).padStart(3, '0');
    const isMobile = this._isMobileDevice();
    const basePath = isMobile ? './assets/frames-mobile/' : this.frameBasePath;
    return `${basePath}ezgif-frame-${paddedIndex}.webp`;
  }
  
  /**
   * Detect if user is on a mobile device
   * 
   * @private
   * @returns {boolean} True if mobile device
   */
  _isMobileDevice() {
    // Check if we've already determined device type
    if (this._isMobile !== undefined) {
      return this._isMobile;
    }
    
    // Check viewport width (mobile if <= 768px)
    const isMobileWidth = window.innerWidth <= 768;
    
    // Check user agent for mobile devices
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Device is mobile if any of these conditions are true
    this._isMobile = isMobileWidth || (isMobileUA && hasTouch);
    
    
    return this._isMobile;
  }
  
  /**
   * Load all frames sequentially
   * Simple approach: load all 250 frames before showing page
   * 
   * @async
   * @returns {Promise<void>} Resolves when all frames are loaded
   * @throws {Error} If frame loading fails
   */
  async loadAllFrames() {
    for (let i = 1; i <= this.frameCount; i++) {
      try {
        await this._loadSingleFrame(i);
      } catch (error) {
        this.emit("error", { frameIndex: i, error: error.message });
        throw error;
      }
    }
    
    this.emit("frames-ready", { 
      totalFrames: this.frameCount,
      loadProgress: this.getLoadProgress()
    });
  }
  
  /**
   * Load a single frame with retry logic
   * 
   * @private
   * @async
   * @param {number} frameIndex - Frame index to load
   * @returns {Promise<Image>} Loaded and decoded image
   * @throws {Error} If frame loading fails after retries
   */
  async _loadSingleFrame(frameIndex) {
    const img = new Image();
    const framePath = this.getFramePath(frameIndex);
    
    // Create promise that resolves when image loads and decodes
    await new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          // Use img.decode() to ensure frame is fully decoded and ready
          await img.decode();
          
          // Cache the loaded frame
          this.frameCache.set(frameIndex, img);
          this.loadedFrames.add(frameIndex);
          
          // Emit progress event
          this.emit("progress", this.getLoadProgress());
          
          resolve(img);
        } catch (decodeError) {
          reject(new Error(`Failed to decode frame ${frameIndex}: ${decodeError.message}`));
        }
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load frame ${frameIndex} from ${framePath}`));
      };
      
      // Start loading the image
      img.src = framePath;
    });
    
    return img;
  }
  
  /**
   * Load remaining frames with sequential strategy for smooth animations
   * MOBILE-OPTIMIZED SEQUENTIAL LOADING:
   * - Phase 3: Frames 11-125 (first transition path - load sequentially)
   * - Phase 4: Frames 126-250 (second transition path - load sequentially)
   * 
   * This ensures smooth frame-by-frame animation between snap points
   * 
   * @param {number} maxConcurrent - Maximum number of concurrent frame loads (default: 8)
   */
  
  /**
   * Unload frames - disabled in simple mode
   */
  unloadDistantFrames(currentFrame, keepRange = 30) {
    // Disabled - keep all frames in memory
    return;
  }
  
  /**
   * Get frame by index with fallback logic
   * Returns the cached Image object if the frame is loaded.
   * If the requested frame is not available, returns the most recently loaded frame.
   * 
   * @param {number} index - Frame index (1-50)
   * @returns {Image|null} Cached Image object or most recent frame, null if no frames loaded
   */
  getFrame(index) {
    // If requested frame is loaded, return it
    if (this.frameCache.has(index)) {
      return this.frameCache.get(index);
    }
    
    // Fallback: return most recently loaded frame
    // Find the highest frame index that is loaded and <= requested index
    let fallbackIndex = null;
    
    // First try to find the most recent frame before or at the requested index
    for (let i = index; i >= 1; i--) {
      if (this.frameCache.has(i)) {
        fallbackIndex = i;
        break;
      }
    }
    
    // If no frame found before requested index, find the first loaded frame after it
    if (fallbackIndex === null) {
      for (let i = index + 1; i <= this.frameCount; i++) {
        if (this.frameCache.has(i)) {
          fallbackIndex = i;
          break;
        }
      }
    }
    
    // Return the fallback frame or null if no frames are loaded
    return fallbackIndex !== null ? this.frameCache.get(fallbackIndex) : null;
  }
  
  /**
   * Get current load progress
   * 
   * @returns {Object} Progress object with loaded, total, and percentage
   */
  getLoadProgress() {
    const loaded = this.loadedFrames.size;
    const total = this.frameCount;
    const percentage = Math.round((loaded / total) * 100);
    
    return { loaded, total, percentage };
  }
}


/**
 * FrameAnimationSystem Class
 * Manages scroll-driven frame animation display using GSAP ScrollTrigger
 * 
 * @class FrameAnimationSystem
 * @description Displays the correct frame based on scroll position and manages the animation hero section.
 *              Works with FramePreloader to display cached frames based on scroll progress.
 *              Uses GSAP ScrollTrigger for scroll tracking and pinning.
 *              Supports snap scrolling with configurable scroll steps and alternating text overlays.
 */
class FrameAnimationSystem {
  /**
   * Creates a FrameAnimationSystem instance
   * 
   * @param {Object} config - Configuration object
   * @param {number} config.frameCount - Total number of frames in the animation (default: 50)
   * @param {string} config.scrollDistance - Scroll distance for animation (e.g., "300vh" for desktop, "200vh" for mobile)
   * @param {HTMLElement} config.container - Container element for the animation hero section
   * @param {string} config.frameBasePath - Base path for frame images (default: "./assets/frames/")
   * @param {Object} config.snapScroll - Snap scroll configuration (optional)
   * @param {boolean} config.snapScroll.enabled - Enable snap scrolling (default: false)
   * @param {string} config.snapScroll.mode - 'auto' or 'manual' (default: 'auto')
   * @param {number} config.snapScroll.maxScrollSteps - Number of scroll steps for auto mode (default: 5)
   * @param {number[]} config.snapScroll.frameStops - Array of frame indices for manual mode (e.g., [1, 12, 25, 38, 50])
   * @param {Array} config.snapScroll.texts - Array of text objects with {content, side} (side: 'left' or 'right')
   */
  constructor(config = {}) {
    // Validate required configuration
    if (!config.container) {
      throw new Error('FrameAnimationSystem requires a container element');
    }
    
    // Configuration
    this.frameCount = config.frameCount || 50;
    this.scrollDistance = config.scrollDistance || "300vh";
    this.frameBasePath = config.frameBasePath || "./assets/frames/";
    
    // Snap scroll configuration
    this.snapScroll = {
      enabled: config.snapScroll?.enabled || false,
      mode: config.snapScroll?.mode || 'auto',
      maxScrollSteps: config.snapScroll?.maxScrollSteps || 5,
      frameStops: config.snapScroll?.frameStops || [],
      texts: config.snapScroll?.texts || []
    };
    
    // Discrete scroll configuration (one frame per scroll)
    this.discreteScroll = config.discreteScroll?.enabled || false;
    
    // Calculate frame stops based on mode
    this.frameStops = this._calculateFrameStops();
    
    // Store reference to container element
    this.container = config.container;
    
    // Find or create image element within container
    this.imageElement = this.container.querySelector('img');
    if (!this.imageElement) {
      // Create image element if it doesn't exist
      this.imageElement = document.createElement('img');
      this.imageElement.alt = 'Barber animation frame';
      this.imageElement.style.width = '100%';
      this.imageElement.style.height = '100%';
      this.imageElement.style.objectFit = 'cover';
      this.container.appendChild(this.imageElement);
    }
    
    // Initialize frame state tracking
    this.currentFrame = 1;
    this.lastFrameIndex = 1;
    this.currentScrollStep = 0;
    
    // ScrollTrigger instance reference for cleanup
    this.scrollTrigger = null;
    
    // Reference to FramePreloader (will be set during init)
    this.preloader = null;
    
    // Text overlay elements
    this.textOverlays = [];
    
    // Create text overlays if texts are configured
    if (this.snapScroll.texts && this.snapScroll.texts.length > 0) {
      this._createTextOverlays();
    }
    
  }
  
  /**
   * Calculate frame stops based on mode (auto or manual)
   * 
   * @private
   * @returns {number[]} Array of frame indices where scrolling stops
   */
  _calculateFrameStops() {
    if (!this.snapScroll.enabled) {
      return [];
    }
    
    if (this.snapScroll.mode === 'manual') {
      // Use manually specified frame stops
      return [...this.snapScroll.frameStops].sort((a, b) => a - b);
    } else {
      // Auto mode: divide frames evenly by maxScrollSteps
      const steps = this.snapScroll.maxScrollSteps;
      const frameStops = [];
      
      for (let i = 0; i < steps; i++) {
        const frameIndex = Math.round((i / (steps - 1)) * (this.frameCount - 1)) + 1;
        frameStops.push(frameIndex);
      }
      
      return frameStops;
    }
  }
  
  /**
   * Create text overlay elements for snap scroll
   * 
   * @private
   */
  _createTextOverlays() {
    // Create container for text overlays
    const textContainer = document.createElement('div');
    textContainer.className = 'frame-text-overlays';
    this.container.appendChild(textContainer);
    
    // Create text elements for each scroll step
    this.snapScroll.texts.forEach((textConfig, index) => {
      const textElement = document.createElement('div');
      textElement.className = `frame-text frame-text-${index}`;
      
      // Determine side (left, right, or center)
      const side = textConfig.side || (index % 2 === 0 ? 'left' : 'right');
      
      // Determine vertical position (top, center, bottom)
      const isMobile = window.innerWidth <= 768;
      const position = (isMobile && textConfig.mobilePosition) ? 
                       textConfig.mobilePosition : 
                       (textConfig.position || 'center');
      
      // Set data attributes for CSS styling
      textElement.setAttribute('data-side', side);
      textElement.setAttribute('data-position', position);
      
      textElement.textContent = textConfig.content || '';
      textContainer.appendChild(textElement);
      
      this.textOverlays.push({
        element: textElement,
        side: side,
        position: position,
        index: index
      });
    });
  }
  
  /**
   * Show text overlay for current scroll step
   * 
   * @private
   * @param {number} stepIndex - Index of the scroll step
   */
  _showTextOverlay(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.textOverlays.length) {
      return;
    }
    
    const overlay = this.textOverlays[stepIndex];
    overlay.element.classList.add('active');
  }
  
  /**
   * Hide text overlay
   * 
   * @private
   * @param {number} stepIndex - Index of the scroll step
   */
  _hideTextOverlay(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.textOverlays.length) {
      return;
    }
    
    const overlay = this.textOverlays[stepIndex];
    overlay.element.classList.remove('active');
  }
  
  /**
   * Hide all text overlays
   * 
   * @private
   */
  _hideAllTextOverlays() {
    this.textOverlays.forEach((overlay) => {
      overlay.element.classList.remove('active');
    });
  }
  
  /**
   * Calculate frame index from scroll progress
   * Formula: floor(scrollProgress × (frameCount - 1)) + 1 (for smooth mode)
   * For snap mode: returns the frame at the current scroll step
   * 
   * @param {number} scrollProgress - Scroll progress value (0 to 1)
   * @returns {number} Frame index (1 to frameCount)
   */
  calculateFrameIndex(scrollProgress) {
    // Clamp scroll progress to 0-1 range
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    
    if (this.snapScroll.enabled) {
      // Snap mode: find which scroll step we're in
      const stepIndex = Math.round(clampedProgress * (this.frameStops.length - 1));
      return this.frameStops[stepIndex];
    } else {
      // Smooth mode: calculate frame index: floor(scrollProgress × (frameCount - 1)) + 1
      const frameIndex = Math.floor(clampedProgress * (this.frameCount - 1)) + 1;
      
      // Ensure result is clamped between 1 and frameCount
      return Math.max(1, Math.min(this.frameCount, frameIndex));
    }
  }
  
  /**
   * Get current scroll step index from scroll progress
   * 
   * @param {number} scrollProgress - Scroll progress value (0 to 1)
   * @returns {number} Scroll step index
   */
  getScrollStepIndex(scrollProgress) {
    if (!this.snapScroll.enabled) {
      return 0;
    }
    
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    return Math.round(clampedProgress * (this.frameStops.length - 1));
  }
  
  /**
   * Update frame display in DOM
   * Gets frame from preloader cache and updates image element with GPU-accelerated transforms
   * 
   * @param {number} frameIndex - Frame index to display (1 to 50)
   */
  updateFrame(frameIndex) {
    // Skip update if frame hasn't changed
    if (frameIndex === this.currentFrame) {
      return;
    }
    
    // Get frame from preloader
    if (!this.preloader) {
      return;
    }
    
    const frame = this.preloader.getFrame(frameIndex);
    
    if (!frame) {
      return;
    }
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      // Update image src with GPU-accelerated CSS transforms
      this.imageElement.src = frame.src;
      
      // Update alt text for accessibility (Task 15)
      this.imageElement.alt = `Animation de barbier - Image ${frameIndex} sur ${this.frameCount}`;
      
      // Apply GPU acceleration hints
      this.imageElement.style.transform = 'translateZ(0)';
      this.imageElement.style.willChange = 'transform';
      
      // Update current frame tracking
      this.currentFrame = frameIndex;
      this.lastFrameIndex = frameIndex;
      
      // Memory management: Unload distant frames on mobile
      if (this.preloader._isMobileDevice()) {
        // Throttle memory management (only every 10 frames)
        if (frameIndex % 10 === 0) {
          this.preloader.unloadDistantFrames(frameIndex, 30);
        }
      }
    });
  }
  
  /**
   * Initialize GSAP ScrollTrigger integration or discrete scroll mode
   * Sets up scroll-linked animation with proper configuration
   * Supports smooth scrolling, snap scrolling, and discrete frame-by-frame scrolling
   * 
   * @param {FramePreloader} preloader - FramePreloader instance to get frames from
   */
  init(preloader) {
    // Store preloader reference
    this.preloader = preloader;
    
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return false;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Display initial frame
    this.updateFrame(1);
    
    // Initialize based on scroll mode
    if (this.discreteScroll) {
      // Discrete scroll mode: one frame per scroll event
      this._initDiscreteScroll();
    } else {
      // ScrollTrigger mode: smooth or snap scrolling
      this._initScrollTrigger();
    }
    
    // Show first text overlay if snap scroll is enabled
    if (this.snapScroll.enabled && this.textOverlays.length > 0) {
      this._showTextOverlay(0);
    }
    
    
    return true;
  }
  
  /**
   * Initialize discrete scroll mode (one frame per scroll)
   * Modified to work with fixed background - scrolls through page content
   * 
   * @private
   */
  _initDiscreteScroll() {
    let scrollTimeout;
    let isScrolling = false;
    let isAnimating = false;
    
    // Use snap scroll frame stops if enabled, otherwise use all frames
    const frameStops = this.snapScroll.enabled ? this.frameStops : 
                       Array.from({length: this.frameCount}, (_, i) => i + 1);
    
    // Find current step index
    let currentStepIndex = 0;
    
    // Track scroll progress through the animation
    const animationScrollHeight = frameStops.length * 100; // 100vh per frame stop
    
    // Create ScrollTrigger to track scroll progress and update frames
    const scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: `+=${animationScrollHeight}vh`,
      onUpdate: (self) => {
        // Calculate which frame to show based on scroll progress
        const progress = self.progress;
        const stepIndex = Math.round(progress * (frameStops.length - 1));
        
        if (stepIndex !== currentStepIndex) {
          currentStepIndex = stepIndex;
          const targetFrame = frameStops[currentStepIndex];
          this.updateFrame(targetFrame);
          
          // Update text overlays
          if (this.snapScroll.enabled && this.textOverlays.length > 0) {
            this._hideAllTextOverlays();
            if (currentStepIndex < this.textOverlays.length) {
              this._showTextOverlay(currentStepIndex);
            }
          }
        }
      }
    });
    
    // Show first text overlay if snap scroll is enabled
    if (this.snapScroll.enabled && this.textOverlays.length > 0) {
      this._showTextOverlay(0);
    }
    
    // Store reference for cleanup
    this._scrollTrigger = scrollTrigger;
  }
  
  /**
   * Initialize ScrollTrigger mode (smooth or snap scrolling)
   * Modified to work with fixed background - tracks spacer element scroll
   * 
   * @private
   */
  _initScrollTrigger() {
    // Find the spacer element that controls the scroll distance
    const spacer = document.querySelector('.animation-scroll-spacer');
    if (!spacer) {
      console.error('Animation scroll spacer not found');
      return;
    }
    
    // Track which text overlays are currently visible
    const textVisibility = new Array(this.textOverlays.length).fill(false);
    
    // Configure ScrollTrigger to track spacer scroll and update frames
    const scrollTriggerConfig = {
      trigger: spacer,
      start: 'top top',
      end: 'bottom top',
      scrub: true, // Smooth scrubbing
      onUpdate: (self) => {
        // Calculate frame index from scroll progress
        const frameIndex = this.calculateFrameIndex(self.progress);
        
        // Update frame display
        this.updateFrame(frameIndex);
        
        // Handle text overlays based on scroll progress (not snap points)
        if (this.textOverlays.length > 0) {
          this.textOverlays.forEach((overlay, index) => {
            const textConfig = this.snapScroll.texts[index];
            const showAtProgress = textConfig.showAtProgress || (index / Math.max(1, this.textOverlays.length - 1));
            const hideAtProgress = showAtProgress + 0.2; // Show for 20% of scroll
            
            const shouldShow = self.progress >= showAtProgress && self.progress < hideAtProgress;
            
            if (shouldShow && !textVisibility[index]) {
              this._showTextOverlay(index);
              textVisibility[index] = true;
            } else if (!shouldShow && textVisibility[index]) {
              this._hideTextOverlay(index);
              textVisibility[index] = false;
            }
          });
        }
      }
    };
    
    // Set up ScrollTrigger
    this.scrollTrigger = ScrollTrigger.create(scrollTriggerConfig);
  }
  
  /**
   * Get responsive scroll distance based on viewport width
   * Desktop (≥768px): 300vh
   * Mobile (<768px): 200vh
   * 
   * @returns {string} Scroll distance (e.g., "300vh" or "200vh")
   */
  getResponsiveScrollDistance() {
    const isMobile = window.innerWidth < 768;
    return isMobile ? "200vh" : "300vh";
  }
  
  /**
   * Handle window resize events
   * Updates scroll distance and refreshes ScrollTrigger
   */
  handleResize() {
    if (!this.scrollTrigger) {
      return;
    }
    
    // Update scroll distance based on new viewport
    const newScrollDistance = this.getResponsiveScrollDistance();
    
    // Update ScrollTrigger end value
    this.scrollTrigger.vars.end = `+=${newScrollDistance}`;
    
    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh();
    
  }
  
  /**
   * Cleanup and destroy method
   * Removes ScrollTrigger instances and event listeners
   */
  destroy() {
    // Kill ScrollTrigger instance
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    
    // Kill pin trigger for discrete scroll
    if (this._pinTrigger) {
      this._pinTrigger.kill();
      this._pinTrigger = null;
    }
    
    // Remove wheel event listener for discrete scroll
    if (this._wheelHandler) {
      this.container.removeEventListener('wheel', this._wheelHandler);
      this._wheelHandler = null;
    }
    
    // Clear frame references
    this.preloader = null;
    this.currentFrame = 1;
    this.lastFrameIndex = 1;
    
    // Remove will-change hint
    if (this.imageElement) {
      this.imageElement.style.willChange = 'auto';
    }
    
  }
  
  /**
   * Get current frame index
   * 
   * @returns {number} Current frame index
   */
  getCurrentFrame() {
    return this.currentFrame;
  }
}


/**
 * ===================================
 * MAIN INITIALIZATION AND INTEGRATION
 * ===================================
 */

// Global references
let framePreloader = null;
let frameAnimationSystem = null;

/**
 * Check for reduced motion preference
 * If user prefers reduced motion, display static frame instead of animation
 */
function checkReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    displayStaticFrame();
    return true;
  }
  return false;
}

/**
 * Display static fallback frame (frame 25)
 * Used for reduced motion preference or when animations fail
 */
function displayStaticFrame() {
  const loadingIndicator = document.querySelector('.loading-indicator');
  const animationFrame = document.getElementById('animation-frame');
  
  if (animationFrame) {
    // Use mobile or desktop frame based on device
    const isMobile = window.innerWidth <= 768;
    const framePath = isMobile ? 
      './assets/frames-mobile/ezgif-frame-025.webp' : 
      './assets/frames/ezgif-frame-025.webp';
    
    animationFrame.src = framePath;
    animationFrame.alt = 'Hermanos Barber - Image statique';
  }
  
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
  
  // Initialize content section animations only
  initializeContentSections();
}

/**
 * Initialize frame animation system
 * Task 7: Loading indicator and initialization flow
 */
async function initializeFrameAnimation() {
  try {
    // Check for GSAP and ScrollTrigger availability
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      displayStaticFrame();
      return false;
    }
    
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Create FramePreloader instance
    framePreloader = new FramePreloader({
      frameCount: 250,
      frameBasePath: './assets/frames/',
      priorityFrames: 10
    });
    
    // Listen to progress events
    framePreloader.on('progress', (progress) => {
    });
    
    // Listen to frames-ready event
    framePreloader.on('frames-ready', () => {
    });
    
    // Listen to error events
    framePreloader.on('error', (error) => {
    });
    
    // Load ALL frames before showing page
    await framePreloader.loadAllFrames();
    
    // Hide loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
    
    // Initialize FrameAnimationSystem with fixed background
    const container = document.querySelector('.animation-background-fixed');
    if (!container) {
      return false;
    }
    
    frameAnimationSystem = new FrameAnimationSystem({
      frameCount: 250,
      scrollDistance: '300vh',
      container: container,
      frameBasePath: './assets/frames/',
      // Disable discrete scroll mode for smooth scrolling
      discreteScroll: {
        enabled: false
      },
      // Use configuration from animation-config.js
      snapScroll: ANIMATION_CONFIG.snapScroll
    });
    
    // Initialize with preloader
    const initSuccess = frameAnimationSystem.init(framePreloader);
    
    if (!initSuccess) {
      displayStaticFrame();
      return false;
    }
    
    
    // Store reference globally for debugging
    window.frameAnimationSystem = frameAnimationSystem;
    window.framePreloader = framePreloader;
    
    return true;
    
  } catch (error) {
    displayStaticFrame();
    return false;
  }
}

/**
 * Task 8: Navigation functionality
 * - Scroll event listener for navigation scroll effect
 * - Smooth scroll for navigation links
 */
function setupNavigation() {
  // Navigation scroll effect - add "scrolled" class at 100px
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
}

/**
 * Task 10: Content section animations using GSAP
 * Preserve animation patterns from original HermanosBarber/script.js
 */
function initializeContentSections() {
  // Video overlay animations (removed pinning for smoother scroll)
  document.querySelectorAll('.video-section .video-overlay').forEach((overlay) => {
    gsap.from(overlay.children, {
      scrollTrigger: {
        trigger: overlay,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1
      },
      opacity: 0,
      y: 100,
      stagger: 0.2
    });
  });

  // About section animations
  gsap.from('.about-image', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%',
      end: 'top 30%',
      scrub: 1
    },
    x: -100,
    opacity: 0
  });

  gsap.from('.about-content > *', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%',
      end: 'top 30%',
      scrub: 1
    },
    x: 100,
    opacity: 0,
    stagger: 0.1
  });

  // About image border animation
  gsap.to('.about-image-border', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 1
    },
    rotation: 5,
    x: 10,
    y: 10
  });

  // Gallery horizontal scroll
  const gallery = document.querySelector('.gallery-section');
  const galleryTrack = document.querySelector('.gallery-track');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryTrack && galleryItems.length > 0) {
    const totalWidth = galleryItems[0].offsetWidth * galleryItems.length + 
                      (32 * (galleryItems.length - 1)); // 32px = 2rem gap
    const scrollWidth = totalWidth - window.innerWidth;

    gsap.to(galleryTrack, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: gallery,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Gallery items stagger animation
    galleryItems.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: gallery,
          start: 'top center',
          end: 'center center',
          scrub: 1
        },
        opacity: 0,
        scale: 0.8,
        rotation: -5,
        stagger: 0.1
      });
    });
  }

  // Services cards animation - TEMPORARILY DISABLED FOR DEBUGGING
  // const serviceCards = document.querySelectorAll('.service-card');
  // if (serviceCards.length > 0) {
  //   gsap.from('.service-card', {
  //     scrollTrigger: {
  //       trigger: '.services-section',
  //       start: 'top 70%',
  //       end: 'top 30%',
  //       scrub: 1
  //     },
  //     y: 100,
  //     opacity: 0,
  //     stagger: 0.2,
  //     rotation: -5
  //   });
  // }

  // Services section title
  gsap.from('.services-section .section-title', {
    scrollTrigger: {
      trigger: '.services-section',
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    scale: 0.5,
    opacity: 0
  });

  // Contact section animations
  gsap.from('.contact-content', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 70%',
      end: 'top 30%',
      scrub: 1
    },
    x: -100,
    opacity: 0
  });

  gsap.from('.contact-map', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 70%',
      end: 'top 30%',
      scrub: 1
    },
    x: 100,
    opacity: 0
  });

  gsap.from('.contact-item', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 60%',
      end: 'top 30%',
      scrub: 1
    },
    y: 50,
    opacity: 0,
    stagger: 0.1
  });

  // Video scale animation on scroll
  document.querySelectorAll('.video-bg').forEach(video => {
    gsap.to(video, {
      scrollTrigger: {
        trigger: video.closest('.video-section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      scale: 1.2
    });
  });

  // Footer fade in
  gsap.from('.footer', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top bottom',
      end: 'top 80%',
      scrub: 1
    },
    opacity: 0,
    y: 50
  });
  
}

/**
 * Task 11: Responsive behavior and mobile optimizations
 * Task 13: Performance optimizations
 */
function setupResponsiveAndPerformance() {
  // Performance optimization: Configure ScrollTrigger for mobile
  if (window.innerWidth < 768) {
    ScrollTrigger.config({ 
      limitCallbacks: true,
      syncInterval: 150 
    });
  }
  
  // Auto-play videos when in viewport
  const videos = document.querySelectorAll('video');
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 });

  videos.forEach(video => {
    videoObserver.observe(video);
  });
  
}

/**
 * Task 12: Error handling and window resize
 */
function setupErrorHandlingAndResize() {
  // Window resize handler with debouncing
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Refresh frame animation system if it exists
      if (frameAnimationSystem) {
        frameAnimationSystem.handleResize();
      }
      
      // Refresh all ScrollTrigger instances
      ScrollTrigger.refresh();
      
    }, 250);
  });
  
}

/**
 * Main initialization function
 * Task 17: Final integration and polish
 */
/**
 * Register service worker for caching
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
      await navigator.serviceWorker.ready;
    } catch (error) {
      // Continue without service worker
    }
  }
}

/**
 * Main initialization function
 */
async function initializeApp() {
  
  // Force scroll to top on page load/refresh
  window.scrollTo(0, 0);
  
  // Also use history API to prevent browser from restoring scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Register service worker first
  registerServiceWorker();
  
  // Check for reduced motion preference
  if (checkReducedMotion()) {
    return;
  }
  
  // Task 7: Initialize frame animation with loading indicator
  const animationInitialized = await initializeFrameAnimation();
  
  // Task 8: Setup navigation functionality
  setupNavigation();
  
  // Task 10: Initialize content section animations
  if (animationInitialized) {
    initializeContentSections();
  }
  
  // Task 11 & 13: Setup responsive behavior and performance optimizations
  setupResponsiveAndPerformance();
  
  // Task 12: Setup error handling and resize listeners
  setupErrorHandlingAndResize();
  
}

// Initialize on DOMContentLoaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeApp);
}
