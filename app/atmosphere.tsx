"use client";

import { Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Point = [number, number, number];

const links: [number, number][] = [
  [0, 3], [3, 7], [7, 11], [11, 14], [14, 18], [18, 22], [22, 0],
  [2, 6], [6, 10], [10, 15], [15, 20], [20, 2],
];

function Constellation({ compact, paused }: { compact: boolean; paused: boolean }) {
  const field = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const points = useMemo<Point[]>(() => Array.from({ length: compact ? 12 : 23 }, (_, index) => {
    const angle = index * 2.39996;
    const radius = 1.8 + (index % 5) * 0.48;
    return [Math.cos(angle) * radius, Math.sin(angle * 1.17) * 1.6, ((index % 4) - 1.5) * 0.9];
  }), [compact]);

  useFrame(({ clock, pointer }) => {
    if (!field.current || paused) return;
    const scroll = typeof window === "undefined"
      ? 0
      : Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1);
    const time = clock.getElapsedTime();
    field.current.rotation.y = THREE.MathUtils.lerp(field.current.rotation.y, pointer.x * 0.04 + scroll * 0.1, 0.025);
    field.current.rotation.x = THREE.MathUtils.lerp(field.current.rotation.x, -pointer.y * 0.025, 0.025);
    field.current.position.y = THREE.MathUtils.lerp(field.current.position.y, scroll * -0.42, 0.025);
    if (!reduced) field.current.rotation.z = Math.sin(time * 0.08) * 0.012;
  });

  return (
    <group ref={field}>
      <Sparkles count={compact ? 35 : 100} scale={[12, 7, 5]} size={compact ? 1.1 : 1.5} speed={0.12} color="#a99aff" opacity={0.42} />
      <Sparkles count={compact ? 16 : 45} scale={[8, 5, 3]} size={1.1} speed={0.08} color="#75e1d5" opacity={0.28} />
      {points.map((point, index) => (
        <mesh key={point.join("-")} position={point}>
          <sphereGeometry args={[index % 4 === 0 ? 0.025 : 0.014, 8, 8]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#75e1d5" : "#a99aff"} transparent opacity={0.65} />
        </mesh>
      ))}
      {!compact && links.map(([from, to]) => (
        <Line key={`${from}-${to}`} points={[points[from], points[to]]} color="#a99aff" transparent opacity={0.12} lineWidth={0.35} />
      ))}
    </group>
  );
}

class WebGLFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Atmospheric background disabled:", error.message, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Atmosphere() {
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = matchMedia("(max-width: 700px)");
    const updateCompact = () => setCompact(media.matches);
    const updateVisibility = () => setPaused(document.visibilityState === "hidden");
    updateCompact();
    updateVisibility();
    media.addEventListener("change", updateCompact);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateCompact);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  if (reduced) return <div className="atmosphere-fallback" aria-hidden="true" />;

  return (
    <div className="atmosphere" aria-hidden="true">
      <WebGLFallback>
        <Canvas dpr={compact ? 1 : [1, 1.35]} frameloop={paused ? "never" : "always"} gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 8], fov: 45 }}>
          <Constellation compact={compact} paused={paused} />
        </Canvas>
      </WebGLFallback>
      <div className="atmosphere-vignette" />
    </div>
  );
}
