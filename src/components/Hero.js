import React, { useEffect, useRef } from 'react';
import './Hero.css';
import { Announcement, AnnouncementTag, AnnouncementTitle } from './ui/announcement';
import { ArrowUpRight } from 'lucide-react';
import { Dock, DockIcon } from './ui/dock';
import { useLeadModal } from './LeadModalContext';
import ShinyText from './ShinyText';

const Hero = () => {
  const { open } = useLeadModal();
  const contentRef = useRef(null);
  const logosRef = useRef(null);
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content" ref={contentRef}>
          {/* Mobile logo above the banner */}
          <img
            className="hero-mobile-logo animate-scale"
            src={require('../MBA.png')}
            alt="MBA"
          />
          <div className="hero-badge animate-on-scroll" style={{background:'transparent', border:'none', padding:0, marginBottom:24}}>
            <Announcement themed variant="outline" className="backdrop-blur supports-[backdrop-filter]:bg-white/5 border-white/10 text-white">
              <AnnouncementTag className="text-white/90">AI Career Starter Pack</AnnouncementTag>
              <AnnouncementTitle>
                Apps, Portfolio & Certificate
                <ArrowUpRight size={16} className="shrink-0 text-white/70" />
              </AnnouncementTitle>
            </Announcement>
          </div>
          
          <h1 className="hero-title animate-on-scroll">
            <span className="hero-title-thin">FROM ZERO TO</span>{' '}
            <ShinyText text="AI HERO" speed={3} className="hero-title-strong" />
            <span className="highlight animate-float"> 🚀</span>
          </h1>
          
          <p className="hero-description animate-on-scroll">
            Launch Your AI Career: Build Real Apps & Get Certified in 1 Hour
          </p>

          
          <div className="hero-actions animate-stagger">
            <button onClick={open} className="btn btn-primary animate-pulse-glow">
              <div className="button-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M 13.084 19.699 L 16.855 15.995 L 13.084 12.292 C 12.705 11.919 12.705 11.318 13.084 10.946 C 13.463 10.574 14.076 10.574 14.455 10.946 L 18.916 15.327 C 19.295 15.699 19.295 16.301 18.916 16.673 L 14.455 21.054 C 14.076 21.426 13.463 21.426 13.084 21.054 C 12.715 20.682 12.705 20.071 13.084 19.699 Z" fill="white"/>
                </svg>
              </div>
              Register Now
            </button>
            <button
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to testimonials section
                const testimonialsSection = document.getElementById('testimonials');
                if (testimonialsSection) {
                  testimonialsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              View Testimonials
            </button>
          </div>
          
          <div className="hero-stats animate-on-scroll">
            <div className="stats-photos">
              <div className="photo-stack animate-stagger">
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
              <div className="stars animate-rotate-in">
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
          
          <div className="trusted-by animate-on-scroll">
            <p>Tools You'll Master</p>
            <div ref={logosRef} className="trusted-logos animate-stagger" style={{pointerEvents:'auto', position:'relative', zIndex:20}}>
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
                {/* PostgreSQL */}
                <DockIcon newTab href="https://www.postgresql.org" name="PostgreSQL" src="https://cdn.simpleicons.org/postgresql/4169E1" />
                {/* Lovable (local asset) */}
                <DockIcon newTab href="https://lovable.dev" name="Lovable" src={require('../lovable-logo-icon.png')} />
              </Dock>
            </div>
          </div>
          
          {/* Event Video Section */}
          <div className="hero-video-section animate-on-scroll">
            <div className="video-container">
              <video 
                className="hero-video"
                autoPlay 
                muted 
                loop 
                playsInline
                controls={true}
                preload="metadata"
                onError={(e) => {
                  console.error('Video error:', e);
                  console.error('Video src:', e.target.src);
                  console.error('Video currentSrc:', e.target.currentSrc);
                  // Hide video and show placeholder
                  e.target.style.display = 'none';
                  const placeholder = e.target.nextElementSibling;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}
                onLoadedData={() => console.log('Video data loaded')}
              >
                <source src="/PMA-EVENT-2025.mp4" type="video/mp4" />
                <source src="/PMA- EVENT-2025.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-placeholder" style={{display: 'none'}}>
                <div className="placeholder-content">
                  <div className="placeholder-icon">🎬</div>
                  <p>PMA Event 2025</p>
                  <small>Video loading...</small>
                </div>
              </div>
              <div className="video-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
