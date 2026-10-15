"use client";

import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, Download, FileText, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { education, experience, leetcodeProfile, personalInfo, projects, siteLinks, skillGroups, type Project } from "../data/site";
import ContactForm from "../components/contact-form";
import { getExperienceIcon } from "../components/experience-icons";
import { getSkillIcon } from "../components/skill-icons";
import { getTechIcon } from "../components/tech-icons";
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from "../components/brand-icons";

// Navbar links and page sections share one order.
const navItems = [{ id: "about", label: "About" }, { id: "projects", label: "Projects" }, { id: "experience", label: "Experience" }, { id: "skills", label: "Skills" }, { id: "leetcode", label: "LeetCode" }, { id: "contact", label: "Contact" }];
const defaultSectionOrder = ["about", "projects", "experience", "skills", "leetcode", "contact"] as const;


const projectHighlights = {
  OperatorLoop: {
    category: "AI / DATA",
    summary: "Human-in-the-loop decision support for manufacturing sensor data.",
    points: ["Evaluated across 160 synthetic runs with 28 injected anomalies.", "Matched exact process conditions before TF-IDF similarity ranking.", "Validated safety constraints and logged operator approvals, edits, and rejections."],
  },
  "AArch64 Teaching Kernel Lab": {
    category: "SYSTEMS",
    summary: "A bare-metal 64-bit ARM teaching kernel for Raspberry Pi 3.",
    points: ["Inspected ELF sections and symbols with nm, objdump, and binary tools.", "Validated boot flow in QEMU/GDB, stepping through instructions and registers.", "Used Make, shell scripts, and Git/GitHub for reproducible builds and debugging."],
  },
  "3D Tic Tac Toe": {
    category: "FRONTEND",
    summary: "A browser Tic Tac Toe game with a 3D-style board.",
    points: ["Animated moves, win and draw detection, and score tracking.", "Built with browser-native HTML, CSS, and JavaScript.", "Deployed as a playable browser game on GitHub Pages."],
  },
} satisfies Record<Extract<Project, { status: "Completed" }>["title"], { category: string; summary: string; points: string[] }>;

function ProjectVisual({ project }: { project: Project }) {
  if (project.visual === "data") return <figure className="project-visual visual-data project-figure">
    <span className="project-number" aria-hidden="true">{project.number}</span>
    <Image src="/images/projects/operatorloop-vibration.png" alt="OperatorLoop chart: vibration across 160 synthetic manufacturing runs, with vibration anomalies marked above the 1.2 g threshold." width={1400} height={636} sizes="(max-width: 900px) 100vw, 640px" />
    <figcaption><span aria-hidden="true">{project.number} · </span>Vibration plot from the OperatorLoop repo · 160 synthetic runs</figcaption>
  </figure>;
  return <div className={`project-visual visual-${project.visual}`} aria-hidden="true">
    <span className="project-number">{project.number}</span>
    {project.visual === "game" && <div className="game-board">{["X", "", "O", "", "X", "", "O", "", ""].map((v, i) => <span key={i}>{v}</span>)}</div>}
    {project.visual === "kernel" && <div className="terminal-visual"><span>$ qemu-system-aarch64</span><span>EL1  pc: 0x40080000</span><span>boot sequence: ok_</span></div>}
    {project.visual === "rag" && <div className="rag-flow"><span>PDF</span><b>→</b><span>VECTORS</span><b>→</b><span>ANSWER</span></div>}
    {project.visual === "cloud" && <div className="cloud-flow"><span>REACT</span><b>↓</b><span>SPRING API</span><b>↓</b><span>MYSQL · REDIS</span></div>}
  </div>;
}

// Scroll-linked motion value: updates the bar's transform without React renders or layout.
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

type LiveLeetCodeStats = {
  ranking?: number | null;
  totalSolved?: number | null;
  easy?: { solved?: number | null; total?: number | null };
  medium?: { solved?: number | null; total?: number | null };
  hard?: { solved?: number | null; total?: number | null };
  updatedAt?: string;
};

// Keep the hand-maintained value unless the live one is a real number, so a partial response never blanks a stat.
const pick = (live: number | null | undefined, fallback: number) => typeof live === "number" ? live : fallback;
const formatDate = (date: string, timeZone?: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone });

