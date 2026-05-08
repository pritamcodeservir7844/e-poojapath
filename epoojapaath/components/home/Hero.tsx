"use client";

import { useRef, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Temple3D() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Mandapa base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#D4820A" emissive="#7A4500" emissiveIntensity={0.3} />
      </mesh>
      {/* Main shikhara tower */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 1.5, 3, 8]} />
        <meshStandardMaterial color="#B8860B" emissive="#6B4F00" emissiveIntensity={0.4} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Upper shikhara */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 2, 8]} />
        <meshStandardMaterial color="#D4820A" emissive="#7A4500" emissiveIntensity={0.4} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Kalash top */}
      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#C8A800" emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Side gopurams */}
      {[[-1.5, -0.3, 0], [1.5, -0.3, 0]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.6, 1.8, 6]} />
            <meshStandardMaterial color="#C87A0A" emissive="#5A3500" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.35, 0.8, 6]} />
            <meshStandardMaterial color="#B8860B" emissive="#5A4000" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
      {/* Diya flame particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 2.5 + Math.random() * 1.5;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, -1 + Math.random() * 3, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#FF8C00" : "#FFD700"} emissive="#FF6600" emissiveIntensity={2} />
          </mesh>
        );
      })}
    </group>
  );
}

const floatingDiyas = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  left: `${10 + i * 11}%`,
  delay: i * 0.5,
  duration: 3 + i * 0.3,
}));

export function Hero() {
  return (
    <section className="relative min-h-screen bg-dark overflow-hidden flex items-center">
      {/* Devotional Background Vectors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main Rotating Mandala */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[1000px] h-[1000px] opacity-[0.04]"
        >
          <svg viewBox="0 0 200 200" fill="none" stroke="#D4820A" strokeWidth="0.2">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="50" />
            {Array.from({ length: 24 }).map((_, i) => (
              <path
                key={i}
                d="M100 100 L100 10 Q110 30 100 50 Q90 30 100 10"
                transform={`rotate(${i * 15} 100 100)`}
              />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={`p-${i}`}
                d="M100 100 Q120 70 100 40 Q80 70 100 100"
                transform={`rotate(${i * 30 + 15} 100 100)`}
                fill="#D4820A"
                fillOpacity="0.2"
              />
            ))}
          </svg>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute inset-0">
          {[
            { top: "15%", left: "10%", size: 40, delay: 0 },
            { top: "65%", left: "5%", size: 30, delay: 2 },
            { top: "25%", left: "85%", size: 45, delay: 1 },
            { top: "75%", left: "90%", size: 35, delay: 3 },
            { top: "45%", left: "50%", size: 50, delay: 1.5 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 0.1, 0], y: [-20, -60, -20] }}
              transition={{ duration: 8, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
              className="absolute"
              style={{ top: item.top, left: item.left }}
            >
              {i % 2 === 0 ? (
                /* Lotus Icon */
                <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="none" stroke="#D4820A" strokeWidth="1">
                  <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
                  <path d="M12 22C12 22 16 18 16 13C16 8 12 5 12 5C12 5 8 8 8 13C8 18 12 22 12 22Z" />
                  <circle cx="12" cy="13" r="2" />
                </svg>
              ) : (
                /* Om Icon (simplified) */
                <div className="font-sanskrit text-saffron text-2xl opacity-20">ॐ</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating diya particles */}
      {floatingDiyas.map(({ id, left, delay, duration }) => (
        <div key={id} className="absolute bottom-0 text-2xl pointer-events-none diya-particle"
          style={{ left, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}>
          🪔
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center min-h-[85vh]">

          {/* Left Content — 60% */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-saffron/10 border border-saffron/30 rounded-full px-4 py-1.5 mb-6"
            >
              <span>🛕</span>
              <span className="text-saffron text-sm font-medium">India&apos;s Devotional Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-heading text-5xl md:text-7xl text-cream leading-tight mb-4"
            >
              Connect with
              <br />
              <span className="text-saffron">the Divine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-sanskrit text-xl text-cream/60 mb-8"
            >
              ॐ सर्वे भवन्तु सुखिनः • सर्वे सन्तु निरामयाः
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-cream/70 text-lg mb-10 max-w-xl leading-relaxed"
            >
              Book sacred pujas, offer Chadawa, and discover temples across India. Experience devotion from wherever you are — with live streaming, prasad delivery, and divine blessings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/puja" className="btn-saffron text-base px-8 py-3">
                Book Puja 🪔
              </Link>
              <Link href="/temples" className="btn-outline-gold text-base px-8 py-3 border-cream/40 text-cream hover:bg-cream hover:text-dark">
                Explore Temples
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-8"
            >
              {[
                { val: "500+", label: "Temples" },
                { val: "10,000+", label: "Bookings" },
                { val: "50+", label: "Cities" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="font-heading text-3xl text-saffron">{val}</div>
                  <div className="text-cream/50 text-sm">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right 3D Temple — 40% */}
          <motion.div
            className="lg:col-span-2 h-[400px] lg:h-[500px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Canvas camera={{ position: [0, 2, 10], fov: 45 }} gl={{ alpha: true }}>
              <ambientLight intensity={0.8} />
              <pointLight position={[5, 5, 5]} intensity={2} color="#FFD700" />
              <pointLight position={[-5, 3, -5]} intensity={1.5} color="#D4820A" />
              <Suspense fallback={null}>
                <Temple3D />
              </Suspense>
              <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} enableDamping dampingFactor={0.05} />
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
