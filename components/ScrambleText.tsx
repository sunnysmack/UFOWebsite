import React, { useEffect, useRef, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

const CHARS = '!@#$%^&*()_+-=[]{}|;:",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ScrambleText: React.FC<ScrambleTextProps> = ({ 
  text, 
  className = "", 
  scrambleSpeed = 30,
  revealSpeed = 70, // ms between revealing next character
  as: Component = 'div'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const iterationRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let currentIteration = 0;
    const maxIterations = text.length;
    
    // Clear previous timer if any
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setDisplayText(prev => {
        const result = text.split('').map((char, index) => {
          if (index < currentIteration) {
            return text[index];
          }
          // Preserve spaces, scramble others
          if (char === ' ') return ' ';
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        
        return result;
      });

      if (currentIteration >= maxIterations) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
      
      currentIteration += 1/3; // Slow down the reveal
    }, scrambleSpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, text, scrambleSpeed]);

  return (
    // Fix: Type cast ref to any to handle dynamic component type 'as' prop
    <Component ref={elementRef as any} className={className}>
      {displayText || text.split('').map(() => '#').join('')}
    </Component>
  );
};

export default ScrambleText;
