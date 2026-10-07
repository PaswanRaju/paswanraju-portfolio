import { type MotionStyle, useMotionValue, useReducedMotion } from "framer-motion";
import { type PointerEvent } from "react";

// Pointer-driven 3D tilt plus a glow position exposed as CSS variables.
// Values go through motion values, so pointer moves never re-render React.
// Reduced motion is read only inside the event handler, never during render, so markup is identical on server and client.
export function usePointerTilt({ perspective, maxRotateX, maxRotateY, glowVars }: {
  perspective: number;
  maxRotateX: number;
  maxRotateY: number;
  glowVars: readonly [x: `--${string}`, y: `--${string}`];
}) {
  const reduced = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue("50%");
  const glowY = useMotionValue("50%");

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    // Reading layout here is safe: motion value writes are batched into the next frame, not applied synchronously.
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((y - 0.5) * -maxRotateX);
    rotateY.set((x - 0.5) * maxRotateY);
    glowX.set(`${x * 100}%`);
    glowY.set(`${y * 100}%`);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const style = { rotateX, rotateY, transformPerspective: perspective, [glowVars[0]]: glowX, [glowVars[1]]: glowY } as MotionStyle;
  return { style, onPointerMove, onPointerLeave };
}
