import { Accessibility, AppWindow, Cpu, Monitor, Network, Printer, Projector, Tag } from "lucide-react";
import type { ComponentType } from "react";
import { SiHtml5, SiJavascript, SiLinux } from "react-icons/si";

type ExperienceIcon = ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

// Lowercase, treat "&"/"and" like "/", drop punctuation and spaces, and ignore a trailing plural "s",
// so "AV Systems", "av system", "Printers", "HTML & CSS" all land on the same key.
function normalize(skill: string) {
  return skill.toLowerCase().replace(/&|\band\b/g, "/").replace(/[^a-z0-9]/g, "").replace(/s$/, "");
}

// Simple Icons no longer ships a Windows logo, so Windows uses lucide's Monitor.
const iconFor = new Map<string, ExperienceIcon>([
  ["Hardware", Cpu],
  ["Software", AppWindow],
  ["AV systems", Projector],
  ["Printers", Printer],
  ["Windows", Monitor],
  ["Linux", SiLinux],
  ["Networking", Network],
  ["Network", Network],
  ["HTML/CSS", SiHtml5],
  ["HTML", SiHtml5],
  ["JavaScript", SiJavascript],
  ["JS", SiJavascript],
  ["Accessibility", Accessibility],
].map(([name, icon]) => [normalize(name as string), icon as ExperienceIcon]));

export function getExperienceIcon(skill: string): ExperienceIcon {
  return iconFor.get(normalize(skill)) ?? Tag;
}
