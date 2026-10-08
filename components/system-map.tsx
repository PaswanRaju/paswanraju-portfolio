"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { engineeringAreas, projects, systemMapAreas, type AreaId } from "../data/site";

type Kind = "skill" | "project" | "area";
type Selection = { kind: Kind; id: string } | null;
type Relation = { skill: string; project: string; area: AreaId; planned: boolean };
type Line = { key: string; d: string; planned: boolean; edge: string };

// Every (skill, project, area) triple, derived from project tags + the area map. Nothing here is hand-copied.
const relations: Relation[] = projects.flatMap((project) =>
  Object.entries(systemMapAreas[project.title] as Record<string, AreaId>).map(([skill, area]) => ({ skill, project: project.title, area, planned: project.status !== "Completed" })),
);
const skills = [...new Set(relations.map((r) => r.skill))];
const projectTitles = projects.map((p) => p.title);
const areaLabel = Object.fromEntries(engineeringAreas.map((a) => [a.id, a.label])) as Record<AreaId, string>;
const isPlanned = (match: (r: Relation) => boolean) => relations.filter(match).every((r) => r.planned);
const plannedProject = new Set<string>(projects.filter((p) => p.status !== "Completed").map((p) => p.title));
const unique = <T,>(items: T[]) => [...new Set(items)];
const nodeKey = (kind: Kind, id: string) => `${kind}:${id}`;
const skillEdge = (r: Relation) => `${r.skill}|${r.project}`;
const areaEdge = (r: Relation) => `${r.project}|${r.area}`;
const columns = [{ kind: "skill", label: "Skills" }, { kind: "project", label: "Projects" }, { kind: "area", label: "Areas" }] as const;

function matches(selection: NonNullable<Selection>) {
  return (r: Relation) => (selection.kind === "skill" ? r.skill : selection.kind === "project" ? r.project : r.area) === selection.id;
}

