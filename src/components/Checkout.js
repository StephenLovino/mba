import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(''); // 'loading', 'success', 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract form data from URL parameters
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || '';
  const organization = searchParams.get('org') || '';
  const yearInCollege = searchParams.get('year') || '';
  const name = searchParams.get('name') || '';

  useEffect(() => {
    // Validate required parameters
    if (!email || !role) {
      setError('Missing required information. Please start over.');
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [email, role]);

  const updateGHLContactWithPayment = async () => {
    try {
      const apiBase = process.env.REACT_APP_API_BASE || '';
      const response = await fetch(`${apiBase}/api/payment-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          role, 
          organization: organization.trim(), 
          yearInCollege: yearInCollege.trim() 
        })
      });

      if (response.ok) {
        console.log('GHL contact updated with payment status');
      } else {
        console.error('Failed to update GHL contact');
      }
    } catch (error) {
      console.error('Error updating GHL contact:', error);
    }
  };

  const handleBackToForm = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="checkout-container">
        <div className="checkout-card">
          <h2>Error</h2>
          <p className="checkout-error">{error}</p>
          <button className="checkout-btn" onClick={handleBackToForm}>
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <div className="checkout-header">
          <h2>Complete Your Payment</h2>
          <p>You're almost there! Complete your payment to secure your spot.</p>
        </div>

        <div className="checkout-summary">
          <h3>Registration Details</h3>
          <div className="checkout-details">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Role:</strong> {role}</p>
            {organization && (
              <p>
                <strong>{role === 'student' ? 'School/University:' : 'Organization/Company:'}</strong> {organization}
              </p>
            )}
            {role === 'student' && yearInCollege && (
              <p><strong>Year in College:</strong> {yearInCollege}</p>
            )}
          </div>
        </div>

        {paymentStatus === 'success' && (
          <div className="checkout-success">
            <h3>🎉 Payment Successful!</h3>
            <p>Thank you for your payment. You will receive webinar details via email shortly.</p>
            <button className="checkout-btn" onClick={handleBackToForm}>
              Return to Home
            </button>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="checkout-error">
            <h3>Payment Failed</h3>
            <p>There was an issue processing your payment. Please try again.</p>
            <div className="checkout-actions">
              <button className="checkout-btn-secondary" onClick={handleBackToForm}>
                Back to Registration
              </button>
              <button className="checkout-btn" onClick={() => setPaymentStatus('')}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {!paymentStatus && (
          <>
            <div className="checkout-payment-container">
              <iframe
                src="https://checkout-staging.xendit.co/od/aistudent"
                title="Xendit Payment"
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#fff'
                }}
                allow="payment *; clipboard-write *;"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
              />
            </div>
            <div className="checkout-actions">
              <button className="checkout-btn-secondary" onClick={handleBackToForm}>
                Back to Registration
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
