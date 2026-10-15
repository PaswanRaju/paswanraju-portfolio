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
const violet = "#6b5b95";
const iconFor: Record<SkillName, SkillIcon> = {
  Python: { icon: SiPython, color: "#3776ab" },
  C: { icon: SiC, color: "#00599c" },
  "ARM Assembly": { icon: SiArm, color: "#0091bd" },
  JavaScript: { icon: SiJavascript, color: "#d4b600" },
  Pandas: { icon: SiPandas, color: "#150458" },
  "scikit-learn": { icon: SiScikitlearn, color: "#f7931e" },
  Matplotlib: { icon: ChartLine, color: "#11557c" },
  "TF-IDF": { icon: FileSearch, color: violet },
  "AI / ML": { icon: BrainCircuit, color: violet },
  Linux: { icon: SiLinux, color: "#111111" },
  Git: { icon: SiGit, color: "#f05032" },
  GDB: { icon: SiGnu, color: "#a42e2b" },
  QEMU: { icon: SiQemu, color: "#ff6600" },
  Make: { icon: SiGnu, color: "#a42e2b" },
  HTML: { icon: SiHtml5, color: "#e34f26" },
  CSS: { icon: SiCss, color: "#663399" },
  "Next.js": { icon: SiNextdotjs, color: "#000000" },
  Java: { icon: SiOpenjdk, color: "#437291" },
  SQL: { icon: Database, color: violet },
  PostgreSQL: { icon: SiPostgresql, color: "#4169e1" },
  MySQL: { icon: SiMysql, color: "#4479a1" },
  Docker: { icon: SiDocker, color: "#2496ed" },
  AWS: { icon: Cloud, color: violet },
  "Spring Boot": { icon: SiSpringboot, color: "#6db33f" },
  React: { icon: SiReact, color: "#149eca" },
  FastAPI: { icon: SiFastapi, color: "#009688" },
  LangChain: { icon: SiLangchain, color: "#1c3c3c" },
  ChromaDB: { icon: Database, color: violet },
  Redis: { icon: SiRedis, color: "#dc382d" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088ff" },
  "Cloud Systems": { icon: Cloud, color: violet },
};

export function getSkillIcon(skill: string): SkillIcon {
  return iconFor[skill as SkillName] ?? { icon: Tag, color: violet };
}
