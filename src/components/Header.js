import React from 'react';
import { useLeadModal } from './LeadModalContext';
import { Home, MessageSquare, Tag, Rocket } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { open } = useLeadModal();
  return (
    <header className="header">
      <div className="container">
        <div className="header-content full-nav">
          <div className="floating-nav">
            <a href="#home" className="nav-item">
              <Home size={20} />
              <span className="nav-text">MBA</span>
            </a>
            <a href="#testimonials" className="nav-item">
              <MessageSquare size={20} />
              <span className="nav-text">Testimonies</span>
            </a>
            <a href="#pricing" className="nav-item">
              <Tag size={20} />
              <span className="nav-text">Pricing</span>
            </a>
            <button onClick={open} className="nav-item">
              <Rocket size={20} />
              <span className="nav-text">Get Started</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
