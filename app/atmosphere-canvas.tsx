"use client";

import { Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, type ErrorInfo, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

const pointCount = 23;
const points = Array.from({ length: pointCount }, (_, index) => {
  const angle = index * 2.39996;
  const radius = 1.8 + (index % 5) * 0.48;
  return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * 1.17) * 1.6, ((index % 4) - 1.5) * 0.9);
});

const links: [number, number][] = [
  [0, 3], [3, 7], [7, 11], [11, 14], [14, 18], [18, 22], [22, 0],
  [2, 6], [6, 10], [10, 15], [15, 20], [20, 2],
];
const linePositions = new Float32Array(links.flatMap(([from, to]) => [...points[from].toArray(), ...points[to].toArray()]));

function Constellation() {
  const field = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const input = useRef({ pointerX: 0, pointerY: 0, scroll: 0 });

  // All 23 nodes share one instanced draw call; per-instance scale and color keep the original two sizes and two colors.
  useLayoutEffect(() => {
    const mesh = nodes.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    points.forEach((point, index) => {
      const radius = index % 4 === 0 ? 0.025 : 0.014;
      mesh.setMatrixAt(index, matrix.makeScale(radius, radius, radius).setPosition(point));
      mesh.setColorAt(index, color.set(index % 3 === 0 ? "#75e1d5" : "#a99aff"));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  // Pointer and scroll are sampled by passive listeners and cached, so the frame loop never reads layout.
  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      input.current.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      input.current.pointerY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      input.current.scroll = Math.min(window.scrollY / Math.max(max, 1), 1);
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useFrame(({ clock }) => {
    const group = field.current;
    if (!group) return;
    const { pointerX, pointerY, scroll } = input.current;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointerX * 0.04 + scroll * 0.1, 0.025);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointerY * 0.025, 0.025);
    group.position.y = THREE.MathUtils.lerp(group.position.y, scroll * -0.42, 0.025);
    group.rotation.z = Math.sin(clock.getElapsedTime() * 0.08) * 0.012;
  });

  return (
    <group ref={field}>
      <Sparkles count={100} scale={[12, 7, 5]} size={1.5} speed={0.12} color="#a99aff" opacity={0.42} />
      <Sparkles count={45} scale={[8, 5, 3]} size={1.1} speed={0.08} color="#75e1d5" opacity={0.28} />
      <instancedMesh ref={nodes} args={[undefined, undefined, pointCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.65} />
      </instancedMesh>
      {/* One line-segments draw call replaces 12 separate fat-line meshes; opacity is lowered to match their sub-pixel width. */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#a99aff" transparent opacity={0.05} />
      </lineSegments>
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
    return this.state.failed ? <div className="atmosphere-fallback" aria-hidden="true" /> : this.props.children;
  }
}

export default function AtmosphereCanvas({ paused: externallyPaused = false }: { paused?: boolean }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setPaused(document.visibilityState === "hidden");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <div className="atmosphere" aria-hidden="true">
      <WebGLFallback>
        {/* pointer-events: none keeps R3F's own pointer handling out of the way; Constellation tracks the pointer itself. */}
        <Canvas style={{ pointerEvents: "none" }} dpr={[1, 1.35]} frameloop={paused || externallyPaused ? "never" : "always"} gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 8], fov: 45 }}>
          <Constellation />
        </Canvas>
      </WebGLFallback>
      <div className="atmosphere-vignette" />
    </div>
  );
}
