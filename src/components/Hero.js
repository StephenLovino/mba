import React from 'react';
import './Hero.css';
import ShinyText from './ui/ShinyText';
import { Announcement, AnnouncementTag, AnnouncementTitle } from './ui/announcement';
import { ArrowUpRight } from 'lucide-react';
import { Dock, DockIcon } from './ui/dock';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          {/* Mobile logo above the banner */}
          <img
            className="hero-mobile-logo"
            src={require('../MBA.png')}
            alt="MBA"
          />
          <div className="hero-badge" style={{background:'transparent', border:'none', padding:0, marginBottom:24}}>
            <Announcement themed variant="outline" className="backdrop-blur supports-[backdrop-filter]:bg-white/5 border-white/10 text-white">
              <AnnouncementTag className="text-white/90">AI Career Starter Pack</AnnouncementTag>
              <AnnouncementTitle>
                Apps, Portfolio & Certificate
                <ArrowUpRight size={16} className="shrink-0 text-white/70" />
              </AnnouncementTitle>
            </Announcement>
          </div>
          
          <h1 className="hero-title">
            <ShinyText text="FROM ZERO TO" speed={3} className="hero-title-thin" />{' '}
            <span className="hero-title-strong">AI HERO</span>
            <span className="highlight">🚀</span>
          </h1>
          
          <p className="hero-description">
            Launch Your AI Career: Build Real Apps & Get Certified in 1 Hour
          </p>

          
          <div className="hero-actions">
            <a href="/checkout" className="btn btn-primary">
              <div className="button-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M 13.084 19.699 L 16.855 15.995 L 13.084 12.292 C 12.705 11.919 12.705 11.318 13.084 10.946 C 13.463 10.574 14.076 10.574 14.455 10.946 L 18.916 15.327 C 19.295 15.699 19.295 16.301 18.916 16.673 L 14.455 21.054 C 14.076 21.426 13.463 21.426 13.084 21.054 C 12.715 20.682 12.705 20.071 13.084 19.699 Z" fill="white"/>
                </svg>
              </div>
              Register Now for Only ₱888
            </a>
            <a href="#preview" className="btn btn-outline">
              Watch Preview
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="stats-photos">
              <div className="photo-stack">
                <div className="photo photo-1">
                  <img src="https://framerusercontent.com/images/sFJggTzla8eMLg8n1AbKDQlyulU.jpg" alt="Student" />
                </div>
                <div className="photo photo-2">
                  <img src="https://framerusercontent.com/images/JhbGle453RWF0QjzZnSxbtxRBiA.jpg" alt="Student" />
                </div>
                <div className="photo photo-3">
                  <img src="https://framerusercontent.com/images/hCsV8dkBKP9VEaaIlJr8Bk89bX4.jpg" alt="Student" />
                </div>
                <div className="photo photo-4">500+</div>
              </div>
            </div>
            <div className="stats-text">
              <div className="stars">
                <svg width="82" height="15" viewBox="0 0 82 15" fill="none">
                  <path d="M8.5 0L10.9286 5.63522L17 6.13837L12.3452 10.1635L13.6607 16L8.5 12.9308L3.33929 16L4.65477 10.1635L0 6.13837L6.07144 5.63522L8.5 0Z" fill="#F7C14D"/>
                  <path d="M27.5 0L29.9286 5.63522L36 6.13837L31.3452 10.1635L32.6607 16L27.5 12.9308L22.3393 16L23.6548 10.1635L19 6.13837L25.0714 5.63522L27.5 0Z" fill="#F7C14D"/>
                  <path d="M46.5 0L48.9286 5.63522L55 6.13837L50.3452 10.1635L51.6607 16L46.5 12.9308L41.3393 16L42.6548 10.1635L38 6.13837L44.0714 5.63522L46.5 0Z" fill="#F7C14D"/>
                  <path d="M65.5 0L67.9286 5.63522L74 6.13837L69.3452 10.1635L70.6607 16L65.5 12.9308L60.3393 16L61.6548 10.1635L57 6.13837L63.0714 5.63522L65.5 0Z" fill="#F7C14D"/>
                  <path d="M84.5 0L86.9286 5.63522L93 6.13837L88.3452 10.1635L89.6607 16L84.5 12.9308L79.3393 16L80.6548 10.1635L76 6.13837L82.0714 5.63522L84.5 0Z" fill="#F7C14D"/>
                </svg>
              </div>
              <p>Students Trained</p>
            </div>
          </div>
          
          <div className="trusted-by">
            <p>Tools You’ll Master</p>
            <div className="trusted-logos" style={{pointerEvents:'auto', position:'relative', zIndex:20}}>
              <Dock className="pointer-events-auto">
                {/* AHA (provided asset) */}
                <DockIcon newTab href="https://www.aha-innovations.com" name="AHA" src="https://storage.googleapis.com/msgsndr/LL7TmGrkL72EOf8O0FKA/media/48904ea3-fd99-4567-81a4-c3b6663a653d.png" />
                {/* ChatGPT (OpenAI) */}
                <DockIcon newTab href="https://chat.openai.com" name="ChatGPT" src="https://cdn.simpleicons.org/openai/10A37F" />
                {/* Gemini */}
                <DockIcon newTab href="https://gemini.google.com" name="Gemini" src="https://cdn.simpleicons.org/googlegemini/4285F4" />
                {/* n8n */}
                <DockIcon newTab href="https://n8n.io" name="n8n" src="https://cdn.simpleicons.org/n8n/FF6A6A" />
                {/* GitHub */}
                <DockIcon newTab href="https://github.com" name="GitHub" src="https://cdn.simpleicons.org/github/FFFFFF" />
                {/* MySQL */}
                <DockIcon newTab href="https://www.mysql.com" name="MySQL" src="https://cdn.simpleicons.org/mysql/4479A1" />
                {/* Lovable (local asset) */}
                <DockIcon newTab href="https://lovable.dev" name="Lovable" src={require('../lovable-logo-icon.png')} />
              </Dock>
            </div>
          </div>
        </div>
        <div className="hero-video">
          <div className="video-container">
            <div className="video-placeholder">
              <div className="video-thumbnail" style={{
                backgroundImage: 'url(https://i.ytimg.com/vi_webp/QBDel4ck-SI/maxresdefault.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <button className="play-button">
                  <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                    <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fillOpacity="0.8"/>
                    <path d="M 45,24 27,14 27,34" fill="#fff"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
