import React from 'react';
import { useLeadModal } from './LeadModalContext';
import './Story.css';

const Story = () => {
  const { open } = useLeadModal();
  return (
    <section className="story section" id="story">
      {/* Sticky background overlay to prevent underlying sections from showing through during reveals */}
      <div className="story-sticky-bg" aria-hidden="true" />
      <div className="container">
        <div className="story-content">
          <div className="story-header animate-on-scroll">
            <h2>Why This Webinar?</h2>
            <p>If any of these sound familiar, you're in the right place</p>
          </div>
          
          <div className="story-layout">
            {/* Left Column - Problems */}
            <div className="story-column story-problems animate-fade-left">
              <div className="column-header">
                <div className="problem-icon animate-rotate-in">⚠️</div>
                <h3>Common Challenges</h3>
              </div>
              <div className="problem-list animate-stagger">
                <div className="problem-item">
                  <div className="problem-bullet">•</div>
                  <p>Stuck in a job with no growth?</p>
                </div>
                <div className="problem-item">
                  <div className="problem-bullet">•</div>
                  <p>No portfolio or GitHub projects to showcase?</p>
                </div>
                <div className="problem-item">
                  <div className="problem-bullet">•</div>
                  <p>Overwhelmed by where to start in AI?</p>
                </div>
                <div className="problem-item">
                  <div className="problem-bullet">•</div>
                  <p>Tired of expensive courses that give you no real results?</p>
                </div>
              </div>
            </div>

            {/* Right Column - Solution */}
            <div className="story-column story-solution animate-fade-right">
              <div className="column-header">
                <div className="solution-icon animate-rotate-in">🚀</div>
                <h3>The Solution</h3>
              </div>
              <div className="solution-content">
                <p>This 3-hour hands-on sprint guarantees results: walk away with your first AI app, a GitHub-ready portfolio, and your AI certification.</p>
                
                <div className="solution-stats animate-stagger">
                  <div className="stat">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Hours</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Guaranteed</span>
                  </div>
                </div>
                
                <div className="solution-features animate-stagger">
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

          <div className="story-cta animate-bounce-in">
            <button onClick={open} className="btn btn-primary animate-pulse-glow">Enroll now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
