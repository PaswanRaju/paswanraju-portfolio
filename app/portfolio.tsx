"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll } from "framer-motion";
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, Check, Code2, Command, Copy, ExternalLink, GitBranch, Mail, Menu, Search, Terminal, X } from "lucide-react";
import { createElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { currentFocus, education, experience, leetcodeProfile, personalInfo, projects, siteLinks, skillGroups, skillProjectLinks, type Project, type SkillName } from "../data/site";
import { usePointerTilt } from "../lib/motion";
import { useModalDialog } from "../lib/use-modal-dialog";
import SkillsCloud from "../components/skills-cloud";
import TechMarquee, { getTechIcon } from "../components/tech-marquee";
import HeroScene from "./scene";

const Atmosphere = dynamic(() => import("./atmosphere"), { ssr: false, loading: () => <div className="atmosphere-fallback" aria-hidden="true" /> });
const navItems = [{ id: "about", label: "About" }, { id: "projects", label: "Projects" }, { id: "experience", label: "Experience" }, { id: "leetcode", label: "LeetCode" }, { id: "github", label: "GitHub" }, { id: "skills", label: "Skills" }, { id: "contact", label: "Contact" }];
const commands: readonly (readonly [label: string, href: string])[] = [["Home", "#top"], ...navItems.map((x) => [x.label, `#${x.id}`] as const), ["Resume", siteLinks.resume], ["GitHub Profile", siteLinks.github], ["LinkedIn", siteLinks.linkedin], ["Email Me", siteLinks.email]];
const chipHover = { whileHover: { y: -3 }, transition: { type: "spring", stiffness: 350, damping: 24 } } as const;

function TiltCard({ children, featured, index }: { children: React.ReactNode; featured: boolean; index: number }) {
  const tilt = usePointerTilt({ perspective: 1100, maxRotateX: 3, maxRotateY: 3, glowVars: ["--card-x", "--card-y"] });
  return <motion.article className={`project-card-tilt${featured ? " project-card-featured" : ""}`} style={tilt.style} data-reveal="up" data-reveal-delay={index * 80} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>{children}</motion.article>;
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

// Skills with related projects are disclosure buttons (tap, click, or Enter/Space toggles the list; mouse hover still previews it).
// Skills without related projects are plain labels, so there are no buttons that do nothing.
function SkillChip({ item }: { item: SkillName }) {
  const [open, setOpen] = useState(false);
  const relatedId = useId();
  const related = skillProjectLinks[item];
  const icon = createElement(getTechIcon(item), { size: 14, strokeWidth: 1.5, "aria-hidden": true });
  if (!related) return <motion.span className="skill-chip" {...chipHover}>{icon}{item}</motion.span>;
  return <span className="skill-chip-wrap">
    <motion.button className="skill-chip" type="button" aria-expanded={open} aria-controls={relatedId} onClick={() => setOpen((value) => !value)} onBlur={() => setOpen(false)} onKeyDown={(event) => { if (event.key === "Escape" && open) { event.stopPropagation(); setOpen(false); } }} {...chipHover}>{icon}{item}</motion.button>
    <span className="skill-related" id={relatedId}>{related.join(" · ")}</span>
  </span>;
}

function CommandPalette({ onClose }: { onClose: (restoreFocus: boolean) => void }) {
  const [query, setQuery] = useState("");
  const paletteRef = useRef<HTMLDivElement>(null);
  useModalDialog(paletteRef);
  const normalized = query.trim().toLowerCase();
  const results = normalized ? commands.filter(([label]) => label.toLowerCase().includes(normalized)) : commands;
  // Arrow keys move between the search field and the results; Tab is trapped by useModalDialog.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = [...(paletteRef.current?.querySelectorAll<HTMLElement>("input, a") ?? [])];
    const index = items.indexOf(document.activeElement as HTMLElement);
    event.preventDefault();
    items[event.key === "ArrowDown" ? Math.min(index + 1, items.length - 1) : Math.max(index - 1, 0)]?.focus();
  };
  return <div className="overlay" onClick={() => onClose(true)}><motion.div ref={paletteRef} className={normalized ? "palette is-filtering" : "palette"} role="dialog" aria-modal="true" aria-label="Command palette" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}><div className="palette-search"><Search size={16} aria-hidden="true" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key !== "Enter") return; e.preventDefault(); paletteRef.current?.querySelector<HTMLAnchorElement>("a")?.click(); }} placeholder="Jump to..." aria-label="Search commands" aria-describedby="palette-hint" /></div><p className="sr-only" id="palette-hint">Type to filter. Use the arrow keys to move through results and Enter to open.</p>{results.map(([label, href]) => { const external = href.startsWith("http") || href === siteLinks.resume; return <a key={href} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={() => onClose(!href.startsWith("#"))}>{label}<ArrowUpRight size={13} aria-hidden="true" /></a>; })}{results.length === 0 ? <p className="palette-empty" role="status">No matching commands</p> : <p className="sr-only" role="status">{normalized ? `${results.length} matching ${results.length === 1 ? "command" : "commands"}` : ""}</p>}</motion.div></div>;
}

