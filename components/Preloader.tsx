import React, { useEffect, useState, useRef } from 'react';

// -----------------------------------------------------------------------------
// NOTIFICATION SETUP (OPTIONAL)
// To get instant alerts on your phone when someone visits:
// 1. Create a Discord Server (it's free).
// 2. Go to Server Settings -> Integrations -> Webhooks -> New Webhook.
// 3. Copy the 'Webhook URL'.
// 4. Paste it inside the quotes below.
// -----------------------------------------------------------------------------
const WEBHOOK_URL = ""; 

interface PreloaderProps {
  onComplete: () => void;
  images?: string[];
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete, images = [] }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [textSequenceDone, setTextSequenceDone] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Ref ensures we don't send duplicate notifications if re-renders happen
  const notificationSentRef = useRef(false);
  
  const userDataRef = useRef({
    city: 'UNKNOWN SECTOR',
    country: 'UNKNOWN REGION',
    device: 'UNIDENTIFIED TERMINAL',
    ip: '::1',
    userAgent: navigator.userAgent
  });

  // --- ASSET PRELOADING LOGIC ---
  useEffect(() => {
    if (!images || images.length === 0) {
      setAssetsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const total = images.length;
    let isMounted = true;

    const handleItemLoad = () => {
      if (!isMounted) return;
      loadedCount++;
      if (loadedCount >= total) {
        setAssetsLoaded(true);
      }
    };

    // Deduplicate images
    const uniqueImages = [...new Set(images)];

    uniqueImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleItemLoad;
      img.onerror = handleItemLoad; // Proceed even if asset is missing to avoid hanging
    });

    return () => { isMounted = false; };
  }, [images]);

  // --- NOTIFICATION LOGIC ---
  const sendNotification = async () => {
    if (notificationSentRef.current) return;
    notificationSentRef.current = true;

    if (!WEBHOOK_URL) {
      console.log("Visitor Log (Configure WEBHOOK_URL in Preloader.tsx):", userDataRef.current);
      return;
    }

    try {
      const { city, country, ip, device, userAgent } = userDataRef.current;
      
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "UFO STUDIOS SECURITY",
          avatar_url: "https://ufostudios.us/logo.png",
          content: "🚨 **INTRUSION DETECTED**",
          embeds: [{
            title: "New Visitor Logged",
            color: 16766720, // Gold color
            fields: [
              { name: "Location", value: `${city}, ${country}`, inline: true },
              { name: "IP Address", value: ip, inline: true },
              { name: "Device", value: device, inline: true },
              { name: "Time", value: new Date().toLocaleString(), inline: false },
              { name: "User Agent", value: `\`${userAgent}\``, inline: false }
            ],
            footer: { text: "UFO STUDIOS • SECURE CHANNEL" }
          }]
        })
      });
    } catch (err) {
      console.error("Failed to transmit beacon:", err);
    }
  };

  useEffect(() => {
    // 1. Hardware Detection
    const ua = navigator.userAgent;
    if (ua.match(/Android/i)) userDataRef.current.device = "ANDROID HANDSET";
    else if (ua.match(/iPhone/i)) userDataRef.current.device = "IPHONE SECURE UNIT";
    else if (ua.match(/iPad/i)) userDataRef.current.device = "IPAD TABLET";
    else if (ua.match(/Mac/i)) userDataRef.current.device = "MACINTOSH WORKSTATION";
    else if (ua.match(/Win/i)) userDataRef.current.device = "WINDOWS TERMINAL";
    else if (ua.match(/Linux/i)) userDataRef.current.device = "LINUX NODE";
    
    // 2. Network Trace
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city) userDataRef.current.city = data.city.toUpperCase();
        if (data.country_name) userDataRef.current.country = data.country_name.toUpperCase();
        if (data.ip) userDataRef.current.ip = data.ip;
        sendNotification();
      })
      .catch(err => {
        console.log("Trace blocked by firewall", err);
        sendNotification();
      });

    // 3. Boot Sequence Definition
    const sequence = [
      () => "INITIALIZING...",
      () => "CHECKING MEMORY... 128KB OK",
      () => "ENTERING UFO...",
      () => "TIMELINE SYNC...",
      () => `${userDataRef.current.device}`,
      () => "SECURING CONNECTION...",
      () => `${userDataRef.current.city}, ${userDataRef.current.country}`,
      () => "TRANSMITTING TO UFO...",
      () => "7ASON SAYS: Welcome aboard!",
      () => "SYSTEM READY!"
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex >= sequence.length) {
        clearInterval(interval);
        setTextSequenceDone(true);
        return;
      }

      const getLineContent = sequence[currentIndex];
      setLines(prev => [...prev, getLineContent()]);
      currentIndex++;
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Show "Downloading" message if text is done but images are still loading
  useEffect(() => {
    if (textSequenceDone && !assetsLoaded) {
      setLines(prev => [...prev, "DOWNLOADING ART FILES..."]);
    }
  }, [textSequenceDone, assetsLoaded]);

  // COMPLETE when BOTH text sequence and assets are ready
  useEffect(() => {
    if (textSequenceDone && assetsLoaded && !isExiting) {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    }
  }, [textSequenceDone, assetsLoaded, isExiting, onComplete]);

  if (isExiting && lines.length === 0) return null;

  return (
    <div 
        className={`fixed inset-0 z-[9999] bg-black flex items-end pb-20 pl-10 transition-opacity duration-1000 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="font-mono text-ufo-accent text-xs md:text-sm leading-relaxed">
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
