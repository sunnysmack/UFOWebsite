import React, { useEffect, useState } from 'react';

const BOOT_SEQUENCE = [
  "INITIALIZING BIOS...",
  "CHECKING MEMORY... 64KB OK",
  "LOADING KERNEL... OK",
  "MOUNTING FILE SYSTEM...",
  "ESTABLISHING SECURE CONNECTION...",
  "DECRYPTING ASSETS...",
  "SYSTEM READY."
];

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex >= BOOT_SEQUENCE.length) {
        clearInterval(interval);
        setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 800); // Wait for fade out
        }, 800);
        return;
      }

      setLines(prev => [...prev, BOOT_SEQUENCE[currentIndex]]);
      currentIndex++;
    }, 300); // Speed of new lines

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isExiting && lines.length === 0) return null;

  return (
    <div 
        className={`fixed inset-0 z-[9999] bg-black flex items-end pb-20 pl-10 transition-opacity duration-1000 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="font-mono text-ufo-accent text-sm md:text-lg leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="mb-1">
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {line}
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
      
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02),rgba(0,0,0,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none" />
    </div>
  );
};

export default Preloader;
