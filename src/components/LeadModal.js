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
  const [extraParticipants, setExtraParticipants] = useState([]); // up to 4 {name,email}

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setEmail('');
      setRole('professional');
      setError('');
      setExtraParticipants([]);
    }
  }, [isOpen]);

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
        const errorMsg = data?.details || data?.error || `Server error (${res.status})`;
        setError(`Error: ${errorMsg}`);
        return;
      }
      
      if (data && data.redirectUrl) {
        console.log('Redirecting to:', data.redirectUrl);
        window.location.href = data.redirectUrl;
        return;
      }
      if (data && data.created) {
        console.log('Contact created successfully:', data.contactId);
        setStep(3);
        setError('');
        return;
      }
      throw new Error('Unexpected response format');
    } catch (e) {
      console.error('Submit error:', e);
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
      </div>
    </div>
  );
};

export default LeadModal;


