import React, { useEffect, useRef, useState } from 'react';

interface ParallaxImageProps {
  items: { image: string, label: string }[];
  className?: string;
  onIndexChange?: (index: number) => void;
  onImageClick?: (image: string) => void;
}

// Sub-component for individual image with glitch logic
const GlitchImage: React.FC<{ src: string; alt: string; isActive: boolean }> = ({ src, alt, isActive }) => {
  const [glitchStyle, setGlitchStyle] = useState<React.CSSProperties>({});

  // Fallback if image fails
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/IMG_0072.AVIF';
  };

  useEffect(() => {
    // Only glitch active item occasionally
    if (!isActive) {
        setGlitchStyle({});
        return;
    }

    const triggerGlitch = () => {
        // Random glitch properties
        const offset = (Math.random() - 0.5) * 10;
        const scale = 1 + Math.random() * 0.05;
        const filter = Math.random() > 0.7 
            ? `invert(1) hue-rotate(${Math.random() * 90}deg)` 
            : `contrast(150%) brightness(120%)`;
        
        setGlitchStyle({
            transform: `translate(${offset}px, ${offset}px) scale(${scale})`,
            filter: filter
        });

        // Reset quickly
        setTimeout(() => setGlitchStyle({}), 100);
    };

    // Random interval for glitches
    const interval = setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance to glitch per cycle
            triggerGlitch();
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
      <img 
        src={src} 
        onError={handleError}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 ease-out"
        style={{ 
            ...glitchStyle,
            // Base styles
            transition: 'transform 0.5s ease-out, filter 0.1s steps(2)',
            // If not glitching, use smooth zoom/focus
            ...(Object.keys(glitchStyle).length === 0 ? {
                transform: isActive ? 'scale(1)' : 'scale(0.9)',
                opacity: isActive ? 1 : 0.5,
                filter: isActive ? 'grayscale(100%) contrast(110%)' : 'grayscale(100%) contrast(150%) blur(2px)'
            } : {})
        }}
        loading="lazy"
      />
  );
};

const ParallaxImage: React.FC<ParallaxImageProps> = ({ 
  items, 
  className = "",
  onIndexChange,
  onImageClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const itemHeight = container.clientHeight;
    
    // Calculate which item is currently centered
    const index = Math.round(container.scrollTop / itemHeight);
    
    if (index !== activeIndex && index >= 0 && index < items.length) {
      setActiveIndex(index);
      if (onIndexChange) {
        onIndexChange(index);
      }
    }
  };

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      
      {/* Film Strip Sprocket Holes - Left Side */}
      <div className="absolute left-0 top-0 bottom-0 w-8 z-20 pointer-events-none bg-[radial-gradient(circle,transparent_40%,#000_45%)] bg-[length:20px_30px] border-r-2 border-black/50" 
           style={{ backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black mix-blend-overlay opacity-50" />
      </div>

      {/* Film Strip Sprocket Holes - Right Side */}
      <div className="absolute right-0 top-0 bottom-0 w-8 z-20 pointer-events-none bg-[radial-gradient(circle,transparent_40%,#000_45%)] bg-[length:20px_30px] border-l-2 border-black/50"
           style={{ backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black mix-blend-overlay opacity-50" />
      </div>

      {/* SCROLL CONTAINER */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide overscroll-contain"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => onImageClick?.(item.image)}
            className="w-full h-full snap-center shrink-0 relative flex items-center justify-center bg-black overflow-hidden cursor-zoom-in"
          >
             <GlitchImage src={item.image} alt={`Evidence ${idx}`} isActive={activeIndex === idx} />
             
             {/* Vignette per frame */}
             <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,#000_100%)] pointer-events-none" />
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ParallaxImage;
