"use client";
import React, { useEffect, useState, useRef } from "react";

export function InteractivePixelGrid() {
  const [mouse, setMouse] = useState({ x: -100, y: -100, active: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY, active: true });
    };
    const handleLeave = () => setMouse((prev) => ({ ...prev, active: false }));
    
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;
    
    // Store grid cell brightness for fading trails
    const cols = Math.ceil(window.innerWidth / 64);
    const rows = Math.ceil(window.innerHeight / 64);
    const cells = new Float32Array(cols * rows);

    const render = () => {
      time += 0.05;
      
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      const width = canvas.width;
      const height = canvas.height;
      const cellSize = 64;
      
      ctx.clearRect(0, 0, width, height);

      const mCol = Math.floor(mouse.x / cellSize);
      const mRow = Math.floor(mouse.y / cellSize);

      for (let r = 0; r < Math.ceil(height / cellSize); r++) {
        for (let c = 0; c < Math.ceil(width / cellSize); c++) {
          const idx = r * cols + c;
          
          // Activate cells near the mouse
          if (mouse.active) {
            const dist = Math.abs(mCol - c) + Math.abs(mRow - r); // Manhattan distance for architectural look
            if (dist < 3) {
              cells[idx] = Math.max(cells[idx], 1 - dist * 0.3);
            }
          }
          
          // Add a subtle wave pattern across the whole grid
          const wave = (Math.sin(c * 0.2 + time) + Math.cos(r * 0.2 + time)) * 0.05;
          cells[idx] = Math.max(0, cells[idx] - 0.02); // Fade out
          
          const val = Math.max(wave, cells[idx]);

          if (val > 0.01) {
            const x = c * cellSize;
            const y = r * cellSize;
            
            // Bright Electric Blue for active, softer for wave
            const alpha = val > 0.1 ? val * 0.4 : val * 0.2;
            ctx.fillStyle = `rgba(16, 63, 213, ${alpha})`;
            
            // Draw a precise square block, slightly inset for a wireframe look
            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            
            // Sometimes draw a crisp dot in the center of active cells
            if (val > 0.5) {
              ctx.fillStyle = "#C3F84A"; // Lime accent
              ctx.fillRect(x + cellSize / 2 - 2, y + cellSize / 2 - 2, 4, 4);
            }
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
