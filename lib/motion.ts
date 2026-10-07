import { type MotionProps, type TargetAndTransition, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export const fadeUp: MotionProps["variants"] = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const scaleReveal: MotionProps["variants"] = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export const maskedReveal: MotionProps["variants"] = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerChildren: MotionProps["variants"] = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const hoverLift: TargetAndTransition = {
  y: -5,
  transition: { type: "spring", stiffness: 320, damping: 24 },
};

export function useParallax(distance = 24) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useSpring(0, { stiffness: 80, damping: 22 });
  const y = useTransform(progress, [-1, 1], [distance, -distance]);

  return { ref, style: { y }, setProgress: progress.set };
}

export function magneticOffset(
  event: { clientX: number; clientY: number },
  element: HTMLElement,
  strength = 0.12,
) {
  const bounds = element.getBoundingClientRect();
  return {
    x: (event.clientX - (bounds.left + bounds.width / 2)) * strength,
    y: (event.clientY - (bounds.top + bounds.height / 2)) * strength,
  };
}
