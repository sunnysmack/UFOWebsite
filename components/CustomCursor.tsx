import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile touch devices
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-8 h-8 border border-ufo-accent rounded-full pointer-events-none z-[100] transition-transform duration-100 ease-out mix-blend-difference"
        style={{ 
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})` 
        }}
      />
      <div 
        className="fixed top-0 left-0 w-1 h-1 bg-ufo-accent rounded-full pointer-events-none z-[100]"
        style={{ 
          transform: `translate(${position.x - 2}px, ${position.y - 2}px)` 
        }}
      />
    </>
  );
};

export default CustomCursor;