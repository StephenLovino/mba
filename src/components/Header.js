import React from 'react';
import { NavBar } from './ui/tubelight-navbar';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content full-nav">
          <NavBar
            items={[
              { name: 'MBA', url: '#home', icon: () => null },
              { name: 'Testimonies', url: '#testimonials', icon: () => null },
              { name: 'Pricing', url: '#pricing', icon: () => null },
              { name: 'Get Started', url: '#enroll', icon: () => null },
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
