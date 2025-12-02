import React, { useEffect, useState, useRef } from 'react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  
  // Use a ref to store data so we can access updated values inside the interval closure
  // without triggering re-renders or dependency issues
  const userDataRef = useRef({
    city: 'UNKNOWN SECTOR',
    country: 'UNKNOWN REGION',
    device: 'UNIDENTIFIED TERMINAL',
    ip: '::1'
  });

  useEffect(() => {
    // 1. Hardware Detection (User Agent)
    const ua = navigator.userAgent;
    if (ua.match(/Android/i)) userDataRef.current.device = "ANDROID HANDSET";
    else if (ua.match(/iPhone/i)) userDataRef.current.device = "IPHONE SECURE UNIT";
    else if (ua.match(/iPad/i)) userDataRef.current.device = "IPAD TABLET";
    else if (ua.match(/Mac/i)) userDataRef.current.device = "MACINTOSH WORKSTATION";
    else if (ua.match(/Win/i)) userDataRef.current.device = "WINDOWS TERMINAL";
    else if (ua.match(/Linux/i)) userDataRef.current.device = "LINUX NODE";
    
    // 2. Network Trace (IP Geolocation)
    // Using a free IP API to get location data. 
    // If this fails (e.g. adblockers), it gracefully falls back to defaults.
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city) userDataRef.current.city = data.city.toUpperCase();
        if (data.country_name) userDataRef.current.country = data.country_name.toUpperCase();
        if (data.ip) userDataRef.current.ip = data.ip;
      })
      .catch(err => {
        console.log("Trace blocked by firewall", err);
      });

    // 3. Boot Sequence Definition
    // We use functions here so they evaluate the ref at the moment they are called
    const sequence = [
      () => "INITIALIZING BIOS...",
      () => "CHECKING MEMORY... 64KB OK",
      () => "CONNECTION... OK",
      () => "ENTERING UFO: SECURE...",
      () => `DETECTING HARDWARE... ${userDataRef.current.device}`,
      () => "ESTABLISHING CONNECTION...",
      () => "TRACING SIGNAL SOURCE...",
      () => `TARGET IDENTIFIED: ${userDataRef.current.city}, ${userDataRef.current.country}`,
      () => "ACCRESS GRANTED...",
      () => "SYSTEM READY."
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 800); // Wait for fade out
        }, 800);
        return;
      }

      const getLineContent = sequence[currentIndex];
      setLines(prev => [...prev, getLineContent()]);
      currentIndex++;
    }, 400); // Speed of text (ms)

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
