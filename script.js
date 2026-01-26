// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Hero animations
gsap.from('.hero-title-line', {
    opacity: 0,
    y: 100,
    duration: 1,
    stagger: 0.3,
    ease: 'power4.out'
});

gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.6,
    ease: 'power4.out'
});

gsap.from('.hero-cta', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.9,
    ease: 'power4.out'
});

gsap.from('.scroll-indicator', {
    opacity: 0,
    duration: 1,
    delay: 1.2,
    ease: 'power4.out'
});

// Pinned video sections
document.querySelectorAll('.video-section .video-container.pinned').forEach((container) => {
    ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 1
    });

    gsap.from(container.querySelector('.video-title'), {
        scrollTrigger: {
            trigger: container,
            start: 'top center',
            end: 'center center',
            scrub: 1
        },
        scale: 0.5,
        opacity: 0
    });
});

// Video overlay animations
document.querySelectorAll('.video-section:not(:has(.pinned)) .video-overlay').forEach((overlay) => {
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
    galleryItems.forEach((item, index) => {
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

// Services cards animation
gsap.from('.service-card', {
    scrollTrigger: {
        trigger: '.services-section',
        start: 'top 70%',
        end: 'top 30%',
        scrub: 1
    },
    y: 100,
    opacity: 0,
    stagger: 0.2,
    rotation: -5
});

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

// Parallax effect on hero background
gsap.to('.hero-bg', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 300,
    opacity: 0.5
});

// Text reveal animations for section titles
document.querySelectorAll('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        y: 50,
        scale: 0.9
    });
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

// Cursor glow effect (optional enhancement)
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--yellow) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    opacity: 0.5;
    transition: transform 0.1s ease;
    display: none;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.display = 'block';
});

// Hover effects for interactive elements
document.querySelectorAll('a, button, .gallery-item, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

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

// Refresh ScrollTrigger on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Performance optimization: Disable animations on mobile if needed
if (window.innerWidth < 768) {
    // Reduce animation complexity on mobile
    ScrollTrigger.config({ 
        limitCallbacks: true,
        syncInterval: 150 
    });
}

console.log('🔥 Hermanos Barber website loaded successfully!');

