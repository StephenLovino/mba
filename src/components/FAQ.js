import React, { useState } from 'react';
import { useLeadModal } from './LeadModalContext';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { open } = useLeadModal();

  const faqs = [
    {
      question: "Do I need prior experience?",
      answer: "Absolutely not! This course is specifically designed for complete beginners. We start from the basics and guide you step-by-step through every concept. Our mentors have experience teaching students from all backgrounds."
    },
    {
      question: "Will I really get results in 3 hours?",
      answer: "Yes, guaranteed! In 3 hours, you'll build your first AI app, create GitHub projects for your portfolio, and earn your AI certification. We focus on practical, hands-on learning that delivers immediate results."
    },
    {
      question: "Is the Masterclass live?",
      answer: "Yes, it's a live interactive session where you can ask questions in real-time. However, if you can't attend live, you'll get lifetime access to the recording plus all materials."
    },
    {
      question: "Can I enroll later?",
      answer: "While you can enroll later, the special launch pricing (Students ₱500, Professionals ₱1000) and the ₱10,000 discount on the Data Analytics Masterclass are limited-time offers available only during this promotion."
    },
    {
      question: "What if I can't attend the live session?",
      answer: "No problem! You'll receive lifetime access to all recordings, materials, and resources. You can learn at your own pace and still get the same certification."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes! We offer a 30-day 100% satisfaction guarantee. If you're not completely satisfied with the course, we'll refund every peso, no questions asked."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <div className="faq-content">
          <div className="faq-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know before joining</p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="faq-cta">
            <h3 className="cta-title">Take the Leap – From Zero to AI Hero</h3>
            <p className="cta-description">
              Your career transformation is just one click away. Join hundreds of students who've already made the leap to AI mastery.
            </p>
            <button onClick={open} className="btn btn-primary">Register Now</button>
            <div className="cta-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Students Trained</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
