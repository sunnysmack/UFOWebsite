import React, { useState, useEffect, useRef } from 'react';
import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';
import RevealOnScroll from './components/RevealOnScroll';
import ParallaxImage from './components/ParallaxImage';
import TvStaticBackground from './components/TvStaticBackground';
import GyroTilt from './components/GyroTilt';
import ScrambleText from './components/ScrambleText';
import Preloader from './components/Preloader';
import VisualThreatAssessment from './components/VisualThreatAssessment';
import Timetruck from './components/Timetruck';
import SunnysmackAudio from './components/SunnysmackAudio';
import CrackedScreenOverlay from './components/CrackedScreenOverlay';
import { NavItem } from './types';

const NAV_ITEMS: NavItem[] = [
  { label: 'ART FILES', href: '#origin' },
  { label: 'PROTOCOLS', href: '#services' },
  { label: 'TIMETRUCK', href: '#timetruck' },
  { label: 'AUDIO', href: '#audio' },
  { label: 'SECTOR SCAN', href: '#intelligence' },
  { label: 'COMMS', href: '#contact' }
];

const SERVICES = [
    { num: '001', title: 'PROPAGANDA', desc: 'Deploying viral thought-forms to destabilize consensus reality.' },
    { num: '002', title: 'COUNTER INTEL', desc: 'Decryption of interstellar static and neutralization of unauthorized signals.' },
    { num: '003', title: 'HISTORY', desc: 'Retroactive continuity adjustments for timeline preservation and archival.' }
];

// Helper to generate a "reel" of random images
const generateReel = () => {
    const items = [];
    // Generate 30 items for the reel
    for(let i = 0; i < 30; i++) {
        const min = 72;
        const max = 158;
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const randomSector = ['A', 'B', 'X', '9', 'Z', 'Q'][Math.floor(Math.random() * 6)];
        
        items.push({
            image: `/images/IMG_${num.toString().padStart(4, '0')}.AVIF`,
            label: `EVIDENCE NO. ${randomId}-${randomSector}`
        });
    }
    return items;
};

// Static assets to preload
const STATIC_ASSETS = [
    '/images/logo.png',
    '/images/album1.jpg',
    '/images/album2.jpg',
    '/images/album3.jpg',
    '/images/album4.jpg',
    '/images/album5.jpg',
    '/images/album6.jpg'
];

