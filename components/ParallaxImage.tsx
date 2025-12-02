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
  const [clipPath, setClipPath] = useState('');

  // Fallback if image fails
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/IMG_0072.AVIF';
  };

  useEffect(() => {
    // Only glitch active item occasionally, but more frequently than before
    if (!isActive) {
        setGlitchStyle({});
        setClipPath('');
        return;
    }

    const triggerGlitch = () => {
        // More aggressive random glitch properties
        const offsetX = (Math.random() - 0.5) * 30; // Increased range
        const offsetY = (Math.random() - 0.5) * 30; 
        const scale = 1 + Math.random() * 0.15; // More zoom jitter
        const rotate = (Math.random() - 0.5) * 5;

        // More frequent filter changes
        const filter = Math.random() > 0.6 
            ? `invert(${Math.random()}) hue-rotate(${Math.random() * 180}deg) contrast(200%)` 
            : `contrast(180%) brightness(130%) sepia(50%)`;
        
        // Random Slice effect
        if (Math.random() > 0.7) {
            const t1 = Math.floor(Math.random() * 40);
            const t2 = Math.floor(Math.random() * 40) + 50;
            setClipPath(`polygon(0 ${t1}%, 100% ${t1}%, 100% ${t2}%, 0 ${t2}%)`);
        } else {
            setClipPath('');
        }

        setGlitchStyle({
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotate}deg)`,
            filter: filter,
            opacity: Math.random() > 0.8 ? 0.5 : 1
        });

        // Reset quickly
        setTimeout(() => {
            setGlitchStyle({});
            setClipPath('');
        }, 100 + Math.random() * 100);
    };

    // Random interval for glitches - faster loop
    const interval = setInterval(() => {
        if (Math.random() > 0.6) { // 40% chance to glitch per cycle (up from 20%)
            triggerGlitch();
        }
    }, 600); // Check every 600ms

    return () => clearInterval(interval);
  }, [isActive]);

  return (
      <div className="w-full h-full relative overflow-hidden">
        {/* Background 'Ghost' Image for extra glitch depth */}
        {Object.keys(glitchStyle).length > 0 && (
             <img 
                src={src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
                style={{ 
                    transform: 'scale(1.1) translateX(-10px)',
                    filter: 'hue-rotate(90deg)' 
                }}
             />
        )}
        
        <img 
            src={src} 
            onError={handleError}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 ease-out will-change-transform"
            style={{ 
                ...glitchStyle,
                clipPath: clipPath || 'none',
                // Base styles if not glitching
                ...(Object.keys(glitchStyle).length === 0 ? {
                    transform: isActive ? 'scale(1)' : 'scale(0.9)',
                    opacity: isActive ? 1 : 0.5,
                    filter: isActive ? 'grayscale(100%) contrast(110%)' : 'grayscale(100%) contrast(150%) blur(2px)'
                } : {})
            }}
            loading="lazy"
        />
      </div>
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
            className="w-full h-full snap-center shrink-0 relative flex items-center justify-center bg-black overflow-hidden cursor-zoom-in group"
          >
             <GlitchImage src={item.image} alt={`Evidence ${idx}`} isActive={activeIndex === idx} />
             
             {/* Vignette per frame */}
             <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,#000_100%)] pointer-events-none" />
             
             {/* REMOVED HOVER HINT OVERLAY */}
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
