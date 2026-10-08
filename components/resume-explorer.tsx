"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, RotateCcw, X } from "lucide-react";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { education, personalInfo, siteLinks, skillProjectLinks, type SkillName } from "../data/site";
import { branches, experienceFor, findBranch, findItem, projectFor, skillGroupFor, type BranchId } from "../lib/resume-tree";
import { useModalDialog } from "../lib/use-modal-dialog";
import { useWebGLCapable } from "../lib/webgl-support";

// The 3D view is its own chunk: it is only downloaded if the 3D view is actually shown.
const ExplorerScene = dynamic(() => import("./resume-explorer-scene"), { ssr: false, loading: () => <p className="explorer-scene-status">Loading 3D view…</p> });

export type Selection = { branch: BranchId | null; item: string | null };
const root: Selection = { branch: null, item: null };

// If the 3D view fails for any reason (no WebGL context, driver issue), drop to the 2D view.
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Details({ selection, onSelect, onViewProjects }: { selection: Selection; onSelect: (selection: Selection) => void; onViewProjects: () => void }) {
  const item = selection.item ? findItem(selection.item) : undefined;
  if (!selection.branch) return <div className="explorer-detail-body">
    <h3>{personalInfo.name}</h3>
    <p className="explorer-meta">{personalInfo.role}</p>
    <p>{personalInfo.intro}</p>
    <p className="explorer-hint">Choose Experience, Education, Projects, or Skills.</p>
  </div>;
  if (!item) {
    const branch = findBranch(selection.branch);
    return <div className="explorer-detail-body">
      <h3>{branch.label}</h3>
      <ul className="explorer-summary">{branch.items.map((entry) => <li key={entry.id}><button type="button" className="text-button" onClick={() => onSelect({ branch: branch.id, item: entry.id })}>{entry.title}</button><span className={entry.planned ? "is-planned" : ""}>{entry.subtitle}</span></li>)}</ul>
    </div>;
  }
  const job = experienceFor(item), project = projectFor(item), group = skillGroupFor(item);
  if (job) return <div className="explorer-detail-body">
    <h3>{job.title}</h3>
    <p className="explorer-meta">{job.company} · {job.date}</p>
    <ul className="explorer-list">{job.responsibilities.map((line) => <li key={line}>{line}</li>)}</ul>
    <div className="tag-list">{job.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
  </div>;
  if (project) return <div className="explorer-detail-body">
    <h3>{project.title}</h3>
    <p className="explorer-meta"><span className={`status ${project.status === "Completed" ? "complete" : ""}`}>{project.status}</span></p>
    <p>{project.description}</p>
    <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    <div className="explorer-links">
      {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> repository for {project.title}</span> <ExternalLink size={12} aria-hidden="true" /></a>}
      {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">Live Demo<span className="sr-only"> of {project.title}</span> <ExternalLink size={12} aria-hidden="true" /></a>}
      <button type="button" className="text-button" onClick={onViewProjects}>View in Projects</button>
    </div>
  </div>;
  if (group) return <div className="explorer-detail-body">
    <h3>{group.label}</h3>
    <p className="explorer-meta"><span className={`status ${group.state === "Hands-on" ? "complete" : ""}`}>{group.state}</span></p>
    <ul className="explorer-list">{group.items.map((skill) => { const used = skillProjectLinks[skill as SkillName]; return <li key={skill}>{skill}{used && <span className="explorer-used"> · used in {used.join(", ")}</span>}</li>; })}</ul>
  </div>;
  return <div className="explorer-detail-body">
    <h3>{education.school}</h3>
    <p className="explorer-meta">{education.degree} · {education.minor}</p>
    <p className="explorer-label">Coursework</p>
    <div className="tag-list">{education.coursework.map((course) => <span key={course}>{course}</span>)}</div>
    <p className="explorer-label">Organizations</p>
    <div className="tag-list">{education.organizations.map((org) => <span key={org}>{org}</span>)}</div>
  </div>;
}

export default function ResumeExplorer({ onClose, onViewProjects, recruiter }: { onClose: () => void; onViewProjects: () => void; recruiter: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalDialog(dialogRef);
  const reduced = useReducedMotion();
  const webgl = useWebGLCapable();
  const [sceneFailed, setSceneFailed] = useState(false);
  const can3d = webgl && !reduced && !sceneFailed;
  // 3D is the default only on capable desktops outside Recruiter Mode; everyone else opens the 2D view.
  const [preferred, setPreferred] = useState<"3d" | "2d">(webgl && !reduced && !recruiter ? "3d" : "2d");
  const view = can3d ? preferred : "2d";
  const [selection, setSelection] = useState<Selection>(root);
  const detailRef = useRef<HTMLElement>(null);
  // On narrow screens the details sit below the list, so bring them into view after picking an entry.
  const pickItem = (next: Selection) => { setSelection(next); if (matchMedia("(max-width: 900px)").matches) requestAnimationFrame(() => detailRef.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" })); };
  const currentItem = selection.item ? findItem(selection.item) : undefined;
  const back = () => setSelection(selection.item ? { branch: selection.branch, item: null } : root);
  // Focus starts inside the dialog (the 2D view autofocuses its first section; the 3D view focuses the dialog itself).
  useEffect(() => { if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus(); }, []);
  const announcement = currentItem ? `Showing ${currentItem.title}` : selection.branch ? `Showing ${findBranch(selection.branch).label}` : "Showing overview";

  return <div className="overlay explorer-overlay" onClick={onClose}>
    <motion.div ref={dialogRef} className="explorer" role="dialog" aria-modal="true" aria-labelledby="explorer-title" tabIndex={-1} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onClick={(event) => event.stopPropagation()}>
      <div className="explorer-head">
        <h2 id="explorer-title">Resume Explorer</h2>
        <div className="explorer-controls">
          {can3d && <div className="explorer-view" role="group" aria-label="View"><button type="button" aria-pressed={view === "3d"} onClick={() => setPreferred("3d")}>3D</button><button type="button" aria-pressed={view === "2d"} onClick={() => setPreferred("2d")}>List</button></div>}
          <button type="button" className="explorer-control" onClick={back} disabled={!selection.branch}><ArrowLeft size={14} aria-hidden="true" /> Back</button>
          <button type="button" className="explorer-control" onClick={() => setSelection(root)} disabled={!selection.branch}><RotateCcw size={14} aria-hidden="true" /> Reset</button>
          <a className="explorer-control" href={siteLinks.resume} target="_blank" rel="noopener noreferrer">Resume PDF <ArrowUpRight size={14} aria-hidden="true" /></a>
          <button type="button" className="explorer-close" onClick={onClose} aria-label="Close resume explorer"><X size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <div className={`explorer-body is-${view}`}>
        {view === "3d"
          ? <div className="explorer-stage">
              <SceneBoundary onError={() => setSceneFailed(true)}><ExplorerScene selection={selection} onSelect={setSelection} /></SceneBoundary>
            </div>
          : <div className="explorer-nav">
              <div className="explorer-branches" role="group" aria-label="Resume sections">
                {branches.map((branch) => <button type="button" key={branch.id} aria-pressed={selection.branch === branch.id} onClick={() => setSelection({ branch: branch.id, item: null })} autoFocus={branch.id === "experience"}>{branch.label}<span aria-hidden="true">{branch.items.length}</span></button>)}
              </div>
              {selection.branch && <ul className="explorer-items" aria-label={`${findBranch(selection.branch).label} entries`}>
                {findBranch(selection.branch).items.map((item) => <li key={item.id}><button type="button" className={item.planned ? "is-planned" : ""} aria-pressed={selection.item === item.id} onClick={() => pickItem({ branch: item.branch, item: item.id })}><span>{item.title}</span><small>{item.subtitle}</small></button></li>)}
              </ul>}
            </div>}
        <section ref={detailRef} className="explorer-detail" aria-label="Details">
          <Details selection={selection} onSelect={pickItem} onViewProjects={onViewProjects} />
        </section>
      </div>
      {sceneFailed && <p className="explorer-note">The 3D view couldn&apos;t start on this device, so the list view is shown.</p>}
      <p className="sr-only" role="status">{announcement}</p>
    </motion.div>
  </div>;
}
