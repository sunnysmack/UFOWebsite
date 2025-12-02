import logo from './logo.png';
import React, { useState, useEffect, useRef } from 'react';
import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';
import RevealOnScroll from './components/RevealOnScroll';
import ParallaxImage from './components/ParallaxImage';
import TvStaticBackground from './components/TvStaticBackground';
import RollingLogo from './components/RollingLogo';
import ScrambleText from './components/ScrambleText';
import Preloader from './components/Preloader';
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
         <line x1="1
