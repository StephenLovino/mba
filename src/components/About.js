import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Meet Mai Nguyen</h2>
            <p>
              Meet Mai Nguyen, the visionary founder behind Valour. With a passion for education and a diverse background in [relevant field], Mai's mission is to empower learners worldwide.
            </p>
            <p>
              Her commitment to excellence drives every aspect of Valour, ensuring an enriching experience that propels students toward success. Join Mai on this transformative journey with Valour.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number">2K+</span>
                <span className="stat-label">Students Helped</span>
              </div>
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img 
              src="https://framerusercontent.com/images/pA9bUThxVP8czm17AmfCWp313o.jpg" 
              alt="Mai Nguyen" 
              className="about-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
