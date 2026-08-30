"use client";

import React, { useEffect, useRef, useState } from "react";

interface PixelCardProps {
  index: string;
  title: string;
  category: string;
  description: string;
  type: "neural" | "matrix" | "benchmark";
  onClick: () => void;
}

export function PixelCanvasCard({
  index,
  title,
  category,
  description,
  type,
  onClick,
}: PixelCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: -100, y: -100, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 320);
    const height = (canvas.height = 180);
    const pixelSize = isHovered ? 6 : 8;

    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    let time = 0;

    const render = () => {
      time += isHovered ? 0.08 : 0.02;
      ctx.clearRect(0, 0, width, height);

      // Background fill
      ctx.fillStyle = isHovered ? "#071A57" : "#E2EFF9";
      ctx.fillRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * pixelSize;
          const y = r * pixelSize;

          let val = 0;
          if (type === "neural") {
            val = Math.sin(c * 0.25 + time) * Math.cos(r * 0.25 + time) + Math.sin((c + r) * 0.15 + time);
          } else if (type === "matrix") {
            val = Math.sin(c * 0.35 + time * 1.5) + Math.cos(r * 0.2 + time);
          } else {
            val = Math.sin(Math.sqrt((c - cols / 2) ** 2 + (r - rows / 2) ** 2) * 0.4 - time * 2);
          }

          // Mouse proximity disturbance
          if (mouseRef.current.active) {
            const dx = (x + pixelSize / 2) - mouseRef.current.x;
            const dy = (y + pixelSize / 2) - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 70) {
              val += (70 - dist) / 25;
            }
          }

          if (val > 0.3) {
            if (isHovered) {
              ctx.fillStyle = val > 1.2 ? "#C3F84A" : val > 0.7 ? "#67BAE4" : "#103FD5";
            } else {
              ctx.fillStyle = val > 1.2 ? "#103FD5" : val > 0.7 ? "#2563EB" : "#93C5FD";
            }
            ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isHovered, type]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 320;
    const y = ((e.clientY - rect.top) / rect.height) * 180;
    mouseRef.current = { x, y, active: true };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -100, y: -100, active: false };
    setIsHovered(false);
  };

  return (
    <div
      className={"group relative flex flex-col rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 " + (
        isHovered
          ? "border-[#103FD5] bg-[#071A57] text-white shadow-xl scale-[1.02]"
          : "border-slate-300/80 bg-[#FAF9F6] text-slate-900 hover:border-[#103FD5]/60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Pixelated Canvas Visual */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />

        {/* Stepped Pixel Corner Accent (like art direction) */}
        <div
          className={"absolute top-0 right-0 transition-colors duration-200 " + (
            isHovered ? "bg-[#C3F84A]" : "bg-[#103FD5]"
          )}
          style={{
            width: "36px",
            height: "36px",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 100%, 50% 50%, 0 50%)",
          }}
        />

        {/* Category Badge */}
        <span
          className={"absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors " + (
            isHovered
              ? "bg-[#071A57]/90 text-[#67BAE4] border border-[#67BAE4]/40"
              : "bg-white/90 text-[#103FD5] border border-[#103FD5]/20 shadow-sm"
          )}
        >
          {category}
        </span>
      </div>

      {/* Card Content Footer */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={"font-sans font-bold text-sm sm:text-base tracking-tight transition-colors " + (
              isHovered ? "text-white" : "text-[#071A57]"
            )}>
              {title}
            </h4>
            <span className="font-mono text-xs font-semibold opacity-60">
              ({index})
            </span>
          </div>
          <p className={"text-xs leading-relaxed transition-colors " + (
            isHovered ? "text-slate-300" : "text-slate-600"
          )}>
            {description}
          </p>
        </div>

        {/* Action link */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-mono font-semibold">
          <span className={isHovered ? "text-[#C3F84A]" : "text-[#103FD5]"}>
            SELECT BRIEF →
          </span>
          <span className="opacity-50">0{index}</span>
        </div>
      </div>
    </div>
  );
}
