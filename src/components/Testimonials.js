import React, { useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote: "Super affordable! Very well-structured even for beginners. The mentors teach with heart and patience. I learned so much in such a short time!",
      author: "Shak Ni Pearl",
      position: "Student"
    },
    {
      id: 2,
      quote: "Affordable bootcamp with approachable mentors. Kahit hindi ko pa natapos dahil busy, may recordings naman para sa mga nakalagpas na sessions.",
      author: "Aaron Arcilla",
      position: "Student"
    },
    {
      id: 3,
      quote: "If you're seeing this, this is your sign! As an online freelancer for 5 years, I vouch for the mentors and the quality of training they provide.",
      author: "Kaye Araquel",
      position: "Student"
    },
    {
      id: 4,
      quote: "From learner to manager in record time, Andrew proves your career transformation is within reach.",
      author: "Andrew",
      position: "Business Analytics Officer at BPI BanKo - Manager Rank"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title">Real Student Success Stories</h2>
          <p className="section-subtitle">
            Authentic feedback from students who transformed their careers
          </p>
        </div>
        
        <div className="testimonials-slider">
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="testimonial-content">
                  <h3 className="testimonial-quote">"{testimonial.quote}"</h3>
                  <div className="testimonial-author">
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-position">{testimonial.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* slider controls removed for cleaner UI */}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
