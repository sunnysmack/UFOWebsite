import React, { useEffect, useRef, useState } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [glitchState, setGlitchState] = useState({
    active: false,
    sliceTop: 0,
    sliceBottom: 0,
    shift: 0
  });

  // Parallax Effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const percentFromCenter = (top + height / 2 - windowHeight / 2) / (windowHeight / 2);
      
      setOffset(percentFromCenter * 30); 
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Random Glitch/Interruption Effect
  useEffect(() => {
    let timeoutId: number;

    const triggerGlitch = () => {
      // 1. Activate Glitch
      setGlitchState({
        active: true,
        sliceTop: Math.random() * 40,      // Random slice near top
        sliceBottom: Math.random() * 40,   // Random slice near bottom
        shift: (Math.random() - 0.5) * 20  // Random X shift
      });

      // 2. Deactivate quickly (50ms - 250ms)
      setTimeout(() => {
        setGlitchState(prev => ({ ...prev, active: false }));
      }, 50 + Math.random() * 200);

      // 3. Schedule next glitch (random 2s - 8s)
      const nextDelay = 2000 + Math.random() * 6000;
      timeoutId = window.setTimeout(triggerGlitch, nextDelay);
    };

    // Initial start delay
    timeoutId = window.setTimeout(triggerGlitch, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden relative bg-black ${className}`}>
      
      {/* GLITCH LAYER: CYAN (Behind) - Only visible during glitch */}
      <img 
        src={src} 
        alt=""
        className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-opacity duration-75 mix-blend-screen opacity-0 ${glitchState.active ? 'opacity-70' : ''}`}
        style={{ 
          transform: `translateY(${offset}px) translateX(${glitchState.shift}px)`,
          filter: 'sepia(100%) saturate(300%) hue-rotate(130deg)', // Cyan tint
          clipPath: glitchState.active ? `polygon(0 ${glitchState.sliceTop}%, 100% ${glitchState.sliceTop}%, 100% ${100 - glitchState.sliceBottom}%, 0 ${100 - glitchState.sliceBottom}%)` : 'none'
        }}
      />

      {/* GLITCH LAYER: RED (Behind) - Only visible during glitch */}
      <img 
        src={src} 
        alt=""
        className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-opacity duration-75 mix-blend-screen opacity-0 ${glitchState.active ? 'opacity-70' : ''}`}
        style={{ 
          transform: `translateY(${offset}px) translateX(${-glitchState.shift}px)`,
          filter: 'sepia(100%) saturate(300%) hue-rotate(-50deg)', // Red tint
        }}
      />

      {/* MAIN IMAGE */}
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-all duration-100 ease-linear will-change-transform relative z-10`}
        style={{ 
          transform: `translateY(${offset}px)`,
          // Normally Grayscale/Contrast (B&W Surveillance look), but flashes to normal color + brightness during glitch
          filter: glitchState.active 
            ? 'grayscale(0%) contrast(100%) brightness(1.2)' 
            : 'grayscale(100%) contrast(125%) brightness(0.9)'
        }}
      />

      {/* NOISE OVERLAY (Always on top) */}
      <div className="absolute inset-0 bg-ufo-accent/10 mix-blend-overlay pointer-events-none z-20" />
      
      {/* FLASH OVERLAY */}
      <div className={`absolute inset-0 bg-white pointer-events-none z-30 mix-blend-overlay transition-opacity duration-75 ${glitchState.active ? 'opacity-20' : 'opacity-0'}`} />
    </div>
  );
};

export default ParallaxImage;
