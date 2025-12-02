import React, { useState, useEffect, useRef } from 'react';
import RevealOnScroll from './RevealOnScroll';
import ScrambleText from './ScrambleText';

// REPLACE THESE WITH YOUR ACTUAL YOUTUBE VIDEO IDs
const ARCHIVES = [
  // Updated the first one with your provided ID: TIyO2eviekc
  { id: 'TIyO2eviekc', title: 'T1: The Tesla Files', date: '1987.10.24' },
  { id: 'ZuyW_caXI1o', title: 'T2: Command Decision II', date: '1988.01.12' },
  { id: 'asVBKzcwOOU', title: 'T3: Donny Tarriffs', date: '1989.03.15' },
  { id: '8NGlSQvP8LI', title: 'T4 Make America Groovy', date: '1990.06.20' },
  { id: 'VfGSWOCpJQc', title: 'T5: The Breakout', date: '1991.09.02' },
  { id: 'HfCIu9o7WFw', title: 'T6: Fort Knox', date: '1992.11.11' },
  { id: 'Yse7CvXtXs8', title: 'T7:  The Basement', date: '1993.12.25' },
  { id: '', title: 'MISSING T8: Coins', date: '1994.02.14' },
  { id: '', title: 'MISSING T9: Nikola Telsa', date: '1995.05.05' },
  { id: '', title: 'MISSING T10: Butler', date: '1996.07.07' },
  { id: '', title: 'LAST TRANSMISSION', date: '2025.12.25' },
];

const Timetruck: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
        id="timetruck" 
        ref={sectionRef}
        className="py-24 px-6 relative border-t border-ufo-gray/30 overflow-hidden bg-black"
    >
      {/* Background Transition Effect: Wipes up from bottom with lighter gray */}
      <div 
        className={`absolute inset-0 bg-[#181818] transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom ${isVisible ? 'scale-y-100' : 'scale-y-0'}`} 
      />

      {/* Grid Pattern Overlay on the gray background */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-1000 delay-500 ${isVisible ? 'opacity-10' : 'opacity-0'}`}
           style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Spinning Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none z-0">
         <div className="w-32 h-32 border border-ufo-accent/30 rounded-full animate-spin-slow" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <RevealOnScroll className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-ufo-gray/50 pb-8 gap-4">
          <div>
            <ScrambleText text="TIMETRUCK ARCHIVES" as="h2" className="font-sans text-4xl md:text-6xl font-bold" />
            <p className="font-mono text-xs text-ufo-accent mt-2">TEMPORAL TRANSMISSION LOGS</p>
          </div>
          <span className="font-mono text-ufo-gray text-xs md:text-sm border border-ufo-gray px-2 py-1">
             TOTAL_ENTRIES: {ARCHIVES.length}
          </span>
        </RevealOnScroll>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ARCHIVES.map((video, idx) => (
            <RevealOnScroll key={idx} delay={idx * 50} threshold={0.1}>
              <div 
                className="group relative cursor-pointer bg-black border border-ufo-gray hover:border-ufo-accent transition-colors duration-300"
                onClick={() => setActiveVideo(video.id)}
              >
                {/* Thumbnail Container */}
                <div className="aspect-video relative overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                   <img 
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} 
                    alt={video.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                   />
                   
                   {/* Overlay Scanlines */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none" />
                   
                   {/* Play Button Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                      <div className="w-12 h-12 border border-ufo-accent flex items-center justify-center rounded-full bg-ufo-accent/10 backdrop-blur-sm">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-ufo-accent border-b-[6px] border-b-transparent ml-1" />
                      </div>
                   </div>
                </div>

                {/* Metadata */}
                <div className="p-4 border-t border-ufo-gray group-hover:border-ufo-accent transition-colors relative">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-mono text-[10px] text-ufo-accent">{video.date}</span>
                     <span className="font-mono text-[10px] text-gray-500">FILE_{String(idx + 1).padStart(3, '0')}</span>
                   </div>
                   <h3 className="font-sans text-sm font-bold text-gray-300 group-hover:text-white truncate pr-4">
                     {video.title}
                   </h3>
                   
                   {/* Corner decoration */}
                   <div className="absolute bottom-0 right-0 w-2 h-2 bg-ufo-gray group-hover:bg-ufo-accent transition-colors" />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-flicker-on"
            onClick={() => setActiveVideo(null)}
        >
          <div className="w-full max-w-6xl aspect-video relative border border-ufo-accent bg-black shadow-[0_0_50px_rgba(255,215,0,0.1)]">
            <iframe 
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            />
            
            {/* Close Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}
                className="absolute -top-12 right-0 font-mono text-white hover:text-ufo-accent text-lg flex items-center gap-2"
            >
                [ CLOSE TERMINAL ]
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Timetruck;
