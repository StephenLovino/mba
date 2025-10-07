import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(''); // 'loading', 'success', 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  // Extract form data from URL parameters
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || '';
  const organization = searchParams.get('org') || '';
  const yearInCollege = searchParams.get('year') || '';
  const name = searchParams.get('name') || '';

  // Determine which Xendit link to use based on role
  const getPaymentLink = () => {
    // Check if we're in test/staging mode
    const isStaging = window.location.hostname.includes('localhost') ||
                      window.location.hostname.includes('staging') ||
                      window.location.hostname.includes('vercel.app');

    if (role === 'student') {
      return isStaging
        ? 'https://checkout-staging.xendit.co/od/aistudent'
        : 'https://checkout.xendit.co/od/student';
    } else {
      return isStaging
        ? 'https://checkout-staging.xendit.co/od/aiprofessional'
        : 'https://checkout.xendit.co/od/professionals';
    }
  };

  useEffect(() => {
    // Validate required parameters
    if (!email || !role) {
      setError('Missing required information. Please start over.');
      setLoading(false);
      return;
    }

    console.log('Checkout loaded with:', { email, role, organization, yearInCollege, name });
    setLoading(false);
  }, [email, role, organization, yearInCollege, name]);

  const handlePaymentComplete = async () => {
    setConfirmingPayment(true);

    try {
      const apiBase = process.env.REACT_APP_API_BASE || '';
      const response = await fetch(`${apiBase}/api/payment-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          organization: organization || '',
          yearInCollege: yearInCollege || ''
        })
      });

      if (response.ok) {
        console.log('GHL contact updated with payment status');
        // Redirect to eticket page
        const eticketUrl = `/eticket?t=${role}&email=${encodeURIComponent(email)}&org=${encodeURIComponent(organization || '')}&year=${encodeURIComponent(yearInCollege || '')}`;
        window.location.href = eticketUrl;
      } else {
        console.error('Failed to update GHL contact');
        setError('Failed to confirm payment. Please contact support.');
        setConfirmingPayment(false);
      }
    } catch (error) {
      console.error('Error updating GHL contact:', error);
      setError('Failed to confirm payment. Please contact support.');
      setConfirmingPayment(false);
    }
  };

  const handleBackToForm = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="checkout-container">
        <div className="checkout-card">
          <h2>⚠️ Error</h2>
          <p className="checkout-error">{error}</p>
          <button className="checkout-btn" onClick={handleBackToForm}>
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-card">
          <h2>Loading...</h2>
          <p>Please wait while we prepare your checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Complete Your Payment</h2>
        <p>You're almost there! Complete your payment to secure your spot.</p>
        <div className="checkout-info">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Type:</strong> {role === 'student' ? 'Student (₱500)' : 'Professional (₱1000)'}</p>
        </div>
      </div>

      <div className="checkout-payment-container">
        <iframe
          src={getPaymentLink()}
          title="Xendit Payment"
          style={{
            width: '100%',
            height: 'calc(100vh - 350px)',
            minHeight: '500px',
            border: 'none',
            borderRadius: '16px',
            backgroundColor: '#fff'
          }}
          allow="payment *; clipboard-write *;"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        />
      </div>

      <div className="checkout-notice">
        <p>⚠️ <strong>Important:</strong> After completing your payment in the form above, click the button below to confirm and get your e-ticket.</p>
      </div>

      <div className="checkout-actions">
        <button
          className="checkout-btn-secondary"
          onClick={handleBackToForm}
          disabled={confirmingPayment}
        >
          Back to Registration
        </button>
        <button
          className="checkout-btn checkout-btn-primary"
          onClick={handlePaymentComplete}
          disabled={confirmingPayment}
        >
          {confirmingPayment ? '⏳ Confirming Payment...' : '✅ I\'ve Completed Payment - Get My E-Ticket'}
        </button>
      </div>

      <div className="checkout-help">
        <p>Having trouble? Contact us at <a href="mailto:support@millennialbusinessacademy.net">support@millennialbusinessacademy.net</a></p>
      </div>
    </div>
  );
};

export default Checkout;
