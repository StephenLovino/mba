import React, { useState } from 'react';
import './Pricing.css';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "AI Hero Training",
      monthlyPrice: 888,
      yearlyPrice: 888,
      originalPrice: 2000,
      features: [
        "Guaranteed results by the end of the webinar",
        "Build your first AI application step-by-step",
        "Create a professional GitHub portfolio",
        "Master database setup and integration",
        "Earn official AI certification",
        "3 hours of intensive hands-on training",
        "Direct access to expert instructors",
        "Lifetime access to training materials"
      ],
      popular: true,
      discount: "Save 55% Today Only"
    }
  ];

  return (
    <section className="pricing section" id="pricing">
      <div className="container">
        <div className="pricing-header">
          <h2 className="section-title">Your Career Transformation Starts Here</h2>
          <p className="section-subtitle">Everything you need to become an AI professional in just one session</p>
        </div>
        
        <div className="pricing-plans">
          {plans.map((plan, index) => (
            <div key={plan.name} className={`plan ${plan.popular ? 'popular' : ''} ${typeof document !== 'undefined' && document.body.classList.contains('clay') ? 'clay-card' : ''}`}>
              {plan.popular && <div className="popular-badge">🔥 Popular</div>}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="original-price">₱{plan.originalPrice}</span>
                  <span className="price-currency">₱</span>
                  <span className="price-amount">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                </div>
                <p className="price-description">{plan.discount}</p>
              </div>
              
              <div className="plan-features">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href="/checkout" className="plan-cta btn btn-primary">
                Register Now - Only ₱888🚀
              </a>
              <p className="plan-guarantee">🔒 Secure payment • 💯 100% satisfaction guarantee</p>
              <p className="plan-limited">Limited spots available - Only 50 seats remaining</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
