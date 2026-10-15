<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Portfolio redesign rules

## Goal
Redesign this Next.js portfolio into a clean light theme matching the screenshots in `design-reference/`.
Keep ALL existing content (text, projects, experience, links). Only change design and layout.

## Reference screenshots (in design-reference/)
hero.png, about.png, projects.png, experience.png, certifications.png,
courses-skills.png, skills.png, leetcode.png, roadmap.png, contact.png, footer.png

## Remove
Three.js background, the old always-dark theme, terminal button, ⌘K command menu, recruiter mode.
(The light/dark toggle below is a current feature, not the old dark theme. Keep it.)

## Design system
The site has a light and a dark theme, switched by the sun/moon toggle in the navbar (and the last row of the mobile menu).
- Theming: next-themes with `attribute="class"` (`components/theme-provider.tsx`). It defaults to the visitor's system setting, remembers their choice in localStorage, and sets `class="dark"` on `<html>` before first paint.
- Colors: every color is a token in `app/globals.css`, set in `:root` (light) and overridden in `html.dark` (dark). Never hard-code a color in a rule; use or add a `--color-*` token and give it a value in both blocks.
- Tinted backgrounds (pills, panels, the resume card, hover fills) use `color-mix(in srgb, var(--color-…) N%, transparent)` so they follow the theme.
- Logos (UTA, Nepal Red Cross) always sit on white rounded boxes (`--color-logo-bg`) in both themes.
- Brand-colored tech icons keep their official color; any too dark to see on the dark background use a `--brand-*` token with a lighter dark-mode shade (`components/skill-icons.ts`).

### Light theme
- Background: off-white #F7F7F5. Cards: white, thin light-gray border, ~12px rounded corners.
- Text: near-black #111111 for headings, gray #5A6270 for body text.
- Ultra violet #6B5B95: primary accent (links, filled buttons, active nav, highlighted text).
- Coral #FF6F61: secondary accent for decorative details only (dots, bars, borders, hover glows). Never use it for small text.
- Green #88B04B: tertiary accent for decorative details (bars, status dots, tags).
- Rose quartz #F7CAC9 and serenity #92A8D1: soft backgrounds for cards, pills, and hover fills.
- Section heading left bars rotate: violet, coral, green, serenity.
- Font: Inter. Section headings: uppercase, extra-bold, tight letter-spacing, thick colored bar on the left (rotate violet, coral, green, serenity per section).
- Buttons: filled violet or outlined violet, rounded, with arrow icons.

### Dark theme
- Page background #111318. Cards and navbar #1A1D24. Borders #2A2F38.
- Headings #F2F2F2, body text #A9B0BA.
- Violet accent #A99BD6, "Paswan" blue #8FA8D9, coral details #FF8A7E. Dark green buttons #6E9A3A with white text. The light green dot stays #88B04B.
- Filled blue buttons (Send message) use dark text #111318 on the blue for contrast.
- Contact form inputs: background #111318, border #2A2F38, light text, placeholder #8A919C.

### Both themes
- Must be responsive on mobile.

## Working rules
- Always use Context7 to check current documentation before writing code that uses Next.js, React, framer-motion, lucide-react, or react-icons.
- Work on ONE section per task. Do not touch other sections.
- After each task, summarize which files changed.
- Run `npm run build` before finishing to confirm nothing is broken.
- Never commit files in `design-reference/`.
- Never run git commit, git push, or any other git command that changes history. I handle all commits myself.