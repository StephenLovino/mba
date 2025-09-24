import React, { useEffect, useRef, useState } from 'react';

const Checkout = () => {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      // if still not loaded after 3s, show fallback
      setLoaded(true); // show container regardless; iframe may be blocked by X-Frame-Options
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', position: 'relative' }}>
      <iframe
        title="MBA Checkout"
        src="https://www.millennialbusinessacademy.net/widget/form/5rnBslAAkfQvHEw6Bv3V"
        ref={iframeRef}
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100vh', border: '0', display: 'block' }}
        allow="payment *; clipboard-write *;"
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      />
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0b0b0b'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>Loading checkout…</p>
            <a
              href="https://www.millennialbusinessacademy.net/widget/form/5rnBslAAkfQvHEw6Bv3V"
              target="_blank" rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-block' }}
            >
              Open Secure Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;


