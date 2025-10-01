import React from 'react';
import './StudentSuccessSpotlight.css';

const StudentSuccessSpotlight = () => {
  return (
    <section className="student-success-spotlight">
      <div className="spotlight-container">
        <div className="spotlight-header">
          <h2 className="spotlight-title">
            <span className="title-main">Student</span>
            <span className="title-gradient">Success Spotlight</span>
          </h2>
          <p className="spotlight-subtitle">Real transformation, real results</p>
        </div>

        <div className="spotlight-card">
          <div className="spotlight-content">
            <div className="spotlight-text">
              <h3 className="spotlight-section-title">From Learner to Manager</h3>
              <p className="spotlight-narrative">
                <span className="highlight-name">Andrew</span>, one of our students, applied the skills he learned and landed a role as <span className="highlight-role">Business Analytics Officer</span> at <span className="highlight-company">BPI BanKo</span> — with a <span className="highlight-rank">Manager rank</span>.
              </p>
              
              <blockquote className="spotlight-quote">
                "From learner to manager in record time, Andrew proves your career transformation is within reach."
              </blockquote>

              <div className="achievement-highlights">
                <h4 className="achievements-title">Achievement Highlights:</h4>
                <ul className="achievements-list">
                  <li className="achievement-item">
                    <span className="achievement-icon"></span>
                    Applied learned skills immediately
                  </li>
                  <li className="achievement-item">
                    <span className="achievement-icon"></span>
                    Secured Manager-level position
                  </li>
                  <li className="achievement-item">
                    <span className="achievement-icon"></span>
                    Business Analytics Officer role
                  </li>
                  <li className="achievement-item">
                    <span className="achievement-icon"></span>
                    Career transformation in record time
                  </li>
                </ul>
              </div>
            </div>

            <div className="spotlight-image-container">
              <div className="image-wrapper">
                <img 
                  src="/success-story-andrew.jpg" 
                  alt="Andrew - Business Analytics Officer at BPI BanKo" 
                  className="spotlight-image"
                />
                <div className="image-overlay success-badge">
                  <div className="trophy-icon">🏆</div>
                  <span>Success Story</span>
                </div>
                <div className="image-overlay role-info">
                  <div className="role-title">Business Analytics Officer</div>
                  <div className="company-name">BPI BanKo</div>
                  <div className="rank-info">Manager Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentSuccessSpotlight;