export default function SystemMap() {
  const [selected, setSelected] = useState<Selection>(null);
  const [mobileColumn, setMobileColumn] = useState<Kind>("skill");
  const [lines, setLines] = useState<Line[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLButtonElement>());

  // What the current selection touches: nodes and connector edges.
  const active = useMemo(() => {
    if (!selected) return null;
    const related = relations.filter(matches(selected));
    return {
      related,
      nodes: new Set([...related.map((r) => nodeKey("skill", r.skill)), ...related.map((r) => nodeKey("project", r.project)), ...related.map((r) => nodeKey("area", r.area))]),
      edges: new Set([...related.map(skillEdge), ...related.map(areaEdge)]),
    };
  }, [selected]);

  // Connector geometry is measured from the buttons, only when the desktop layout is showing and only on resize.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const desktop = matchMedia("(min-width: 901px)");
    let mounted = true;
    const measure = () => {
      if (!mounted) return;
      if (!desktop.matches) { setLines([]); return; }
      const box = map.getBoundingClientRect();
      const point = (kind: Kind, id: string, side: "left" | "right") => {
        const r = nodes.current.get(nodeKey(kind, id))?.getBoundingClientRect();
        return r ? { x: (side === "left" ? r.left : r.right) - box.left, y: r.top + r.height / 2 - box.top } : null;
      };
      const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => { const mid = (a.x + b.x) / 2; return `M${a.x.toFixed(1)},${a.y.toFixed(1)} C${mid.toFixed(1)},${a.y.toFixed(1)} ${mid.toFixed(1)},${b.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`; };
      const next: Line[] = [];
      for (const r of unique(relations.map(skillEdge))) {
        const [skill, project] = r.split("|");
        const a = point("skill", skill, "right"), b = point("project", project, "left");
        if (a && b) next.push({ key: `s:${r}`, d: curve(a, b), planned: plannedProject.has(project), edge: r });
      }
      for (const r of unique(relations.map(areaEdge))) {
        const [project, area] = r.split("|");
        const a = point("project", project, "right"), b = point("area", area, "left");
        if (a && b) next.push({ key: `a:${r}`, d: curve(a, b), planned: plannedProject.has(project), edge: r });
      }
      setLines(next);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(map);
    desktop.addEventListener("change", measure);
    document.fonts?.ready.then(measure);
    return () => { mounted = false; resize.disconnect(); desktop.removeEventListener("change", measure); };
  }, []);

  // Selection persists until another item is chosen, Reset is pressed, or Escape is pressed.
  const select = (kind: Kind, id: string) => setSelected({ kind, id });
  const register = (kind: Kind, id: string) => (element: HTMLButtonElement | null) => { if (element) nodes.current.set(nodeKey(kind, id), element); else nodes.current.delete(nodeKey(kind, id)); };
  const stateOf = (kind: Kind, id: string) => (!active ? "" : selected?.kind === kind && selected.id === id ? " is-selected" : active.nodes.has(nodeKey(kind, id)) ? " is-related" : " is-dimmed");
  const label = (kind: Kind, id: string) => (kind === "area" ? areaLabel[id as AreaId] : id);
  const plannedNode = (kind: Kind, id: string) => (kind === "project" ? plannedProject.has(id) : kind === "skill" ? isPlanned((r) => r.skill === id) : isPlanned((r) => r.area === id));
  const ids: Record<Kind, string[]> = { skill: skills, project: projectTitles, area: engineeringAreas.map((a) => a.id) };

  // Plain-language result of the current selection, for everyone (and announced to screen readers).
  const summary = useMemo(() => {
    if (!selected || !active) return null;
    const tag = (title: string) => (plannedProject.has(title) ? `${title} (in progress)` : title);
    const groups: { heading: string; items: string[] }[] = [];
    if (selected.kind !== "skill") groups.push({ heading: "Skills", items: unique(active.related.map((r) => r.skill)) });
    if (selected.kind !== "project") groups.push({ heading: selected.kind === "skill" ? "Used in" : "Projects", items: unique(active.related.map((r) => tag(r.project))) });
    if (selected.kind !== "area") groups.push({ heading: "Areas", items: unique(active.related.map((r) => areaLabel[r.area])) });
    return { title: label(selected.kind, selected.id), groups };
  }, [selected, active]);

  return <div className="system-map" onKeyDown={(event) => { if (event.key === "Escape" && selected) { event.stopPropagation(); setSelected(null); } }}>
    <div className="map-toolbar">
      <div className="map-tabs" role="group" aria-label="Show list">
        {columns.map((column) => <button type="button" key={column.kind} aria-pressed={mobileColumn === column.kind} onClick={() => setMobileColumn(column.kind)}>{column.label}</button>)}
      </div>
      <p className="map-legend"><span className="legend-solid" aria-hidden="true" /> completed work <span className="legend-dashed" aria-hidden="true" /> in-progress project</p>
      <button type="button" className="map-reset" onClick={() => setSelected(null)} disabled={!selected}>Reset</button>
    </div>
    <div className={`map-grid${active ? " has-selection" : ""}`} ref={mapRef}>
      <svg className="map-lines" aria-hidden="true" focusable="false">
        {lines.map((line) => <path key={line.key} d={line.d} className={`${line.planned ? "planned" : ""}${active ? (active.edges.has(line.edge) ? " active" : " dim") : ""}`} />)}
      </svg>
      {columns.map((column) => <div className={`map-col map-col-${column.kind}${mobileColumn === column.kind ? " is-mobile-active" : ""}`} key={column.kind}>
        <h3 className="map-col-title">{column.label}</h3>
        <ul>
          {ids[column.kind].map((id) => { const planned = plannedNode(column.kind, id); return <li key={id}>
            <button type="button" ref={register(column.kind, id)} className={`map-node${planned ? " is-planned" : ""}${stateOf(column.kind, id)}`} aria-pressed={selected?.kind === column.kind && selected.id === id} onClick={() => select(column.kind, id)}>
              {label(column.kind, id)}
              {planned && (column.kind === "project" ? <small>In progress</small> : <span className="sr-only"> (in-progress work only)</span>)}
            </button>
          </li>; })}
        </ul>
      </div>)}
    </div>
    <div className="map-summary" role="status">
      {summary ? <>
        <p className="map-summary-title">{summary.title}</p>
        <dl>{summary.groups.map((group) => <div key={group.heading}><dt>{group.heading}</dt><dd>{group.items.join(", ")}</dd></div>)}</dl>
      </> : <p className="map-summary-hint">Select a skill, project, or area to see how it connects.</p>}
    </div>
    {/* The connector lines are decorative; this is the same information as text. */}
    <div className="sr-only">
      <h3>All connections</h3>
      <ul>{skills.map((skill) => <li key={skill}>{skill}: {relations.filter((r) => r.skill === skill).map((r) => `${r.project}${r.planned ? " (in progress)" : ""}, ${areaLabel[r.area]}`).join("; ")}</li>)}</ul>
    </div>
  </div>;
}
