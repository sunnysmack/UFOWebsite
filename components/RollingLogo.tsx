import React, { useEffect, useState } from 'react';

interface RollingLogoProps {
  children: React.ReactNode;
  className?: string;
}

const RollingLogo: React.FC<RollingLogoProps> = ({ children, className = "" }) => {
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Handler for Mobile Device Orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Gamma is left-to-right tilt in degrees [-90, 90]
      const gamma = event.gamma || 0;
      // Beta is front-to-back tilt in degrees [-180, 180]
      const beta = event.beta || 0;

      // Rotate the logo like a steering wheel based on left/right tilt
      // Multiply by 1.5 to make it feel more responsive
      setRotation(gamma * 1.5);

      // Add a subtle 3D tilt effect
      // Clamp values to prevent extreme distortion
      const x = Math.min(Math.max(gamma, -45), 45) / 3; 
      const y = Math.min(Math.max(beta - 45, -45), 45) / 3; // Subtract 45 assuming user holds phone at angle
      setTilt({ x, y });
    };

    // Handler for Desktop Mouse Movement (Fallback)
    const handleMouseMove = (event: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Calculate percentage from center (-0.5 to 0.5)
      const xPct = (mouseX / width - 0.5);
      const yPct = (mouseY / height - 0.5);

      setRotation(xPct * 60); // Rotate up to 30 degrees each way
      setTilt({ x: xPct * 30, y: -yPct * 30 });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className={`relative transition-transform duration-100 ease-out will-change-transform ${className}`}
      style={{
        transform: `
          rotate(${rotation}deg) 
          perspective(1000px) 
          rotateX(${tilt.y}deg) 
          rotateY(${tilt.x}deg)
        `
      }}
    >
      {children}
      
      {/* Gloss/Reflection Overlay */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none mix-blend-overlay"
        style={{ transform: `rotate(${-rotation}deg)` }} 
      />
    </div>
  );
};

export default RollingLogo;