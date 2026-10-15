"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

// next-themes renders an inline script that sets class="dark" on <html> before first paint (no flash of the wrong theme).
// Like InlineScript, it renders as text/plain on the client so React never re-executes it or warns about <script> tags.
// A Client Component so the typeof window check runs in the browser (the layout using it is a Server Component).
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange scriptProps={{ type: typeof window === "undefined" ? "text/javascript" : "text/plain" }}>{children}</NextThemesProvider>;
}
