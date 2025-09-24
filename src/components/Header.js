import React from 'react';
import { NavBar } from './ui/tubelight-navbar';
import { Home, MessageSquare, Tag, Rocket } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content full-nav">
          <NavBar
            items={[
              { name: 'MBA', url: '#home', icon: Home },
              { name: 'Testimonies', url: '#testimonials', icon: MessageSquare },
              { name: 'Pricing', url: '#pricing', icon: Tag },
              { name: 'Get Started', url: '#enroll', icon: Rocket },
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
