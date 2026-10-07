"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const orbitNodes = ["node-a", "node-b", "node-c"];
const spacePoints = ["point-a", "point-b", "point-c", "point-d", "point-e", "point-f"];
const neuralLinks = ["link-a", "link-b", "link-c", "link-d"];
const monoliths = ["monolith-a", "monolith-b", "monolith-c"];
const debris = ["debris-a", "debris-b", "debris-c", "debris-d"];

export default function HeroScene() {
  const reduced = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || reduced) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetScroll = 0;
    let currentX = 0;
    let currentY = 0;
    let currentScroll = 0;

    const render = () => {
      currentX += (pointerX - currentX) * 0.06;
      currentY += (pointerY - currentY) * 0.06;
      currentScroll += (targetScroll - currentScroll) * 0.05;
      scene.style.setProperty("--orbit-x", `${currentX.toFixed(2)}deg`);
      scene.style.setProperty("--orbit-y", `${currentY.toFixed(2)}deg`);
      scene.style.setProperty("--orbit-depth", `${(currentScroll * -18).toFixed(2)}px`);
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = scene.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
    };
    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const onScroll = () => {
      targetScroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    };

    scene.addEventListener("pointermove", onPointerMove, { passive: true });
    scene.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    frame = requestAnimationFrame(render);

    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div ref={sceneRef} className={`scene-shell${reduced ? " scene-static" : ""}`} aria-label="Abstract orbital engineering system">
      <div className="orbit-aura" aria-hidden="true" />
      <div className="orbit-system" aria-hidden="true">
        <span className="orbit-ring orbit-ring-outer" />
        <span className="orbit-ring orbit-ring-middle" />
        <span className="orbit-ring orbit-ring-inner" />
        <span className="orbit-arc orbit-arc-one" />
        <span className="orbit-arc orbit-arc-two" />
        {orbitNodes.map((node) => <span className={`orbit-node ${node}`} key={node} />)}
        {spacePoints.map((point) => <span className={`space-point ${point}`} key={point} />)}
        {neuralLinks.map((link) => <span className={`neural-link ${link}`} key={link} />)}
        {monoliths.map((monolith) => <span className={`space-monolith ${monolith}`} key={monolith} />)}
        {debris.map((piece) => <span className={`space-debris ${piece}`} key={piece} />)}
        <div className="system-core">
          <div className="core-top"><span className="signal-dot" /> RKP / SYSTEM CORE <span className="core-state">ONLINE</span></div>
          <div className="core-body">
            <span className="core-brand">RKP<span>.</span></span>
            <span className="core-line core-line-one" />
            <span className="core-line core-line-two" />
            <span className="core-line core-line-three" />
            <span className="core-pulse" />
          </div>
          <div className="core-bottom"><span>BUILD / DEBUG / ITERATE</span><span>v0.1</span></div>
        </div>
      </div>
      <div className="orbit-marker orbit-marker-top" aria-hidden="true">RKP / 01</div>
      <div className="orbit-marker orbit-marker-bottom" aria-hidden="true">SYSTEMS / AI / WEB</div>
    </div>
  );
}
