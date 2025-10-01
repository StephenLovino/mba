import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'top center',
  wordAnimationEnd = 'top center',
  instantReveal = false
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    if (instantReveal) {
      gsap.set(el, { rotate: 0 });
    } else {
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 85%',
            end: rotationEnd,
            scrub: true
          }
        }
      );
    }

    const wordElements = el.querySelectorAll('.word');

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        duration: instantReveal ? 0.4 : undefined,
        stagger: instantReveal ? 0 : 0.06,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 85%',
          end: instantReveal ? 'top 85%' : wordAnimationEnd,
          scrub: instantReveal ? false : true,
          toggleActions: instantReveal ? 'play none none reverse' : undefined
        }
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          duration: instantReveal ? 0.4 : undefined,
          stagger: instantReveal ? 0 : 0.06,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 85%',
            end: instantReveal ? 'top 85%' : wordAnimationEnd,
            scrub: instantReveal ? false : true,
            toggleActions: instantReveal ? 'play none none reverse' : undefined
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;


