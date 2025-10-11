import React from 'react';

const Terms = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '80px auto', padding: '0 20px', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Terms & Conditions</h1>
      <p style={{ color: '#a0aec0' }}>These Terms & Conditions ("Terms") govern your participation in Millennial Business Academy ("MBA") events, workshops, and programs (collectively, "Events"). By registering for or attending an Event, you agree to these Terms.</p>

      <h2 style={{ marginTop: '2rem' }}>1. Eligibility</h2>
      <p style={{ color: '#a0aec0' }}>You must provide accurate information during registration. MBA reserves the right to refuse or revoke access for violations of these Terms.</p>

      <h2 style={{ marginTop: '2rem' }}>2. Payment and Access</h2>
      <p style={{ color: '#a0aec0' }}>Access to Events is granted upon successful payment. Sharing access links, materials, or credentials is prohibited.</p>

      <h2 style={{ marginTop: '2rem' }}>3. Conduct</h2>
      <p style={{ color: '#a0aec0' }}>Participants are expected to maintain professional conduct. MBA may remove any participant who disrupts the learning environment without refund, subject to the Refund Policy below.</p>

      <h2 style={{ marginTop: '2rem' }}>4. Intellectual Property</h2>
      <p style={{ color: '#a0aec0' }}>All Event content, including slides, recordings, and materials, is the intellectual property of MBA or its licensors and may not be reproduced, distributed, or resold without written permission.</p>

      <h2 style={{ marginTop: '2rem' }}>5. Recording and Use of Likeness</h2>
      <p style={{ color: '#a0aec0' }}>Events may be recorded. By attending, you consent to the recording and to MBA’s use of screenshots, chat, audio, or video for educational and marketing purposes.</p>

      <h2 style={{ marginTop: '2rem' }}>6. Schedule Changes</h2>
      <p style={{ color: '#a0aec0' }}>MBA may modify schedules, speakers, or delivery format. If an Event is postponed, your registration will transfer to the new date or an equivalent offering.</p>

      <h2 style={{ marginTop: '2rem' }}>7. Refunds</h2>
      <p style={{ color: '#a0aec0' }}>Refunds are governed by the Refund Policy. Please review the <a href="/refund" style={{ color: '#667eea' }}>Refund Policy</a> for details.</p>

      <h2 style={{ marginTop: '2rem' }}>8. Limitation of Liability</h2>
      <p style={{ color: '#a0aec0' }}>MBA is not liable for indirect, incidental, or consequential damages. Total liability shall not exceed the amount paid for the Event.</p>

      <h2 style={{ marginTop: '2rem' }}>9. Contact</h2>
      <p style={{ color: '#a0aec0' }}>For questions about these Terms, please reach out via the official channels listed on our website.</p>

      <p style={{ marginTop: '2rem', color: '#a0aec0' }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>
    </div>
  );
};

export default Terms;



