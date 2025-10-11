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
              With MBA, your satisfaction is our priority. If you're not completely satisfied with your learning experience and request a refund within 14 days of purchase, we'll refund your investment, no questions asked.
            </p>
            
            <div className="social-links">
              <a href="https://www.facebook.com/MillennialBusinessAcademy" target="_blank" rel="noopener noreferrer" className="social-link">FACEBOOK</a>
              <a href="https://www.linkedin.com/company/millennial-business-academy" target="_blank" rel="noopener noreferrer" className="social-link">LINKEDIN</a>
            </div>
          </div>
          
          <div className="footer-main">
            <div className="footer-brand">
              <h4 className="brand-title">Millennial Business Academy</h4>
            </div>
            
            <div className="footer-links">
              <a href="#pricing" className="footer-link">Pricing</a>
              <a href="/terms" className="footer-link">Terms & Conditions</a>
              <a href="/refund" className="footer-link">Refund policy</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">© MBA 2024. All Rights Reserved.</p>
            <p className="designer">Designed by Stephen Lovino</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



