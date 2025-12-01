import React from 'react';

const NoiseOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay bg-noise animate-pulse" />
  );
};

export default NoiseOverlay;
