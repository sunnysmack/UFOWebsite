import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import ScrambleText from './ScrambleText';

// Mock Data - Add your image paths to the 'cover' property
const ALBUMS = [
  {
    title: "FREQUENCY_ZERO",
    year: "2024",
    type: "LP",
    duration: "42:15",
    color: "from-purple-900 to-blue-900",
    tracks: ["Static Dawn", "Neon Veins", "Zero Point"],
    link: "https://open.spotify.com/artist/sunnysmack",
    cover: "" // e.g., "/images/frequency_zero.jpg"
  },
  {
    title: "ANALOG_GHOSTS",
    year: "2023",
    type: "EP",
    duration: "18:30",
    color: "from-red-900 to-orange-900",
    tracks: ["Haunt", "Poltergeist", "Exorcism_V2"],
    link: "https://open.spotify.com/artist/sunnysmack",
    cover: ""
  },
  {
    title: "VOID_RUNNER",
    year: "2022",
    type: "SINGLE",
    duration: "04:20",
    color: "from-emerald-900 to-teal-900",
    tracks: ["Void Runner (Original Mix)"],
    link: "https://open.spotify.com/artist/sunnysmack",
    cover: ""
  },
  {
    title: "SYSTEM_CRASH_V1",
    year: "2021",
    type: "EP",
    duration: "22:10",
    color: "from-rose-900 to-pink-900",
    tracks: ["Kernel Panic", "Fatal Exception", "Force Quit"],
    link: "https://open.spotify.com/artist/sunnysmack",
    cover: ""
  },
  {
    title: "DEEP_WEB_DIVING",
    year: "2020",
    type: "LP",
    duration: "38:45",
    color: "from-cyan-900 to-blue-900",
    tracks: ["Onion Router", "Encrypted Walls", "Bitcoin Assassin"],
    link: "https://open.spotify.com/artist/sunnysmack",
    cover: ""
  },
  {
    title: "SIGNAL_LOSS",
    year: "2019",
    type: "SINGLE",
    duration: "03:33",
    color: "from-gray-800 to-gray-900",
    tracks: ["White Noise", "Static (Reprise)"],
    link: "https://open.spotify.com/artist/sunnysmack",
    cover: ""
  }
];

const SunnysmackAudio: React.FC = () => {
  return (
    <section id="audio" className="py-24 relative bg-[#0a0a0a] overflow-hidden border-t border-ufo-gray/30">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-ufo-accent/50" />
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-ufo-gray/30" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-ufo-gray/30" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <RevealOnScroll className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-ufo-gray/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="flex gap-1 h-6 items-end">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-ufo-accent animate-[equalizer_1s_ease-in-out_infinite]" 
                      style={{ animationDelay: `${i * 0.1}s`, height: '100%' }}
                    />
                  ))}
               </div>
               <span className="font-mono text-xs text-ufo-accent tracking-widest">AUDIO_LINK_ESTABLISHED</span>
            </div>
            <ScrambleText text="SUNNYSMACK" as="h2" className="font-sans text-5xl md:text-7xl font-bold text-white tracking-tighter" />
            <p className="font-mono text-gray-500 mt-2">SONIC WARFARE / AUDIO ARCHIVE</p>
          </div>
          
          <div className="hidden md:block font-mono text-right text-xs text-gray-400">
             ARTIST_ID: SNSMK<br/>
             STATUS: BROADCASTING
          </div>
        </RevealOnScroll>

        {/* Horizontal Scroll Deck - "Wow" Factor for Mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-2 -mx-6 md:mx-0 md:px-0 scrollbar-hide">
           {/* Spacer for mobile left alignment */}
           <div className="w-2 shrink-0 md:hidden" />

           {ALBUMS.map((album, idx) => (
             <div 
                key={idx} 
                className="snap-center shrink-0 w-[85vw] md:w-[350px] relative group perspective-1000"
             >
                {/* Card Container */}
                <div className="relative bg-[#111] border border-ufo-gray group-hover:border-ufo-accent transition-all duration-500 overflow-hidden rounded-sm hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,215,0,0.1)]">
                   
                   {/* Album Art Container - SQUARE (Aspect Ratio 1:1) */}
                   <div className="aspect-square w-full relative overflow-hidden bg-black">
                      {album.cover ? (
                         <img 
                           src={album.cover} 
                           alt={album.title} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                         />
                      ) : (
                         /* Fallback CSS Tape Art - Centered in Square */
                         <div className={`w-full h-full bg-gradient-to-br ${album.color} relative p-6 flex flex-col justify-center items-center`}>
                            {/* Noise Texture */}
                            <div className="absolute inset-0 opacity-30 bg-noise mix-blend-overlay" />
                            
                            {/* Tape Reels UI */}
                            <div className="relative z-10 bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-sm flex items-center justify-between w-full max-w-[90%] shadow-lg">
                               <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-dashed border-white/40" />
                               </div>
                               <div className="h-6 md:h-8 flex-1 mx-4 bg-black/50 rounded-sm overflow-hidden flex items-center px-2">
                                  <div className="w-full h-1 bg-white/20" />
                               </div>
                               <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-dashed border-white/40" />
                               </div>
                            </div>

                            <div className="relative z-10 mt-6">
                              <span className="font-mono text-xs border border-white/30 px-3 py-1 rounded text-white/80">{album.type}</span>
                            </div>
                         </div>
                      )}
                      
                      {/* Overlay Play Button (Visible on Hover) */}
                      <a href={album.link} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 cursor-pointer">
                          <div className="w-16 h-16 rounded-full border border-ufo-accent bg-black/50 backdrop-blur flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
                               <div className="ml-1 border-y-[8px] border-y-transparent border-l-[16px] border-l-ufo-accent" />
                          </div>
                      </a>
                   </div>

                   {/* Info Section */}
                   <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-sans text-xl md:text-2xl font-bold text-white group-hover:text-ufo-accent transition-colors truncate w-[200px] md:w-auto">{album.title}</h3>
                          <p className="font-mono text-xs text-gray-500 mt-1">{album.year} • {album.duration}</p>
                        </div>
                      </div>

                      {/* Tracklist Preview */}
                      <div className="space-y-2 mb-6 border-t border-ufo-gray/30 pt-4">
                        {album.tracks.map((track, tIdx) => (
                           <div key={tIdx} className="flex justify-between items-center font-mono text-xs text-gray-400 group-hover:text-gray-300">
                              <span>0{tIdx + 1}. {track}</span>
                           </div>
                        ))}
                      </div>

                      <a 
                        href={album.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center py-3 border border-ufo-accent/30 text-ufo-accent font-mono text-xs uppercase hover:bg-ufo-accent hover:text-black transition-colors"
                      >
                        Stream Transmission
                      </a>
                   </div>
                </div>
             </div>
           ))}
           
           {/* Spacer for mobile right alignment */}
           <div className="w-2 shrink-0 md:hidden" />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes equalizer {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default SunnysmackAudio;
