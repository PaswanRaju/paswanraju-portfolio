"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const bootLines = ["RAJU.DEV", "INITIALIZING PORTFOLIO", "SOFTWARE / AI / CLOUD", "SYSTEMS READY"];

export default function Intro() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(() => !reduced);
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const lineTimer = window.setInterval(() => {
      setLine((current) => Math.min(current + 1, bootLines.length - 1));
    }, 250);
    const closeTimer = window.setTimeout(() => setVisible(false), 1250);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(closeTimer);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-screen"
          role="status"
          aria-label="Loading portfolio"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
        >
          <div className="intro-panel">
            <div className="intro-mark">RKP<span>.</span></div>
            <div className="intro-lines" aria-hidden="true">
              {bootLines.slice(0, line + 1).map((entry, index) => (
                <motion.p
                  key={entry}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22 }}
                  className={index === 0 ? "intro-primary" : ""}
                >
                  <span>{index === 0 ? ">" : "·"}</span> {entry}
                </motion.p>
              ))}
            </div>
            <div className="intro-progress"><span /></div>
            <button className="intro-skip" type="button" onClick={() => setVisible(false)}>
              Skip intro <span>↗</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
