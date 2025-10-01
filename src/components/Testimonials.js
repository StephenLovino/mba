import React from 'react';
import { AnimatedTestimonials, testimonials } from './ui/testimonial';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title">Real Student Success Stories</h2>
          <p className="section-subtitle">
            Authentic feedback from students who transformed their careers
          </p>
        </div>
        
        <div className="testimonials-animated">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
