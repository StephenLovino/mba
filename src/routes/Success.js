import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your registration...');

  useEffect(() => {
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const isAffiliate = searchParams.get('affiliate') === 'true';

    if (!email || !role) {
      setStatus('error');
      setMessage('Missing registration information. Please contact support.');
      return;
    }

    // Update message based on affiliate status
    if (isAffiliate) {
      setMessage('Processing your free registration...');
    } else {
      setMessage('Processing your payment...');
    }

    // Update GHL contact with payment tag (same for both paid and affiliate users)
    const updateContact = async () => {
      try {
        console.log('Updating contact:', { email, role, isAffiliate });

        const response = await fetch('/api/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role })
        });

        const data = await response.json();
        console.log('Success response:', data);

        if (response.ok) {
          setStatus('success');
          if (isAffiliate) {
            setMessage('Registration confirmed! Check your email for webinar details.');
          } else {
            setMessage('Payment confirmed! Check your email for webinar details.');
          }
        } else {
          setStatus('error');
          if (isAffiliate) {
            setMessage('Registration confirmed but there was an issue. Please contact support.');
          } else {
            setMessage('Payment confirmed but there was an issue updating your registration. Please contact support.');
          }
        }
      } catch (error) {
        console.error('Success page error:', error);
        setStatus('error');
        setMessage('There was an issue completing your registration. Please contact support.');
      }
    };

    updateContact();
  }, [searchParams]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0b0b0b', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '600px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '20px',
          color: status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#f59e0b'
        }}>
          {status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳'}
        </div>
        
        <h1 style={{
          color: '#fff',
          fontSize: '2rem',
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          {status === 'success' ? 'Registration Successful!' :
           status === 'error' ? 'Registration Confirmed' :
           'Processing...'}
        </h1>
        
        <p style={{ 
          color: '#b0b0b0', 
          fontSize: '1.1rem', 
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          {message}
        </p>

        {status === 'success' && (
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#22c55e', marginBottom: '10px' }}>
              What's Next?
            </h3>
            <ul style={{ 
              color: '#b0b0b0', 
              textAlign: 'left',
              listStyle: 'none',
              padding: 0
            }}>
              <li style={{ marginBottom: '8px' }}>📧 Check your email for webinar details</li>
              <li style={{ marginBottom: '8px' }}>📅 Add the webinar to your calendar</li>
              <li style={{ marginBottom: '8px' }}>🚀 Get ready to build your first AI app!</li>
            </ul>
          </div>
        )}

        <a 
          href="/" 
          style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #a83086, #4db1bd)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default Success;
