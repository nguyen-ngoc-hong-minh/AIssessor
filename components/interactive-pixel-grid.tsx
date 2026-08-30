"use client";
import React, { useEffect, useState, useRef } from "react";

export function InteractivePixelGrid() {
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    
    const render = () => {
      // Resize handling could be added here
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      const cellSize = 64;
      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      // We only draw boxes near the mouse
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize;
          const y = r * cellSize;
          
          const centerX = x + cellSize / 2;
          const centerY = y + cellSize / 2;
          
          const dx = mouse.x - centerX;
          const dy = mouse.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200) {
            // Draw an interactive highlight box
            const alpha = Math.max(0, 1 - dist / 200) * 0.1;
            ctx.fillStyle = `rgba(16, 63, 213, ${alpha})`;
            ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mouse]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
