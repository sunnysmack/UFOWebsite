import React, { useEffect, useState } from 'react';
import TvStaticBackground from './TvStaticBackground';

interface CrackedScreenProps {
  onComplete: () => void;
}

const CrackedScreenOverlay: React.FC<CrackedScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [currentImg, setCurrentImg] = useState(1);

  useEffect(() => {
    // Stage 1: Initial Impact (0ms)
    // Stage 2: Glitch intensifies (1000ms)
    // Stage 3: Message Fade In (2000ms)
    // Stage 4: System Reboot / Clear (5000ms)

    const t1 = setTimeout(() => setStage(1), 50);
    const t2 = setTimeout(() => setStage(2), 1500);
    const t3 = setTimeout(() => setStage(3), 5000);
    const t4 = setTimeout(() => onComplete(), 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Image cycling effect for "ts1.jpg" through "ts27.jpg"
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly pick an image between 1 and 27
      const num = Math.floor(Math.random() * 27) + 1;
      setCurrentImg(num);
    }, 60); // 60ms = ~16fps, very fast/glitchy

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto cursor-none bg-black">
      
      {/* 0. BACKGROUND IMAGE CYCLE - Glitchy Layer */}
      <div className={`absolute inset-0 z-20 transition-opacity duration-100 ${stage >= 1 ? 'opacity-60' : 'opacity-0'}`}>
         <img 
            src={`/images/ts${currentImg}.jpg`} 
            alt="" 
            className="w-full h-full object-cover filter contrast-125 brightness-75 sepia-[.5] hue-rotate-15"
         />
         <div className="absolute inset-0 bg-yellow-900/30 mix-blend-color" />
      </div>

      {/* 1. CRACKS SVG - Fixed visual crack centered on screen */}
      <div className="absolute inset-0 z-50 pointer-events-none mix-blend-exclusion">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M50 50 L20 10 L30 0" stroke="white" strokeWidth="0.2" fill="none" className="animate-pulse" />
           <path d="M50 50 L80 15 L90 0" stroke="white" strokeWidth="0.1" fill="none" />
           <path d="M50 50 L10 60 L0 55" stroke="white" strokeWidth="0.3" fill="none" />
           <path d="M50 50 L90 80 L100 75" stroke="white" strokeWidth="0.1" fill="none" />
           <path d="M50 50 L40 90 L35 100" stroke="white" strokeWidth="0.2" fill="none" />
           
           {/* Spiderweb center */}
           <path d="M50 50 L45 45 M50 50 L55 45 M50 50 L55 55 M50 50 L45 55" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* 2. CHROMATIC ABERRATION / SHIFT */}
      <div className="absolute inset-0 z-40 mix-blend-color-dodge opacity-50 animate-[shift_0.1s_infinite]">
         <div className="absolute inset-0 bg-yellow-500/20 translate-x-1" />
         <div className="absolute inset-0 bg-blue-500/20 -translate-x-1" />
      </div>

      {/* 3. HEAVY STATIC */}
      <div className={`absolute inset-0 z-30 transition-opacity duration-1000 ${stage >= 1 ? 'opacity-70' : 'opacity-0'}`}>
         <TvStaticBackground className="opacity-100 mix-blend-hard-light" />
      </div>

      {/* 4. SECRET MESSAGE */}
      <div className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-500 flex-col gap-4 ${stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
         <div className="bg-black/90 p-6 border-4 border-yellow-400 shadow-[0_0_50px_rgba(255,215,0,0.6)] transform rotate-1">
            <h1 className="font-mono text-4xl md:text-6xl text-yellow-400 font-bold tracking-tighter text-center animate-pulse drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
               BIRD CLUB
            </h1>
            <p className="font-mono text-xs md:text-sm text-white text-center mt-2 tracking-widest">
               IP LOGGED: {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.XXX
            </p>
            <p className="font-mono text-xs text-yellow-400 text-center mt-4 blink">
               DO NOT TURN OFF YOUR TERMINAL
            </p>
         </div>
      </div>

      {/* 5. WHITE FLASH OUT */}
      <div className={`absolute inset-0 bg-white z-[60] transition-opacity duration-500 pointer-events-none ${stage === 3 ? 'opacity-100' : 'opacity-0'}`} />

      <style>{`
        @keyframes shift {
            0% { transform: translate(2px, 0); }
            25% { transform: translate(-2px, 2px); }
            50% { transform: translate(0, -2px); }
            75% { transform: translate(-2px, -2px); }
            100% { transform: translate(2px, 2px); }
        }
        .blink { animation: blink 0.1s infinite; }
      `}</style>
    </div>
  );
};

export default CrackedScreenOverlay;
