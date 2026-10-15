import { BrainCircuit, ChartLine, Cloud, Database, FileSearch, Tag } from "lucide-react";
import type { ComponentType } from "react";
import {
  SiArm, SiC, SiCss, SiDocker, SiFastapi, SiGit, SiGithubactions, SiGnu, SiHtml5, SiJavascript, SiLangchain,
  SiLinux, SiMysql, SiNextdotjs, SiOpenjdk, SiPandas, SiPostgresql, SiPython, SiQemu, SiReact, SiRedis,
  SiScikitlearn, SiSpringboot,
} from "react-icons/si";
import type { SkillName } from "../data/site";

type SkillIcon = { icon: ComponentType<{ size?: number; color?: string; "aria-hidden"?: boolean | "true" }>; color: string };

// Brand logos use their official color; a few very light brand colors are darkened so the icon stays visible
// on white. Skills without an official logo get a lucide icon in the portfolio violet.
// Colors are CSS values (applied through --skill-color in globals.css). Logos too dark to see on the dark theme
// use a --brand-* token that switches to a lighter shade there.
const violet = "var(--color-violet)";
const iconFor: Record<SkillName, SkillIcon> = {
  Python: { icon: SiPython, color: "#3776ab" },
  C: { icon: SiC, color: "var(--brand-c)" },
  "ARM Assembly": { icon: SiArm, color: "#0091bd" },
  JavaScript: { icon: SiJavascript, color: "#d4b600" },
  Pandas: { icon: SiPandas, color: "var(--brand-pandas)" },
  "scikit-learn": { icon: SiScikitlearn, color: "#f7931e" },
  Matplotlib: { icon: ChartLine, color: "var(--brand-matplotlib)" },
  "TF-IDF": { icon: FileSearch, color: violet },
  "AI / ML": { icon: BrainCircuit, color: violet },
  Linux: { icon: SiLinux, color: "var(--brand-linux)" },
  Git: { icon: SiGit, color: "#f05032" },
  GDB: { icon: SiGnu, color: "var(--brand-gnu)" },
  QEMU: { icon: SiQemu, color: "#ff6600" },
  Make: { icon: SiGnu, color: "var(--brand-gnu)" },
  HTML: { icon: SiHtml5, color: "#e34f26" },
  CSS: { icon: SiCss, color: "var(--brand-css)" },
  "Next.js": { icon: SiNextdotjs, color: "var(--brand-nextjs)" },
  Java: { icon: SiOpenjdk, color: "#437291" },
  SQL: { icon: Database, color: violet },
  PostgreSQL: { icon: SiPostgresql, color: "#4169e1" },
  MySQL: { icon: SiMysql, color: "#4479a1" },
  Docker: { icon: SiDocker, color: "#2496ed" },
  AWS: { icon: Cloud, color: violet },
  "Spring Boot": { icon: SiSpringboot, color: "#6db33f" },
  React: { icon: SiReact, color: "#149eca" },
  FastAPI: { icon: SiFastapi, color: "#009688" },
  LangChain: { icon: SiLangchain, color: "var(--brand-langchain)" },
  ChromaDB: { icon: Database, color: violet },
  Redis: { icon: SiRedis, color: "#dc382d" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088ff" },
  "Cloud Systems": { icon: Cloud, color: violet },
};

export function getSkillIcon(skill: string): SkillIcon {
  return iconFor[skill as SkillName] ?? { icon: Tag, color: violet };
}
