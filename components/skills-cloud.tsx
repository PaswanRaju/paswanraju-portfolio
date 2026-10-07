"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { skillGroups } from "../data/site";
import { getTechIcon } from "./tech-marquee";

type CloudPoint = {
  technology: string;
  x: number;
  y: number;
  z: number;
};

const technologies = skillGroups.flatMap((group) => group.items);

function createPoints(): CloudPoint[] {
  const count = technologies.length;
  return technologies.map((technology, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    return {
      technology,
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    };
  });
}

export default function SkillsCloud({ reduced }: { reduced: boolean }) {
  const cloudRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rotation = useRef({ x: -0.12, y: 0.18 });
  const velocity = useRef({ x: 0, y: 0.0028 });
  const pointer = useRef({ x: 0, y: 0, dragging: false, active: false });
  const points = useMemo(() => createPoints(), []);
  const reducedPreference = useReducedMotion();

  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) return;
    let frame = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;
      if (!reduced && !reducedPreference) {
        if (!pointer.current.dragging) {
          const hoverFactor = pointer.current.active ? 0.22 : 1;
          rotation.current.y += velocity.current.y * delta * hoverFactor;
          rotation.current.x += velocity.current.x * delta * hoverFactor;
        }
        velocity.current.x *= 0.94;
        velocity.current.y = velocity.current.y * 0.985 + 0.0028 * 0.015;
      }

      const sinY = Math.sin(rotation.current.y);
      const cosY = Math.cos(rotation.current.y);
      const sinX = Math.sin(rotation.current.x);
      const cosX = Math.cos(rotation.current.x);
      const pointRadius = Math.min(205, cloud.clientWidth * 0.34);
      points.forEach((point, index) => {
        const x = point.x * cosY + point.z * sinY;
        const depth = -point.x * sinY + point.z * cosY;
        const y = point.y * cosX - depth * sinX;
        const z = point.y * sinX + depth * cosX;
        const scale = 0.7 + (z + 1) * 0.24;
        const opacity = 0.35 + (z + 1) * 0.3;
        const item = itemsRef.current[index];
        if (!item) return;
        item.style.setProperty("--cloud-x", `${x * pointRadius}px`);
        item.style.setProperty("--cloud-y", `${y * pointRadius}px`);
        item.style.setProperty("--cloud-z", `${z * pointRadius}px`);
        item.style.setProperty("--cloud-scale", scale.toFixed(3));
        item.style.setProperty("--cloud-opacity", opacity.toFixed(3));
      });
      cloud.style.setProperty("--cloud-tilt-x", `${rotation.current.x * 7}deg`);
      cloud.style.setProperty("--cloud-tilt-y", `${rotation.current.y * 5}deg`);
      frame = requestAnimationFrame(render);
    };

    const onPointerEnter = () => { pointer.current.active = true; };
    const onPointerLeave = () => {
      pointer.current.active = false;
      pointer.current.dragging = false;
    };
    const onPointerDown = (event: PointerEvent) => {
      pointer.current.dragging = true;
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      cloud.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.current.dragging || reduced || reducedPreference) return;
      const dx = event.clientX - pointer.current.x;
      const dy = event.clientY - pointer.current.y;
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      rotation.current.y += dx * 0.006;
      rotation.current.x += dy * 0.006;
      velocity.current.y = dx * 0.0008;
      velocity.current.x = dy * 0.0008;
    };
    const onPointerUp = () => { pointer.current.dragging = false; };

    cloud.addEventListener("pointerenter", onPointerEnter);
    cloud.addEventListener("pointerleave", onPointerLeave);
    cloud.addEventListener("pointerdown", onPointerDown);
    cloud.addEventListener("pointermove", onPointerMove);
    cloud.addEventListener("pointerup", onPointerUp);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      cloud.removeEventListener("pointerenter", onPointerEnter);
      cloud.removeEventListener("pointerleave", onPointerLeave);
      cloud.removeEventListener("pointerdown", onPointerDown);
      cloud.removeEventListener("pointermove", onPointerMove);
      cloud.removeEventListener("pointerup", onPointerUp);
    };
  }, [points, reduced, reducedPreference]);

  return (
    <div className="skills-cloud-wrap">
      <div className={`skills-cloud${reduced || reducedPreference ? " skills-cloud-static" : ""}`} ref={cloudRef} aria-label="Interactive technology icon cloud">
        <span className="skills-cloud-aura" aria-hidden="true" />
        <span className="skills-cloud-ring skills-cloud-ring-one" aria-hidden="true" />
        <span className="skills-cloud-ring skills-cloud-ring-two" aria-hidden="true" />
        <div className="skills-cloud-items">
          {points.map(({ technology }, index) => {
            const Icon = getTechIcon(technology);
            return <span className="skills-cloud-item" key={technology} ref={(element) => { itemsRef.current[index] = element; }} title={technology} aria-label={technology}><Icon size={20} strokeWidth={1.4} aria-hidden="true" /><b>{technology}</b></span>;
          })}
        </div>
      </div>
      <small className="skills-cloud-hint">DRAG TO ROTATE / HOVER TO SLOW</small>
    </div>
  );
}
