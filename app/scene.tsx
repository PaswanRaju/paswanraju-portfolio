"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const orbitNodes = ["node-a", "node-b", "node-c"];
const spacePoints = ["point-a", "point-b", "point-c", "point-d", "point-e", "point-f"];
const neuralLinks = ["link-a", "link-b", "link-c", "link-d"];

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

    // The loop only runs while the eased values are still settling, then stops until the next pointer or scroll input.
    const render = () => {
      frame = 0;
      currentX += (pointerX - currentX) * 0.06;
      currentY += (pointerY - currentY) * 0.06;
      currentScroll += (targetScroll - currentScroll) * 0.05;
      scene.style.setProperty("--orbit-x", `${currentX.toFixed(2)}deg`);
      scene.style.setProperty("--orbit-y", `${currentY.toFixed(2)}deg`);
      scene.style.setProperty("--orbit-depth", `${(currentScroll * -18).toFixed(2)}px`);
      const settling = Math.abs(pointerX - currentX) > 0.005 || Math.abs(pointerY - currentY) > 0.005 || Math.abs(targetScroll - currentScroll) > 0.0005;
      if (settling) frame = requestAnimationFrame(render);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = scene.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
      start();
    };
    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      start();
    };
    const onScroll = () => {
      const next = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      if (next === targetScroll) return;
      targetScroll = next;
      start();
    };
    // Pause the scene's CSS keyframe animations while the hero is offscreen.
    const visibility = new IntersectionObserver(([entry]) => scene.classList.toggle("is-offscreen", !entry.isIntersecting));

    scene.addEventListener("pointermove", onPointerMove, { passive: true });
    scene.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    visibility.observe(scene);
    onScroll();
    start();

    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      visibility.disconnect();
      scene.classList.remove("is-offscreen");
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div ref={sceneRef} className="scene-shell" aria-hidden="true">
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
        <div className="system-core">
          <div className="core-top">SYSTEMS · AI · WEB</div>
          <div className="core-body">
            <span className="core-brand">RKP<span>.</span></span>
            <span className="core-line core-line-one" />
            <span className="core-line core-line-two" />
            <span className="core-line core-line-three" />
            <span className="core-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
