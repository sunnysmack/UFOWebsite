import React, { useEffect, useState, useRef } from 'react';

interface GyroTiltProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // How much it moves
}

const GyroTilt: React.FC<GyroTiltProps> = ({ children, className = "", intensity = 20 }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const requestRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  useEffect(() => {
    // Smooth interpolation function
    const update = () => {
      setTransform(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.1,
        y: prev.y + (targetRef.current.y - prev.y) * 0.1,
        rotateX: prev.rotateX + (targetRef.current.rotateX - prev.rotateX) * 0.1,
        rotateY: prev.rotateY + (targetRef.current.rotateY - prev.rotateY) * 0.1,
      }));
      requestRef.current = requestAnimationFrame(update);
    };
    
    requestRef.current = requestAnimationFrame(update);

    // 1. Mobile Gyro Handler
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Gamma: Left/Right tilt (-90 to 90)
      // Beta: Front/Back tilt (-180 to 180)
      const gamma = event.gamma || 0; 
      const beta = event.beta || 0;

      // Clamp values to avoid extreme flips
      const clampedGamma = Math.min(Math.max(gamma, -45), 45);
      const clampedBeta = Math.min(Math.max(beta - 45, -45), 45); // offset beta by 45deg for natural holding position

      targetRef.current = {
        x: clampedGamma * (intensity / 10),
        y: clampedBeta * (intensity / 10),
        rotateX: -clampedBeta * 0.5, // Tilt back/forth
        rotateY: clampedGamma * 0.5  // Tilt left/right
      };
    };

    // 2. Desktop Mouse Handler
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (event.clientY - innerHeight / 2) / (innerHeight / 2);

      targetRef.current = {
        x: x * intensity,
        y: y * intensity,
        rotateX: -y * 10,
        rotateY: x * 10
      };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [intensity]);

  return (
    <div 
      className={`will-change-transform ${className}`}
      style={{
        transform: `
          perspective(1000px)
          translate3d(${transform.x}px, ${transform.y}px, 0)
          rotateX(${transform.rotateX}deg)
          rotateY(${transform.rotateY}deg)
        `,
        transition: 'none' // We handle smoothing via JS loop
      }}
    >
      {children}
    </div>
  );
};

export default GyroTilt;
