"use client";
import React, { useEffect, useRef } from "react";

export function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const cellSize = 40;
    let cols = 0;
    let rows = 0;
    let cells: number[] = []; // Stores the "alpha" value of each pixel cell
    
    // Audio Context for sound effect (initialize on first click)
    let audioCtx: AudioContext | null = null;
    
    const playClickSound = () => {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        // A crisp tech click
        osc.type = "square";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        console.error("Audio playback failed", e);
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / cellSize);
      rows = Math.ceil(canvas.height / cellSize);
      const newCells = new Array(cols * rows).fill(0);
      
      // Copy over old cells if resizing
      if (cells.length > 0) {
         // rough copy to avoid losing entirely
      }
      cells = newCells;
    };
    
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    let mouse = { x: -1000, y: -1000, active: false };
    const handleMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      
      const c = Math.floor(mouse.x / cellSize);
      const r = Math.floor(mouse.y / cellSize);
      const idx = r * cols + c;
      if (idx >= 0 && idx < cells.length) {
         // Instantly fill pixel under mouse
         cells[idx] = 1.0;
         
         // Fill a few neighbors slightly
         const neighbors = [
           [0, 1], [1, 0], [0, -1], [-1, 0]
         ];
         neighbors.forEach(([dx, dy]) => {
           const nx = c + dx;
           const ny = r + dy;
           if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
             const nidx = ny * cols + nx;
             if (cells[nidx] < 0.5) cells[nidx] = 0.5;
           }
         });
      }
    };
    
    const handleLeave = () => { mouse.active = false; };
    
    // Click Effect
    let ripples: {x: number, y: number, radius: number, alpha: number}[] = [];
    
    const handleClick = (e: MouseEvent) => {
      playClickSound();
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        alpha: 1.0
      });
      
      // Also instantly activate a cluster of pixels
      const c = Math.floor(e.clientX / cellSize);
      const r = Math.floor(e.clientY / cellSize);
      
      for(let dy=-2; dy<=2; dy++){
        for(let dx=-2; dx<=2; dx++){
           const nx = c + dx;
           const ny = r + dy;
           if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
             const dist = Math.abs(dx) + Math.abs(dy);
             if (dist <= 2) {
               cells[ny * cols + nx] = 1.0;
             }
           }
        }
      }
    };
    
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid Cells
      ctx.fillStyle = "#103FD5"; // Electric Blue
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          if (cells[idx] > 0.01) {
             ctx.globalAlpha = cells[idx];
             // Render the filled pixel, slightly smaller for a clean grid look
             ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
             // Decay
             cells[idx] *= 0.92; 
          }
        }
      }
      
      // Draw Ripples (Visual Click Effect)
      ripples.forEach((rip, i) => {
        ctx.globalAlpha = rip.alpha;
        ctx.strokeStyle = "#103FD5";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        rip.radius += 15;
        rip.alpha *= 0.9;
        
        // Interaction with grid from ripple
        const rc = Math.floor(rip.x / cellSize);
        const rr = Math.floor(rip.y / cellSize);
        const waveRadiusCells = Math.floor(rip.radius / cellSize);
        
        // Find cells roughly on the circle
        for (let dr = -waveRadiusCells; dr <= waveRadiusCells; dr++) {
          for (let dc = -waveRadiusCells; dc <= waveRadiusCells; dc++) {
            const dist = Math.sqrt(dr*dr + dc*dc);
            if (Math.abs(dist - waveRadiusCells) < 1) {
              const nx = rc + dc;
              const ny = rr + dr;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                 const nidx = ny * cols + nx;
                 cells[nidx] = Math.max(cells[nidx], rip.alpha);
              }
            }
          }
        }
      });
      
      // Clean up dead ripples
      ripples = ripples.filter(r => r.alpha > 0.01);
      
      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();
    
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
