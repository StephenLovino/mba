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
      this.animatedElements.add(element);
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerAnimation(entry.target);
        }
      });
    }, options);

    // Observe all animated elements
    this.animatedElements.forEach(element => {
      observer.observe(element);
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
