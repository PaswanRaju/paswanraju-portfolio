export const personalInfo = {
  name: "Raju Kumar Paswan",
  shortName: "Raju Paswan",
  role: "Computer Science Student • Software Developer • Builder",
  intro: "Computer Science student at UTA exploring software engineering, AI, cloud systems, full-stack development, and systems programming.",
  email: "raju@paswanraju.com",
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
    explanation: "As part of UTA's Office of Information Technology, I help keep classroom and lab technology running so instructors and students can focus on teaching and learning.",
    responsibilities: ["Resolved 20+ technical support tickets across the university library, classrooms, and labs — student account logins, password issues, campus Wi-Fi, printers, and peripherals.", "Diagnosed hardware, software, and audiovisual problems for students, faculty, and staff; documented solutions and escalated complex incidents with clear troubleshooting findings."],
    tools: ["Hardware", "Software", "AV systems", "Printers"],
  },
  {
    title: "IT Support Assistant",
    company: "Triton SS & College / Kathmandu",
    date: "Jun 2022 – Aug 2023",
    explanation: "As IT Support Assistant at Triton SS & College, I supported campus technology across 200+ workstations.",
    responsibilities: ["Developed automated Python and batch scripts to streamline software deployments, system updates, and data backups across campus computer labs.", "Provided technical support for 200+ campus workstations.", "Managed user access, credentials, and system security permissions."],
    tools: ["Python", "Active Directory", "IT Hardware Support"],
  },
  {
    title: "IT Support Volunteer",
    company: "Nepal Red Cross Society / Nepal",
    date: "May 2023 – Jul 2023",
    explanation: "As a volunteer with the Nepal Red Cross Society, I supported staff with day-to-day IT needs and helped maintain the organization's systems and website.",
    responsibilities: ["Provided front-line IT support for staff.", "Set up and maintained Windows and Linux workstations.", "Diagnosed hardware, software, and network issues.", "Updated the organization's website using HTML, CSS, and JavaScript.", "Supported staff in creating accessible PDF documents."],
    tools: ["Windows", "Linux", "Networking", "HTML/CSS", "JavaScript", "Accessibility"],
  },
] as const;

export type LeetCodeProfile = {
  username: string;
  profileUrl: string;
  // Fallback snapshot shown until (or instead of) live stats from /api/leetcode. Update by hand from the profile page.
  lastUpdated: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  ranking: number;
  language: string;
  languageSolved: number;
  topicActivity: readonly { label: string; count: number; group: "Advanced" | "Intermediate" | "Fundamental" }[];
};

