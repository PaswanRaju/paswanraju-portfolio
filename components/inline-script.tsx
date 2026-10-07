"use client";

// Inline script that runs during HTML parsing, before first paint and before React loads.
// A Client Component so the type check below runs in the browser too (the layout using it is a Server Component).
// On the client it renders as text/plain so React never re-executes it or warns about <script> tags
// (pattern from node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md).
export function InlineScript({ html }: { html: string }) {
  return <script type={typeof window === "undefined" ? "text/javascript" : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
