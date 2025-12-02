import React, { useEffect, useRef, useState } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  isActive?: boolean; // Controls the "Slot Machine" Glitch intensity
  onClick?: () => void;
  onError?: (fallbackSrc: string) => void;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  isActive = false,
  onClick,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [activeSrc, setActiveSrc] = useState(src);
  const [glitchState, setGlitchState] = useState({
    active: false,
    sliceTop: 0,
    sliceBottom: 0,
    shift: 0,
    filter: ''
  });

  // Reset activeSrc when prop changes
  useEffect(() => {
    setActiveSrc(src);
  }, [src]);

  // Fallback handler for broken random images
  const handleError = () => {
    const fallback = '/images/IMG_0072.AVIF';
    if (activeSrc !== fallback) {
       setActiveSrc(fallback);
       if (onError) onError(fallback);
    }
  };

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

  // GLITCH LOOP
  useEffect(() => {
    let timeoutId: number;

    const triggerGlitch = () => {
      // If 'isActive' (Slot Machine Mode) is ON, we glitch aggressively every cycle
      // If OFF, we glitch occasionally as ambient effect
      
      const isAggressive = isActive;

      setGlitchState({
        active: true,
        sliceTop: Math.random() * 80,
        sliceBottom: Math.random() * 80,
        shift: (Math.random() - 0.5) * (isAggressive ? 100 : 20),
        // Randomly invert or hue rotate during aggressive phase for "flashing" effect
        filter: isAggressive 
                ? `invert(${Math.random() > 0.5 ? 1 : 0}) hue-rotate(${Math.random() * 360}deg) contrast(200%)` 
                : ''
      });

      // Clear glitch state quickly
      setTimeout(() => {
        setGlitchState(prev => ({ ...prev, active: false, filter: '' }));
      }, isAggressive ? 100 : 50 + Math.random() * 200);

      // Schedule next
      const nextDelay = isAggressive ? 100 : 2000 + Math.random() * 6000;
      timeoutId = window.setTimeout(triggerGlitch, nextDelay);
    };

    // If active changed to true, trigger immediately
    if (isActive) {
        triggerGlitch();
    } else {
        timeoutId = window.setTimeout(triggerGlitch, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  // Combine internal random glitch with external 'isActive' state
  const isGlitching = glitchState.active || isActive;

  return (
    <div 
      ref={containerRef} 
      onClick={onClick}
      className={`overflow-hidden relative bg-black ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      
      {/* GLITCH LAYER: CYAN/RED SPLIT (Behind) - Only visible during glitch */}
      <img 
          src={activeSrc} 
          onError={handleError}
          alt=""
          className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-opacity duration-75 mix-blend-screen opacity-0 ${isGlitching ? 'opacity-80' : ''}`}
          style={{ 
            transform: `translateY(${offset}px) translateX(${glitchState.shift}px)`,
            filter: 'sepia(100%) saturate(300%) hue-rotate(130deg)', 
            clipPath: isGlitching ? `polygon(0 ${glitchState.sliceTop}%, 100% ${glitchState.sliceTop}%, 100% ${100 - glitchState.sliceBottom}%, 0 ${100 - glitchState.sliceBottom}%)` : 'none'
          }}
      />

      {/* MAIN IMAGE */}
      <img 
          src={activeSrc}
          onError={handleError}
          alt={alt}
          className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-all duration-75 ease-linear will-change-transform relative z-10`}
          style={{ 
            transform: `translateY(${offset}px)`,
            // Apply the random filters (invert/hue) if aggressive glitch is active
            filter: glitchState.filter || (isGlitching ? 'grayscale(0%) contrast(150%)' : 'grayscale(100%) contrast(125%) brightness(0.9)')
          }}
      />

      {/* NOISE OVERLAY (Always on top) */}
      <div className="absolute inset-0 bg-ufo-accent/10 mix-blend-overlay pointer-events-none z-20" />
      
      {/* WHITE FLASH OVERLAY */}
      <div className={`absolute inset-0 bg-white pointer-events-none z-30 mix-blend-overlay transition-opacity duration-75 ${isGlitching ? 'opacity-50' : 'opacity-0'}`} />
    </div>
  );
};

export default ParallaxImage;
