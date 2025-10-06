import React, { useEffect, useMemo, useState } from 'react';
import './LeadModal.css';
import { useLeadModal } from './LeadModalContext';

const EMAIL_REGEX = /.+@.+\..+/;

const StepIndicator = ({ step }) => (
  <div className="lm-steps">
    <div className={`lm-step ${step >= 1 ? 'active' : ''}`}>1</div>
    <div className={`lm-step ${step >= 2 ? 'active' : ''}`}>2</div>
    <div className={`lm-step ${step >= 3 ? 'active' : ''}`}>3</div>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setEmail('');
      setRole('professional');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canNextFrom1 = name.trim().length > 1 && EMAIL_REGEX.test(email);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const apiBase = process.env.REACT_APP_API_BASE || '';
      const res = await fetch(`${apiBase}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, utms })
      });
      if (!res.ok) throw new Error('Failed to submit');
      const data = await res.json();
      if (data && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      if (data && data.created) {
        setStep(3);
        setError('');
        return;
      }
      throw new Error('No redirect URL returned');
    } catch (e) {
      setError('Something went wrong. Please try again.');
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
            {!error && !loading && (
              <p className="lm-success">You're in! We'll email details shortly.</p>
            )}
            {error && <p className="lm-error">{error}</p>}
            <div className="lm-actions">
              <button className="lm-btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="lm-btn" onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Proceed to payment'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadModal;


