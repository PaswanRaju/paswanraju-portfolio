"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, Check, Code2, Command, Copy, ExternalLink, GitBranch, Mail, Menu, Search, Terminal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { currentFocus, education, experience, leetcodeProfile, personalInfo, projects, siteLinks, skillGroups, skillProjectLinks, type Project } from "../data/site";
import { fadeUp, staggerChildren } from "../lib/motion";
import SkillsCloud from "../components/skills-cloud";
import TechMarquee, { getTechIcon } from "../components/tech-marquee";

const HeroScene = dynamic(() => import("./scene"), { ssr: false, loading: () => <div className="scene-fallback" aria-hidden="true" /> });
const Atmosphere = dynamic(() => import("./atmosphere"), { ssr: false, loading: () => <div className="atmosphere-fallback" aria-hidden="true" /> });
const Intro = dynamic(() => import("./intro"), { ssr: false });
const navItems = [{ id: "about", label: "About" }, { id: "projects", label: "Projects" }, { id: "experience", label: "Experience" }, { id: "leetcode", label: "LeetCode" }, { id: "github", label: "GitHub" }, { id: "skills", label: "Skills" }, { id: "contact", label: "Contact" }];
const commands: readonly (readonly [label: string, href: string])[] = [["Home", "#top"], ...navItems.map((x) => [x.label, `#${x.id}`] as const), ["Resume", siteLinks.resume], ["GitHub Profile", siteLinks.github], ["LinkedIn", siteLinks.linkedin], ["Email Me", siteLinks.email]];
const conveyorReveal: Variants = { hidden: { opacity: 0, x: 64, filter: "blur(8px)" }, visible: (index = 0) => ({ opacity: 1, x: 0, filter: "blur(0px)", transition: { delay: 0.42 + Number(index) * 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } }) };

function TiltCard({ children, reduced, featured }: { children: React.ReactNode; reduced: boolean; featured: boolean }) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  return <motion.article className={`project-card-tilt${featured ? " project-card-featured" : ""}`} style={style} initial={reduced ? false : "hidden"} whileInView={reduced ? undefined : "visible"} viewport={{ once: true, amount: .18 }} variants={fadeUp} onMouseMove={(e) => { if (reduced || !matchMedia("(pointer: fine)").matches) return; const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height; setStyle({ transform: `perspective(1100px) rotateX(${(y - .5) * -3}deg) rotateY(${(x - .5) * 3}deg)`, ["--card-x" as string]: `${x * 100}%`, ["--card-y" as string]: `${y * 100}%` }); }} onMouseLeave={() => setStyle({})}>{children}</motion.article>;
}

function ProjectVisual({ project }: { project: Project }) {
  return <div className={`project-visual visual-${project.visual}`} aria-hidden="true">
    <span className="project-number">{project.number}</span>
    {project.visual === "game" && <div className="game-board">{["X", "", "O", "", "X", "", "O", "", ""].map((v, i) => <span key={i}>{v}</span>)}</div>}
    {project.visual === "data" && <><div className="waveform">⌁⌁⌁⌁⌁⌁⌁</div><div className="data-readout">160 RUNS <b>·</b> 28 ANOMALIES</div><i className="sensor sensor-one" /><i className="sensor sensor-two" /></>}
    {project.visual === "kernel" && <div className="terminal-visual"><span>$ qemu-system-aarch64</span><span>EL1  pc: 0x40080000</span><span>boot sequence: ok_</span></div>}
    {project.visual === "rag" && <div className="rag-flow"><span>PDF</span><b>→</b><span>VECTORS</span><b>→</b><span>ANSWER</span></div>}
    {project.visual === "cloud" && <div className="cloud-flow"><span>REACT</span><b>↓</b><span>SPRING API</span><b>↓</b><span>MYSQL · REDIS</span></div>}
  </div>;
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const paletteRef = useRef<HTMLDivElement>(null);
  const normalized = query.trim().toLowerCase();
  const results = normalized ? commands.filter(([label]) => label.toLowerCase().includes(normalized)) : commands;
  return <div className="overlay" onClick={onClose}><motion.div ref={paletteRef} className={normalized ? "palette is-filtering" : "palette"} role="dialog" aria-label="Command palette" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()}><div className="palette-search"><Search size={16} aria-hidden="true" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key !== "Enter") return; e.preventDefault(); paletteRef.current?.querySelector<HTMLAnchorElement>("a")?.click(); }} placeholder="Jump to..." aria-label="Search commands" /></div>{results.map(([label, href]) => { const external = href.startsWith("http") || href === siteLinks.resume; return <a key={href} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={onClose}>{label}<ArrowUpRight size={13} aria-hidden="true" /></a>; })}{results.length === 0 && <p className="palette-empty" role="status">No matching commands</p>}</motion.div></div>;
}

