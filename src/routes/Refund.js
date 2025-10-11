import React from 'react';

const Refund = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '80px auto', padding: '0 20px', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Refund Policy</h1>
      <p style={{ color: '#a0aec0' }}>We want you to have a great learning experience with Millennial Business Academy ("MBA"). This policy explains when refunds are available for Event registrations.</p>

      <h2 style={{ marginTop: '2rem' }}>1. 14-Day Refund Window</h2>
      <p style={{ color: '#a0aec0' }}>Refunds may be requested within 14 days of purchase and prior to attending more than the first live session. Requests outside this window are not eligible for a refund.</p>

      <h2 style={{ marginTop: '2rem' }}>2. How to Request</h2>
      <p style={{ color: '#a0aec0' }}>Email your order details and reason for the request to our support address listed on the website. We’ll review and respond within 5 business days.</p>

      <h2 style={{ marginTop: '2rem' }}>3. Non-Refundable Cases</h2>
      <ul style={{ color: '#a0aec0' }}>
        <li>Requests submitted after 14 days from purchase.</li>
        <li>Substantial participation beyond the first live session or significant consumption of course materials.</li>
        <li>Violations of our Terms & Conditions or Code of Conduct.</li>
      </ul>

      <h2 style={{ marginTop: '2rem' }}>4. Processing</h2>
      <p style={{ color: '#a0aec0' }}>Eligible refunds are issued to the original payment method. Processing times may vary based on your payment provider.</p>

      <h2 style={{ marginTop: '2rem' }}>5. Event Changes</h2>
      <p style={{ color: '#a0aec0' }}>If an Event is postponed or rescheduled, your registration will be moved to the new date or an equivalent offering. If MBA cancels an Event, you are entitled to a full refund.</p>

      <p style={{ marginTop: '2rem', color: '#a0aec0' }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>
    </div>
  );
};

export default Refund;



