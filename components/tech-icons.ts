import { BrainCircuit, Cloud, Code2, Database, GitBranch, Globe2, MonitorCog, type LucideIcon } from "lucide-react";

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
