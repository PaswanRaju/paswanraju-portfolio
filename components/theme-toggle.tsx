"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Both icons are always rendered and CSS shows the right one from html.dark (sun in dark mode, moon in light),
// so the server HTML is already correct and nothing flips after hydration.
// aria-pressed is only known in the browser, so it is added after hydration.
export function ThemeToggle({ className, label }: { className: string; label?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = resolvedTheme === "dark";
  return <button className={className} type="button" aria-label="Toggle dark mode" aria-pressed={hydrated ? isDark : undefined} onClick={() => setTheme(isDark ? "light" : "dark")}>
    <Sun className="theme-icon-sun" size={22} aria-hidden="true" />
    <Moon className="theme-icon-moon" size={22} aria-hidden="true" />
    {label && <span aria-hidden="true">{label}</span>}
  </button>;
}
