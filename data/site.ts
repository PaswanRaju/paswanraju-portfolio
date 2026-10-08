export const personalInfo = {
  name: "Raju Kumar Paswan",
  shortName: "Raju Paswan",
  role: "Computer Science Student • Software Developer • Builder",
  intro: "Computer Science student at UTA exploring software engineering, AI, cloud systems, full-stack development, and systems programming.",
  email: "paswanrajukumar890@gmail.com",
} as const;

export const siteLinks = {
  email: `mailto:${personalInfo.email}`,
  github: "https://github.com/PaswanRaju",
  linkedin: "https://linkedin.com/in/paswanrajukumar",
  resume: "/resume/Raju_Kumar_Paswan_Resume.pdf",
} as const;

export const education = {
  school: "The University of Texas at Arlington",
  degree: "Bachelor of Science in Computer Science",
  degreeShort: "B.S. Computer Science",
  minor: "Minor in Data Science",
  coursework: ["Data Structures & Algorithms", "Object-Oriented Programming", "Database Systems", "Computer Organization", "Operating Systems", "Discrete Mathematics", "Software Engineering"],
  organizations: ["ACM Research", "ACM", "Data Science Club", "CSEC", "HackUTA"],
} as const;

export const currentFocus = ["CS @ UTA", "Building software", "Exploring AI & cloud systems"] as const;

export const experience = [
  {
    title: "Student Technical Assistant",
    company: "UTA Office of Information Technology",
    date: "Sep 2026 – Present",
    responsibilities: ["Troubleshoot classroom and lab technology across hardware, software, AV systems, and printers.", "Document technical issues.", "Escalate complex cases when necessary."],
    tools: ["Hardware", "Software", "AV systems", "Printers"],
  },
  {
    title: "IT Support Volunteer",
    company: "Nepal Red Cross Society / Nepal",
    date: "May 2023 – Jul 2023",
    responsibilities: ["Front-line IT support.", "Windows/Linux workstation setup.", "Hardware/software/network diagnostics.", "Website updates using HTML/CSS/JavaScript.", "Accessible PDF support."],
    tools: ["Windows", "Linux", "Networking", "HTML/CSS", "JavaScript", "Accessibility"],
  },
] as const;

export type LeetCodeProfile = {
  username: string;
  profileUrl: string;
  totalSolved: number | null;
  totalQuestions: number | null;
  easySolved: number | null;
  easyTotal: number | null;
  mediumSolved: number | null;
  mediumTotal: number | null;
  hardSolved: number | null;
  hardTotal: number | null;
  ranking: number | null;
  language: string;
  languageSolved: number;
  topicActivity: readonly { label: string; count: number; group: "Advanced" | "Intermediate" | "Fundamental" }[];
};

export const leetcodeProfile: LeetCodeProfile = {
  username: "raju_algo",
  profileUrl: "https://leetcode.com/u/raju_algo/",
  totalSolved: null,
  totalQuestions: null,
  easySolved: null,
  easyTotal: null,
  mediumSolved: null,
  mediumTotal: null,
  hardSolved: null,
  hardTotal: null,
  ranking: null,
  language: "C",
  languageSolved: 53,
  topicActivity: [
    { label: "Dynamic Programming", count: 11, group: "Advanced" },
    { label: "Divide and Conquer", count: 2, group: "Advanced" },
    { label: "Trie", count: 1, group: "Advanced" },
    { label: "Tree", count: 14, group: "Intermediate" },
    { label: "Binary Tree", count: 14, group: "Intermediate" },
    { label: "Math", count: 12, group: "Intermediate" },
    { label: "Array", count: 18, group: "Fundamental" },
    { label: "String", count: 12, group: "Fundamental" },
    { label: "Two Pointers", count: 8, group: "Fundamental" },
  ],
};

