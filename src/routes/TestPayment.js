import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const TestPayment = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing test payment...');
  const [formData, setFormData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    role: 'student'
  });

  useEffect(() => {
    // Get test data from URL params or use defaults
    const name = searchParams.get('name') || 'Test User';
    const email = searchParams.get('email') || 'test@example.com';
    const role = searchParams.get('role') || 'student';
    
    setFormData({ name, email, role });
    
    // Simulate the form submission process
    const simulateFormSubmission = async () => {
      try {
        console.log('Starting test payment flow:', { name, email, role });
        
        // Step 1: Submit to our lead API (like the real form)
        const payload = {
          name,
          email,
          role,
          utms: {}
        };

        console.log('Submitting to lead API:', payload);
        
        const apiBase = process.env.REACT_APP_API_BASE || '';
        const response = await fetch(`${apiBase}/api/lead?t=${Date.now()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Lead API Response:', { status: response.status, data });

        if (response.ok && data.redirectUrl) {
          console.log('Lead API returned URL:', data.redirectUrl);
          // Use the URL from API but replace with staging if it's a Xendit URL
          if (data.redirectUrl.includes('checkout.xendit.co')) {
            const stagingUrl = data.redirectUrl.replace('checkout.xendit.co', 'checkout-staging.xendit.co');
            console.log('Redirecting to Xendit staging:', stagingUrl);
            window.location.href = stagingUrl;
          } else {
            console.log('Redirecting to API URL:', data.redirectUrl);
            window.location.href = data.redirectUrl;
          }
        } else {
          // Fallback: redirect directly to staging
          console.log('Lead API failed, redirecting directly to staging');
          window.location.href = 'https://checkout-staging.xendit.co/od/student';
        }
      } catch (error) {
        console.error('Test payment error:', error);
        // Fallback: redirect directly to staging
        console.log('Error occurred, redirecting directly to staging');
        window.location.href = 'https://checkout-staging.xendit.co/od/student';
      }
    };

    simulateFormSubmission();
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
          color: '#f59e0b'
        }}>
          🧪
        </div>
        
        <h1 style={{ 
          color: '#fff', 
          fontSize: '2rem', 
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          Test Payment Flow
        </h1>
        
        <p style={{ 
          color: '#b0b0b0', 
          fontSize: '1.1rem', 
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          Simulating form submission and redirecting to Xendit staging...
        </p>

        <div style={{ 
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '10px' }}>
            Test Data
          </h3>
          <ul style={{ 
            color: '#b0b0b0', 
            textAlign: 'left',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ marginBottom: '8px' }}>👤 Name: {formData.name}</li>
            <li style={{ marginBottom: '8px' }}>📧 Email: {formData.email}</li>
            <li style={{ marginBottom: '8px' }}>🎓 Role: {formData.role}</li>
          </ul>
        </div>

        <p style={{ 
          color: '#f59e0b', 
          fontSize: '0.9rem',
          fontStyle: 'italic'
        }}>
          Check browser console for detailed logs
        </p>
      </div>
    </div>
  );
};

export default TestPayment;
