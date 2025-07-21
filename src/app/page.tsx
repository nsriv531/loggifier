"use client";

import { motion } from "framer-motion";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import "./globals.css";

export default function ClickyMonLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subtitles = [
    "Log anything, everything.",
    "Huge list of games",
    "Huge list of movies",
    "Biggest realm of audio media.",
  ];
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [showForm, setShowForm] = useState<"none" | "signup" | "login">("none");
  const cameraXOffset = useRef(0);

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

      cube.position.x = Math.random() * 40 - 20;
      cube.position.y = Math.random() * 20 - 10;
      cube.position.z = Math.random() * -30;

      cubes.push(cube);
      scene.add(cube);
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane();
    const planeIntersect = new THREE.Vector3();
    const offset = new THREE.Vector3();
    let selectedCube: THREE.Mesh | null = null;

    const getMouseCoords = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseDown = (event: MouseEvent) => {
      getMouseCoords(event);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(cubes);
      if (intersects.length > 0) {
        selectedCube = intersects[0].object as THREE.Mesh;
        plane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(new THREE.Vector3()).clone().negate(),
          selectedCube.position
        );
        raycaster.ray.intersectPlane(plane, planeIntersect);
        offset.copy(planeIntersect).sub(selectedCube.position);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!selectedCube) return;

      getMouseCoords(event);
      raycaster.setFromCamera(mouse, camera);
      if (raycaster.ray.intersectPlane(plane, planeIntersect)) {
        const newPosition = planeIntersect.clone().sub(offset);
        selectedCube.position.x = newPosition.x;
        selectedCube.position.y = newPosition.y;
      }
    };

    const onMouseUp = () => {
      selectedCube = null;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      // move camera left if form is open
      const target = showForm !== "none" ? 10 : 0;
      cameraXOffset.current += (target - cameraXOffset.current) * 0.05;
      camera.position.x = cameraXOffset.current;

      cubes.forEach((cube, i) => {
        cube.rotation.x += 0.01 + i * 0.001;
        cube.rotation.y += 0.01 + i * 0.001;
        cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
  }, [showForm]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#ff8800] via-[#ff6fff] to-[#8844ff]">
      {/* Particle Trail Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      {/* Animated radial highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0,transparent_60%)]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
      />

      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-0">
        <canvas id="three-canvas" className="w-full h-full" />
      </div>

      {/* Page slider */}
      <motion.div
        className="relative z-10 flex w-[200%] transition-transform duration-500 ease-in-out"
        animate={{ x: showForm !== "none" ? "-50%" : "0%" }}
        initial={false}
      >
        {/* Landing Page */}
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center">
          <h1 className="font-sans text-black text-5xl font-extrabold tracking-tight drop-shadow-sm">
            Loggifier
          </h1>

          <div className="min-h-[28px] h-7">
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
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowForm("signup")}
              className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 font-medium text-white hover:bg-black/80 active:scale-95"
            >
              Sign Up
            </button>
            <button
              onClick={() => setShowForm("login")}
              className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 font-medium text-white hover:bg-black/80 active:scale-95"
            >
              Login
            </button>
          </div>
        </div>

        {/* Form Page */}
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {showForm === "signup" ? "Sign Up" : "Login"}
            </h2>
            <form className="flex flex-col gap-4">
              {showForm === "signup" && (
                <>
                  <input type="text" placeholder="Username" className="border p-2 rounded" />
                  <input type="email" placeholder="Email" className="border p-2 rounded" />
                  <input type="password" placeholder="Password" className="border p-2 rounded" />
                </>
              )}
              {showForm === "login" && (
                <>
                  <input type="email" placeholder="Email" className="border p-2 rounded" />
                  <input type="password" placeholder="Password" className="border p-2 rounded" />
                </>
              )}
              <button type="submit" className="bg-black text-white py-2 rounded hover:bg-black/80">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm("none")}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
