import logo from './logo.png';
import React, { useState, useEffect, useRef } from 'react';
import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';
import RevealOnScroll from './components/RevealOnScroll';
import ParallaxImage from './components/ParallaxImage';
import TvStaticBackground from './components/TvStaticBackground';
import RollingLogo from './components/RollingLogo';
import { generateAlienSlogan } from './services/geminiService';
import { LoadingState, AlienResponse } from './types';
import { NavItem } from './types';

const NAV_ITEMS: NavItem[] = [
  { label: 'CLASSIFIED', href: '#origin' },
  { label: 'OPERATIONS', href: '#services' },
  { label: 'INTELLIGENCE', href: '#intelligence' },
  { label: 'COMMS', href: '#contact' }
];

// Recreated Logo Component for Preview Visibility
const LogoSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="curveTop" d="M 100,250 A 150,150 0 0,1 400,250" />
      <path id="curveBottom" d="M 100,250 A 150,150 0 0,0 400,250" />
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Outer Ring */}
    <circle cx="250" cy="250" r="240" fill="none" stroke="currentColor" strokeWidth="15" className="opacity-80" />
    <circle cx="250" cy="250" r="230" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />

    {/* Text Paths */}
    <text fill="currentColor" className="font-logo font-bold tracking-widest" fontSize="52" textAnchor="middle">
      <textPath href="#curveTop" startOffset="50%">UFO STUDIOS</textPath>
    </text>
    
    <text fill="currentColor" className="font-logo font-bold tracking-widest" fontSize="42" textAnchor="middle">
      <textPath href="#curveBottom" startOffset="50%">SINCE 1987</textPath>
    </text>

    {/* Center UFO Icon */}
    <g transform="translate(140, 160) scale(0.9)" filter="url(#glow)">
       {/* Dome */}
       <path d="M 120,40 A 60,50 0 0,1 120,100" fill="none" stroke="currentColor" strokeWidth="8" transform="rotate(-90 120 100)"/>
       <circle cx="120" cy="40" r="8" fill="currentColor" />
       
       {/* Saucer */}
       <ellipse cx="122" cy="110" rx="100" ry="30" fill="currentColor" />
       <line x1="22" y1="110" x2="222" y2="110" stroke="black" strokeWidth="2" />
       
       {/* Lights */}
       <circle cx="70" cy="110" r="5" fill="black" />
       <circle cx="122" cy="110" r="5" fill="black" />
       <circle cx="174" cy="110" r="5" fill="black" />

       {/* Beams */}
       <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="animate-pulse">
         <line x1="100" y1="150" x2="80" y2="190" />
         <line x1="122" y1="150" x2="122" y2="200" />
         <line x1="144" y1="150" x2="164" y2="190" />
       </g>
    </g>
  </svg>
);

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aiState, setAiState] = useState<LoadingState>(LoadingState.IDLE);
  const [aiResponse, setAiResponse] = useState<AlienResponse | null>(null);
  
  // Ref and state for the lighting transition on the Origin section
  const originRef = useRef<HTMLDivElement>(null);
  const [originVisible, setOriginVisible] = useState(false);

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

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setAiState(LoadingState.LOADING);
    setAiResponse(null);

    try {
      const result = await generateAlienSlogan(prompt);
      setAiResponse(result);
      setAiState(LoadingState.SUCCESS);
    } catch (error) {
      setAiState(LoadingState.ERROR);
    }
  };

  return (
    <div className="bg-ufo-black min-h-screen text-ufo-offwhite selection:bg-ufo-accent selection:text-black">
      <CustomCursor />
      <NoiseOverlay />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 mix-blend-difference ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Header Text - Just "UFO" in new font */}
          <a href="#" className="font-logo text-3xl tracking-tighter hover:text-ufo-accent transition-colors">
            The UFO
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
            className="md:hidden text-ufo-offwhite hover:text-ufo-accent transition-colors font-mono"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '[ CLOSE ]' : '[ MENU ]'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-ufo-black/95 backdrop-blur-md flex flex-col justify-center items-center gap-8 md:hidden">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-4xl font-bold hover:text-ufo-accent glitch-text"
              data-text={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* HERO SECTION */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* TV Static Background */}
        <TvStaticBackground />
        
        {/* Abstract Background Shapes - Now Green - Lower opacity to blend with static */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-ufo-gray opacity-10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-ufo-gray opacity-10 animate-[spin_40s_linear_infinite_reverse]" />
        
        <RevealOnScroll className="z-10 text-center flex flex-col items-center justify-center w-full">
          {/* Main Hero Logo - Using RollingLogo with SVG child for preview */}
  <div className="w-[75vw] h-[75vw] md:w-[340px] md:h-[340px] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-8">
  <img 
    src={logo} 
    className="w-full h-full object-contain" 
    alt="UFO Studios Logo" 
  />
</div>
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
             <h2 className="font-sans text-5xl md:text-7xl font-bold mb-8 leading-[0.9] text-ufo-black">
               ORIGIN<br/>
               <span className="text-transparent" style={{WebkitTextStroke: '1px #050505'}}>UNKNOWN</span>
             </h2>
             <div className="h-1 w-24 bg-black mb-8" />
             <p className="font-mono text-lg text-black/80 leading-relaxed max-w-lg border-l-2 border-black pl-6 font-bold">
               Established 1987 under Project 1987-Alpha. UFO Studios is a shadowy government contractor specializing in narrative control and mass communication. We manufacture the legends the public believes.
             </p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200} className="relative group">
            {/* Image Border darkened for contrast */}
            <div className="aspect-square border border-black relative overflow-hidden bg-black rounded-sm shadow-[10px_10px_0px_rgba(0,0,0,0.2)]">
               {/* New Parallax Component */}
               <ParallaxImage 
                 src="https://picsum.photos/800/800?grayscale" 
                 alt="Studio Interior" 
                 className="w-full h-full opacity-80 mix-blend-luminosity contrast-125 transition-all duration-700" 
               />
               
               {/* CRT Scanline Overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02),rgba(0,0,0,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
               
               <div className="absolute top-4 left-4 border border-black text-black px-2 py-1 font-mono text-xs tracking-widest z-20 bg-ufo-accent/80 backdrop-blur-sm">
                 TOP SECRET
               </div>
               <div className="absolute bottom-4 right-4 font-mono text-xs bg-black text-ufo-accent px-2 py-1 font-bold z-20">
                 FIG. 01: THE BUNKER
               </div>
            </div>
            {/* Decorative corners - Black */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-black" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-black" />
          </RevealOnScroll>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 bg-[#080808] relative border-t border-ufo-gray/30">
        <div className="container mx-auto">
          <RevealOnScroll className="mb-16 flex items-end justify-between border-b border-ufo-gray/50 pb-8">
            <h2 className="font-sans text-4xl md:text-6xl font-bold">PROTOCOL</h2>
            <span className="font-mono text-ufo-accent hidden md:block">CLEARANCE: LEVEL 4</span>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { title: 'PROPAGANDA', desc: 'Social engineering and viral deployment. We control the narrative before it spreads.', num: '01' },
               { title: 'COUNTER INTEL', desc: 'Visual design that confuses, captivates, and commands attention.', num: '02' },
               { title: 'HISTORY REVISION', desc: 'Brand narrative construction. We write the past to secure your future.', num: '03' }
             ].map((service, idx) => (
               <RevealOnScroll key={idx} delay={idx * 150} threshold={0.2}>
                 <div className="group border border-ufo-gray p-8 hover:bg-ufo-gray/10 hover:border-ufo-accent transition-all duration-300 h-full flex flex-col justify-between min-h-[300px] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-2 h-2 bg-ufo-accent rounded-full animate-ping" />
                   </div>
                   <div>
                     <span className="font-mono text-xs opacity-50 mb-4 block text-ufo-accent">FILE NO. {service.num}</span>
                     <h3 className="font-sans text-2xl font-bold mb-4 text-ufo-offwhite group-hover:text-ufo-accent transition-colors">{service.title}</h3>
                     <p className="font-mono text-sm opacity-80 leading-relaxed group-hover:text-white">
                       {service.desc}
                     </p>
                   </div>
                   <div className="w-full h-[1px] bg-ufo-gray mt-8 group-hover:bg-ufo-accent transition-colors" />
                 </div>
               </RevealOnScroll>
             ))}
          </div>
        </div>
      </section>

      {/* ALIEN INTELLIGENCE (GEMINI DEMO) */}
      <section id="intelligence" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-ufo-accent/5" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <RevealOnScroll className="text-center mb-12">
            <h2 className="font-sans text-4xl md:text-5xl font-bold mb-4">STRATEGIC COMMAND_AI</h2>
            <p className="font-mono text-sm text-gray-400">SECURE LINE ESTABLISHED... ENTER TARGET TOPIC FOR ANALYSIS.</p>
          </RevealOnScroll>

          <div className="bg-ufo-black border border-ufo-accent p-1 shadow-[0_0_20px_rgba(57,255,20,0.15)]">
            <div className="border border-ufo-accent/30 p-8 md:p-12 flex flex-col items-center">
              
              <form onSubmit={handleAiGenerate} className="w-full max-w-lg mb-8 flex gap-0">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="SUBJECT: E.g., SURVEILLANCE DRONES"
                  className="flex-1 bg-transparent border-b border-ufo-gray py-4 px-2 font-mono text-lg focus:outline-none focus:border-ufo-accent focus:bg-ufo-accent/5 transition-all placeholder:text-gray-700 text-ufo-accent"
                />
                <button 
                  type="submit"
                  disabled={aiState === LoadingState.LOADING}
                  className="bg-ufo-accent text-black font-mono font-bold px-6 py-4 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {aiState === LoadingState.LOADING ? 'ENCRYPTING...' : 'SUBMIT'}
                </button>
              </form>

              {/* Output Area */}
              <div className="w-full min-h-[200px] flex items-center justify-center text-center">
                {aiState === LoadingState.IDLE && (
                   <span className="font-mono text-xs text-ufo-accent/50 blink">AWAITING CLASSIFIED DATA_</span>
                )}
                
                {aiState === LoadingState.ERROR && (
                   <span className="font-mono text-red-500">ERROR: SECURITY BREACH DETECTED.</span>
                )}

                {aiState === LoadingState.SUCCESS && aiResponse && (
                  <div className="animate-in fade-in zoom-in duration-500 w-full">
                    <div className="flex justify-center mb-4">
                        <span className="border border-ufo-accent text-ufo-accent px-2 py-1 text-xs font-mono tracking-widest">DECLASSIFIED</span>
                    </div>
                    <h3 className="font-sans text-3xl md:text-5xl font-bold mb-6 text-ufo-offwhite leading-tight uppercase glitch-text" data-text={aiResponse.slogan}>
                      "{aiResponse.slogan}"
                    </h3>
                    <div className="inline-block border border-ufo-gray px-4 py-2 bg-ufo-gray/20">
                      <p className="font-mono text-xs md:text-sm text-gray-400">
                        STRATEGIC RATIONALE: {aiResponse.rationale}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-black py-20 px-6 border-t border-ufo-gray/30">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h2 className="font-sans text-3xl font-bold mb-6">SECURE CHANNEL</h2>
            <a href="mailto:hello@ufostudios.us" className="font-mono text-xl hover:text-ufo-accent underline decoration-ufo-accent underline-offset-4 transition-colors">
              hello@ufostudios.us
            </a>
            <p className="font-mono text-sm text-gray-500 mt-4">
              FIELD OFFICE:<br/>
              MILWAUKEE, WI<br/>
              UNITED STATES<br/>
              43.0389° N, 87.9065° W
            </p>
          </div>

          <div className="text-right">
             <div className="w-16 h-16 ml-auto mb-4 text-white">
                <LogoSVG className="w-full h-full opacity-50 hover:opacity-100 transition-opacity" />
             </div>
             <p className="font-mono text-xs text-gray-600">
               © 1987 - {new Date().getFullYear()} UFO STUDIOS CORP.<br/>
               GOVERNMENT CONTRACTOR 87-X.<br/>
               TRUST NO ONE.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
