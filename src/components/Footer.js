import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-cta">
            <h3 className="cta-title">Join the community</h3>
            <p className="cta-description">
              With Valour, your satisfaction is our priority. If you're not completely satisfied with your learning experience within [specific time frame], we'll refund your investment, no questions asked.
            </p>
            
            <div className="social-links">
              <a href="#" className="social-link">FACEBOOK</a>
              <a href="#" className="social-link">INSTAGRAM</a>
              <a href="#" className="social-link">Linkedin</a>
            </div>
          </div>
          
          <div className="footer-main">
            <div className="footer-brand">
              <h4 className="brand-title">Valour - Framer Template for Course Creators</h4>
            </div>
            
            <div className="footer-links">
              <a href="#pricing" className="footer-link">Pricing</a>
              <a href="#blog" className="footer-link">Blog</a>
              <a href="#contact" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Terms & Conditions</a>
              <a href="#" className="footer-link">Privacy policy</a>
              <a href="#" className="footer-link">Remix this template for free</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">© Valour 2024. All Rights Reserved.</p>
            <p className="designer">Designed by Wize</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



