import React from 'react';
import './Story.css';

const Story = () => {
  return (
    <section className="story section" id="story">
      {/* Sticky background overlay to prevent underlying sections from showing through during reveals */}
      <div className="story-sticky-bg" aria-hidden="true" />
      <div className="container">
        <div className="story-content">
          <div className="story-header">
            <h2>Why This Webinar?</h2>
            <p>If any of these sound familiar, you're in the right place</p>
          </div>
          
          <div className="story-text">
            <div className="problem-list">
              <p>• Stuck in a job with no growth?</p>
              <p>• No portfolio or GitHub projects to showcase?</p>
              <p>• Overwhelmed by where to start in AI?</p>
              <p>• Tired of expensive courses that give you no real results?</p>
            </div>
            
            <div className="solution-section">
              <h3>The Solution:</h3>
              <p>This 3-hour hands-on sprint guarantees results: walk away with your first AI app, a GitHub-ready portfolio, and your AI certification.</p>
            </div>
          </div>
          
          <div className="story-cta">
            <a href="/checkout" className="btn btn-primary">Enroll now</a>
            
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
