import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Eticket = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const type = searchParams.get('t'); // student or professional
    const email = searchParams.get('email'); // if passed from Xendit
    const organization = searchParams.get('org'); // organization/school
    const yearInCollege = searchParams.get('year'); // year in college

    console.log('Eticket page loaded:', { 
      type, 
      email, 
      organization, 
      yearInCollege, 
      searchParams: Object.fromEntries(searchParams.entries()) 
    });

    if (!type) {
      setStatus('error');
      setMessage('Invalid ticket type. Please contact support.');
      return;
    }

    // If email is provided, update GHL contact with payment tag
    if (email) {
      const updateContact = async () => {
        try {
          console.log('Updating contact with payment status:', { email, role: type });
          
          const response = await fetch('/api/payment-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email, 
              role: type, 
              organization: organization || '', 
              yearInCollege: yearInCollege || '' 
            })
          });

          const data = await response.json();
          console.log('Payment success response:', data);

          if (response.ok) {
            setStatus('success');
            setMessage('Payment confirmed! Check your email for webinar details.');
          } else {
            setStatus('success'); // Still show success even if GHL update fails
            setMessage('Payment confirmed! You will receive webinar details shortly.');
          }
        } catch (error) {
          console.error('Payment success error:', error);
          setStatus('success'); // Still show success even if API fails
          setMessage('Payment confirmed! You will receive webinar details shortly.');
        }
      };

      updateContact();
    } else {
      // No email provided, show success but mention webhook will handle GHL update
      setStatus('success');
      setMessage('Payment confirmed! You will receive webinar details shortly. (GHL contact will be updated automatically)');
    }
  }, [searchParams]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0b0b0b', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10000
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '600px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '40px',
        borderRadius: '20px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '20px',
          color: status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : '#f59e0b'
        }}>
          {status === 'success' ? '🎫' : status === 'error' ? '❌' : '⏳'}
        </div>
        
        <h1 style={{ 
          color: '#fff', 
          fontSize: '2rem', 
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          {status === 'success' ? 'Your E-Ticket is Ready!' : 
           status === 'error' ? 'Ticket Error' : 
           'Processing Your Ticket...'}
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

export default Eticket;