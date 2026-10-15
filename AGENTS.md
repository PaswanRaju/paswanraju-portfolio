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
Three.js background, dark theme, terminal button, ⌘K command menu, recruiter mode.

## Design system
- Background: off-white #F7F7F5. Cards: white, thin light-gray border, ~12px rounded corners.
- Text: near-black #111111 for headings, gray #5A6270 for body text.
- Ultra violet #6B5B95: primary accent (links, filled buttons, active nav, highlighted text).
- Coral #FF6F61: secondary accent for decorative details only (dots, bars, borders, hover glows). Never use it for small text.
- Green #88B04B: tertiary accent for decorative details (bars, status dots, tags).
- Rose quartz #F7CAC9 and serenity #92A8D1: soft backgrounds for cards, pills, and hover fills.
- Section heading left bars rotate: violet, coral, green, serenity.
- Font: Inter. Section headings: uppercase, extra-bold, tight letter-spacing, thick colored bar on the left (rotate violet, coral, green, serenity per section).
- Buttons: filled violet or outlined violet, rounded, with arrow icons.
- Must be responsive on mobile.

## Working rules
- Work on ONE section per task. Do not touch other sections.
- After each task, summarize which files changed.
- Run `npm run build` before finishing to confirm nothing is broken.
- Never commit files in `design-reference/`.
- Never run git commit, git push, or any other git command that changes history. I handle all commits myself.