export type Project = (typeof projects)[number];
export const projects = [
  { number: "01", title: "OperatorLoop", status: "Completed", tone: "teal", visual: "data", description: "I built a human-in-the-loop decision-support pipeline for manufacturing sensor data. It flags abnormal runs, retrieves process guidance, checks recommendations against safety constraints, and logs whether the operator approves, edits, or rejects them.", tags: ["Python", "Pandas", "scikit-learn", "Matplotlib", "TF-IDF", "Git"], github: "https://github.com/PaswanRaju/OperatorLoop-Manufacturing-AI", liveDemo: "", problem: "Support manufacturing operators with explainable guidance around sensor anomalies.", approach: "Prioritized exact process-condition matching before TF-IDF similarity ranking. Evaluated retrieval and safety validation across 160 synthetic runs with 28 injected anomalies, and created vibration-monitoring visualizations.", decisions: "Focused on reproducible code, technical documentation, explicit safety validation, and operator feedback rather than opaque automation.", outcome: "Completed technical project evaluated across the documented synthetic runs.", note: { label: "What was tricky", text: "Retrieval sometimes returned the wrong guidance (a vibration problem pulled up overheating advice) until I matched the exact process condition first and used TF-IDF after that." } },
  { number: "02", title: "AArch64 Teaching Kernel Lab", status: "Completed", tone: "amber", visual: "kernel", description: "A bare-metal 64-bit ARM teaching kernel for Raspberry Pi 3 that I worked through in QEMU: inspecting the ELF, validating the boot in GDB, and stepping through AArch64 instructions.", tags: ["C", "ARM Assembly", "QEMU", "GDB", "Make", "Git"], github: "", liveDemo: "", problem: "Understand boot flow, binary layout, and exception-level state on AArch64.", approach: "Inspected ELF sections and symbols with nm, objdump, and binary tools; validated boot flow in QEMU/GDB and stepped through instructions and registers.", decisions: "Used Make, shell scripts, and Git/GitHub for a reproducible build and debug workflow.", outcome: "Completed systems programming and low-level debugging lab.", note: { label: "What was tricky", text: "Debugging the boot meant reading registers and execution state directly, before any higher-level tooling was running." } },
  { number: "03", title: "3D Tic Tac Toe", status: "Completed", tone: "violet", visual: "game", description: "I built a browser Tic Tac Toe game with a 3D-style board, animated moves, win and draw detection, and score tracking, using plain HTML, CSS, and JavaScript.", tags: ["HTML", "CSS", "JavaScript"], github: "https://github.com/PaswanRaju/3d-tic-tac-toe", liveDemo: "https://paswanraju.github.io/3d-tic-tac-toe/", problem: "Create a polished, approachable browser game without a heavy runtime.", approach: "Built the game interface around responsive layouts, animated state changes, and score tracking.", decisions: "Kept the implementation lightweight with browser-native HTML, CSS, and JavaScript.", outcome: "Completed and deployed as a playable browser game on GitHub Pages.", note: { label: "Next", text: "Add a Player vs Computer mode with easy, medium, and hard difficulty." } },
  { number: "04", title: "MavRAG Course Assistant", status: "In Progress", tone: "violet", visual: "rag", description: "A planned course assistant for PDF ingestion, grounded answers, source citations, and retrieval evaluation.", tags: ["Python", "FastAPI", "LangChain", "ChromaDB", "Docker", "AWS"], github: "", liveDemo: "", problem: "Make course materials easier to search while keeping answers grounded in source documents.", approach: "Planned architecture includes ingestion, embeddings, vector storage, retrieval, citations, REST APIs, semantic-search evaluation, caching, and latency/error logging.", decisions: "Prompt/version tracking and retrieval testing are planned alongside Docker deployment to AWS EC2/S3.", outcome: "In progress. The architecture above is the plan; the implementation is not finished yet.", note: null },
  { number: "05", title: "Cloud-Native Task Platform", status: "In Progress", tone: "teal", visual: "cloud", description: "A planned task platform with a React frontend, Spring Boot API, relational persistence, authentication, caching, and cloud deployment.", tags: ["Java", "Spring Boot", "React", "MySQL", "Redis", "AWS", "Docker", "GitHub Actions"], github: "", liveDemo: "", problem: "Design a maintainable task workflow with a clear path from local development to cloud deployment.", approach: "Planned architecture covers JWT authentication, RBAC, validation, pagination, indexing, Redis caching, tests, and horizontal scaling.", decisions: "Docker, GitHub Actions, AWS RDS/EC2, and CloudWatch are planned as the delivery and operations foundation.", outcome: "In progress. The architecture above is the target design; the build is not finished yet.", note: null },
] as const;

export const skillGroups = [
  { label: "Languages", state: "Hands-on", items: ["Python", "Java", "JavaScript", "C", "SQL"] },
  { label: "Databases", state: "Hands-on", items: ["PostgreSQL", "MySQL"] },
  { label: "Tools / Systems", state: "Hands-on", items: ["Git", "Docker", "Linux", "GDB", "QEMU"] },
  { label: "Web / Backend", state: "Hands-on", items: ["Spring Boot", "React", "Next.js"] },
  { label: "Currently learning", state: "In progress", items: ["AI / ML", "Cloud Systems"] },
] as const;

export type SkillName = (typeof skillGroups)[number]["items"][number];

