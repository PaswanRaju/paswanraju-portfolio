export const personalInfo = {
  name: "Raju Kumar Paswan",
  shortName: "Raju Paswan",
  role: "Computer Science Student • Software Engineer • Builder",
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
  { number: "01", title: "3D Tic Tac Toe", status: "Completed", tone: "violet", visual: "game", description: "A futuristic browser-based Tic Tac Toe experience featuring a 3D-inspired interface, animated interactions, score tracking, responsive design, and polished gameplay.", tags: ["HTML", "CSS", "JavaScript"], github: "https://github.com/PaswanRaju/3d-tic-tac-toe", liveDemo: "", problem: "Create a polished, approachable browser game without a heavy runtime.", approach: "Built the game interface around responsive layouts, animated state changes, and score tracking.", decisions: "Kept the implementation lightweight with browser-native HTML, CSS, and JavaScript.", outcome: "Completed browser project; no verified live demo is listed." },
  { number: "02", title: "OperatorLoop", status: "Completed", tone: "teal", visual: "data", description: "Human-in-the-loop manufacturing AI decision support: sensor processing, anomaly classification, guidance retrieval, safety validation, and operator feedback logging.", tags: ["Python", "Pandas", "scikit-learn", "Matplotlib", "TF-IDF", "Git"], github: "https://github.com/PaswanRaju/OperatorLoop-Manufacturing-AI", liveDemo: "", problem: "Support manufacturing operators with explainable guidance around sensor anomalies.", approach: "Prioritized exact process-condition matching before TF-IDF similarity ranking. Evaluated retrieval and safety validation across 160 synthetic runs with 28 injected anomalies, and created vibration-monitoring visualizations.", decisions: "Focused on reproducible code, technical documentation, explicit safety validation, and operator feedback rather than opaque automation.", outcome: "Completed technical project evaluated across the documented synthetic runs." },
  { number: "03", title: "AArch64 Teaching Kernel Lab", status: "Completed", tone: "amber", visual: "kernel", description: "A bare-metal 64-bit ARM kernel image for Raspberry Pi 3/QEMU, explored through ELF inspection, QEMU/GDB boot validation, and AArch64 instruction-level debugging.", tags: ["C", "ARM Assembly", "QEMU", "GDB", "Make", "Git"], github: "", liveDemo: "", problem: "Understand boot flow, binary layout, and exception-level state on AArch64.", approach: "Inspected ELF sections and symbols with nm, objdump, and binary tools; validated boot flow in QEMU/GDB and stepped through instructions and registers.", decisions: "Used Make, shell scripts, and Git/GitHub for a reproducible build and debug workflow.", outcome: "Completed systems programming and low-level debugging lab." },
  { number: "04", title: "MavRAG Course Assistant", status: "In progress / Planned", tone: "violet", visual: "rag", description: "A planned course assistant for PDF ingestion, grounded answers, source citations, and retrieval evaluation.", tags: ["Python", "FastAPI", "LangChain", "ChromaDB", "Docker", "AWS"], github: "", liveDemo: "", problem: "Make course materials easier to search while keeping answers grounded in source documents.", approach: "Planned architecture includes ingestion, embeddings, vector storage, retrieval, citations, REST APIs, semantic-search evaluation, caching, and latency/error logging.", decisions: "Prompt/version tracking and retrieval testing are planned alongside Docker deployment to AWS EC2/S3.", outcome: "In progress / planned; no completed implementation is being presented." },
  { number: "05", title: "Cloud-Native Task Platform", status: "In progress / Planned", tone: "teal", visual: "cloud", description: "A planned task platform with a React frontend, Spring Boot API, relational persistence, authentication, caching, and cloud deployment.", tags: ["Java", "Spring Boot", "React", "MySQL", "Redis", "AWS", "Docker", "GitHub Actions"], github: "", liveDemo: "", problem: "Design a maintainable task workflow with a clear path from local development to cloud deployment.", approach: "Planned architecture covers JWT authentication, RBAC, validation, pagination, indexing, Redis caching, tests, and horizontal scaling.", decisions: "Docker, GitHub Actions, AWS RDS/EC2, and CloudWatch are planned as the delivery and operations foundation.", outcome: "In progress / planned; architecture remains a future build." },
] as const;

export const skillGroups = [
  { label: "Languages", state: "Used / verified", items: ["Python", "Java", "JavaScript", "C", "SQL"] },
  { label: "Databases", state: "Used / verified", items: ["PostgreSQL", "MySQL"] },
  { label: "Tools / Systems", state: "Used / verified", items: ["Git", "Docker", "Linux", "GDB", "QEMU"] },
  { label: "Web / Backend", state: "Used / verified", items: ["Spring Boot", "React", "Next.js"] },
  { label: "Currently learning", state: "In progress", items: ["AI / ML", "Cloud Systems"] },
] as const;

export const skillProjectLinks = {
  Python: ["OperatorLoop", "MavRAG Course Assistant"],
  "C / ARM": ["AArch64 Teaching Kernel Lab"],
  JavaScript: ["3D Tic Tac Toe"],
  "FastAPI / React": ["MavRAG Course Assistant", "Cloud-Native Task Platform"],
} as const;