// Interactive Service Card Component
const ServiceItem = ({ service, index }: { service: any, index: number }) => {
  const [active, setActive] = useState(false);

  const triggerStatic = () => {
    if (active) return;
    setActive(true);
    if (navigator.vibrate) navigator.vibrate(30);
    // Static effect duration
    setTimeout(() => setActive(false), 1200);
  };

  return (
    <RevealOnScroll delay={index * 150} threshold={0.2}>
       <div 
         onClick={triggerStatic}
         className="group border border-ufo-gray p-8 hover:bg-ufo-gray/10 hover:border-ufo-accent transition-all duration-300 h-full flex flex-col justify-between min-h-[300px] relative overflow-hidden cursor-pointer select-none"
       >
         {/* Ping Indicator */}
         <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
           <div className="w-2 h-2 bg-ufo-accent rounded-full animate-ping" />
         </div>

         {/* Active Static Effect - Removed Overlay Container */}
         {active && (
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <TvStaticBackground />
            </div>
         )}

         <div className="relative z-10">
           <span className="font-mono text-xs opacity-50 mb-4 block text-ufo-accent">FILE NO. {service.num}</span>
           <h3 className="font-sans text-2xl font-bold mb-4 text-ufo-offwhite group-hover:text-ufo-accent transition-colors">{service.title}</h3>
           <p className="font-mono text-sm opacity-80 leading-relaxed group-hover:text-white">
             {service.desc}
           </p>
         </div>
         <div className="w-full h-[1px] bg-ufo-gray mt-8 group-hover:bg-ufo-accent transition-colors relative z-10" />
       </div>
    </RevealOnScroll>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Easter Egg State
  const [isCracked, setIsCracked] = useState(false);
  
  // Fullscreen Image State
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Ref and state for the lighting transition on the Origin section
  const originRef = useRef<HTMLDivElement>(null);
  const [originVisible, setOriginVisible] = useState(false);

  // Initialize reel items once on load so we can preload them
  const [reelItems] = useState(() => generateReel());
  const [currentEvidenceLabel, setCurrentEvidenceLabel] = useState('EVIDENCE NO. 8492-X');

  // Combine all images for preloader
  const [preloadList] = useState(() => [
    ...STATIC_ASSETS,
    ...reelItems.map(item => item.image)
  ]);

  const handleReelChange = (index: number) => {
    if (reelItems[index]) {
        if (navigator.vibrate) navigator.vibrate(5); // Tiny tick on scroll
        setCurrentEvidenceLabel(reelItems[index].label);
    }
  };

  const handleEasterEgg = () => {
    if (navigator.vibrate) {
        navigator.vibrate([100, 30, 100, 30, 500, 50, 500]);
    }
    setIsCracked(true);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOriginVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 } // Trigger when 20% visible
    );
    
    if (originRef.current) {
      observer.observe(originRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {loading && (
          <Preloader 
            onComplete={() => setLoading(false)} 
            images={preloadList} 
          />
      )}
      {isCracked && <CrackedScreenOverlay onComplete={() => setIsCracked(false)} />}
      
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeFullscreen}
        >
           {/* Image Container - Warm White Glow added here - Opacity 100% background above */}
           <div 
             className="relative max-w-full max-h-[70vh] shadow-[0_0_100px_rgba(255,225,200,0.3)] rounded-sm transition-all duration-500" 
             onClick={(e) => e.stopPropagation()}
           >
                <img 
                  src={fullscreenImage} 
                  alt="Evidence" 
                  className="max-h-[70vh] max-w-[90vw] object-contain rounded-sm" 
                />
           </div>

           {/* Controls Row - Below Image */}
           <div className="flex gap-4 mt-8 z-50" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={closeFullscreen}
                className="bg-black text-white border border-white/30 px-6 py-3 font-mono text-sm tracking-widest hover:bg-white hover:text-black transition-all uppercase"
              >
                [ Close ]
              </button>
           </div>
        </div>
      )}

      <div className={`bg-ufo-black min-h-screen text-ufo-offwhite selection:bg-ufo-accent selection:text-black transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <CustomCursor />
        <NoiseOverlay />

        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 mix-blend-difference ${scrolled ? 'py-4' : 'py-8'}`}>
          <div className="container mx-auto px-6 flex justify-between items-center">
            {/* Header Text - Just "UFO" in new font */}
            <a href="#" className="font-logo text-3xl tracking-tighter hover:text-ufo-accent transition-colors">
             THE UFO
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-8">
              {NAV_ITEMS.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className="font-mono text-sm tracking-widest hover:text-ufo-accent transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-ufo-accent transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-ufo-offwhite hover:text-ufo-accent transition-colors font-mono relative z-50"
              onClick={toggleMenu}
            >
              {menuOpen ? '[ CLOSE ]' : '[ MENU ]'}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-[#121212] flex flex-col justify-center md:hidden">
             {/* Animation Keyframes */}
             <style>{`
                @keyframes slideUpFade {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .nav-item-enter {
                  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
             `}</style>
             
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(40,40,40,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(40,40,40,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

             <div className="flex flex-col w-full px-8 relative z-10">
                {NAV_ITEMS.map((item, idx) => (
                  <a 
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="nav-item-enter group flex items-center justify-between border-b border-gray-800/50 py-5"
                    style={{ animationDelay: `${idx * 100}ms`, opacity: 0 }}
                  >
                    <div className="flex items-baseline gap-4">
                       <span className="font-mono text-xs text-ufo-accent/50 group-hover:text-ufo-accent transition-colors">0{idx + 1}</span>
                       <span className="font-sans text-3xl font-bold text-white group-hover:text-ufo-accent transition-colors tracking-tight">
                        {item.label}
                       </span>
                    </div>
                    <span className="text-ufo-accent opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-4 group-hover:translate-x-0 duration-300">
                       &gt;
                    </span>
                  </a>
                ))}
             </div>
             
             <div className="absolute bottom-10 left-0 w-full text-center nav-item-enter" style={{ animationDelay: '600ms', opacity: 0 }}>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  UFO STUDIOS /// MOBILE UPLINK
                </p>
             </div>
          </div>
        )}

        {/* HERO SECTION */}
        <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* TV Static Background */}
          <TvStaticBackground />
          
          {/* Abstract Background Shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-ufo-gray opacity-[0.05] animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-ufo-gray opacity-[0.05] animate-[spin_40s_linear_infinite_reverse]" />
          
          <RevealOnScroll className="z-10 text-center flex flex-col items-center justify-center w-full">
            {/* Main Hero Logo - Wrapped in GyroTilt for Mobile interaction */}
            <GyroTilt className="mb-8 w-[75vw] h-[75vw] md:w-[340px] md:h-[340px]">
                <div className="relative w-full h-full animate-levitate">
                   {/* Subtle back glow to integrate with background */}
                   <div className="absolute inset-0 bg-ufo-accent/5 rounded-full blur-2xl animate-pulse-slow" />
                   
                   <img 
                     src="/images/logo.png" 
                     alt="UFO Studios" 
                     className="w-full h-full object-contain rounded-full relative z-10 drop-shadow-2xl" 
                   />
                </div>
            </GyroTilt>
          </RevealOnScroll>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
             <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-ufo-accent animate-bounce" />
             <span className="font-mono text-xs opacity-70 tracking-widest text-ufo-accent blink">INCOMING TRANSMISSION</span>
          </div>
        </header>

        {/* MARQUEE */}
        <div className="w-full bg-ufo-accent text-black overflow-hidden py-2 font-mono text-sm font-bold tracking-widest border-y border-ufo-black">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            THIS WAS ONLY A TEST • THIS IS ONLY A TEST • THIS WAS ONLY A TEST • THIS IS ONLY A TEST • THIS WAS ONLY A TEST • THIS IS ONLY A TEST • THIS WAS ONLY A TEST • THIS IS ONLY A TEST •
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .blink {
            animation: blink 1.5s infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          /* New Levitate Animation */
          @keyframes levitate {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-levitate {
            animation: levitate 6s ease-in-out infinite;
          }
          .animate-pulse-slow {
             animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>

        {/* ORIGIN (ABOUT) - Modified for White BG + Lighting Transition */}
        <section 
          id="origin" 
          ref={originRef}
          className={`min-h-screen flex items-center py-20 px-6 bg-white transition-opacity duration-75 ${originVisible ? 'animate-flicker-on opacity-100' : 'opacity-0'}`}
        >
          <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
               {/* Text is Black for contrast against White BG */}
               <div className="mb-8">
                <ScrambleText 
                  text="ORIGIN: 7ASON" 
                  as="h2" 
                  className="font-sans text-5xl md:text-7xl font-bold leading-[0.9] text-ufo-black lining-nums" 
                />
               </div>
               
               <div className="h-1 w-24 bg-black mb-8" />
               <p className="font-mono text-lg text-black/80 leading-relaxed max-w-lg border-l-2 border-black pl-6 font-bold mb-8">
                 Established in the bedroom of 13 year old Jason Eddie Nowak during the summer of 1987, UFO Studios is a shadowy "non-government" contractor, specializing in narrative control and mass communication. Basically, we tell stories. Possibly your story. Let's Make Stuff.
               </p>

               {/* Easter Egg Trigger */}
               <button 
                onClick={handleEasterEgg}
                className="font-mono text-xs tracking-widest text-black/40 hover:text-red-500 transition-colors uppercase border border-black/10 px-4 py-2 hover:border-red-500"
               >
                 [ DO NOT CLICK ]
               </button>
            </RevealOnScroll>

            {/* FILM STRIP / PARALLAX IMAGE COMPONENT */}
            <div className="relative w-full max-w-xs mx-auto">
               <div className="aspect-square relative border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,0.2)]">
                  {/* Label */}
                   <div className="absolute -top-6 left-0 z-20 bg-black text-white px-2 py-1 font-mono text-xs tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                     {currentEvidenceLabel}
                   </div>

                   <ParallaxImage 
                     items={reelItems} 
                     className="h-full w-full"
                     onIndexChange={handleReelChange}
                     onImageClick={(img) => setFullscreenImage(img)}
                   />
                   
                   {/* Decorative "Tape" */}
                   <div className="absolute -bottom-4 -right-4 w-32 h-8 bg-yellow-400 opacity-80 transform -rotate-3 z-30 shadow-sm" />
               </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-24 bg-ufo-black border-t border-ufo-gray/30">
          <div className="container mx-auto px-6">
            <RevealOnScroll className="mb-16">
              <ScrambleText text="PROTOCOLS" as="h2" className="font-sans text-4xl md:text-6xl font-bold text-white mb-4" />
              <div className="w-full h-[1px] bg-ufo-gray opacity-30" />
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((service, idx) => (
                <ServiceItem key={idx} service={service} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* TIMETRUCK */}
        <Timetruck />

        {/* AUDIO */}
        <SunnysmackAudio />

        {/* Easter Egg Link */}
        <div className="py-12 bg-black flex justify-center items-center border-t border-ufo-gray/30">
           <button 
             onClick={handleEasterEgg}
             className="font-mono text-[10px] text-ufo-gray hover:text-red-500 tracking-[0.5em] transition-colors cursor-pointer"
           >
             [ DO NOT CLICK ]
           </button>
        </div>

        {/* INTELLIGENCE / SCAN */}
        <section id="intelligence" className="py-24 bg-[#050505] relative overflow-hidden">
           <div className="container mx-auto px-6 relative z-10">
              <RevealOnScroll className="text-center mb-16">
                 <ScrambleText text="SECTOR SCAN" as="h2" className="font-sans text-4xl md:text-6xl font-bold text-white mb-2" />
                 <p className="font-mono text-ufo-accent text-sm tracking-widest">VISUAL THREAT ASSESSMENT SYSTEM</p>
              </RevealOnScroll>
              
              <VisualThreatAssessment />
           </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="bg-black py-20 px-6 border-t border-ufo-gray/30">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <h2 className="font-sans text-3xl font-bold mb-6">SECURE CHANNEL</h2>
              <a href="mailto:jasoneddie@gmail.com" className="font-mono text-xl hover:text-ufo-accent underline decoration-ufo-accent underline-offset-4 transition-colors">
                jasoneddie@gmail.com
              </a>
              <p className="font-mono text-sm text-gray-500 mt-4">
                FIELD OFFICE:<br/>
                MILWAUKEE, WI<br/>
                UNITED STATES<br/>
                43.0389° N, 87.9065° W
              </p>
            </div>

            <div className="text-right w-full md:w-auto">
               <div 
                 className="w-16 h-16 ml-auto mb-4 cursor-pointer hover:scale-110 transition-transform duration-300"
                 onClick={handleEasterEgg}
               >
                  <img 
                    src="/images/logo.png" 
                    alt="UFO Studios" 
                    className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity" 
                  />
               </div>
               <p className="font-mono text-xs text-gray-600">
                 © 1987 - {new Date().getFullYear()} UFO STUDIOS CORP.<br/>
                 GOVERNMENT CONTRACTOR 87-X.<br/>
                 Please Be Prepared.
               </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default App;
