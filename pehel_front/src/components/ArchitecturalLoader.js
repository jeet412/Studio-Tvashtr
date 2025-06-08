import React from 'react';

const ArchitecturalLoader = () => {
  return (
    <div className="loader-overlay">
      <svg
        className="tower-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 128"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Simple stylized tower shape */}
        <line x1="32" y1="5" x2="32" y2="120" />
        <line x1="20" y1="40" x2="44" y2="40" />
        <line x1="24" y1="70" x2="40" y2="70" />
        <line x1="28" y1="100" x2="36" y2="100" />
        <polyline points="16,120 32,10 48,120" />
      </svg>
    </div>
  );
};

export default ArchitecturalLoader;
