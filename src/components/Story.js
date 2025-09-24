import React from 'react';
import './Story.css';
import ScrollReveal from './ui/ScrollReveal';

const Story = () => {
  return (
    <section className="story section" id="story">
      <div className="container">
        <div className="story-content">
          <div className="story-header">
            <ScrollReveal rotationEnd="+=800 bottom" wordAnimationEnd="+=800 bottom">
              Why This Webinar?
            </ScrollReveal>
            <ScrollReveal rotationEnd="+=800 bottom" wordAnimationEnd="+=800 bottom">
              If any of these sound familiar, you're in the right place
            </ScrollReveal>
          </div>
          
          <div className="story-text">
            <div className="problem-list">
              <ScrollReveal rotationEnd="+=800 bottom" wordAnimationEnd="+=800 bottom">
                • Stuck in a job with no growth?
              </ScrollReveal>
              <ScrollReveal rotationEnd="+=800 bottom" wordAnimationEnd="+=800 bottom">
                • No portfolio or GitHub projects to showcase?
              </ScrollReveal>
              <ScrollReveal rotationEnd="+=800 bottom" wordAnimationEnd="+=800 bottom">
                • Overwhelmed by where to start in AI?
              </ScrollReveal>
              <ScrollReveal rotationEnd="+=800 bottom" wordAnimationEnd="+=800 bottom">
                • Tired of expensive courses that give you no real results?
              </ScrollReveal>
            </div>
            
            <div className="solution-section">
              <h3>The Solution:</h3>
              <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={5} blurStrength={10} rotationEnd="+=800 bottom" wordAnimationEnd="+=800 bottom">
                This 3-hour hands-on sprint guarantees results: walk away with your first AI app, a GitHub-ready portfolio, and your AI certification.
              </ScrollReveal>
            </div>
          </div>
          
          <div className="story-cta">
            <a href="#enroll" className="btn btn-primary">Enroll now</a>
            
            <div className="story-stats">
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Hours</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Guaranteed</span>
              </div>
            </div>
            
            <div className="story-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>1-Hour Live Training</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>2 Hours Project Time</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>AI Certification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
