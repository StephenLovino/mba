import React from 'react';

const Eticket = () => {
  const params = new URLSearchParams(window.location.search);
  const t = (params.get('t') || '').toLowerCase(); // 'student' | 'professional'

  const fileName = t === 'student'
    ? 'eticket-students.png'
    : 'eticket-professionals.png';
  const src = `/${fileName}`; // public assets are served from root

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient( circle at 20% 20%, #0b1220, #070b16 60%, #050912 100%)'
    }}>
      <div style={{ textAlign: 'center', padding: 16 }}>
        <img
          src={src}
          alt="MBA E-ticket"
          style={{ maxWidth: '96vw', height: 'auto', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
          onError={(e) => {
            // Show a simple placeholder when not found
            e.currentTarget.replaceWith(Object.assign(document.createElement('div'), {
              style: 'color:#cbd5e1',
              textContent: `Ticket image not found: ${src}`
            }));
          }}
        />
        <p style={{ color: '#cbd5e1', marginTop: 16 }}>
          Save this e-ticket. You’ll also receive it via email.
        </p>
      </div>
    </div>
  );
}

export default Eticket;


