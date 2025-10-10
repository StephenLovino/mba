import React from 'react';
import MagicBento from './MagicBento';
import './Curriculum.css';

const Curriculum = () => {
  return (
    <section className="curriculum section" id="curriculum">
      <div className="container">
        <div className="curriculum-header animate-on-scroll">
          <h2 className="section-title">What You'll Accomplish in Just 3 Hours</h2>
          <p className="section-subtitle">
            Real skills, real projects, real career transformation
          </p>
        </div>
        
        <div className="curriculum-bento animate-scale">
          <MagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="255, 107, 107"
          />
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