// Owns its input state so typing re-renders only the modal, not the whole page.
function TerminalModal({ output, onRun, onClose }: { output: string[]; onRun: (value: string) => void; onClose: () => void }) {
  const [input, setInput] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalDialog(dialogRef);
  return <div className="overlay" onClick={onClose}><motion.div ref={dialogRef} className="terminal-modal" role="dialog" aria-modal="true" aria-labelledby="terminal-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()}><div className="terminal-head"><span id="terminal-title">RKP terminal</span><button type="button" onClick={onClose} aria-label="Close terminal"><X size={16} aria-hidden="true" /></button></div><div className="terminal-output" role="log" aria-live="polite">{output.map((line, i) => <pre key={i}>{line}</pre>)}</div><form onSubmit={(e) => { e.preventDefault(); onRun(input); setInput(""); }}><span aria-hidden="true">&gt;</span><input autoFocus value={input} onChange={(e) => setInput(e.target.value)} aria-label="Terminal command" aria-describedby="terminal-hint" autoComplete="off" autoCapitalize="none" spellCheck={false} /></form><p className="sr-only" id="terminal-hint">Type help and press Enter to list commands. Press Escape to close.</p></motion.div></div>;
}

// Scroll-linked motion value: updates the bar's transform without React renders or layout.
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

const spotlightQuery = "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

// Moves a pre-painted gradient layer with transform, so the cursor glow costs no React renders or full-screen repaints.
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = matchMedia(spotlightQuery);
    let frame = 0, x = 0, y = 0;
    const render = () => { frame = 0; element.style.transform = `translate3d(${x - 280}px, ${y - 280}px, 0)`; };
    const onPointer = (e: PointerEvent) => { x = e.clientX; y = e.clientY; if (!frame) frame = requestAnimationFrame(render); };
    const sync = () => { if (media.matches) addEventListener("pointermove", onPointer, { passive: true }); else removeEventListener("pointermove", onPointer); };
    sync();
    media.addEventListener("change", sync);
    return () => { media.removeEventListener("change", sync); removeEventListener("pointermove", onPointer); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className="spotlight" aria-hidden="true" />;
}

