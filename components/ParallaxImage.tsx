import React, { useEffect, useRef, useState } from 'react';

interface ParallaxImageProps {
  items: { image: string, label: string }[]; // New prop for reel data
  className?: string;
  onIndexChange?: (index: number) => void;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ 
  items, 
  className = "",
  onIndexChange
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if image fails
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/IMG_0072.AVIF';
  };

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
            className="w-full h-full snap-center shrink-0 relative flex items-center justify-center bg-black overflow-hidden"
          >
             {/* IMAGE */}
             <img 
               src={item.image} 
               onError={handleError}
               alt={`Evidence ${idx}`}
               className="w-full h-full object-cover transition-transform duration-500 ease-out"
               style={{ 
                 // Subtle parallax zoom effect when active
                 transform: activeIndex === idx ? 'scale(1)' : 'scale(0.9)',
                 opacity: activeIndex === idx ? 1 : 0.5,
                 filter: activeIndex === idx ? 'grayscale(100%) contrast(110%)' : 'grayscale(100%) contrast(150%) blur(2px)'
               }}
               loading={Math.abs(activeIndex - idx) < 2 ? "eager" : "lazy"}
             />
             
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
