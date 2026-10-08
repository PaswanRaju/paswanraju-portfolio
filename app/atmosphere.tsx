"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useWebGLCapable } from "../lib/webgl-support";

// three.js lives in this separate chunk, so devices that get the static fallback never download it.
const AtmosphereCanvas = dynamic(() => import("./atmosphere-canvas"), { ssr: false, loading: () => <div className="atmosphere-fallback" aria-hidden="true" /> });

// `quiet` (Recruiter Mode) uses the static fallback, which also unmounts the WebGL canvas and its frame loop.
// `paused` (a dialog is open over the page) keeps the canvas mounted but stops drawing frames.
export default function Atmosphere({ quiet = false, paused = false }: { quiet?: boolean; paused?: boolean }) {
  const reduced = useReducedMotion();
  const webgl = useWebGLCapable();

  if (quiet || reduced || !webgl) return <div className="atmosphere-fallback" aria-hidden="true" />;
  return <AtmosphereCanvas paused={paused} />;
}
