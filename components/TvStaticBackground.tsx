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
      
      // Vignette
      const gradient = ctx.createRadialGradient(w / 2, h / 2, h / 3, w / 2, h / 2, h);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient; // We can't directly use gradient as fillStyle over putImageData easily without globalCompositeOperation or drawing a rect
      
      // Since putImageData overwrites, we draw effects after
      ctx.globalCompositeOperation = 'source-over';
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