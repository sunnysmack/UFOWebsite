import React, { useEffect, useRef, useState } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  isActive?: boolean; // Prop for external animation trigger
  videoUrl?: string | null; // New prop for animated video content
  onClick?: () => void;
  onError?: (fallbackSrc: string) => void; // Notify parent of error
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  isActive = false,
  videoUrl = null,
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
    shift: 0
  });

  // Reset activeSrc when prop changes
  useEffect(() => {
    setActiveSrc(src);
  }, [src]);

  // Fallback handler for broken random images
  const handleError = () => {
    const fallback = '/images/IMG_0072.AVIF';
    // If the random image fails, try loading the first image in the series as a fallback.
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

  // Random Glitch/Interruption Effect (Internal)
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

  // Combine internal random glitch with external 'isActive' (rapid click cycle) state
  const isGlitching = glitchState.active || isActive;

  return (
    <div 
      ref={containerRef} 
      onClick={onClick}
      className={`overflow-hidden relative bg-black ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      
      {/* If Video URL exists, render Video, otherwise Images */}
      {videoUrl ? (
        <>
            <video 
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-opacity duration-1000 ease-in-out relative z-10 animate-flicker-on"
                style={{ 
                    transform: `translateY(${offset}px)`,
                    filter: 'contrast(110%) brightness(1.1)' 
                }}
            />
            {/* Overlay a faint grid to make it look digital */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px]" />
        </>
      ) : (
          <>
            {/* GLITCH LAYER: CYAN (Behind) - Only visible during glitch */}
            <img 
                src={activeSrc} 
                onError={handleError}
                alt=""
                className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-opacity duration-75 mix-blend-screen opacity-0 ${isGlitching ? 'opacity-70' : ''}`}
                style={{ 
                transform: `translateY(${offset}px) translateX(${glitchState.shift + (isActive ? Math.random() * 10 - 5 : 0)}px)`,
                filter: 'sepia(100%) saturate(300%) hue-rotate(130deg)', // Cyan tint
                clipPath: isGlitching ? `polygon(0 ${glitchState.sliceTop}%, 100% ${glitchState.sliceTop}%, 100% ${100 - glitchState.sliceBottom}%, 0 ${100 - glitchState.sliceBottom}%)` : 'none'
                }}
            />

            {/* GLITCH LAYER: RED (Behind) - Only visible during glitch */}
            <img 
                src={activeSrc}
                onError={handleError}
                alt=""
                className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-opacity duration-75 mix-blend-screen opacity-0 ${isGlitching ? 'opacity-70' : ''}`}
                style={{ 
                transform: `translateY(${offset}px) translateX(${-(glitchState.shift + (isActive ? Math.random() * 10 - 5 : 0))}px)`,
                filter: 'sepia(100%) saturate(300%) hue-rotate(-50deg)', // Red tint
                }}
            />

            {/* MAIN IMAGE */}
            <img 
                src={activeSrc}
                onError={handleError}
                alt={alt}
                className={`w-full h-[120%] object-cover absolute -top-[10%] left-0 transition-all duration-100 ease-linear will-change-transform relative z-10`}
                style={{ 
                transform: `translateY(${offset}px)`,
                // Removed the invert/saturate filter when isActive.
                // It now just looks slightly brighter/glitchy via the glitch layers above.
                filter: isGlitching 
                        ? 'grayscale(0%) contrast(100%) brightness(1.1)' 
                        : 'grayscale(100%) contrast(125%) brightness(0.9)'
                }}
            />
          </>
      )}

      {/* NOISE OVERLAY (Always on top) */}
      <div className="absolute inset-0 bg-ufo-accent/10 mix-blend-overlay pointer-events-none z-20" />
      
      {/* FLASH OVERLAY */}
      <div className={`absolute inset-0 bg-white pointer-events-none z-30 mix-blend-overlay transition-opacity duration-75 ${isGlitching ? 'opacity-20' : 'opacity-0'}`} />
    </div>
  );
};

export default ParallaxImage;
