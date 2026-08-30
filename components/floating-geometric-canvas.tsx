"use client";
import React, { useEffect, useRef } from "react";

export function FloatingGeometricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    
    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener("mousemove", handleMove);

    class FloatingElement {
      x: number;
      y: number;
      z: number; // depth for parallax (0.1 to 1)
      vx: number;
      vy: number;
      size: number;
      type: "square" | "circle" | "cross" | "code" | "ai-chip";
      color: string;
      rotation: number;
      rotSpeed: number;
      baseX: number;
      baseY: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.z = 0.2 + Math.random() * 0.8;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = (20 + Math.random() * 60) * this.z;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        
        const types: Array<"square" | "circle" | "cross" | "code" | "ai-chip"> = ["square", "circle", "cross", "code", "ai-chip"];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        const colors = ["rgba(16, 63, 213, 0.15)", "rgba(16, 63, 213, 0.25)", "rgba(195, 248, 74, 0.4)", "rgba(103, 186, 228, 0.3)"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(width: number, height: number) {
        // Natural drifting
        this.baseX += this.vx * this.z;
        this.baseY += this.vy * this.z;
        this.rotation += this.rotSpeed;

        // Wrap around screen
        if (this.baseX > width + 100) this.baseX = -100;
        if (this.baseX < -100) this.baseX = width + 100;
        if (this.baseY > height + 100) this.baseY = -100;
        if (this.baseY < -100) this.baseY = height + 100;

        // Mouse Parallax & Repulsion
        const dx = mouseX - this.baseX;
        const dy = mouseY - this.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let offsetX = 0;
        let offsetY = 0;

        // Parallax shift based on depth
        if (mouseX !== -1000) {
           offsetX = (mouseX - width/2) * (1 - this.z) * -0.05;
           offsetY = (mouseY - height/2) * (1 - this.z) * -0.05;
        }

        // Magnetic repulsion
        if (dist < 150) {
          const force = (150 - dist) / 150;
          offsetX -= (dx / dist) * force * 50 * this.z;
          offsetY -= (dy / dist) * force * 50 * this.z;
        }

        this.x = this.baseX + offsetX;
        this.y = this.baseY + offsetY;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        if (this.type === "square") {
          ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        } else if (this.type === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === "cross") {
          const s = this.size / 3;
          ctx.fillRect(-s/2, -this.size/2, s, this.size);
          ctx.fillRect(-this.size/2, -s/2, this.size, s);
        } else if (this.type === "code") {
          ctx.font = `bold ${this.size}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("{/}", 0, 0);
        } else if (this.type === "ai-chip") {
          const s = this.size * 0.7;
          ctx.strokeRect(-s/2, -s/2, s, s);
          ctx.fillRect(-s/4, -s/4, s/2, s/2);
          // drawing pins
          ctx.fillRect(-s/2 - 4, -s/4, 4, 2);
          ctx.fillRect(-s/2 - 4, s/4, 4, 2);
          ctx.fillRect(s/2, -s/4, 4, 2);
          ctx.fillRect(s/2, s/4, 4, 2);
          ctx.fillRect(-s/4, -s/2 - 4, 2, 4);
          ctx.fillRect(s/4, -s/2 - 4, 2, 4);
          ctx.fillRect(-s/4, s/2, 2, 4);
          ctx.fillRect(s/4, s/2, 2, 4);
        }

        ctx.restore();
      }
    }

    let elements: FloatingElement[] = [];
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      elements = [];
      const numElements = Math.min(window.innerWidth / 30, 45); // Responsive count
      for (let i = 0; i < numElements; i++) {
        elements.push(new FloatingElement(canvas.width, canvas.height));
      }
    };

    init();
    window.addEventListener("resize", init);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elements.forEach(el => {
        el.update(canvas.width, canvas.height);
        el.draw(ctx);
      });
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
