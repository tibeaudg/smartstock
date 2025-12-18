import React, { useEffect, useRef } from 'react';

interface GradientMeshBackgroundProps {
  className?: string;
}

export function GradientMeshBackground({ className = '' }: GradientMeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color stops: Primary blue theme - blue-900, blue-700, blue-500
    const color1 = { r: 30, g: 58, b: 138 };   // blue-900 (#1e3a8a) - darker base
    const color2 = { r: 29, g: 78, b: 216 };   // blue-700 (#1d4ed8) - primary blue
    const color3 = { r: 59, g: 130, b: 246 };  // blue-500 (#3b82f6) - lighter accent

    let time = 0;
    const frequency = 0.05; // 0.05Hz for slow organic movement

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient mesh with multiple overlapping gradients
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * frequency) * 100,
        canvas.height * 0.3 + Math.cos(time * frequency * 1.3) * 100,
        0,
        canvas.width * 0.3 + Math.sin(time * frequency) * 100,
        canvas.height * 0.3 + Math.cos(time * frequency * 1.3) * 100,
        canvas.width * 0.8
      );
      gradient1.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0.6)`);
      gradient1.addColorStop(0.5, `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0.4)`);
      gradient1.addColorStop(1, `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0)`);

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(time * frequency * 0.8) * 150,
        canvas.height * 0.7 + Math.sin(time * frequency * 1.1) * 150,
        0,
        canvas.width * 0.7 + Math.cos(time * frequency * 0.8) * 150,
        canvas.height * 0.7 + Math.sin(time * frequency * 1.1) * 150,
        canvas.width * 0.9
      );
      gradient2.addColorStop(0, `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0.5)`);
      gradient2.addColorStop(0.4, `rgba(${color3.r}, ${color3.g}, ${color3.b}, 0.2)`);
      gradient2.addColorStop(1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0)`);

      const gradient3 = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * frequency * 1.5) * 80,
        canvas.height * 0.5 + Math.cos(time * frequency * 0.7) * 80,
        0,
        canvas.width * 0.5 + Math.sin(time * frequency * 1.5) * 80,
        canvas.height * 0.5 + Math.cos(time * frequency * 0.7) * 80,
        canvas.width * 0.6
      );
      gradient3.addColorStop(0, `rgba(${color3.r}, ${color3.g}, ${color3.b}, 0.15)`);
      gradient3.addColorStop(1, `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0)`);

      // Draw gradients with blend mode
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'source-over';
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