export const leetcodeProfile: LeetCodeProfile = {
  username: "raju_algo",
  profileUrl: "https://leetcode.com/u/raju_algo/",
  lastUpdated: "2026-11-16",
  totalSolved: 54,
  totalQuestions: 4114,
  easySolved: 25,
  easyTotal: 976,
  mediumSolved: 26,
  mediumTotal: 2148,
  hardSolved: 3,
  hardTotal: 990,
  ranking: 2678874,
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
  { number: "01", title: "StoryMotion", status: "Completed", tone: "violet", visual: "storymotion", description: "I built a webcam-driven storytelling app that maps real-time pose estimates to animated character actions across 3 interactive stories. Built at HackTX 2026.", tags: ["React", "TypeScript", "Vite", "MediaPipe", "XState", "Web Audio API"], github: "https://github.com/PaswanRaju/StoryMotion", liveDemo: "https://storymotion-red.vercel.app/", problem: "Turn passive story watching into active play by mapping body gestures to animated character actions.", approach: "Mapped real-time MediaPipe pose estimates to 5 gesture triggers with confidence thresholds and cooldowns; modeled scene transitions with XState; added camera-free button fallbacks so the stories work without a webcam.", decisions: "Wrote 267 automated tests across 37 files to validate story behavior and AI-assisted code changes before merging.", outcome: "Built at HackTX 2026. Live with 3 interactive stories.", note: { label: "What was tricky", text: "Gesture triggers fired on noise until I added confidence thresholds and cooldowns — plus a button fallback for when there is no camera." } },
  { number: "02", title: "PausePoint", status: "Completed", tone: "amber", visual: "pausepoint", description: "I built an on-device scam-awareness browser app that highlights warning signs in suspicious messages, explains how to verify a request, and exports recovery plans for 6 situations. Messages never leave the browser. Built at HackUTD 2026.", tags: ["JavaScript", "HTML/CSS", "Node.js", "GitHub Actions", "GitHub Pages"], github: "https://github.com/PaswanRaju/pausepoint", liveDemo: "https://paswanraju.github.io/pausepoint/", problem: "People act on scam messages in the moment — help them pause, spot the warning signs, and verify before responding.", approach: "Implemented Unicode-normalized detection rules with original-text evidence mapping; all detection runs on-device so messages stay in the browser.", decisions: "Validated behavior with 34 automated tests, including an expanded set of scam and legitimate examples.", outcome: "Flagged 16/16 scam examples in the initial set, and 13/14 scams with 0/12 legitimate examples flagged in the expanded set. Built at HackUTD 2026.", note: { label: "What was tricky", text: "Scammers hide behind lookalike Unicode characters, so detection normalizes text before matching — while still showing evidence in the original message." } },
  { number: "03", title: "OperatorLoop", status: "Completed", tone: "teal", visual: "data", description: "I built a human-in-the-loop decision-support pipeline for manufacturing sensor data. It flags abnormal runs, retrieves process guidance, checks recommendations against safety constraints, and logs whether the operator approves, edits, or rejects them.", tags: ["Python", "Pandas", "scikit-learn", "Matplotlib", "TF-IDF", "Git"], github: "https://github.com/PaswanRaju/OperatorLoop-Manufacturing-AI", liveDemo: "", problem: "Support manufacturing operators with explainable guidance around sensor anomalies.", approach: "Prioritized exact process-condition matching before TF-IDF similarity ranking. Evaluated retrieval and safety validation across 160 synthetic runs with 28 injected anomalies, and created vibration-monitoring visualizations.", decisions: "Focused on reproducible code, technical documentation, explicit safety validation, and operator feedback rather than opaque automation.", outcome: "Detected 28/28 injected anomalies with 0 false alarms across 160 controlled synthetic runs. Reduced mismatched operator guidance from 14/28 to 0/28 cases by matching exact process conditions before TF-IDF ranking.", note: { label: "What was tricky", text: "Retrieval sometimes returned the wrong guidance (a vibration problem pulled up overheating advice) until I matched the exact process condition first and used TF-IDF after that." } },
  { number: "04", title: "AArch64 Teaching Kernel Lab", status: "Completed", tone: "amber", visual: "kernel", description: "A bare-metal 64-bit ARM teaching kernel for Raspberry Pi 3 that I worked through in QEMU: inspecting the ELF, validating the boot in GDB, and stepping through AArch64 instructions.", tags: ["C", "ARM Assembly", "QEMU", "GDB", "Make", "Git"], github: "", liveDemo: "", problem: "Understand boot flow, binary layout, and exception-level state on AArch64.", approach: "Inspected ELF sections and symbols with nm, objdump, and binary tools; validated boot flow in QEMU/GDB and stepped through instructions and registers.", decisions: "Used Make, shell scripts, and Git/GitHub for a reproducible build and debug workflow.", outcome: "Completed systems programming and low-level debugging lab.", note: { label: "What was tricky", text: "Debugging the boot meant reading registers and execution state directly, before any higher-level tooling was running." } },
  { number: "05", title: "3D Tic Tac Toe", status: "Completed", tone: "violet", visual: "game", description: "I built a browser Tic Tac Toe game with a 3D-style board, animated moves, win and draw detection, and score tracking, using plain HTML, CSS, and JavaScript.", tags: ["HTML", "CSS", "JavaScript"], github: "https://github.com/PaswanRaju/3d-tic-tac-toe", liveDemo: "https://paswanraju.github.io/3d-tic-tac-toe/", problem: "Create a polished, approachable browser game without a heavy runtime.", approach: "Built the game interface around responsive layouts, animated state changes, and score tracking.", decisions: "Kept the implementation lightweight with browser-native HTML, CSS, and JavaScript.", outcome: "Completed and deployed as a playable browser game on GitHub Pages.", note: { label: "Next", text: "Add a Player vs Computer mode with easy, medium, and hard difficulty." } },
  { number: "06", title: "MavRAG Course Assistant", status: "In Progress", tone: "violet", visual: "rag", description: "A planned course assistant for PDF ingestion, grounded answers, source citations, and retrieval evaluation.", tags: ["Python", "FastAPI", "LangChain", "ChromaDB", "Docker", "AWS"], github: "", liveDemo: "", problem: "Make course materials easier to search while keeping answers grounded in source documents.", approach: "Planned architecture includes ingestion, embeddings, vector storage, retrieval, citations, REST APIs, semantic-search evaluation, caching, and latency/error logging.", decisions: "Prompt/version tracking and retrieval testing are planned alongside Docker deployment to AWS EC2/S3.", outcome: "In progress. The architecture above is the plan; the implementation is not finished yet.", note: null },
  { number: "07", title: "Cloud-Native Task Platform", status: "In Progress", tone: "teal", visual: "cloud", description: "A planned task platform with a React frontend, Spring Boot API, relational persistence, authentication, caching, and cloud deployment.", tags: ["Java", "Spring Boot", "React", "MySQL", "Redis", "AWS", "Docker", "GitHub Actions"], github: "", liveDemo: "", problem: "Design a maintainable task workflow with a clear path from local development to cloud deployment.", approach: "Planned architecture covers JWT authentication, RBAC, validation, pagination, indexing, Redis caching, tests, and horizontal scaling.", decisions: "Docker, GitHub Actions, AWS RDS/EC2, and CloudWatch are planned as the delivery and operations foundation.", outcome: "In progress. The architecture above is the target design; the build is not finished yet.", note: null },
] as const;

export const skillGroups = [
  { label: "Languages", state: "Hands-on", items: ["Python", "Java", "C", "C++", "TypeScript", "JavaScript", "SQL", "ARM Assembly"] },
  { label: "AI & Data", state: "Hands-on", items: ["Pandas", "scikit-learn", "Matplotlib", "TF-IDF", "AI / ML", "MediaPipe"] },
  { label: "Systems & Tools", state: "Hands-on", items: ["Linux", "Git", "GDB", "QEMU", "Make", "GitHub Actions", "Shell Scripting", "MySQL"] },
  { label: "Web", state: "Hands-on", items: ["HTML", "CSS", "Next.js", "React", "Vite", "XState", "Vercel"] },
  { label: "Currently learning", state: "In progress", items: ["PostgreSQL", "Docker", "AWS", "Spring Boot", "FastAPI", "LangChain", "ChromaDB", "Redis", "Cloud Systems"] },
] as const;

export type SkillName = (typeof skillGroups)[number]["items"][number];
