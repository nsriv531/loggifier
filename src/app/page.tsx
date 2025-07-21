// ClickyMonLanding.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as THREE from 'three';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";   
import "./globals.css";

export default function ClickyMonLanding() {
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
  const canvas = document.getElementById("three-canvas") as HTMLCanvasElement;
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

const cubes: THREE.Mesh[] = [];

  for (let i = 0; i < 10; i++) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.x = Math.random() * 40 - 20; // Wider X spread
    cube.position.y = Math.random() * 20 - 10; // Taller Y spread
    cube.position.z = Math.random() * -30;  

    cubes.push(cube);
    scene.add(cube);
  }

  const animate = () => {
    requestAnimationFrame(animate);
    cubes.forEach((cube, i) => {
      cube.rotation.x += 0.01 + i * 0.001;
      cube.rotation.y += 0.01 + i * 0.001;
      cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    });
    renderer.render(scene, camera);
  };

  animate();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
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

<div className="absolute inset-0 z-0">
  <canvas id="three-canvas" className="w-full h-full" />
</div>
      <motion.main
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 p-8 text-center"
      >

        {/* Heading */}
        <h1 className="font-sans text-black text-5xl/tight font-extrabold tracking-tight drop-shadow-sm">
          Loggifier
        </h1>

        {/* Rotating Subtitle */}
        <div className="min-h-[28px] h-7">
          <AnimatePresence mode="wait">
            <motion.p
              key={subtitleIndex}
              className="max-w-md font-sans text-lg text-black/80"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.5 }}
            >
              {subtitles[subtitleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA buttons side by side */}
        <div className="flex gap-4">
          <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 font-medium text-white hover:bg-black/80 active:scale-95">
  Sign Up
</Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 font-medium text-white hover:bg-black/80 active:scale-95">
  Login
</Link>
        </div>
      </motion.main>
    </div>
  );
}
