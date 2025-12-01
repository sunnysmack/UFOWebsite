import React, { useEffect, useRef, useState } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the element is from the center of the screen
      // Value is -1 when just entering from bottom, 1 when leaving top
      const percentFromCenter = (top + height / 2 - windowHeight / 2) / (windowHeight / 2);
      
      // Move image slightly based on scroll position
      setOffset(percentFromCenter * 30); // 30px movement range
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden relative ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-transform duration-100 ease-linear will-change-transform"
        style={{ transform: `translateY(${offset}px)` }}
      />
      <div className="absolute inset-0 bg-ufo-accent/10 mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default ParallaxImage;