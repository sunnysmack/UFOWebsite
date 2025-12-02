import React, { useState, useRef } from 'react';
import { analyzeSectorImage } from '../services/geminiService';
import { LoadingState, ThreatAnalysisResponse } from '../types';
import ScrambleText from './ScrambleText';

const VisualThreatAssessment: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<ThreatAnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (navigator.vibrate) navigator.vibrate(20);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysisState(LoadingState.IDLE);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    
    if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    setAnalysisState(LoadingState.LOADING);
    
    try {
      const data = await analyzeSectorImage(image);
      setResult(data);
      setAnalysisState(LoadingState.SUCCESS);
      if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50]);
    } catch (error) {
      setAnalysisState(LoadingState.ERROR);
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setAnalysisState(LoadingState.IDLE);
  };

  return (
    <div className="w-full max-w-2xl mx-auto border-2 border-ufo-accent/50 bg-ufo-black/80 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative HUD Elements */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ufo-accent" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ufo-accent" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-ufo-accent" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ufo-accent" />
      
      {/* Header */}
      <div className="bg-ufo-accent/10 border-b border-ufo-accent/30 p-2 flex justify-between items-center">
        <span className="font-mono text-xs text-ufo-accent tracking-widest animate-pulse">
          ● LIVE FEED
        </span>
        <span className="font-mono text-xs text-ufo-accent/70">
          SYS_V.4.0
        </span>
      </div>

      <div className="p-4 md:p-8">
        {!image ? (
          // INITIAL STATE: UPLOAD UI
          <div className="aspect-video border border-dashed border-ufo-gray flex flex-col items-center justify-center gap-4 bg-ufo-gray/5 group hover:bg-ufo-gray/10 transition-colors cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <div className="w-16 h-16 rounded-full border border-ufo-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
               <div className="w-12 h-12 bg-ufo-accent rounded-full opacity-20 group-hover:opacity-40" />
               <span className="absolute text-2xl text-ufo-accent">+</span>
            </div>
            <p className="font-mono text-ufo-accent text-sm tracking-wider text-center px-4">
              UPLOAD SECTOR VISUALS<br/>
              <span className="text-xs opacity-50">(TAP TO ACTIVATE CAMERA)</span>
            </p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          // IMAGE PREVIEW / RESULT STATE
          <div className="relative">
            <div className="relative aspect-video overflow-hidden border border-ufo-gray bg-black">
              <img 
                src={image} 
                alt="Target Sector" 
                className={`w-full h-full object-cover transition-all duration-1000 ${analysisState === LoadingState.LOADING ? 'opacity-50 grayscale' : 'opacity-80'}`} 
              />
              
              {/* Scanning Overlay */}
              {analysisState === LoadingState.LOADING && (
                <div className="absolute inset-0 z-10">
                   <div className="w-full h-1 bg-ufo-accent/50 absolute top-0 animate-[scan_2s_linear_infinite] shadow-[0_0_15px_#FFD700]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/80 px-4 py-2 border border-ufo-accent">
                        <span className="font-mono text-ufo-accent text-xs blink">ANALYZING BIOMETRICS...</span>
                      </div>
                   </div>
                </div>
              )}

              {/* Scanlines on image */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02),rgba(0,0,0,0.06))] bg-[length:100%_4px,6px_100%]" />
            </div>

            {/* Controls */}
            {analysisState === LoadingState.IDLE && (
               <div className="flex gap-4 mt-4">
                 <button 
                  onClick={reset}
                  className="flex-1 py-3 border border-ufo-gray text-gray-500 font-mono text-xs hover:bg-ufo-gray/20 transition-colors"
                 >
                   RESET
                 </button>
                 <button 
                  onClick={handleScan}
                  className="flex-[2] py-3 bg-ufo-accent text-black font-mono font-bold text-sm tracking-widest hover:bg-white transition-colors"
                 >
                   INITIATE SCAN
                 </button>
               </div>
            )}
            
            {analysisState === LoadingState.ERROR && (
               <div className="mt-4 text-center">
                 <p className="font-mono text-red-500 text-sm mb-4">SIGNAL LOST. RETRY.</p>
                 <button 
                  onClick={reset}
                  className="w-full py-3 border border-red-500 text-red-500 font-mono text-xs hover:bg-red-900/20 transition-colors"
                 >
                   RESET SYSTEM
                 </button>
               </div>
            )}
          </div>
        )}
      </div>

      {/* RESULTS PANEL */}
      {analysisState === LoadingState.SUCCESS && result && (
        <div className="border-t-2 border-ufo-accent/30 bg-black/90 p-6 animate-in slide-in-from-bottom duration-500">
           <div className="flex justify-between items-start mb-6">
             <div>
                <span className="font-mono text-[10px] text-gray-500 block mb-1">SECTOR STATUS</span>
                <ScrambleText text={result.sectorStatus} className="font-sans text-2xl font-bold text-white uppercase" />
             </div>
             <button onClick={reset} className="text-ufo-accent text-xs font-mono underline">[ NEW SCAN ]</button>
           </div>

           <div className="space-y-4">
             {result.anomalies.map((anomaly, idx) => (
               <div key={idx} className="border-l-2 border-ufo-accent pl-4 py-1 relative">
                 <div className="absolute -left-[5px] top-0 w-2 h-2 bg-ufo-accent rounded-full" />
                 <div className="flex justify-between items-baseline mb-1">
                   <h4 className="font-mono text-ufo-accent text-sm font-bold uppercase">{anomaly.designation}</h4>
                   <span className={`text-[10px] px-2 py-0.5 font-bold ${
                     anomaly.threatLevel === 'LOW' ? 'bg-green-900 text-green-300' :
                     anomaly.threatLevel === 'MODERATE' ? 'bg-yellow-900 text-yellow-300' :
                     'bg-red-900 text-red-100 animate-pulse'
                   }`}>
                     {anomaly.threatLevel}
                   </span>
                 </div>
                 <p className="font-mono text-xs text-gray-400 mb-1">TARGET: {anomaly.object.toUpperCase()}</p>
                 <p className="font-sans text-sm text-gray-200 leading-tight">
                   {anomaly.description}
                 </p>
               </div>
             ))}
           </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VisualThreatAssessment;
