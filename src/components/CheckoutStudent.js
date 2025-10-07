import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Checkout.css';

const CheckoutStudent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');

  // Extract form data from URL parameters
  const email = searchParams.get('email') || '';
  const organization = searchParams.get('org') || '';
  const yearInCollege = searchParams.get('year') || '';
  const name = searchParams.get('name') || '';
  const role = 'student'; // Fixed role for this route

  useEffect(() => {
    // Validate required parameters
    if (!email || !name) {
      setError('Missing required information. Please start over.');
      setLoading(false);
      return;
    }

    console.log('Student Checkout loaded with:', { email, organization, yearInCollege, name });

    // Create Xendit invoice
    createInvoice();
  }, [email, organization, yearInCollege, name]);

  const createInvoice = async () => {
    try {
      setLoading(true);
      setError('');

      const apiBase = process.env.REACT_APP_API_BASE || '';

      try {
        // Try to create invoice via API
        const response = await fetch(`${apiBase}/api/create-invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            role: 'student',
            organization,
            yearInCollege
          })
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();

          if (response.ok && data.invoice_url) {
            console.log('Invoice created via API:', data);
            setInvoiceUrl(data.invoice_url);
            setLoading(false);
            return;
          }
        }

        // If API fails, fall through to static link
        console.log('API invoice creation failed, using static link');
      } catch (apiError) {
        console.log('API error, falling back to static link:', apiError);
      }

      // Fallback: Use static Xendit link
      const isStaging = window.location.hostname.includes('localhost') ||
                        window.location.hostname.includes('staging') ||
                        window.location.hostname.includes('vercel.app');

      const staticLink = isStaging
        ? 'https://checkout-staging.xendit.co/od/aistudent'
        : 'https://checkout.xendit.co/od/aistudent';

      console.log('Using static link:', staticLink);
      setInvoiceUrl(staticLink);
      setLoading(false);

    } catch (err) {
      console.error('Error in createInvoice:', err);
      setError(err.message || 'Failed to load payment form. Please try again.');
      setLoading(false);
    }
  };

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
      <div className="checkout-header-minimal">
        <h2>Complete Your Payment</h2>
      </div>

      <div className="checkout-payment-container">
        {invoiceUrl ? (
          <iframe
            src={invoiceUrl}
            title="Xendit Payment"
            style={{
              width: '100%',
              height: 'calc(100vh - 200px)',
              minHeight: '600px',
              border: 'none',
              borderRadius: '16px',
              backgroundColor: '#fff'
            }}
            allow="payment *; clipboard-write *;"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1' }}>
            <p>Loading payment form...</p>
          </div>
        )}
      </div>

      <div className="checkout-notice">
        <p>⚠️ <strong>Important:</strong> After completing your payment, click the button below to get your e-ticket.</p>
      </div>

      <div className="checkout-actions">
        <button
          className="checkout-btn-secondary"
          onClick={handleBackToForm}
          disabled={confirmingPayment}
        >
          Back
        </button>
        <button
          className="checkout-btn checkout-btn-primary"
          onClick={handlePaymentComplete}
          disabled={confirmingPayment}
        >
          {confirmingPayment ? '⏳ Confirming...' : '✅ I\'ve Completed Payment'}
        </button>
      </div>

      <div className="checkout-help">
        <p>Need help? <a href="mailto:support@millennialbusinessacademy.net">Contact support</a></p>
      </div>
    </div>
  );
};

export default CheckoutStudent;