// Keys must be skill names and values completed project titles, so a typo fails type-checking instead of silently hiding the link.
export const skillProjectLinks: Partial<Record<SkillName, readonly Extract<Project, { status: "Completed" }>["title"][]>> = {
  Python: ["OperatorLoop"],
  JavaScript: ["3D Tic Tac Toe"],
  C: ["AArch64 Teaching Kernel Lab"],
  Git: ["OperatorLoop", "AArch64 Teaching Kernel Lab"],
  GDB: ["AArch64 Teaching Kernel Lab"],
  QEMU: ["AArch64 Teaching Kernel Lab"],
  "AI / ML": ["OperatorLoop"],
};

// System Map. Skills and their projects come straight from each project's `tags`; this only adds which
// engineering area a tag serves in that project. Keys are type-checked against the project's real tags.
// Git is left off on purpose: it's in every project's workflow, not tied to one area.
export const engineeringAreas = [
  { id: "frontend", label: "Frontend" },
  { id: "ai-data", label: "AI / Data" },
  { id: "retrieval", label: "Retrieval" },
  { id: "systems", label: "Systems & debugging" },
  { id: "backend", label: "Backend & APIs" },
  { id: "data-layer", label: "Data layer" },
  { id: "deployment", label: "Deployment" },
] as const;
export type AreaId = (typeof engineeringAreas)[number]["id"];
type ProjectAreaMap = { [P in Project as P["title"]]: Partial<Record<P["tags"][number], AreaId>> };
export const systemMapAreas: ProjectAreaMap = {
  "3D Tic Tac Toe": { HTML: "frontend", CSS: "frontend", JavaScript: "frontend" },
  OperatorLoop: { Python: "ai-data", Pandas: "ai-data", "scikit-learn": "ai-data", Matplotlib: "ai-data", "TF-IDF": "retrieval" },
  "AArch64 Teaching Kernel Lab": { C: "systems", "ARM Assembly": "systems", QEMU: "systems", GDB: "systems", Make: "systems" },
  "MavRAG Course Assistant": { Python: "retrieval", FastAPI: "backend", LangChain: "retrieval", ChromaDB: "retrieval", Docker: "deployment", AWS: "deployment" },
  "Cloud-Native Task Platform": { Java: "backend", "Spring Boot": "backend", React: "frontend", MySQL: "data-layer", Redis: "data-layer", Docker: "deployment", AWS: "deployment", "GitHub Actions": "deployment" },
};

// "How I Think": each principle points back to work already described on this page (projects or experience).
export const thinkingPrinciples = [
  { number: "01", title: "Start simple", body: "I like getting the basic version working first, then adding complexity when there's an actual reason for it.", source: "From 3D Tic Tac Toe", detail: "It shipped as plain HTML, CSS, and JavaScript. A Player vs Computer mode comes next, not first." },
  { number: "02", title: "Debug what's actually happening", body: "Working with QEMU and GDB taught me to inspect registers, execution state, and program behavior instead of guessing.", source: "From the AArch64 lab", detail: "Stepping through the boot one instruction at a time." },
  { number: "03", title: "Measure before guessing", body: "With OperatorLoop, testing the pipeline across many runs exposed problems that weren't obvious from a few examples.", source: "From OperatorLoop", detail: "Evaluated across 160 synthetic runs with 28 injected anomalies." },
  { number: "04", title: "Build for the person using it", body: "Technical correctness matters, but the software still needs to make sense to the person using it.", source: "From IT support", detail: "Front-line IT support and accessible PDF support at the Nepal Red Cross Society, and classroom technology support at UTA." },
] as const;

// A plain log of what I've been building. Dates come from git history and the GitHub repos; undated work is left out.
export const buildNotes = [
  { when: "Now", dateTime: null, entries: [
    { title: "MavRAG Course Assistant", text: "Planning the ingestion, retrieval, and source-citation pieces." },
    { title: "Cloud-Native Task Platform", text: "Planning the Spring Boot API, auth, and deployment setup." },
  ] },
  { when: "Oct 2026", dateTime: "2026-10", entries: [
    { title: "This portfolio", text: "Built it with Next.js and Three.js, then spent a round on rendering performance, first load, keyboard navigation, and mobile accessibility." },
    { title: "3D Tic Tac Toe", text: "Published the game on GitHub Pages." },
  ] },
  { when: "Sep 2026", dateTime: "2026-09", entries: [
    { title: "OperatorLoop", text: "Built the pipeline, evaluated it on 160 synthetic runs, and fixed a retrieval mismatch and an over-eager safety check." },
  ] },
] as const;