function LeetCodeSection() {
  const reduced = useReducedMotion();
  const [stats, setStats] = useState(leetcodeProfile);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const tilt = usePointerTilt({ perspective: 1400, maxRotateX: 1.4, maxRotateY: 1.8, glowVars: ["--leetcode-x", "--leetcode-y"] });
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
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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

  return <section ref={sectionRef} className="section-shell leetcode-section" id="leetcode" data-reveal="up">
    <div className="section-label"><span>04</span> LeetCode</div>
    <div className="leetcode-content">
      <div className="leetcode-heading"><h2>Problem solving,<br /><span>in motion.</span></h2><p>Live stats from my LeetCode profile.</p></div>
      <motion.div className="leetcode-dashboard" style={tilt.style} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave} data-reveal="up" data-reveal-delay={100}>
        <div className="leetcode-dashboard-top">
          <div className="leetcode-profile-name"><span className="leetcode-mark" aria-hidden="true">LC</span><strong>@{stats.username}</strong></div>
          <div className="leetcode-ranking"><small>GLOBAL RANKING</small><strong aria-label={stats.ranking === null ? "Global ranking unavailable" : `Global ranking ${stats.ranking.toLocaleString()}`}>{stats.ranking === null ? "—" : `#${stats.ranking.toLocaleString()}`}</strong></div>
        </div>
        <div className="leetcode-dashboard-body">
          <div className="leetcode-ring-column">
            <div className={`leetcode-ring${visible ? " is-visible" : ""}`} style={{ ["--leetcode-progress" as string]: ringProgress }} role="img" aria-label={stats.totalSolved === null ? "Total solved unavailable" : `${stats.totalSolved} of ${totalAvailable ?? "available"} problems solved`}>
              <div><strong>{solvedLabel}</strong><span>TOTAL SOLVED</span></div>
            </div>
            <small>{statsError ? "STATS TEMPORARILY UNAVAILABLE" : "LIVE PROFILE SNAPSHOT"}</small>
          </div>
          <div className="leetcode-difficulty-summary">
            <span>DIFFICULTY BREAKDOWN</span>
            {difficultyStats.map(({ label, solved, total, color }) => {
              const available = solved !== null && total !== null;
              const percentage = available && total > 0 ? (solved / total) * 100 : 0;
              return <div className={`leetcode-difficulty leetcode-difficulty-${color}`} key={label}><div><span>{label}</span><b>{available ? `${solved} / ${total}` : "— / —"}</b></div><div className="leetcode-bar" role="progressbar" aria-label={`${label} difficulty progress${available ? `: ${solved} of ${total}` : ": unavailable"}`} aria-valuenow={available ? solved : 0} aria-valuemin={0} aria-valuemax={total ?? 0}><i style={{ width: visible ? `${percentage}%` : "0%" }} /></div></div>;
            })}
          </div>
        </div>
      </motion.div>
      <a className="leetcode-profile-link" href={stats.profileUrl} target="_blank" rel="noopener noreferrer">View Profile on LeetCode <ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>
  </section>;
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false), [palette, setPalette] = useState(false), [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]), [expanded, setExpanded] = useState<string | null>(null);
  const [active, setActive] = useState("about");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);
  const dialogOpenerRef = useRef<HTMLElement | null>(null);
  const dialogOpen = palette || terminalOpen;

  // Remember what had focus before a dialog opens, so closing it can put focus back there.
  const openDialog = useCallback((which: "palette" | "terminal") => {
    dialogOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMenuOpen(false);
    if (which === "palette") setPalette(true); else setTerminalOpen(true);
  }, []);
  const closeDialogs = useCallback((restoreFocus = true) => {
    setPalette(false);
    setTerminalOpen(false);
    // After the commit that removes `inert` from the page, so the opener is focusable again.
    if (restoreFocus) requestAnimationFrame(() => dialogOpenerRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (terminalOpen) return;
        e.preventDefault();
        if (palette) closeDialogs(); else openDialog("palette");
        return;
      }
      if (e.key !== "Escape") return;
      if (palette || terminalOpen) closeDialogs();
      else if (menuOpen) { setMenuOpen(false); menuToggleRef.current?.focus(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [closeDialogs, menuOpen, openDialog, palette, terminalOpen]);

  // Close the mobile menu on a tap outside the header.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    navItems.forEach(({ id }) => { const el = document.getElementById(id); if (el) sectionObserver.observe(el); });
    // The fixed header gets its backdrop once the top-of-page sentinel scrolls away; a class toggle, so no React render.
    const header = headerRef.current, sentinel = headerSentinelRef.current;
    const headerObserver = header && sentinel ? new IntersectionObserver(([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting)) : null;
    if (headerObserver && sentinel) headerObserver.observe(sentinel);
    return () => { sectionObserver.disconnect(); headerObserver?.disconnect(); };
  }, []);

  const toggleMenu = () => {
    const opening = !menuOpen;
    setMenuOpen(opening);
    // The nav links come before the toggle in the DOM, so move focus into the opened menu.
    if (opening) requestAnimationFrame(() => navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
  };
  const runTerminal = (value: string) => { const command = value.trim().toLowerCase(); const responses: Record<string, string> = { help: "whoami  projects  skills  experience  contact  clear", whoami: "Raju Kumar Paswan\nComputer Science @ UTA\nSoftware Engineer • Builder", projects: "3D Tic Tac Toe · OperatorLoop · AArch64 Teaching Kernel Lab", skills: "Software engineering · AI/ML · cloud · systems · full-stack", experience: "Student Technical Assistant — Academic Technology, UTA OIT", contact: personalInfo.email, clear: "" }; setTerminalOutput((old) => command === "clear" ? [] : [...old, `> ${value}`, responses[command] ?? "Command not found. Type help for supported commands."]); };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2400);
  };
  const resumeLink = <a className="text-link resume-link" href={siteLinks.resume} target="_blank" rel="noopener noreferrer">Resume <ArrowUpRight size={16} aria-hidden="true" /></a>;
  // reducedMotion="user": Framer skips transform animations (modals, chip hover lift) for reduced-motion users.
  // While a dialog is open everything behind it is `inert`: not focusable, not clickable, hidden from screen readers.
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#main-content" inert={dialogOpen}>Skip to main content</a>
    <Atmosphere />
    <ScrollProgress /><Spotlight />
    <header ref={headerRef} className="site-header" inert={dialogOpen} onBlur={(event) => { if (menuOpen && !event.currentTarget.contains(event.relatedTarget as Node | null)) setMenuOpen(false); }}><a className="wordmark" href="#top" aria-label="RKP home">RKP<span aria-hidden="true">.</span></a><nav ref={navRef} id="main-nav" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">{navItems.map((item) => <a className={active === item.id ? "active" : ""} aria-current={active === item.id ? "true" : undefined} href={`#${item.id}`} key={item.id} onClick={() => setMenuOpen(false)}>{item.label}<i aria-hidden="true" /></a>)}</nav><div className="header-actions"><button className="palette-trigger" type="button" onClick={() => openDialog("palette")} aria-label="Open command palette" aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K"><Command size={14} aria-hidden="true" /> K</button><a className="header-contact" href="#contact">Let&apos;s talk <ArrowUpRight size={15} aria-hidden="true" /></a><button ref={menuToggleRef} className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-nav" onClick={toggleMenu}>{menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button></div></header>
    <main id="main-content" tabIndex={-1} inert={dialogOpen}>
    <section className="hero section-shell" id="top">
      <div ref={headerSentinelRef} className="header-sentinel" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">WELCOME TO MY PORTFOLIO<span className="eyebrow-marker" aria-hidden="true" /></p>
        <p className="hero-intro-label">Hi, I&apos;m</p>
        <h1 className="hero-name"><span className="name-line"><span>Raju</span></span><span className="name-line"><span>Kumar</span></span><span className="name-line name-accent name-final"><span>Paswan</span><span className="name-dots" aria-hidden="true"><i /><i /><i /></span></span></h1>
        <p className="hero-role">Computer Science Student</p>
        <p className="hero-education">The University of Texas at Arlington <span aria-hidden="true">/</span> Minor in Data Science</p>
        <p className="hero-focus-line">Focused on systems programming and building things that work.</p>
        <div className="hero-actions"><a className="button-primary" href="#projects">View Projects <ArrowDown size={16} aria-hidden="true" /></a>{resumeLink}</div>
      </div>
      <div className="hero-art">
        <div className="hero-socials">
          <a href={siteLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch size={16} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={12} aria-hidden="true" /></a>
          <a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={16} aria-hidden="true" /><span>LinkedIn</span><ArrowUpRight size={12} aria-hidden="true" /></a>
          <a href="https://leetcode.com/u/raju_algo/" target="_blank" rel="noopener noreferrer"><Code2 size={16} aria-hidden="true" /><span>LeetCode</span><ArrowUpRight size={12} aria-hidden="true" /></a>
        </div>
        <HeroScene />
        <div className="hero-scroll-cue" aria-hidden="true"><span /> Scroll to explore</div>
      </div>
    </section>
    <section className="section-shell split-section" id="about" data-reveal="up"><div className="section-label"><span>01</span> About</div><div className="about-content"><h2>Curious by default.<br /><span>Intentional by design.</span></h2><div className="about-grid"><div className="about-copy"><p className="large-copy">I&apos;m a Computer Science student at The University of Texas at Arlington with a minor in Data Science. I like working on different parts of software, from low-level systems and debugging to AI projects, cloud infrastructure, and interactive web applications. I usually learn best by building things, breaking them, figuring out why they broke, and improving them.</p><div className="currently"><strong>Currently</strong>{currentFocus.map((item) => <span key={item}>{item}</span>)}</div></div><div className="portrait-wrap"><div className="portrait-frame"><Image className="portrait" src="/images/raju-profile.jpg" alt="Portrait of Raju Kumar Paswan" width={280} height={350} priority={false} /><span className="portrait-signal portrait-signal-one" aria-hidden="true" /><span className="portrait-signal portrait-signal-two" aria-hidden="true" /></div></div></div><div className="education-panels"><div className="education-panel education-primary"><small>Education / 01</small><strong>{education.school}</strong><span>{education.degree}<br />{education.minor}</span><em>Focused on systems programming and building things that work.</em></div><div className="education-panel"><small>Coursework / 02</small><div className="education-list">{education.coursework.map((item) => <span key={item}>{item}</span>)}</div></div><div className="education-panel"><small>Organizations / 03</small><div className="education-list">{education.organizations.map((item) => <span key={item}>{item}</span>)}</div></div></div></div></section>
    <section className="work-section" id="projects"><div className="section-shell"><div className="section-heading"><div><div className="section-label"><span>02</span> Projects</div><h2>Selected systems<br /><span>and experiments.</span></h2></div><p>Built, documented, and still being explored.</p></div><div className="project-grid">{projects.map((project, index) => { const caseStudyId = `case-study-${project.number}`; const isOpen = expanded === project.title; return <TiltCard featured={index < 2} index={index} key={project.title}><ProjectVisual project={project} /><div className="project-info"><div className="project-title-row"><div><h3>{project.title}</h3><p>{project.description}</p></div><span className={`status ${project.status === "Completed" ? "complete" : ""}`}>{project.status}</span></div><div className="project-meta"><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{(project.github || project.liveDemo) && <div className="project-links">{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> repository for {project.title}</span> <ExternalLink size={12} aria-hidden="true" /></a>}{project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">Live Demo<span className="sr-only"> of {project.title}</span> <ExternalLink size={12} aria-hidden="true" /></a>}</div>}</div><button className="details-button" type="button" aria-expanded={isOpen} aria-controls={caseStudyId} onClick={() => setExpanded(isOpen ? null : project.title)}>Case study<span className="sr-only">: {project.title}</span> <span aria-hidden="true">{isOpen ? "−" : "+"}</span></button><div className="case-study" id={caseStudyId} hidden={!isOpen}><p><b>Problem</b>{project.problem}</p><p><b>Approach</b>{project.approach}</p><p><b>Engineering decisions</b>{project.decisions}</p><p><b>Outcome / current status</b>{project.outcome}</p></div></div></TiltCard>; })}</div></div></section>
    <section className="section-shell split-section experience-section" id="experience" data-reveal="up"><div className="section-label"><span>03</span> Experience</div><div className="experience-content"><h2>A timeline of<br /><span>technical support.</span></h2><div className="timeline"><div className="timeline-progress" data-reveal="line" aria-hidden="true" /><div className="timeline-items">{experience.map((item, index) => <article className="timeline-item" data-reveal="up" data-reveal-delay={150 + index * 80} key={item.title}><div className="timeline-marker" aria-hidden="true" /><div><small>{item.date}</small><h3>{item.title}</h3><p className="timeline-company">{item.company}</p><ul>{item.responsibilities.map((line) => <li key={line}>{line}</li>)}</ul><div className="tag-list">{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div></article>)}</div></div></div></section>
    <LeetCodeSection />
    <section className="section-shell github-section" id="github" data-reveal="up"><div className="section-label"><span>05</span> GitHub / Development</div><div className="github-content"><div className="github-heading"><h2>Build in public.<br /><span>Learn by shipping.</span></h2><p>Public repositories for the projects featured above.</p><a className="button-primary" href={siteLinks.github} target="_blank" rel="noopener noreferrer">Visit GitHub <ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="github-console"><div className="github-console-head"><span><i aria-hidden="true" /> PASWANRAJU / SELECTED WORK</span><span>PUBLIC PROFILE</span></div><div className="github-repos">{projects.filter((project) => project.github).map((project) => <a className="github-repo" href={project.github} target="_blank" rel="noopener noreferrer" key={project.title}><span className="github-repo-index" aria-hidden="true">{project.number}</span><span><strong>{project.title}</strong><small>{project.description}</small></span><ExternalLink size={14} aria-hidden="true" /></a>)}</div><div className="github-console-foot"><span>PROFILE / {siteLinks.github.replace("https://github.com/", "")}</span><span>{projects.filter((project) => project.github).length} FEATURED REPOSITORIES</span></div></div></div></section>
    <section className="section-shell split-section skills-section" id="skills" data-reveal="up"><div className="section-label"><span>06</span> Skills &amp; Expertise</div><div className="skills-content"><h2>Skills &amp;<br /><span>Expertise.</span></h2><p className="skills-note">A focused toolkit spanning software engineering, systems, web development, databases, and cloud/AI learning.</p><SkillsCloud /><TechMarquee /><div className="skill-grid">{skillGroups.map((group, index) => <div className="skill-group skill-group-card" data-reveal="up" data-reveal-delay={index * 80} key={group.label}><small>{group.label}</small><span className="skill-state">{group.state}</span><div>{group.items.map((item) => <SkillChip item={item} key={item} />)}</div></div>)}</div></div></section>
    <section className="contact-section" id="contact"><div className="section-shell contact-inner"><div className="contact-intro"><div className="section-label"><span>07</span> Get In Touch</div><h2>Let&apos;s build<br /><span>something.</span></h2><p>Open to thoughtful engineering conversations, collaborations, and opportunities.</p><div className="contact-links"><a href={siteLinks.email}><Mail size={17} aria-hidden="true" /><span>{personalInfo.email}</span><ArrowUpRight size={13} aria-hidden="true" /></a><a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={17} aria-hidden="true" /><span>LinkedIn</span><ArrowUpRight size={13} aria-hidden="true" /></a><a href={siteLinks.github} target="_blank" rel="noopener noreferrer"><GitBranch size={17} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={13} aria-hidden="true" /></a><a href={leetcodeProfile.profileUrl} target="_blank" rel="noopener noreferrer"><Code2 size={17} aria-hidden="true" /><span>LeetCode</span><ArrowUpRight size={13} aria-hidden="true" /></a></div></div><div className="contact-cta"><span className="contact-cta-label">EMAIL</span><a className="contact-cta-email" href={siteLinks.email}>{personalInfo.email}</a><p>Email is the best way to reach me. The button below opens your email app with a new message addressed to me.</p><div className="contact-cta-actions"><a className="button-primary" href={siteLinks.email}><Mail size={16} aria-hidden="true" />Email Me <ArrowUpRight size={16} aria-hidden="true" /></a><button className="contact-copy" type="button" onClick={copyEmail}>{copyState === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy address"}</button></div><p className="sr-only" role="status">{copyState === "copied" ? "Email address copied to clipboard." : copyState === "failed" ? "Couldn't copy automatically. Select the email address instead." : ""}</p></div></div></section>
    </main>
    <footer className="site-footer section-shell" inert={dialogOpen}><div className="footer-identity"><span className="wordmark" aria-hidden="true">RKP<span>.</span></span><span>Software Engineer</span></div><span suppressHydrationWarning>Designed &amp; Developed by Raju Kumar Paswan<br />© {new Date().getFullYear()} Raju Kumar Paswan</span><div><a href={siteLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a href={siteLinks.email}>Email</a>{resumeLink}</div></footer>
    <button className="terminal-trigger" type="button" inert={dialogOpen} onClick={() => openDialog("terminal")} aria-label="Open safe terminal" aria-haspopup="dialog"><Terminal size={15} aria-hidden="true" /> terminal</button>
    <AnimatePresence>{palette && <CommandPalette key="palette" onClose={closeDialogs} />}{terminalOpen && <TerminalModal key="terminal" output={terminalOutput} onRun={runTerminal} onClose={() => closeDialogs()} />}</AnimatePresence>
  </MotionConfig>;
}
