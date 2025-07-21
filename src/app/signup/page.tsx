// ClickyMonLanding.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


export default function SignUp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subtitles = ["Log anything, everything.", "Huge list of games", "Huge list of movies", "Biggest realm of audio media."];
  const [subtitleIndex, setSubtitleIndex] = useState(0);

   useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [subtitles.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; alpha: number; angle: number }[] = [];
    let mouse = { x: 0, y: 0 };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          alpha: 1,
          angle: Math.random() * 2 * Math.PI
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        const tickLength = 6;
        const dx = tickLength * Math.cos(p.angle);
        const dy = tickLength * Math.sin(p.angle);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + dx, p.y + dy);
        ctx.strokeStyle = `rgba(0, 0, 0, ${p.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.stroke();

        p.alpha -= 0.025;
        if (p.alpha <= 0) particles.splice(i, 1);
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#ff8800] via-[#ff6fff] to-[#8844ff]">
      {/* Particle Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Animated radial highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0,transparent_60%)]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
      />

      <motion.main
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 p-8 text-center"
      >
      </motion.main>
      <div>
        <p>sign up</p>
    </div>
    </div>
    
  );
}
