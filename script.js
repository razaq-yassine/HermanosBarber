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
      console.warn(`Unknown event type: ${event}`);
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
          console.error(`Error in ${event} event listener:`, error);
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
    
    console.log(`Device detection: ${this._isMobile ? 'Mobile' : 'Desktop'} (width: ${window.innerWidth}px)`);
    
    return this._isMobile;
  }
  
  /**
   * Load priority frames with snap-point priority
   * MOBILE-OPTIMIZED LOADING STRATEGY:
   * - Phase 1: Snap frames (1, 125, 250) - CRITICAL for instant interactivity
   * - Phase 2: Priority frames (2-10) - Show page quickly
   * - Phase 3: Remaining frames in sections
   * 
   * @async
   * @returns {Promise<void>} Resolves when snap point frames are loaded
   * @throws {Error} If snap point frame loading fails
   */
  async loadPriorityFrames() {
    // Phase 1: Load snap point frames FIRST (critical for mobile)
    const snapFrames = [1, 125, 250];
    console.log(`🎬 Phase 1: Loading snap point frames (1, 125, 250)...`);
    
    for (const frameIndex of snapFrames) {
      try {
        await this._loadSingleFrame(frameIndex);
      } catch (error) {
        console.error(`Failed to load snap frame ${frameIndex}:`, error);
        this.emit("error", { frameIndex, error: error.message });
        throw error; // Critical frames must load
      }
    }
    
    console.log(`✅ Phase 1 complete: Snap point frames loaded (${snapFrames.length} frames)`);
    
    // Phase 2: Load remaining priority frames (2-10, excluding 1 which is already loaded)
    const priorityCount = Math.min(this.priorityFrames, this.frameCount);
    console.log(`🎬 Phase 2: Loading priority frames 2-${priorityCount}...`);
    
    for (let i = 2; i <= priorityCount; i++) {
      if (snapFrames.includes(i)) continue; // Skip already loaded snap frames
      
      try {
        await this._loadSingleFrame(i);
      } catch (error) {
        console.error(`Error loading priority frame ${i}:`, error);
        this.emit("error", { frameIndex: i, error: error.message });
        // Don't throw - non-critical frames can fail
      }
    }
    
    console.log(`✅ Phase 2 complete: Priority frames 2-${priorityCount} loaded`);
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
   * Load remaining frames with progressive strategy and memory management
   * PROGRESSIVE LOADING PHASES:
   * - Phase 3: Frames 11-124 (first scroll section - skip 125, already loaded)
   * - Phase 4: Frames 126-249 (middle section - skip 250, already loaded)
   * 
   * MEMORY MANAGEMENT:
   * - Keeps only nearby frames in memory (±30 frames from current position)
   * - Unloads distant frames to prevent mobile memory issues
   * 
   * @param {number} maxConcurrent - Maximum number of concurrent frame loads (default: 8)
   */
  loadRemainingFrames(maxConcurrent = 8) {
    console.log(`🎬 Starting progressive background loading...`);
    
    // Phase 3: Load frames 11-124 (first scroll section, skip snap frames)
    const phase3Frames = [];
    for (let i = this.priorityFrames + 1; i <= 124; i++) {
      if (![1, 125, 250].includes(i)) { // Skip snap frames
        phase3Frames.push(i);
      }
    }
    
    // Phase 4: Load frames 126-249 (middle section, skip snap frames)
    const phase4Frames = [];
    for (let i = 126; i <= 249; i++) {
      if (![1, 125, 250].includes(i)) { // Skip snap frames
        phase4Frames.push(i);
      }
    }
    
    // Start Phase 3 immediately
    this._loadPhase(3, phase3Frames, maxConcurrent, () => {
      console.log(`✅ Phase 3 complete: First scroll section (frames 11-124) loaded`);
      
      // Start Phase 4 after Phase 3
      this._loadPhase(4, phase4Frames, maxConcurrent, () => {
        console.log(`✅ Phase 4 complete: All frames loaded!`);
      });
    });
  }
  
  /**
   * Unload frames that are far from current position (memory management)
   * Keeps only frames within ±30 of current frame
   * 
   * @param {number} currentFrame - Current frame being displayed
   * @param {number} keepRange - Number of frames to keep on each side (default: 30)
   */
  unloadDistantFrames(currentFrame, keepRange = 30) {
    const framesToKeep = new Set();
    
    // Always keep snap frames
    framesToKeep.add(1);
    framesToKeep.add(125);
    framesToKeep.add(250);
    
    // Keep frames near current position
    for (let i = Math.max(1, currentFrame - keepRange); i <= Math.min(this.frameCount, currentFrame + keepRange); i++) {
      framesToKeep.add(i);
    }
    
    // Unload frames not in keep set
    let unloadedCount = 0;
    for (const [frameIndex, img] of this.frameCache.entries()) {
      if (!framesToKeep.has(frameIndex)) {
        // Clear image src to free memory
        img.src = '';
        this.frameCache.delete(frameIndex);
        this.loadedFrames.delete(frameIndex);
        unloadedCount++;
      }
    }
    
    if (unloadedCount > 0) {
      console.log(`🗑️ Memory management: Unloaded ${unloadedCount} distant frames (keeping ${framesToKeep.size} frames)`);
    }
  }
  
  /**
   * Load a specific phase of frames
   * 
   * @private
   * @param {number} phaseNumber - Phase number for logging
   * @param {number[]} frameIndices - Array of frame indices to load
   * @param {number} maxConcurrent - Maximum number of concurrent loads
   * @param {Function} onComplete - Callback when phase completes
   */
  _loadPhase(phaseNumber, frameIndices, maxConcurrent, onComplete) {
    if (frameIndices.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    
    console.log(`🎬 Phase ${phaseNumber}: Loading ${frameIndices.length} frames with max ${maxConcurrent} concurrent requests`);
    
    // Load frames with concurrency control
    this._loadFramesWithConcurrency(frameIndices, maxConcurrent, onComplete);
  }
  
  /**
   * Load frames with concurrency control
   * Internal method that manages parallel loading with a maximum concurrent limit
   * 
   * @private
   * @param {number[]} frameIndices - Array of frame indices to load
   * @param {number} maxConcurrent - Maximum number of concurrent loads
   * @param {Function} onComplete - Optional callback when all frames in this batch are loaded
   */
  async _loadFramesWithConcurrency(frameIndices, maxConcurrent, onComplete) {
    let currentIndex = 0;
    let activeLoads = 0;
    let completedLoads = 0;
    const totalFrames = frameIndices.length;
    
    // Function to load a single frame with retry logic
    const loadSingleFrame = async (frameIndex) => {
      activeLoads++;
      
      try {
        await this._loadFrameWithRetry(frameIndex);
        completedLoads++;
        
        // Emit progress event
        this.emit("progress", this.getLoadProgress());
        
        // Check if this batch is complete
        if (completedLoads === totalFrames) {
          if (onComplete) onComplete();
        }
        
        // Check if all frames are loaded
        if (this.loadedFrames.size === this.frameCount) {
          console.log('🎉 All 250 frames loaded successfully!');
          this.emit("frames-ready", { 
            totalFrames: this.frameCount,
            loadProgress: this.getLoadProgress()
          });
        }
        
      } catch (error) {
        console.error(`Failed to load frame ${frameIndex} after retries:`, error);
        this.emit("error", { frameIndex, error: error.message });
        completedLoads++;
        
        // Check if this batch is complete even with errors
        if (completedLoads === totalFrames) {
          if (onComplete) onComplete();
        }
      } finally {
        activeLoads--;
        
        // Start next frame load if available
        if (currentIndex < frameIndices.length) {
          const nextFrameIndex = frameIndices[currentIndex];
          currentIndex++;
          loadSingleFrame(nextFrameIndex);
        }
      }
    };
    
    // Start initial batch of concurrent loads
    const initialBatchSize = Math.min(maxConcurrent, frameIndices.length);
    for (let i = 0; i < initialBatchSize; i++) {
      const frameIndex = frameIndices[currentIndex];
      currentIndex++;
      loadSingleFrame(frameIndex);
    }
  }
  
  /**
   * Load a single frame with retry logic (up to 3 attempts)
   * 
   * @private
   * @async
   * @param {number} frameIndex - Frame index to load
   * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
   * @returns {Promise<Image>} Loaded and decoded image
   * @throws {Error} If all retry attempts fail
   */
  async _loadFrameWithRetry(frameIndex, maxRetries = 3) {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
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
        
        // Success - return the loaded image
        return img;
        
      } catch (error) {
        retries++;
        
        if (retries < maxRetries) {
          console.warn(`Failed to load frame ${frameIndex}, retry ${retries}/${maxRetries}:`, error.message);
          // Wait 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          // All retries exhausted
          throw new Error(`Failed to load frame ${frameIndex} after ${maxRetries} attempts: ${error.message}`);
        }
      }
    }
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
    
    // Create text overlays if snap scroll is enabled
    if (this.snapScroll.enabled) {
      this._createTextOverlays();
    }
    
    console.log('FrameAnimationSystem initialized:', {
      frameCount: this.frameCount,
      scrollDistance: this.scrollDistance,
      container: this.container,
      imageElement: this.imageElement,
      snapScroll: this.snapScroll,
      frameStops: this.frameStops
    });
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
    textContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    `;
    this.container.appendChild(textContainer);
    
    // Create text elements for each scroll step
    this.snapScroll.texts.forEach((textConfig, index) => {
      const textElement = document.createElement('div');
      textElement.className = `frame-text frame-text-${index}`;
      
      // Determine side (left or right)
      const side = textConfig.side || (index % 2 === 0 ? 'left' : 'right');
      
      // Determine vertical position (top, center, bottom)
      // Check if mobile and use mobilePosition if available
      const isMobile = window.innerWidth <= 768;
      const position = (isMobile && textConfig.mobilePosition) ? 
                       textConfig.mobilePosition : 
                       (textConfig.position || 'center');
      
      let topValue, transformY;
      
      if (position === 'top') {
        topValue = '10%';
        transformY = '0';
      } else if (position === 'bottom') {
        topValue = '90%';
        transformY = '-100%';
      } else {
        topValue = '50%';
        transformY = '-50%';
      }
      
      textElement.style.cssText = `
        position: absolute;
        top: ${topValue};
        ${side}: 5%;
        transform: translateY(${transformY}) translateX(${side === 'left' ? '-100%' : '100%'});
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(2rem, 5vw, 4rem);
        color: #FFD700;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 40%;
        line-height: 1.2;
      `;
      
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
    const position = overlay.position || 'center';
    let transformY;
    
    if (position === 'top') {
      transformY = '0';
    } else if (position === 'bottom') {
      transformY = '-100%';
    } else {
      transformY = '-50%';
    }
    
    overlay.element.style.opacity = '1';
    overlay.element.style.transform = `translateY(${transformY}) translateX(0)`;
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
    const side = overlay.side;
    overlay.element.style.opacity = '0';
    overlay.element.style.transform = `translateY(-50%) translateX(${side === 'left' ? '-100%' : '100%'})`;
  }
  
  /**
   * Hide all text overlays
   * 
   * @private
   */
  _hideAllTextOverlays() {
    this.textOverlays.forEach((_, index) => {
      this._hideTextOverlay(index);
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
      console.warn('Preloader not initialized');
      return;
    }
    
    const frame = this.preloader.getFrame(frameIndex);
    
    if (!frame) {
      console.warn(`Frame ${frameIndex} not available`);
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
      console.error('GSAP or ScrollTrigger not available');
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
    
    console.log('FrameAnimationSystem initialized:', {
      trigger: this.container,
      discreteScroll: this.discreteScroll,
      snapEnabled: this.snapScroll.enabled,
      frameStops: this.frameStops
    });
    
    return true;
  }
  
  /**
   * Initialize discrete scroll mode (one frame per scroll)
   * 
   * @private
   */
  _initDiscreteScroll() {
    let scrollTimeout;
    let isScrolling = false;
    let isAnimating = false;
    let hasReachedLastFrame = false; // Track if we've reached and completed animation to last frame
    let scrollCountAtLastFrame = 0; // Track how many scrolls have occurred at the last frame
    
    // Use snap scroll frame stops if enabled, otherwise use all frames
    const frameStops = this.snapScroll.enabled ? this.frameStops : 
                       Array.from({length: this.frameCount}, (_, i) => i + 1);
    
    // Find current step index
    let currentStepIndex = 0;
    
    // Create a wrapper for better scroll control
    const scrollWrapper = document.createElement('div');
    scrollWrapper.style.height = `${frameStops.length * 100}vh`;
    scrollWrapper.style.position = 'relative';
    
    // Pin the container with better snap configuration
    const pinTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      end: `+=${frameStops.length * 100}vh`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      snap: {
        snapTo: (progress) => {
          // Snap to either 0 (fully in view) or 1 (fully out of view)
          return progress < 0.5 ? 0 : 1;
        },
        duration: { min: 0.2, max: 0.5 },
        delay: 0.1,
        ease: "power2.inOut"
      },
      onEnter: () => {
        console.log('Entered hero section');
        hasReachedLastFrame = false; // Reset when entering
        scrollCountAtLastFrame = 0; // Reset scroll count when entering
      },
      onLeave: () => {
        console.log('Left hero section');
      },
      onEnterBack: () => {
        console.log('Entered back hero section');
        // Reset to last frame when coming back
        currentStepIndex = frameStops.length - 1;
        hasReachedLastFrame = true;
        scrollCountAtLastFrame = 0; // Reset scroll count when re-entering
        this.updateFrame(frameStops[currentStepIndex]);
      },
      onLeaveBack: () => {
        console.log('Left back hero section');
      }
    });
    
    // Animate through frames from current to target
    const animateToFrame = (targetFrame) => {
      if (isAnimating) return;
      
      isAnimating = true;
      const startFrame = this.currentFrame;
      const direction = targetFrame > startFrame ? 1 : -1;
      const framesToAnimate = Math.abs(targetFrame - startFrame);
      
      let currentAnimFrame = startFrame;
      let frameIndex = 0;
      
      // Show text overlay at the START of animation (not at the end)
      if (this.snapScroll.enabled && this.textOverlays.length > 0) {
        this._hideAllTextOverlays();
        if (currentStepIndex < this.textOverlays.length) {
          this._showTextOverlay(currentStepIndex);
        }
      }
      
      const animateNextFrame = () => {
        if (frameIndex >= framesToAnimate) {
          isAnimating = false;
          
          // Check if we've reached the last frame
          if (currentStepIndex === frameStops.length - 1) {
            hasReachedLastFrame = true;
            scrollCountAtLastFrame = 0; // Reset scroll count when first reaching last frame
          } else {
            hasReachedLastFrame = false;
            scrollCountAtLastFrame = 0;
          }
          
          return;
        }
        
        currentAnimFrame += direction;
        this.updateFrame(currentAnimFrame);
        frameIndex++;
        
        // Continue animation (adjust speed here: lower = faster)
        setTimeout(animateNextFrame, 16); // ~60fps
      };
      
      animateNextFrame();
    };
    
    // Handle wheel events for discrete scrolling
    const handleWheel = (e) => {
      // If scrolling up in hero section, ensure we're at the very top (0)
      if (e.deltaY < 0) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If not at the very top (position 0), snap to top first
        if (scrollTop > 5) { // 5px tolerance
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          return;
        }
        
        // Check if we're at the first frame and scrolling up
        if (currentStepIndex === 0) {
          hasReachedLastFrame = false;
          scrollCountAtLastFrame = 0;
          // Allow natural scroll up
          return;
        }
      }
      
      // If at last frame and scrolling down, count the scroll
      if (e.deltaY > 0 && hasReachedLastFrame && currentStepIndex === frameStops.length - 1) {
        scrollCountAtLastFrame++;
        
        // Only allow scroll to next section after the SECOND scroll at last frame
        // First scroll at last frame: scrollCountAtLastFrame becomes 1 (stay in hero)
        // Second scroll at last frame: scrollCountAtLastFrame becomes 2 (allow exit)
        if (scrollCountAtLastFrame >= 2) {
          // Allow natural scroll to next section (don't prevent default)
          return;
        }
        
        // First scroll at last frame - prevent default and stay in hero
        e.preventDefault();
        return;
      }
      
      e.preventDefault();
      
      // Block new scrolls while animating or during scroll cooldown
      if (isScrolling || isAnimating) {
        return;
      }
      
      isScrolling = true;
      
      // Determine scroll direction
      const delta = e.deltaY;
      
      if (delta > 0) {
        // Scrolling down - next frame stop
        const nextStepIndex = Math.min(currentStepIndex + 1, frameStops.length - 1);
        
        // Only animate if we're actually moving to a new step
        if (nextStepIndex !== currentStepIndex) {
          currentStepIndex = nextStepIndex;
          const targetFrame = frameStops[currentStepIndex];
          animateToFrame(targetFrame);
        } else {
          // Already at last frame, reset flag immediately
          isScrolling = false;
        }
      } else if (delta < 0) {
        // Scrolling up - previous frame stop
        hasReachedLastFrame = false; // Reset flag when scrolling up
        scrollCountAtLastFrame = 0; // Reset scroll count when scrolling up
        currentStepIndex = Math.max(currentStepIndex - 1, 0);
        const targetFrame = frameStops[currentStepIndex];
        animateToFrame(targetFrame);
      }
      
      // Reset scrolling flag after animation completes + delay
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 300);
    };
    
    // Add wheel event listener
    this.container.addEventListener('wheel', handleWheel, { passive: false });
    
    // Store reference for cleanup
    this._wheelHandler = handleWheel;
    this._pinTrigger = pinTrigger;
    
    console.log('Discrete scroll initialized with frame stops:', frameStops);
  }
  
  /**
   * Initialize ScrollTrigger mode (smooth or snap scrolling)
   * 
   * @private
   */
  _initScrollTrigger() {
    // Adjust scroll distance based on viewport width
    const scrollDistance = this.getResponsiveScrollDistance();
    
    // Configure ScrollTrigger based on snap mode
    const scrollTriggerConfig = {
      trigger: this.container,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: this.snapScroll.enabled ? 0.5 : true,
      onUpdate: (self) => {
        // Calculate frame index from scroll progress
        const frameIndex = this.calculateFrameIndex(self.progress);
        
        // Update frame display
        this.updateFrame(frameIndex);
        
        // Handle text overlays for snap scroll
        if (this.snapScroll.enabled) {
          const stepIndex = this.getScrollStepIndex(self.progress);
          
          if (stepIndex !== this.currentScrollStep) {
            // Hide previous text
            this._hideTextOverlay(this.currentScrollStep);
            
            // Show new text
            this._showTextOverlay(stepIndex);
            
            this.currentScrollStep = stepIndex;
          }
        }
      }
    };
    
    // Add snap configuration if enabled
    if (this.snapScroll.enabled) {
      // Create snap points based on frame stops
      const snapPoints = this.frameStops.map((_, index) => {
        return index / (this.frameStops.length - 1);
      });
      
      scrollTriggerConfig.snap = {
        snapTo: snapPoints,
        duration: 0.5,
        ease: "power2.inOut"
      };
    }
    
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
    
    console.log('ScrollTrigger refreshed with new scroll distance:', newScrollDistance);
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
      console.log('ScrollTrigger instance destroyed');
    }
    
    // Kill pin trigger for discrete scroll
    if (this._pinTrigger) {
      this._pinTrigger.kill();
      this._pinTrigger = null;
      console.log('Pin trigger destroyed');
    }
    
    // Remove wheel event listener for discrete scroll
    if (this._wheelHandler) {
      this.container.removeEventListener('wheel', this._wheelHandler);
      this._wheelHandler = null;
      console.log('Wheel event listener removed');
    }
    
    // Clear frame references
    this.preloader = null;
    this.currentFrame = 1;
    this.lastFrameIndex = 1;
    
    // Remove will-change hint
    if (this.imageElement) {
      this.imageElement.style.willChange = 'auto';
    }
    
    console.log('FrameAnimationSystem destroyed');
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
    console.log('Reduced motion preference detected - displaying static frame');
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
      console.error('GSAP or ScrollTrigger not available - displaying fallback');
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
      console.log(`Loading progress: ${progress.loaded}/${progress.total} (${progress.percentage}%)`);
    });
    
    // Listen to frames-ready event
    framePreloader.on('frames-ready', () => {
      console.log('✓ All frames loaded successfully');
    });
    
    // Listen to error events
    framePreloader.on('error', (error) => {
      console.error('Frame loading error:', error);
    });
    
    // Load priority frames (1-10)
    console.log('Loading priority frames...');
    await framePreloader.loadPriorityFrames();
    console.log('✓ Priority frames loaded');
    
    // Hide loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
    
    // Initialize FrameAnimationSystem
    const container = document.querySelector('.animation-hero-section');
    if (!container) {
      console.error('Animation hero section container not found');
      return false;
    }
    
    frameAnimationSystem = new FrameAnimationSystem({
      frameCount: 250,
      scrollDistance: '300vh',
      container: container,
      frameBasePath: './assets/frames/',
      // Enable discrete scroll mode (one frame per scroll)
      discreteScroll: {
        enabled: true
      },
      // Use configuration from animation-config.js
      snapScroll: ANIMATION_CONFIG.snapScroll
    });
    
    // Initialize with preloader
    const initSuccess = frameAnimationSystem.init(framePreloader);
    
    if (!initSuccess) {
      console.error('Failed to initialize FrameAnimationSystem');
      displayStaticFrame();
      return false;
    }
    
    console.log('✓ FrameAnimationSystem initialized successfully');
    
    // Start progressive background loading immediately
    // Phase 2: Frames 11-125 (first scroll section)
    // Phase 3: Frame 250 (last snap point)
    // Phase 4: Frames 126-249 (middle section)
    framePreloader.loadRemainingFrames(8); // Increased concurrency for faster loading
    
    // Store reference globally for debugging
    window.frameAnimationSystem = frameAnimationSystem;
    window.framePreloader = framePreloader;
    
    return true;
    
  } catch (error) {
    console.error('Failed to initialize frame animation:', error);
    displayStaticFrame();
    return false;
  }
}

/**
 * Task 8: Navigation functionality
 * - Scroll event listener for navigation scroll effect
 * - Smooth scroll for navigation links
 * - Scroll indicator click handler
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
  
  // Scroll indicator click handler
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
    
    // Keyboard accessibility for scroll indicator
    scrollIndicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }
  
  console.log('✓ Navigation functionality initialized');
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
  
  console.log('✓ Content section animations initialized');
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
  
  console.log('✓ Responsive behavior and performance optimizations applied');
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
      
      console.log('Window resized - ScrollTrigger refreshed');
    }, 250);
  });
  
  console.log('✓ Error handling and resize listeners initialized');
}

/**
 * Main initialization function
 * Task 17: Final integration and polish
 */
async function initializeApp() {
  console.log('🔥 Initializing HERMANOSBARBER2...');
  
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
  
  console.log('✓ HERMANOSBARBER2 initialized successfully!');
}

// Initialize on DOMContentLoaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initializeApp);
}
