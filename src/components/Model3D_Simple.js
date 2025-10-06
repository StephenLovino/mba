import React, { useRef, useEffect, useState } from 'react';
import './Model3D.css';

function Model3D_Simple() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const modelRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (modelRef.current && !isLoading) {
      const rotationY = scrollY * 0.5; // degrees
      const rotationX = Math.sin(scrollY * 0.01) * 10; // subtle bobbing
      const scale = 1 + Math.sin(scrollY * 0.005) * 0.1; // subtle scaling
      
      modelRef.current.style.transform = `
        perspective(1000px) 
        rotateY(${rotationY}deg) 
        rotateX(${rotationX}deg) 
        scale(${scale})
        translateZ(0)
      `;
    }
  }, [scrollY, isLoading]);

  if (isLoading) {
    return (
      <div className="model-container">
        <div className="model-overlay"></div>
        <div className="model-title">MBA Mascot</div>
        <div className="model-subtitle">Scroll to see me rotate!</div>
        <div className="model-loading">
          <div className="loading-spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="model-container">
      <div className="model-overlay"></div>
      <div className="model-title">MBA Mascot</div>
      <div className="model-subtitle">Scroll to see me rotate!</div>
      <div className="model-3d-container">
        <div ref={modelRef} className="model-3d-shape">
          <div className="model-face front">
            <div className="model-logo">MBA</div>
          </div>
          <div className="model-face back"></div>
          <div className="model-face right"></div>
          <div className="model-face left"></div>
          <div className="model-face top"></div>
          <div className="model-face bottom"></div>
        </div>
      </div>
    </div>
  );
}

export default Model3D_Simple;