// Renders the snapshot from data/site.ts first, then swaps in live numbers from /api/leetcode when they arrive.
function LeetCodeSection() {
  const [stats, setStats] = useState(leetcodeProfile);
  const [updatedLabel, setUpdatedLabel] = useState(() => formatDate(leetcodeProfile.lastUpdated, "UTC"));
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const response = await fetch("/api/leetcode", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json() as LiveLeetCodeStats;
        if (!active) return;
        setStats((current) => ({
          ...current,
          ranking: pick(data.ranking, current.ranking),
          totalSolved: pick(data.totalSolved, current.totalSolved),
          easySolved: pick(data.easy?.solved, current.easySolved),
          easyTotal: pick(data.easy?.total, current.easyTotal),
          mediumSolved: pick(data.medium?.solved, current.mediumSolved),
          mediumTotal: pick(data.medium?.total, current.mediumTotal),
          hardSolved: pick(data.hard?.solved, current.hardSolved),
          hardTotal: pick(data.hard?.total, current.hardTotal),
        }));
        if (data.updatedAt) setUpdatedLabel(formatDate(data.updatedAt));
      } catch {
        // Network failure: the snapshot from data/site.ts stays on screen.
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

  const totalAvailable = stats.easyTotal + stats.mediumTotal + stats.hardTotal;
  const ringProgress = totalAvailable > 0 ? Math.min(stats.totalSolved / totalAvailable, 1) : 0;
  const ringRadius = 52, ringLength = 2 * Math.PI * ringRadius;
  const difficultyStats = [
    { label: "Easy", solved: stats.easySolved, total: stats.easyTotal, tone: "easy" },
    { label: "Medium", solved: stats.mediumSolved, total: stats.mediumTotal, tone: "medium" },
    { label: "Hard", solved: stats.hardSolved, total: stats.hardTotal, tone: "hard" },
  ] as const;

  return <section ref={sectionRef} className="section-shell leetcode-section" id="leetcode" aria-labelledby="leetcode-heading" data-reveal="up">
    <div className="leetcode-header">
      <p className="leetcode-eyebrow">LeetCode</p>
      <h2 className="section-label" id="leetcode-heading">A little problem-solving</h2>
    </div>
    <div className="leetcode-layout">
      <div className="leetcode-intro">
        <p>Problem-solving practice, with statistics from my LeetCode profile.</p>
        <p className="leetcode-handle"><LeetCodeIcon size={20} />@{stats.username}</p>
        <a className="leetcode-button" href={stats.profileUrl} target="_blank" rel="noopener noreferrer">View LeetCode profile<ArrowRight size={16} aria-hidden="true" /></a>
      </div>
      <div className="leetcode-card">
        <div className="leetcode-card-top">
          <p className="leetcode-user"><LeetCodeIcon size={26} />{stats.username}</p>
          <p className="leetcode-rank"><span className="sr-only">Global ranking </span>#{stats.ranking.toLocaleString("en-US")}</p>
        </div>
        <div className="leetcode-card-body">
          <div className="leetcode-total" role="img" aria-label={`${stats.totalSolved} of ${totalAvailable} problems solved`}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r={ringRadius} className="leetcode-total-track" />
              <circle cx="60" cy="60" r={ringRadius} className="leetcode-total-fill" strokeDasharray={ringLength} strokeDashoffset={visible ? ringLength * (1 - ringProgress) : ringLength} />
            </svg>
            <strong aria-hidden="true">{stats.totalSolved.toLocaleString("en-US")}</strong>
          </div>
          <div className="leetcode-rows">{difficultyStats.map(({ label, solved, total, tone }) => {
            const percentage = total > 0 ? (solved / total) * 100 : 0;
            return <div className="leetcode-row" data-tone={tone} key={label}>
              <div><span>{label}</span><b>{solved} / {total}</b></div>
              <div className="leetcode-track" role="progressbar" aria-label={`${label}: ${solved} of ${total} solved`} aria-valuenow={solved} aria-valuemin={0} aria-valuemax={total}><i style={{ width: visible ? `${percentage}%` : "0%" }} /></div>
            </div>;
          })}</div>
        </div>
        <p className="leetcode-updated">Last updated {updatedLabel}</p>
      </div>
    </div>
  </section>;
}

export default function Portfolio() {
  const [openRoles, setOpenRoles] = useState<Record<string, boolean>>({});
  const [openProjectDetails, setOpenProjectDetails] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("about");
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menuOpen) { setMenuOpen(false); menuToggleRef.current?.focus(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menuOpen]);

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

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    const opening = !menuOpen;
    setMenuOpen(opening);
    // Keyboard users (click.detail === 0) get focus moved into the menu, since its links come before the toggle in the DOM.
    // Taps leave focus alone: WebKit doesn't focus tapped links, so moved focus would only get in the way.
    if (opening && event.detail === 0) requestAnimationFrame(() => navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
  };
  // Smooth unless the visitor prefers reduced motion; keyboard focus returns to the start of the page too.
  const backToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };
  const sections = {
    about: <section key="about" className="section-shell about-section" id="about" aria-labelledby="about-heading" data-reveal="up">
      <h2 className="section-label" id="about-heading">About me</h2>
      <div className="about-columns">
        <div className="about-details">
          <p className="about-lead">I&apos;m Raju Kumar Paswan, a Computer Science student at the University of Texas at Arlington, minoring in Data Science. I&apos;m interested in how software works all the way down, from the instructions a processor runs to the applications people use every day.</p>
          <p>At UTA&apos;s Office of Information Technology, I work as a Student Technical Assistant, supporting classroom and lab technology across hardware, software, and AV systems. Outside of work, I build projects that pull me into new areas, from a decision-support pipeline for manufacturing data to a bare-metal ARM kernel lab. I&apos;m currently looking for Summer 2027 software engineering internships.</p>
          <h3>What I&apos;m studying</h3>
          <ul className="about-pills">{education.coursework.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>Organizations</h3>
          <ul className="about-pills about-organizations">{education.organizations.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="about-cards">
          <article className="about-card about-resume">
            <h3><FileText size={24} aria-hidden="true" />My resume</h3>
            <p>Want the quick version? My education, experience, and projects in one PDF.</p>
            <div className="about-resume-actions">
              <a className="about-download" href={siteLinks.resume} download>Download PDF <Download size={16} aria-hidden="true" /></a>
              <a className="about-preview" href={siteLinks.resume} target="_blank" rel="noopener noreferrer">Preview resume <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </article>
          <article className="about-card about-education">
            <div className="about-education-title">
              <span className="about-uta-badge"><Image src="/images/uta-logo.png" alt="UTA logo" width={44} height={44} /></span>
              <div><p className="about-education-label">Education</p><h3>{education.degreeShort}</h3><p>{education.minor}</p></div>
            </div>
            <p>{education.school}</p>
            <dl><div><dt>Expected graduation:</dt><dd>May 2028</dd></div><div><dt>Location:</dt><dd>Arlington, Texas</dd></div></dl>
          </article>
        </div>
      </div>
    </section>,
    projects: <section key="projects" className="section-shell projects-section" id="projects" aria-labelledby="projects-heading">
      <h2 className="section-label" id="projects-heading">Projects</h2>
      <p className="projects-intro">Built, documented, and still being explored.</p>
      <div className="projects-cards">{projects.filter((project) => project.status === "Completed").map((project) => {
        const highlights = projectHighlights[project.title];
        const detailsOpen = Boolean(openProjectDetails[project.number]);
        const detailsId = `project-details-${project.number}`;
        return <article className="projects-card" data-project={project.visual} key={project.title}>
          <ProjectVisual project={project} />
          <div className="projects-card-body">
            <span className="projects-category">{highlights.category}</span>
            <h3>{project.title}</h3>
            <p className="projects-description">{highlights.summary}</p>
            <ul className="projects-points">{highlights.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <ul className="projects-stack" aria-label="Tech stack">{project.tags.map((tag) => {
              const TechIcon = getTechIcon(tag);
              return <li key={tag}><TechIcon size={16} aria-hidden="true" />{tag}</li>;
            })}</ul>
            <div className="projects-actions">
              {project.github && <a className="projects-source" href={project.github} target="_blank" rel="noopener noreferrer"><GitHubIcon size={16} />Source code<span className="sr-only"> for {project.title}</span><ArrowRight size={16} aria-hidden="true" /></a>}
              {project.github && project.liveDemo && <a className="projects-demo" href={project.liveDemo} target="_blank" rel="noopener noreferrer">Live demo<span className="sr-only"> of {project.title}</span><ArrowUpRight size={16} aria-hidden="true" /></a>}
              <button className="projects-details-toggle" type="button" aria-expanded={detailsOpen} aria-controls={detailsId} onClick={() => setOpenProjectDetails((open) => ({ ...open, [project.number]: !open[project.number] }))}>Engineering details<span className="sr-only">: {project.title}</span><ChevronDown size={16} aria-hidden="true" /></button>
            </div>
            <div className="projects-case-study" id={detailsId} hidden={!detailsOpen}>
              <p>{project.description}</p>
              {project.note && <p><strong>{project.note.label}</strong>{project.note.text}</p>}
              <p><strong>Problem</strong>{project.problem}</p>
              <p><strong>Approach</strong>{project.approach}</p>
              <p><strong>Engineering decisions</strong>{project.decisions}</p>
              <p><strong>Outcome / current status</strong>{project.outcome}</p>
            </div>
          </div>
        </article>;
      })}</div>
    </section>,
    experience: <section key="experience" className="section-shell experience-section" id="experience" aria-labelledby="experience-heading" data-reveal="up">
      <h2 className="section-label" id="experience-heading">Experience</h2>
      <div className="experience-roles">{experience.map((item) => {
        const isUta = item.title === "Student Technical Assistant";
        const roleOpen = Boolean(openRoles[item.title]);
        const extraId = `experience-extra-${isUta ? "uta" : "nrcs"}`;
        return <article className="experience-role" key={item.title}>
          <div className="experience-logo">{isUta
            ? <Image src="/images/uta-logo.png" alt="UTA logo" width={44} height={44} />
            : <Image src="/images/nrcs-logo.png" alt="Nepal Red Cross Society logo" width={44} height={44} />}</div>
          <div className="experience-role-body">
            <div className="experience-title-row"><h3>{item.title}</h3><p className="experience-date">{item.date}</p></div>
            <p className="experience-organization">{isUta ? "Office of Information Technology, University of Texas at Arlington · Arlington, TX" : "Nepal Red Cross Society · Nepal"}</p>
            <p className="experience-summary">{isUta ? "Support classroom and lab technology across hardware, software, and AV systems." : "Provide front-line IT support, workstation setup, website updates, and accessible PDF support."}</p>
            <ul className="experience-tools" aria-label="Skills and tools">{item.tools.map((tool) => {
              const ToolIcon = getExperienceIcon(tool);
              return <li key={tool}><ToolIcon size={16} aria-hidden="true" />{tool}</li>;
            })}</ul>
            <button className="experience-toggle" type="button" aria-expanded={roleOpen} aria-controls={extraId} onClick={() => setOpenRoles((roles) => ({ ...roles, [item.title]: !roles[item.title] }))}>
              {roleOpen ? "Show less" : "Learn more about this role"}<ChevronDown size={16} aria-hidden="true" />
            </button>
            <div className="experience-extra" id={extraId} data-open={roleOpen} aria-hidden={!roleOpen} inert={!roleOpen}>
              <div><div className="experience-panel">
                <p>{item.explanation}</p>
                <ul className="experience-bullets">{item.responsibilities.map((line) => <li key={line}>{line}</li>)}</ul>
              </div></div>
            </div>
          </div>
        </article>;
      })}</div>
    </section>,
    leetcode: <LeetCodeSection key="leetcode" />,
    skills: <section key="skills" className="section-shell skills-section" id="skills" aria-labelledby="skills-heading" data-reveal="up">
      <h2 className="section-label" id="skills-heading">Skills</h2>
      <p className="skills-intro">The tools I&apos;ve used in my projects and coursework, and what I&apos;m learning next.</p>
      <div className="skills-groups">{skillGroups.map((group) => {
        const learning = group.state === "In progress";
        return <div className={`skills-group${learning ? " is-learning" : ""}`} key={group.label}>
          <h3>{group.label}{learning && <span className="skills-badge">In progress</span>}</h3>
          <ul className="skills-items">{group.items.map((item) => {
            const { icon: SkillIcon, color } = getSkillIcon(item);
            return <li key={item}><SkillIcon size={18} color={color} aria-hidden="true" />{item}</li>;
          })}</ul>
        </div>;
      })}</div>
    </section>,
    contact: <section key="contact" className="section-shell connect-section" id="contact" aria-labelledby="contact-heading">
      <h2 className="section-label" id="contact-heading">Let&apos;s connect</h2>
      <div className="connect-columns">
        <div className="connect-details">
          <p className="connect-lead">Looking for a Summer 2027 software engineering intern, or want to talk about a project? I&apos;d be glad to hear from you.</p>
          <a className="connect-button connect-email" href={siteLinks.email}>{personalInfo.email}<ArrowRight size={18} aria-hidden="true" /></a>
          <div className="connect-profiles">
            <a className="connect-button" href={siteLinks.github} target="_blank" rel="noopener noreferrer"><GitHubIcon size={18} />GitHub</a>
            <a className="connect-button" href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon size={18} />LinkedIn</a>
            <a className="connect-button" href={leetcodeProfile.profileUrl} target="_blank" rel="noopener noreferrer"><LeetCodeIcon size={18} />LeetCode</a>
          </div>
          <p className="connect-location">Based in Arlington, Texas</p>
        </div>
        <ContactForm />
      </div>
    </section>,
  };
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <ScrollProgress />
    <header ref={headerRef} className="site-header" onBlur={(event) => { const next = event.relatedTarget as Node | null; if (menuOpen && next && !event.currentTarget.contains(next)) setMenuOpen(false); }}><a className="wordmark" href="#top" aria-label="Raju Paswan home"><span className="wordmark-first">Raju.</span><span className="wordmark-last">Paswan<span className="wordmark-dot">.</span></span></a><nav ref={navRef} id="main-nav" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">{navItems.map((item) => <a className={active === item.id ? "active" : ""} aria-current={active === item.id ? "true" : undefined} href={`#${item.id}`} key={item.id} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<a className="resume-nav-link" href={siteLinks.resume} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Resume</a></nav><div className="header-actions"><div className="header-socials"><a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon size={18} /></a><a href={leetcodeProfile.profileUrl} target="_blank" rel="noopener noreferrer" aria-label="LeetCode"><LeetCodeIcon size={18} /></a><a href={siteLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon size={18} /></a></div><button ref={menuToggleRef} className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-nav" onClick={toggleMenu}>{menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button></div></header>
    <main id="main-content" tabIndex={-1}>
    <section className="hero section-shell" id="top">
      <div ref={headerSentinelRef} className="header-sentinel" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-intro-label">Hi, I&apos;m</p>
        <h1 className="hero-name"><span className="name-line"><span>Raju Kumar</span></span><span className="name-line name-accent"><span>Paswan<i aria-hidden="true">.</i></span></span></h1>
        <p className="hero-role">Software development across systems, AI, and the web.</p>
        <p className="hero-academic">{education.degreeShort} <span aria-hidden="true">•</span> {education.minor} — UTA</p>
        <p className="hero-summary">I&apos;m a CS student at UTA who learns by building — from low-level systems and AI experiments to web projects.</p>
        <div className="hero-actions"><a className="button-primary hero-project-static" href="#projects">Explore projects <ArrowRight size={16} aria-hidden="true" /></a><a className="hero-resume-button" href={siteLinks.resume} target="_blank" rel="noopener noreferrer">View resume <Download size={16} aria-hidden="true" /></a></div>
      </div>
      <div className="hero-art">
        <div className="hero-portrait-wrap"><span className="hero-yellow-bar" aria-hidden="true" /><div className="hero-portrait-card"><Image className="hero-portrait" src="/images/raju-photo.png" alt="Raju Kumar Paswan" width={1086} height={1448} sizes="(max-width: 520px) 100vw, 420px" priority /></div><p className="hero-caption">Computer Science · UT Arlington</p></div>
      </div>
    </section>
    {defaultSectionOrder.map((key) => sections[key])}
    </main>
    <footer className="page-footer section-shell">
      <p suppressHydrationWarning>© {new Date().getFullYear()} {personalInfo.name}</p>
      <button className="page-footer-top" type="button" onClick={backToTop}>Back to top<ArrowUp size={18} aria-hidden="true" /></button>
    </footer>
  </>;
}
