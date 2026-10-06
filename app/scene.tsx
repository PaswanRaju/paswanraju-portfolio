"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HeroScene() {
  const reduced = useReducedMotion();
  return (
    <div className="command-core" aria-label="Engineering system interface">
      <div className="core-top"><span className="signal-dot" /> RKP / SYSTEM CORE <span className="core-state">ONLINE</span></div>
      <div className="core-body">
        <div className="core-brand">RKP<span>.</span></div>
        <div className="core-lines"><span /><span /><span /></div>
        <div className="core-node node-a" /><div className="core-node node-b" /><div className="core-node node-c" />
        <motion.div className="core-path path-a" animate={reduced ? undefined : { opacity: [0.35, 1, 0.35] }} transition={{ duration: 2.8, repeat: Infinity }} />
        <motion.div className="core-path path-b" animate={reduced ? undefined : { opacity: [1, 0.35, 1] }} transition={{ duration: 3.4, repeat: Infinity }} />
      </div>
      <div className="core-bottom"><span>BUILD / DEBUG / ITERATE</span><span>v0.1</span></div>
    </div>
  );
}
