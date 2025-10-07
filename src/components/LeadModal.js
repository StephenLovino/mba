import React, { useEffect, useMemo, useState } from 'react';
import './LeadModal.css';
import { useLeadModal } from './LeadModalContext';

const EMAIL_REGEX = /.+@.+\..+/;

const StepIndicator = ({ step }) => (
  <div className="lm-steps">
    <div className={`lm-step ${step >= 1 ? 'active' : ''}`}>1</div>
    <div className={`lm-step ${step >= 2 ? 'active' : ''}`}>2</div>
    <div className={`lm-step ${step >= 3 ? 'active' : ''}`}>3</div>
    <div className={`lm-step ${step >= 4 ? 'active' : ''}`}>4</div>
  </div>
);

const useUTMs = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','ref'];
    const out = {};
    keys.forEach(k => { const v = params.get(k); if (v) out[k] = v; });
    return out;
  }, []);
};

const LeadModal = () => {
  const { isOpen, close } = useLeadModal();
  const utms = useUTMs();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('professional');
  const [organization, setOrganization] = useState('');
  const [yearInCollege, setYearInCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extraParticipants, setExtraParticipants] = useState([]); // up to 4 {name,email}
  const [paymentData, setPaymentData] = useState(null); // Store payment session data
  const [paymentStatus, setPaymentStatus] = useState(''); // 'loading', 'success', 'error'

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setEmail('');
      setRole('professional');
      setOrganization('');
      setYearInCollege('');
      setError('');
      setExtraParticipants([]);
      setPaymentData(null);
      setPaymentStatus('');
    }
  }, [isOpen]);

  // Initialize Xendit checkout when step 4 is reached
  useEffect(() => {
    if (step === 4 && paymentData && !paymentStatus && window.XenditCheckout) {
      const initializeCheckout = () => {
        try {
          // Use the staging student link for testing
          const checkoutUrl = 'https://checkout-staging.xendit.co/od/aistudent';
          
          window.XenditCheckout.init({
            checkoutUrl: checkoutUrl,
            containerId: 'xendit-checkout-container',
            onSuccess: (data) => {
              console.log('Payment successful:', data);
              setPaymentStatus('success');
              
              // Update GHL contact with payment status
              updateGHLContactWithPayment();
            },
            onError: (error) => {
              console.error('Payment error:', error);
              setPaymentStatus('error');
            }
          });
        } catch (error) {
          console.error('Failed to initialize Xendit checkout:', error);
          setPaymentStatus('error');
        }
      };

      // Small delay to ensure DOM is ready
      setTimeout(initializeCheckout, 100);
    }
  }, [step, paymentData, paymentStatus]);

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

  if (!isOpen) return null;

  const canNextFrom1 = name.trim().length > 1 && EMAIL_REGEX.test(email);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const apiBase = process.env.REACT_APP_API_BASE || '';
      const payload = {
        name,
        email,
        role,
        organization: organization.trim(),
        yearInCollege: yearInCollege.trim(),
        utms,
        participants: extraParticipants
          .map(p => ({ name: String(p.name||'').trim(), email: String(p.email||'').trim() }))
          .filter(p => p.name && EMAIL_REGEX.test(p.email))
      };
      
      console.log('Submitting lead:', { payload, apiBase });
      
      const res = await fetch(`${apiBase}/api/lead?t=${Date.now()}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      console.log('API Response:', { status: res.status, data });
      
      if (!res.ok) {
        console.error('API Error:', data);
        
        // Fallback: Direct redirect to Xendit if API fails
        console.log('API failed, using direct Xendit redirect');
        const studentUrl = 'https://checkout.xendit.co/od/ai-student'; // Replace with your actual URLs
        const proUrl = 'https://checkout.xendit.co/od/ai-professional';
        const chosen = role === 'student' ? studentUrl : proUrl;
        
        if (chosen) {
          window.location.href = chosen;
          return;
        }
        
        const errorMsg = data?.details || data?.error || `Server error (${res.status})`;
        setError(`Error: ${errorMsg}`);
        return;
      }
      
      if (data && data.created) {
        console.log('Contact created successfully:', data.contactId);
        // Store payment data and go to embedded payment step
        setPaymentData({
          contactId: data.contactId,
          contact: data.contact
        });
        setStep(4); // Go to embedded payment step
        setError('');
        return;
      }
      throw new Error('Unexpected response format');
    } catch (e) {
      console.error('Submit error:', e);
      
      // Fallback: Direct redirect to Xendit if network fails
      console.log('Network error, using direct Xendit redirect');
      const studentUrl = 'https://checkout.xendit.co/od/ai-student'; // Replace with your actual URLs
      const proUrl = 'https://checkout.xendit.co/od/ai-professional';
      const chosen = role === 'student' ? studentUrl : proUrl;
      
      if (chosen) {
        window.location.href = chosen;
        return;
      }
      
      setError(`Network error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lm-backdrop" onClick={close}>
      <div className="lm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lm-close" onClick={close} aria-label="Close">×</button>
        <StepIndicator step={step} />
        {step === 1 && (
          <div className="lm-step-content">
            <h3>Let’s get you set up</h3>
            <label className="lm-label">Full name
              <input className="lm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </label>
            <label className="lm-label">Email
              <input className="lm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" />
            </label>
            <button className="lm-btn" disabled={!canNextFrom1} onClick={() => setStep(2)}>Continue</button>
          </div>
        )}
        {step === 2 && (
          <div className="lm-step-content">
            <h3>What is your role?</h3>
            <div className="lm-radio-group">
              <label className={`lm-radio ${role === 'student' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
                Student
              </label>
              <label className={`lm-radio ${role === 'professional' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="professional" checked={role === 'professional'} onChange={() => setRole('professional')} />
                Professional
              </label>
            </div>
            
            <label className="lm-label">
              {role === 'student' ? 'School/University' : 'Organization/Company'}
              <input 
                className="lm-input" 
                value={organization} 
                onChange={(e) => setOrganization(e.target.value)} 
                placeholder={role === 'student' ? 'University of the Philippines' : 'Google Inc.'} 
              />
            </label>
            
            {role === 'student' && (
              <label className="lm-label">
                Year in College
                <select 
                  className="lm-input" 
                  value={yearInCollege} 
                  onChange={(e) => setYearInCollege(e.target.value)}
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Graduate Student">Graduate Student</option>
                </select>
              </label>
            )}
            {role === 'student' && (
              <div className="lm-extra">
                <h4>Add participants (optional)</h4>
                <p className="lm-help">You can add up to 4 additional participants besides yourself.</p>
                {extraParticipants.map((p, idx) => (
                  <div key={idx} className="lm-extra-row">
                    <label className="lm-label">Participant {idx + 2} name
                      <input
                        className="lm-input"
                        value={p.name || ''}
                        onChange={e => {
                          const next = [...extraParticipants];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setExtraParticipants(next);
                        }}
                        placeholder="Full name"
                      />
                    </label>
                    <label className="lm-label">Email
                      <input
                        className="lm-input"
                        type="email"
                        value={p.email || ''}
                        onChange={e => {
                          const next = [...extraParticipants];
                          next[idx] = { ...next[idx], email: e.target.value };
                          setExtraParticipants(next);
                        }}
                        placeholder="email@example.com"
                      />
                    </label>
                    <button
                      type="button"
                      className="lm-btn-secondary lm-inline-remove"
                      onClick={() => setExtraParticipants(extraParticipants.filter((_, i) => i !== idx))}
                    >Remove</button>
                  </div>
                ))}
                {extraParticipants.length < 4 && (
                  <button
                    type="button"
                    className="lm-btn-secondary"
                    onClick={() => setExtraParticipants([...extraParticipants, { name: '', email: '' }])}
                  >+ Add another participant</button>
                )}
              </div>
            )}
            <div className="lm-actions">
              <button className="lm-btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="lm-btn" onClick={() => setStep(3)}>Continue</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="lm-step-content">
            <h3>Confirm & proceed</h3>
            <p className="lm-summary"><strong>Name:</strong> {name}</p>
            <p className="lm-summary"><strong>Email:</strong> {email}</p>
            <p className="lm-summary"><strong>Role:</strong> {role}</p>
            {organization && (
              <p className="lm-summary">
                <strong>{role === 'student' ? 'School/University:' : 'Organization/Company:'}</strong> {organization}
              </p>
            )}
            {role === 'student' && yearInCollege && (
              <p className="lm-summary"><strong>Year in College:</strong> {yearInCollege}</p>
            )}
            {role === 'student' && extraParticipants.length > 0 && (
              <div className="lm-summary-list">
                <p className="lm-summary"><strong>Additional participants:</strong></p>
                <ul>
                  {extraParticipants
                    .filter(p => p.name && EMAIL_REGEX.test(p.email))
                    .map((p, i) => (
                      <li key={i}>{p.name} — {p.email}</li>
                    ))}
                </ul>
              </div>
            )}
            {/* Success message removed; user proceeds directly to payment */}
            {error && <p className="lm-error">{error}</p>}
            <div className="lm-actions">
              <button className="lm-btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="lm-btn" onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Proceed to payment'}</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="lm-step-content">
            <h3>Complete your payment</h3>
            <p className="lm-summary">You're almost there! Complete your payment to secure your spot.</p>
            
            {paymentStatus === 'success' && (
              <div className="lm-success">
                <h4>🎉 Payment Successful!</h4>
                <p>Thank you for your payment. You will receive webinar details via email shortly.</p>
                <button className="lm-btn" onClick={close}>Close</button>
              </div>
            )}
            
            {paymentStatus === 'error' && (
              <div className="lm-error">
                <h4>Payment Failed</h4>
                <p>There was an issue processing your payment. Please try again.</p>
                <div className="lm-actions">
                  <button className="lm-btn-secondary" onClick={() => setStep(3)}>Back</button>
                  <button className="lm-btn" onClick={() => setPaymentStatus('')}>Try Again</button>
                </div>
              </div>
            )}
            
            {!paymentStatus && (
              <>
                <div id="xendit-checkout-container" style={{ minHeight: '400px', margin: '20px 0' }}>
                  {/* Xendit checkout will be embedded here */}
                </div>
                <div className="lm-actions">
                  <button className="lm-btn-secondary" onClick={() => setStep(3)}>Back</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadModal;


