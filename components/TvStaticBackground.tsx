import React, { useEffect, useRef } from 'react';

interface TvStaticProps {
  className?: string;
}

const TvStaticBackground: React.FC<TvStaticProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      // Use parent dimensions if available, else fallback to window
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) { // Sparsity of noise
           // White noise with varying opacity
           buffer32[i] = ((Math.random() * 255) | 0) << 24 | 0x00FFFFFF; 
        }
      }

      ctx.putImageData(idata, 0, 0);

      // Add scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      for (let i = 0; i < h; i += 4) {
        ctx.fillRect(0, i, w, 2);
      }
      
      // 1. Center Glow (Brighter static near logo/center)
      const centerGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, h / 2);
      centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.15)'); 
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      // 2. Vignette (Darken edges)
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h / 3, w / 2, h / 2, h);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.8)');
      
      ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
      ctx.fillStyle = vignette; 
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const defaultStyles = "opacity-30 mix-blend-screen";
  const finalClassName = `absolute inset-0 w-full h-full pointer-events-none z-0 ${className || defaultStyles}`;

  return (
    <canvas 
      ref={canvasRef} 
      className={finalClassName}
    />
  );
};

export default TvStaticBackground;
