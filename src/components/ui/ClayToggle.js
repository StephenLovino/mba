import React from 'react';

const ClayToggle = ({ theme, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle claymorphism theme"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 9999,
        border: 'none',
        padding: '10px 14px',
        borderRadius: 9999,
        background: theme === 'clay'
          ? 'linear-gradient(145deg, #20242a, #171a1f)'
          : 'linear-gradient(145deg, #1e293b, #0b1220)',
        color: '#fff',
        boxShadow: theme === 'clay'
          ? '8px 8px 16px rgba(0,0,0,0.45), -6px -6px 14px rgba(255,255,255,0.04)'
          : '0 8px 20px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        opacity: 0.9,
      }}
    >
      {theme === 'clay' ? 'Clay: ON' : 'Clay: OFF'}
    </button>
  );
};

export default ClayToggle;


