"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

// three.js lives in this separate chunk, so devices that get the static fallback never download it.
const AtmosphereCanvas = dynamic(() => import("./atmosphere-canvas"), { ssr: false, loading: () => <div className="atmosphere-fallback" aria-hidden="true" /> });

const capableScreen = "(min-width: 701px) and (pointer: fine)";

type DeviceHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

// WebGL only on desktop-class devices: wide screen, precise pointer, and no low-memory, low-core, or data-saver hints.
function canRenderWebGL() {
  if (!window.matchMedia(capableScreen).matches) return false;
  const hints = navigator as DeviceHints;
  if (hints.connection?.saveData) return false;
  if ((hints.deviceMemory ?? 8) < 4) return false;
  return (navigator.hardwareConcurrency ?? 8) >= 4;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(capableScreen);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export default function Atmosphere() {
  const reduced = useReducedMotion();
  const webgl = useSyncExternalStore(subscribe, canRenderWebGL, () => false);

  if (reduced || !webgl) return <div className="atmosphere-fallback" aria-hidden="true" />;
  return <AtmosphereCanvas />;
}
