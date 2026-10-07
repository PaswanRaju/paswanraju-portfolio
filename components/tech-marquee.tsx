"use client";

import { ArrowRight, BrainCircuit, Cloud, Code2, Database, GitBranch, Globe2, MonitorCog, type LucideIcon } from "lucide-react";
import { skillGroups } from "../data/site";

const iconFor: Record<string, LucideIcon> = {
  Python: Code2,
  Java: Code2,
  JavaScript: Code2,
  C: Code2,
  SQL: Database,
  PostgreSQL: Database,
  MySQL: Database,
  Git: GitBranch,
  Docker: MonitorCog,
  Linux: MonitorCog,
  GDB: MonitorCog,
  QEMU: MonitorCog,
  "Spring Boot": Globe2,
  React: Globe2,
  "Next.js": Globe2,
  "AI / ML": BrainCircuit,
  "Cloud Systems": Cloud,
};

export function getTechIcon(technology: string) {
  return iconFor[technology] ?? Code2;
}

const technologies = skillGroups.flatMap((group) => group.items).filter((item, index, items) => items.indexOf(item) === index);

export default function TechMarquee() {
  const items = [...technologies, ...technologies];

  return (
    <div className="tech-marquee" aria-label="Technologies used and currently learning">
      <div className="tech-marquee-edge tech-marquee-edge-left" aria-hidden="true" />
      {/* Animated in CSS (see .tech-marquee-track) so it runs on the compositor instead of a per-frame JS loop. */}
      <div className="tech-marquee-track">
        {items.map((technology, index) => {
          const Icon = getTechIcon(technology);
          return (
            <span className="tech-marquee-item" key={`${technology}-${index}`}>
              <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
              {technology}
              <ArrowRight size={12} aria-hidden="true" />
            </span>
          );
        })}
      </div>
      <div className="tech-marquee-edge tech-marquee-edge-right" aria-hidden="true" />
    </div>
  );
}
