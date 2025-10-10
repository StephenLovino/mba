// Scroll Animation Utilities
// Handles reveal animations and parallax effects on scroll

class ScrollAnimations {
  constructor() {
    this.animatedElements = new Set();
    this.parallaxElements = [];
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
    } else {
      this.setupAnimations();
    }
  }

  setupAnimations() {
    this.setupScrollReveal();
    this.setupParallax();
    this.setupIntersectionObserver();

    // Re-scan for new elements periodically (for React components)
    this.rescanInterval = setInterval(() => {
      this.setupScrollReveal();
      this.setupIntersectionObserver();
    }, 500);

    // Stop rescanning after 5 seconds (all components should be loaded by then)
    setTimeout(() => {
      if (this.rescanInterval) {
        clearInterval(this.rescanInterval);
        this.rescanInterval = null;
      }
    }, 5000);
  }

  setupScrollReveal() {
    // Find all elements with animation classes
    const elements = document.querySelectorAll([
      '.animate-on-scroll',
      '.animate-fade-left',
      '.animate-fade-right',
      '.animate-scale',
      '.animate-stagger',
      '.animate-bounce-in',
      '.animate-rotate-in'
    ].join(','));

    elements.forEach(element => {
      // Only add if not already tracked
      if (!this.animatedElements.has(element)) {
        this.animatedElements.add(element);
      }
    });
  }

  setupParallax() {
    // Find parallax elements
    const parallaxElements = document.querySelectorAll([
      '.parallax-slow',
      '.parallax-medium',
      '.parallax-fast'
    ].join(','));

    parallaxElements.forEach(element => {
      this.parallaxElements.push({
        element,
        speed: this.getParallaxSpeed(element),
        offset: element.offsetTop
      });
    });
  }

  getParallaxSpeed(element) {
    if (element.classList.contains('parallax-slow')) return 0.3;
    if (element.classList.contains('parallax-medium')) return 0.5;
    if (element.classList.contains('parallax-fast')) return 0.7;
    return 0.5;
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // Create observer if it doesn't exist
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerAnimation(entry.target);
          }
        });
      }, options);
    }

    // Observe all animated elements that aren't already being observed
    this.animatedElements.forEach(element => {
      // Check if element is already being observed
      if (!element.hasAttribute('data-observed')) {
        element.setAttribute('data-observed', 'true');
        this.observer.observe(element);

        // If element is already in viewport, trigger animation immediately
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          this.triggerAnimation(element);
        }
      }
    });
  }

  triggerAnimation(element) {
    // Add animate-in class to trigger CSS animations
    element.classList.add('animate-in');

    // Handle staggered animations
    if (element.classList.contains('animate-stagger')) {
      const children = element.children;
      Array.from(children).forEach((child, index) => {
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }

    // Handle bounce-in animation
    if (element.classList.contains('animate-bounce-in')) {
      element.style.animationPlayState = 'running';
    }

    // Handle rotate-in animation
    if (element.classList.contains('animate-rotate-in')) {
      element.style.animationPlayState = 'running';
    }
  }

  updateParallax() {
    const scrollY = window.pageYOffset;

    this.parallaxElements.forEach(({ element, speed, offset }) => {
      const yPos = -(scrollY - offset) * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  // Public method to add new animated elements
  addAnimatedElement(element) {
    this.animatedElements.add(element);
    this.setupIntersectionObserver();
  }

  // Public method to add new parallax elements
  addParallaxElement(element, speed = 0.5) {
    this.parallaxElements.push({
      element,
      speed,
      offset: element.offsetTop
    });
  }

  // Cleanup method
  destroy() {
    if (this.rescanInterval) {
      clearInterval(this.rescanInterval);
      this.rescanInterval = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.animatedElements.clear();
    this.parallaxElements = [];
  }
}

// Initialize scroll animations
let scrollAnimations;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    scrollAnimations = new ScrollAnimations();
    
    // Add scroll listener for parallax
    window.addEventListener('scroll', () => {
      scrollAnimations.updateParallax();
    }, { passive: true });
  });
} else {
  scrollAnimations = new ScrollAnimations();
  
  // Add scroll listener for parallax
  window.addEventListener('scroll', () => {
    scrollAnimations.updateParallax();
  }, { passive: true });
}

export default scrollAnimations;
