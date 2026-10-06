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
    title: "Student Technical Assistant — Academic Technology",
    company: "UTA Office of Information Technology",
    date: "Sep. 2026 – Present",
    responsibilities: ["Troubleshoot classroom and lab technology across hardware, software, AV systems, printers, and peripherals.", "Document issues clearly and consistently.", "Escalate complex cases using structured problem-solving."],
    tools: ["Hardware", "AV systems", "Printers", "Troubleshooting"],
  },
  {
    title: "IT Support Volunteer",
    company: "Nepal Red Cross Society — Nepal",
    date: "May 2023 – Jul 2023",
    responsibilities: ["Provided front-line IT support for office staff, explaining technical problems and solutions clearly.", "Configured and maintained workstations; installed and reimaged Windows and Linux systems, drivers, updates, software, printers, and peripherals.", "Diagnosed hardware, software, and network-connectivity issues; documented troubleshooting and escalated unresolved problems.", "Assisted with website updates using HTML, CSS, and JavaScript and tested across common browsers.", "Created and remediated accessible PDF documents in Adobe Acrobat Pro using tags, headings, reading order, alt text, links, and form fields."],
    tools: ["Windows", "Linux", "Networking", "HTML/CSS", "JavaScript", "Accessibility"],
  },
] as const;

export type Project = (typeof projects)[number];
export const projects = [
  { number: "01", title: "3D Tic Tac Toe", status: "Completed", tone: "violet", visual: "game", description: "A futuristic browser-based Tic Tac Toe experience featuring a 3D-inspired interface, animated interactions, score tracking, responsive design, and polished gameplay.", tags: ["HTML", "CSS", "JavaScript"], github: "https://github.com/PaswanRaju/3d-tic-tac-toe", liveDemo: "", problem: "Create a polished, approachable browser game without a heavy runtime.", approach: "Built the game interface around responsive layouts, animated state changes, and score tracking.", decisions: "Kept the implementation lightweight with browser-native HTML, CSS, and JavaScript.", outcome: "Completed browser project; no verified live demo is listed." },
  { number: "02", title: "OperatorLoop", status: "Completed", tone: "teal", visual: "data", description: "Human-in-the-loop manufacturing AI decision support: sensor processing, anomaly classification, guidance retrieval, safety validation, and operator feedback logging.", tags: ["Python", "Pandas", "scikit-learn", "Matplotlib", "TF-IDF", "Git"], github: "https://github.com/PaswanRaju/OperatorLoop-Manufacturing-AI", liveDemo: "", problem: "Support manufacturing operators with explainable guidance around sensor anomalies.", approach: "Prioritized exact process-condition matching before TF-IDF similarity ranking. Evaluated retrieval and safety validation across 160 synthetic runs with 28 injected anomalies, and created vibration-monitoring visualizations.", decisions: "Focused on reproducible code, technical documentation, explicit safety validation, and operator feedback rather than opaque automation.", outcome: "Completed technical project evaluated across the documented synthetic runs." },
  { number: "03", title: "AArch64 Teaching Kernel Lab", status: "Completed", tone: "amber", visual: "kernel", description: "A bare-metal 64-bit ARM kernel image for Raspberry Pi 3/QEMU, explored through ELF inspection, QEMU/GDB boot validation, and AArch64 instruction-level debugging.", tags: ["C", "ARM Assembly", "QEMU", "GDB", "Make", "Git"], github: "", liveDemo: "", problem: "Understand boot flow, binary layout, and exception-level state on AArch64.", approach: "Inspected ELF sections and symbols with nm, objdump, and binary tools; validated boot flow in QEMU/GDB and stepped through instructions and registers.", decisions: "Used Make, shell scripts, and Git/GitHub for a reproducible build and debug workflow.", outcome: "Completed systems programming and low-level debugging lab." },
  { number: "04", title: "MavRAG Course Assistant", status: "In progress / Planned", tone: "violet", visual: "rag", description: "A planned course assistant for PDF ingestion, grounded answers, source citations, and retrieval evaluation.", tags: ["Python", "FastAPI", "LangChain", "ChromaDB", "Docker", "AWS"], github: "", liveDemo: "", problem: "Make course materials easier to search while keeping answers grounded in source documents.", approach: "Planned architecture includes ingestion, embeddings, vector storage, retrieval, citations, REST APIs, semantic-search evaluation, caching, and latency/error logging.", decisions: "Prompt/version tracking and retrieval testing are planned alongside Docker deployment to AWS EC2/S3.", outcome: "In progress / planned; no completed implementation is being presented." },
  { number: "05", title: "Cloud-Native Task Platform", status: "In progress / Planned", tone: "teal", visual: "cloud", description: "A planned task platform with a React frontend, Spring Boot API, relational persistence, authentication, caching, and cloud deployment.", tags: ["Java", "Spring Boot", "React", "MySQL", "Redis", "AWS", "Docker", "GitHub Actions"], github: "", liveDemo: "", problem: "Design a maintainable task workflow with a clear path from local development to cloud deployment.", approach: "Planned architecture covers JWT authentication, RBAC, validation, pagination, indexing, Redis caching, tests, and horizontal scaling.", decisions: "Docker, GitHub Actions, AWS RDS/EC2, and CloudWatch are planned as the delivery and operations foundation.", outcome: "In progress / planned; architecture remains a future build." },
] as const;

export const skillGroups = [
  { label: "Languages", state: "Used / verified", items: ["Java", "Python", "C", "C++", "SQL", "JavaScript", "HTML/CSS"] },
  { label: "Databases", state: "Used / verified", items: ["MySQL", "SQL", "Relational Modeling"] },
  { label: "Currently learning", state: "In progress", items: ["Redis", "Vector Databases", "DynamoDB", "NoSQL concepts"] },
  { label: "Tools / Libraries", state: "Used / verified", items: ["Git", "GitHub", "Linux", "Pandas", "scikit-learn", "Matplotlib", "QEMU", "GDB", "Make"] },
  { label: "Backend & Cloud", state: "Currently learning", items: ["FastAPI", "React", "Spring Boot", "RESTful API design", "AWS EC2", "S3", "RDS", "Docker", "GitHub Actions"] },
] as const;

export const skillProjectLinks = {
  Python: ["OperatorLoop", "MavRAG Course Assistant"],
  "C / ARM": ["AArch64 Teaching Kernel Lab"],
  JavaScript: ["3D Tic Tac Toe"],
  "FastAPI / React": ["MavRAG Course Assistant", "Cloud-Native Task Platform"],
} as const;
