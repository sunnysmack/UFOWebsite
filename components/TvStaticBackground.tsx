import React, { useEffect, useRef } from 'react';

const TvStaticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      
      // 1. Center Glow (Brighter static near logo)
      // We draw a white radial gradient with 'screen' blend mode to boost brightness in center
      const centerGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, h / 2);
      centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.15)'); // Subtle white glow at center
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

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none mix-blend-screen z-0"
    />
  );
};

export default TvStaticBackground;
