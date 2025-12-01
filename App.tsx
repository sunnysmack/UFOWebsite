import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';
import RevealOnScroll from './components/RevealOnScroll';
import ParallaxImage from './components/ParallaxImage';
import TvStaticBackground from './components/TvStaticBackground';
import { generateAlienSlogan } from './services/geminiService';
import { LoadingState, ClassifiedResponse } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<ClassifiedResponse | null>(null);
  const [isFlickering, setIsFlickering] = useState(false);

  // Trigger the light flicker effect when the Origin section comes into view
  useEffect(() => {
    const handleScroll = () => {
      const originSection = document.getElementById('origin');
      if (originSection) {
        const rect = originSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          setIsFlickering(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSloganGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading('loading');
    try {
      const result = await generateAlienSlogan(input);
      setResponse(result);
      setLoading('success');
    } catch (error) {
      console.error(error);
      setLoading('error');
    }
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white overflow-x-hidden selection:bg-ufo-accent selection:text-black">
      <CustomCursor />
      <NoiseOverlay />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-2">
          <span className="font-logo text-2xl tracking-tighter text-ufo-accent">UFO</span>
        </div>
        <div className="hidden md:flex gap-8 font-mono text-sm tracking-widest text-ufo-accent">
          <a href="#origin" className="hover:text-white transition-colors">ORIGIN</a>
          <a href="#services" className="hover:text-white transition-colors">SERVICES</a>
          <a href="#operations" className="hover:text-white transition-colors">OPERATIONS</a>
        </div>
        <div className="md:hidden text-ufo-accent text-xs animate-pulse">
          SECURE_CONN_ESTABLISHED
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background - TV Static Effect */}
        <div className="absolute inset-0 z-0 opacity-30">
          <TvStaticBackground />
        </div>
        
        <div className="z-10 text-center px-4 flex flex-col items-center">
          {/* Logo Container - 75% Width on Mobile, Spinning */}
          <div className="w-[75vw] h-[75vw] md:w-[340px] md:h-[340px] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-8">
            <img 
              src={logo} 
              className="w-full h-full object-contain animate-spin md:animate-none" 
              style={{ animationDuration: '15s' }}
              alt="UFO Studios Logo" 
            />
          </div>

          <RevealOnScroll>
            <h1 className="glitch-text text-4xl md:text-7xl font-bold tracking-tighter mb-4 text-white" data-text="UFO STUDIOS">
              UFO STUDIOS
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <p className="font-mono text-ufo-accent tracking-[0.2em] text-sm md:text-base animate-pulse">
              INCOMING TRANSMISSION
            </p>
          </RevealOnScroll>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-ufo-accent to-transparent animate-scroll-line"></div>
        </div>
      </section>

      {/* Origin Section - White Background */}
      <section id="origin" className={`py-24 px-6 relative bg-white text-black transition-opacity duration-1000 ${isFlickering ? 'animate-flicker-on opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <RevealOnScroll>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">THE ORIGIN</h2>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <div className="space-y-6 font-mono text-sm leading-relaxed border-l-2 border-black pl-6">
                <p>
                  ESTABLISHED 1987. CLASSIFIED SECTOR 4.
                </p>
                <p>
                  We operate in the shadows of the creative industry. Our mission is not to sell, but to infiltrate the public consciousness through advanced memetic warfare and high-frequency visual propaganda.
                </p>
                <p>
                  What you see is not real. What you feel is designed.
                </p>
              </div>
            </RevealOnScroll>
          </div>
          <div className="relative h-[600px] border-2 border-black p-2">
             <div className="absolute top-4 left-4 z-10 bg-black text-white px-3 py-1 font-mono text-xs">
                EVIDENCE_FILE_882
             </div>
             <div className="w-full h-full overflow-hidden grayscale contrast-125">
               <ParallaxImage 
                 src="https://images.unsplash.com/photo-1518331483807-f671ed1963fa?q=80&w=2670&auto=format&fit=crop" 
                 alt="Underground Bunker"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Services Section - Black Background */}
      <section id="services" className="py-24 px-6 bg-black border-t border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h2 className="text-ufo-accent font-mono text-sm tracking-widest mb-12 border-b border-neutral-800 pb-4">
              // ACTIVE_PROTOCOLS
            </h2>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'PROPAGANDA', desc: 'Viral campaigns designed to alter public perception.' },
              { title: 'ACQUISITION', desc: 'Targeted audience capture through visual hypnosis.' },
              { title: 'INTELLIGENCE', desc: 'Data-driven insights from the collective unconscious.' }
            ].map((service, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="group border border-neutral-800 p-8 hover:bg-neutral-900 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-ufo-accent rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-ufo-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-mono text-xs text-gray-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Operations Section (AI) */}
      <section id="operations" className="py-24 px-6 bg-neutral-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <RevealOnScroll>
            <div className="mb-12">
              <div className="inline-block border border-ufo-accent px-4 py-1 rounded-full text-ufo-accent font-mono text-xs mb-6 animate-pulse">
                RESTRICTED ACCESS: CLEARANCE LEVEL 5
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">DIRECTOR OF DISINFORMATION</h2>
              <p className="text-gray-400 max-w-lg mx-auto font-mono text-sm">
                Enter a target subject. Our neural network will generate the appropriate cover story.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <form onSubmit={handleSloganGeneration} className="max-w-lg mx-auto relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ENTER SUBJECT..."
                className="w-full bg-black border-2 border-neutral-700 p-4 text-center font-mono text-white focus:border-ufo-accent focus:outline-none transition-colors uppercase tracking-widest placeholder:text-neutral-800"
              />
              <button 
                type="submit"
                disabled={loading === 'loading'}
                className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black font-bold hover:bg-ufo-accent hover:text-black transition-colors disabled:opacity-50 font-mono text-xs"
              >
                {loading === 'loading' ? 'PROCESSING...' : 'TRANSMIT'}
              </button>
            </form>
          </RevealOnScroll>

          {response && (
            <div className="mt-12 text-left max-w-lg mx-auto border border-ufo-accent bg-black p-8 relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ufo-accent to-transparent opacity-50"></div>
               <div className="font-mono text-xs text-ufo-accent mb-4 opacity-50">
                 // RESPONSE_RECEIVED_
               </div>
               <p className="text-2xl font-bold text-white mb-4 leading-tight">
                 "{response.slogan}"
               </p>
               <p className="font-mono text-xs text-gray-500 uppercase">
                 STRATEGY: {response.rationale}
               </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-neutral-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end">
          <div className="mb-8 md:mb-0">
            <a href="#" className="font-logo text-4xl text-white block mb-4">UFO</a>
            <a href="mailto:hello@ufostudios.us" className="font-mono text-sm text-gray-500 hover:text-ufo-accent transition-colors">
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
                <img 
                  src={logo} 
                  alt="UFO Studios Logo" 
                  className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
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