function LeetCodeSection({ reduced }: { reduced: boolean }) {
  const [stats, setStats] = useState(leetcodeProfile);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(reduced);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
  const [statsError, setStatsError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const response = await fetch("/api/leetcode", { cache: "no-store" });
        if (!response.ok) throw new Error("Stats unavailable");
        const data = await response.json();
        if (active) {
          setStats((current) => ({
            ...current,
            totalSolved: data.totalSolved,
            ranking: data.ranking,
            easySolved: data.easy?.solved ?? null,
            easyTotal: data.easy?.total ?? null,
            mediumSolved: data.medium?.solved ?? null,
            mediumTotal: data.medium?.total ?? null,
            hardSolved: data.hard?.solved ?? null,
            hardTotal: data.hard?.total ?? null,
          }));
          setStatsError(false);
        }
      } catch {
        if (active && leetcodeProfile.totalSolved === null) setStatsError(true);
      }
    };
    loadStats();
    const interval = window.setInterval(loadStats, 600000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!visible || reduced || stats.totalSolved === null || count >= stats.totalSolved) return;
    const step = Math.max(1, Math.ceil(stats.totalSolved / 28));
    const timer = window.setTimeout(() => setCount((current) => Math.min(current + step, stats.totalSolved ?? current)), 34);
    return () => window.clearTimeout(timer);
  }, [count, reduced, stats.totalSolved, visible]);

  const solvedLabel = stats.totalSolved === null ? "—" : (reduced ? stats.totalSolved : count).toLocaleString();
  const totalAvailable = [stats.easyTotal, stats.mediumTotal, stats.hardTotal].every((value) => value !== null)
    ? (stats.easyTotal ?? 0) + (stats.mediumTotal ?? 0) + (stats.hardTotal ?? 0)
    : null;
  const ringProgress = stats.totalSolved !== null && totalAvailable ? Math.min(stats.totalSolved / totalAvailable, 1) : 0;
  const difficultyStats = [
    { label: "Easy", solved: stats.easySolved, total: stats.easyTotal, color: "easy" },
    { label: "Medium", solved: stats.mediumSolved, total: stats.mediumTotal, color: "medium" },
    { label: "Hard", solved: stats.hardSolved, total: stats.hardTotal, color: "hard" },
  ] as const;
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !matchMedia("(pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setCardStyle({
      transform: `perspective(1400px) rotateX(${(y - 0.5) * -1.4}deg) rotateY(${(x - 0.5) * 1.8}deg)`,
      ["--leetcode-x" as string]: `${x * 100}%`,
      ["--leetcode-y" as string]: `${y * 100}%`,
    });
  };

  return <motion.section ref={sectionRef} className="section-shell leetcode-section" id="leetcode" initial={reduced ? false : "hidden"} whileInView={reduced ? undefined : "visible"} viewport={{ once: true, amount: .16 }} variants={fadeUp}>
    <div className="section-label"><span>04</span> LeetCode</div>
    <div className="leetcode-content">
      <div className="leetcode-heading"><h2>Problem solving,<br /><span>in motion.</span></h2><p>Live stats from my LeetCode profile.</p></div>
      <motion.div className="leetcode-dashboard" style={cardStyle} onPointerMove={handlePointerMove} onPointerLeave={() => setCardStyle({})} initial={reduced ? false : "hidden"} whileInView={reduced ? undefined : "visible"} viewport={{ once: true, amount: .2 }} variants={fadeUp}>
        <div className="leetcode-dashboard-top">
          <div className="leetcode-profile-name"><span className="leetcode-mark" aria-label="LeetCode logo">LC</span><strong>@{stats.username}</strong></div>
          <div className="leetcode-ranking"><small>GLOBAL RANKING</small><strong aria-label={stats.ranking === null ? "Global ranking unavailable" : `Global ranking ${stats.ranking.toLocaleString()}`}>{stats.ranking === null ? "—" : `#${stats.ranking.toLocaleString()}`}</strong></div>
        </div>
        <div className="leetcode-dashboard-body">
          <div className="leetcode-ring-column">
            <div className={`leetcode-ring${visible ? " is-visible" : ""}`} style={{ ["--leetcode-progress" as string]: ringProgress }} role="img" aria-label={stats.totalSolved === null ? "Total solved unavailable" : `${stats.totalSolved} of ${totalAvailable ?? "available"} problems solved`}>
              <div><strong>{solvedLabel}</strong><span>TOTAL SOLVED</span></div>
            </div>
            <small>{statsError ? "STATS TEMPORARILY UNAVAILABLE" : "LIVE PROFILE SNAPSHOT"}</small>
          </div>
          <div className="leetcode-difficulty-summary" aria-label="Difficulty statistics">
            <span>DIFFICULTY BREAKDOWN</span>
            {difficultyStats.map(({ label, solved, total, color }) => {
              const available = solved !== null && total !== null;
              const percentage = available && total > 0 ? (solved / total) * 100 : 0;
              return <div className={`leetcode-difficulty leetcode-difficulty-${color}`} key={label}><div><span>{label}</span><b>{available ? `${solved} / ${total}` : "— / —"}</b></div><div className="leetcode-bar" role="progressbar" aria-label={`${label} difficulty progress${available ? `: ${solved} of ${total}` : ": unavailable"}`} aria-valuenow={available ? solved : 0} aria-valuemin={0} aria-valuemax={total ?? 0}><i style={{ width: visible ? `${percentage}%` : "0%" }} /></div></div>;
            })}
          </div>
        </div>
      </motion.div>
      <a className="leetcode-profile-link" href={stats.profileUrl} target="_blank" rel="noopener noreferrer">View Profile on LeetCode <ArrowUpRight size={14} /></a>
    </div>
  </motion.section>;
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false), [palette, setPalette] = useState(false), [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState(""), [terminalOutput, setTerminalOutput] = useState<string[]>([]), [expanded, setExpanded] = useState<string | null>(null);
  const [progress, setProgress] = useState(0), [active, setActive] = useState("about"), [spotlight, setSpotlight] = useState({ x: -500, y: -500 }), [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const reveal = reduced ? undefined : { once: true, amount: .16 };
  useEffect(() => {
    let frame = 0;
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((v) => !v); } if (e.key === "Escape") { setPalette(false); setTerminalOpen(false); } };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setProgress(max ? scrollY / max * 100 : 0);
        frame = 0;
      });
    };
    const onPointer = (e: PointerEvent) => { if (matchMedia("(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) setSpotlight({ x: e.clientX, y: e.clientY }); };
    addEventListener("keydown", onKey); addEventListener("scroll", onScroll, { passive: true }); addEventListener("pointermove", onPointer);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    navItems.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => { removeEventListener("keydown", onKey); removeEventListener("scroll", onScroll); removeEventListener("pointermove", onPointer); observer.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, []);
  const runTerminal = (value: string) => { const command = value.trim().toLowerCase(); const responses: Record<string, string> = { help: "whoami  projects  skills  experience  contact  clear", whoami: "Raju Kumar Paswan\nComputer Science @ UTA\nSoftware Engineer • Builder", projects: "3D Tic Tac Toe · OperatorLoop · AArch64 Teaching Kernel Lab", skills: "Software engineering · AI/ML · cloud · systems · full-stack", experience: "Student Technical Assistant — Academic Technology, UTA OIT", contact: personalInfo.email, clear: "" }; setTerminalOutput((old) => command === "clear" ? [] : [...old, `> ${value}`, responses[command] ?? "Command not found. Type help for supported commands."]); setTerminalInput(""); };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2400);
  };
  const resumeLink = <a className="text-link resume-link" href={siteLinks.resume} target="_blank" rel="noopener noreferrer">Resume <ArrowUpRight size={16} /></a>;
  return <main style={{ ["--spot-x" as string]: `${spotlight.x}px`, ["--spot-y" as string]: `${spotlight.y}px` }}>
    <Intro />
    <Atmosphere />
    <div className="scroll-progress" style={{ width: `${progress}%` }} /><div className="spotlight" aria-hidden="true" />
    <header className="site-header"><a className="wordmark" href="#top" aria-label="RKP home">RKP<span>.</span></a><nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">{navItems.map((item) => <a className={active === item.id ? "active" : ""} href={`#${item.id}`} key={item.id} onClick={() => setMenuOpen(false)}>{item.label}<i aria-hidden="true" /></a>)}</nav><div className="header-actions"><button className="palette-trigger" onClick={() => setPalette(true)} aria-label="Open command palette"><Command size={14} /> K</button><a className="header-contact" href="#contact">Let&apos;s talk <ArrowUpRight size={15} /></a><button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div></header>
    <section className="hero section-shell" id="top">
      <div className="hero-copy">
        <motion.p className="eyebrow hero-eyebrow" initial={reduced ? false : "hidden"} animate="visible" variants={fadeUp}>WELCOME TO MY PORTFOLIO<span className="eyebrow-marker" aria-hidden="true" /></motion.p>
        <motion.p className="hero-intro-label" initial={reduced ? false : "hidden"} animate="visible" variants={fadeUp}>Hi, I&apos;m</motion.p>
        <motion.h1 className="hero-name" initial={reduced ? false : "hidden"} animate="visible" variants={staggerChildren}><span className="name-line"><motion.span custom={0} variants={conveyorReveal}>Raju</motion.span></span><span className="name-line"><motion.span custom={1} variants={conveyorReveal}>Kumar</motion.span></span><span className="name-line name-accent name-final"><motion.span custom={2} variants={conveyorReveal}>Paswan</motion.span><span className="name-dots" aria-label="System activity" aria-hidden="true"><i /><i /><i /></span></span></motion.h1>
        <motion.h2 className="hero-role" initial={reduced ? false : "hidden"} animate="visible" variants={fadeUp}>Computer Science Student</motion.h2>
        <motion.p className="hero-education" initial={reduced ? false : "hidden"} animate="visible" variants={fadeUp}>The University of Texas at Arlington <span>/</span> Minor in Data Science</motion.p>
        <p className="hero-focus-line">Focused on systems programming and building things that work.</p>
        <motion.div className="hero-actions" initial={reduced ? false : "hidden"} animate="visible" variants={fadeUp}><a className="button-primary" href="#projects">View Projects <ArrowDown size={16} /></a>{resumeLink}</motion.div>
      </div>
      <div className="hero-art">
        <div className="hero-socials" aria-label="Social profiles">
          <a href={siteLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch size={16} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={12} aria-hidden="true" /></a>
          <a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={16} aria-hidden="true" /><span>LinkedIn</span><ArrowUpRight size={12} aria-hidden="true" /></a>
          <a href="https://leetcode.com/u/raju_algo/" target="_blank" rel="noopener noreferrer"><Code2 size={16} aria-hidden="true" /><span>LeetCode</span><ArrowUpRight size={12} aria-hidden="true" /></a>
        </div>
        <HeroScene />
        <div className="hero-scroll-cue" aria-hidden="true"><span /> Scroll to explore</div>
      </div>
    </section>
    <motion.section className="section-shell split-section" id="about" initial="hidden" whileInView="visible" viewport={reveal} variants={fadeUp}><div className="section-label"><span>01</span> About</div><div className="about-content"><h2>Curious by default.<br /><span>Intentional by design.</span></h2><div className="about-grid"><motion.div className="about-copy" variants={fadeUp}><p className="large-copy">I&apos;m a Computer Science student at The University of Texas at Arlington with a minor in Data Science. I like working on different parts of software, from low-level systems and debugging to AI projects, cloud infrastructure, and interactive web applications. I usually learn best by building things, breaking them, figuring out why they broke, and improving them.</p><div className="currently"><strong>Currently</strong>{currentFocus.map((item) => <span key={item}>{item}</span>)}</div></motion.div><motion.div className="portrait-wrap" variants={fadeUp}><div className="portrait-frame"><Image className="portrait" src="/images/raju-profile.jpg" alt="Raju Kumar Paswan" width={280} height={350} priority={false} /><span className="portrait-signal portrait-signal-one" aria-hidden="true" /><span className="portrait-signal portrait-signal-two" aria-hidden="true" /></div></motion.div></div><div className="education-panels"><div className="education-panel education-primary"><small>Education / 01</small><strong>{education.school}</strong><span>{education.degree}<br />{education.minor}</span><em>Focused on systems programming and building things that work.</em></div><div className="education-panel"><small>Coursework / 02</small><div className="education-list">{education.coursework.map((item) => <span key={item}>{item}</span>)}</div></div><div className="education-panel"><small>Organizations / 03</small><div className="education-list">{education.organizations.map((item) => <span key={item}>{item}</span>)}</div></div></div></div></motion.section>
    <section className="work-section" id="projects"><div className="section-shell"><div className="section-heading"><div><div className="section-label"><span>02</span> Projects</div><h2>Selected systems<br /><span>and experiments.</span></h2></div><p>Built, documented, and still being explored.</p></div><motion.div className="project-grid" initial={reduced ? false : "hidden"} whileInView={reduced ? undefined : "visible"} viewport={{ once: true, amount: .12 }} variants={staggerChildren}>{projects.map((project, index) => <TiltCard reduced={Boolean(reduced)} featured={index < 2} key={project.title}><ProjectVisual project={project} /><div className="project-info"><div className="project-title-row"><div><h3>{project.title}</h3><p>{project.description}</p></div><span className={`status ${project.status === "Completed" ? "complete" : ""}`}>{project.status}</span></div><div className="project-meta"><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{(project.github || project.liveDemo) && <div className="project-links">{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub <ExternalLink size={12} aria-hidden="true" /></a>}{project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">Live Demo <ExternalLink size={12} aria-hidden="true" /></a>}</div>}</div><button className="details-button" onClick={() => setExpanded(expanded === project.title ? null : project.title)}>Case study <span>{expanded === project.title ? "−" : "+"}</span></button>{expanded === project.title && <div className="case-study"><p><b>Problem</b>{project.problem}</p><p><b>Approach</b>{project.approach}</p><p><b>Engineering decisions</b>{project.decisions}</p><p><b>Outcome / current status</b>{project.outcome}</p></div>}</div></TiltCard>)}</motion.div></div></section>
    <motion.section className="section-shell split-section experience-section" id="experience" initial="hidden" whileInView="visible" viewport={reveal} variants={fadeUp}><div className="section-label"><span>03</span> Experience</div><div className="experience-content"><h2>A timeline of<br /><span>technical support.</span></h2><div className="timeline"><motion.div className="timeline-progress" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} /><motion.div className="timeline-items" variants={staggerChildren}>{experience.map((item) => <motion.article className="timeline-item" variants={fadeUp} key={item.title}><div className="timeline-marker" /><div><small>{item.date}</small><h3>{item.title}</h3><p className="timeline-company">{item.company}</p><ul>{item.responsibilities.map((line) => <li key={line}>{line}</li>)}</ul><div className="tag-list">{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div></motion.article>)}</motion.div></div></div></motion.section>
    <LeetCodeSection reduced={Boolean(reduced)} />
    <motion.section className="section-shell github-section" id="github" initial="hidden" whileInView="visible" viewport={reveal} variants={fadeUp}><div className="section-label"><span>05</span> GitHub / Development</div><div className="github-content"><div className="github-heading"><h2>Build in public.<br /><span>Learn by shipping.</span></h2><p>Public repositories for the projects featured above.</p><a className="button-primary" href={siteLinks.github} target="_blank" rel="noopener noreferrer">Visit GitHub <ArrowUpRight size={16} /></a></div><div className="github-console" aria-label="Selected GitHub repositories"><div className="github-console-head"><span><i /> PASWANRAJU / SELECTED WORK</span><span>PUBLIC PROFILE</span></div><div className="github-repos">{projects.filter((project) => project.github).map((project) => <a className="github-repo" href={project.github} target="_blank" rel="noopener noreferrer" key={project.title}><span className="github-repo-index">{project.number}</span><span><strong>{project.title}</strong><small>{project.description}</small></span><ExternalLink size={14} /></a>)}</div><div className="github-console-foot"><span>PROFILE / {siteLinks.github.replace("https://github.com/", "")}</span><span>{projects.filter((project) => project.github).length} FEATURED REPOSITORIES</span></div></div></div></motion.section>
    <motion.section className="section-shell split-section skills-section" id="skills" initial="hidden" whileInView="visible" viewport={reveal} variants={fadeUp}><div className="section-label"><span>06</span> Skills &amp; Expertise</div><div className="skills-content"><h2>Skills &amp;<br /><span>Expertise.</span></h2><p className="skills-note">A focused toolkit spanning software engineering, systems, web development, databases, and cloud/AI learning.</p><SkillsCloud reduced={Boolean(reduced)} /><TechMarquee /><motion.div className="skill-grid" initial="hidden" whileInView="visible" viewport={reveal} variants={staggerChildren}>{skillGroups.map((group) => <motion.div className="skill-group skill-group-card" variants={fadeUp} key={group.label}><small>{group.label}</small><span className="skill-state">{group.state}</span><div>{group.items.map((item) => { const related = skillProjectLinks[item]; const Icon = getTechIcon(item); return <motion.button whileHover={reduced ? undefined : { y: -3 }} transition={{ type: "spring", stiffness: 350, damping: 24 }} className={highlightedSkill === item ? "skill-chip is-highlighted" : "skill-chip"} key={item} type="button" onFocus={() => setHighlightedSkill(item)} onMouseEnter={() => setHighlightedSkill(item)} onBlur={() => setHighlightedSkill(null)} onMouseLeave={() => setHighlightedSkill(null)}><Icon size={14} strokeWidth={1.5} aria-hidden="true" />{item}{related ? <span className="skill-related">{related.join(" · ")}</span> : null}</motion.button>; })}</div></motion.div>)}</motion.div></div></motion.section>
    <section className="contact-section" id="contact"><div className="section-shell contact-inner"><div className="contact-intro"><div className="section-label"><span>07</span> Get In Touch</div><h2>Let&apos;s build<br /><span>something.</span></h2><p>Open to thoughtful engineering conversations, collaborations, and opportunities.</p><div className="contact-links"><a href={siteLinks.email}><Mail size={17} aria-hidden="true" /><span>{personalInfo.email}</span><ArrowUpRight size={13} aria-hidden="true" /></a><a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={17} aria-hidden="true" /><span>LinkedIn</span><ArrowUpRight size={13} aria-hidden="true" /></a><a href={siteLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch size={17} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={13} aria-hidden="true" /></a><a href={leetcodeProfile.profileUrl} target="_blank" rel="noopener noreferrer"><Code2 size={17} aria-hidden="true" /><span>LeetCode</span><ArrowUpRight size={13} aria-hidden="true" /></a></div></div><div className="contact-cta"><span className="contact-cta-label">EMAIL</span><a className="contact-cta-email" href={siteLinks.email}>{personalInfo.email}</a><p>Email is the best way to reach me. The button below opens your email app with a new message addressed to me.</p><div className="contact-cta-actions"><a className="button-primary" href={siteLinks.email}><Mail size={16} aria-hidden="true" />Email Me <ArrowUpRight size={16} aria-hidden="true" /></a><button className="contact-copy" type="button" onClick={copyEmail}>{copyState === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy address"}</button></div><p className="sr-only" role="status">{copyState === "copied" ? "Email address copied to clipboard." : copyState === "failed" ? "Couldn't copy automatically. Select the email address instead." : ""}</p></div></div></section>
    <footer className="site-footer section-shell"><div className="footer-identity"><span className="wordmark">RKP<span>.</span></span><span>Software Engineer</span></div><span>Designed &amp; Developed by Raju Kumar Paswan<br />© {new Date().getFullYear()} Raju Kumar Paswan</span><div><a href={siteLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a href={siteLinks.email}>Email</a>{resumeLink}</div></footer>
    <button className="terminal-trigger" onClick={() => setTerminalOpen(true)} aria-label="Open safe terminal"><Terminal size={15} /> terminal</button>
    <AnimatePresence>{palette && <CommandPalette key="palette" onClose={() => setPalette(false)} />}{terminalOpen && <div key="terminal" className="overlay" onClick={() => setTerminalOpen(false)}><motion.div className="terminal-modal" role="dialog" aria-label="Safe terminal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()}><div className="terminal-head"><span>RKP terminal</span><button onClick={() => setTerminalOpen(false)} aria-label="Close terminal"><X size={16} /></button></div><div className="terminal-output">{terminalOutput.map((line, i) => <pre key={i}>{line}</pre>)}</div><form onSubmit={(e) => { e.preventDefault(); runTerminal(terminalInput); }}><span>&gt;</span><input autoFocus value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} aria-label="Terminal command" /></form></motion.div></div>}</AnimatePresence>
  </main>;
}
