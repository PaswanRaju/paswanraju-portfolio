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
- Headings: navy #1B2033. Body text: gray #5A6270.
- Accent blue #3B57C4 (links, filled buttons, active nav). Red dot #D9534F after last name. Yellow accent bar above photo.
- Font: Inter. Section headings: uppercase, extra-bold, tight letter-spacing, thick colored bar on the left (rotate blue, red, green, purple, orange per section).
- Buttons: filled blue or outlined blue, rounded, with arrow icons.
- Must be responsive on mobile.

## Working rules
- Work on ONE section per task. Do not touch other sections.
- After each task, summarize which files changed.
- Run `npm run build` before finishing to confirm nothing is broken.
- Never commit files in `design-reference/`.