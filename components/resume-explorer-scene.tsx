"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { personalInfo } from "../data/site";
import { branches, type BranchId } from "../lib/resume-tree";
import type { Selection } from "./resume-explorer";

type Point = [number, number, number];
type SceneNode = { id: string; position: Point; label: string; detail?: string; size: number; kind: "root" | "branch" | "item"; active: boolean; planned: boolean; select: Selection; labelSide: "below" | "left" | "right" };

// Fixed, hand-placed layout: the name in the middle, one branch per corner at slightly different depths.
const branchPosition: Record<BranchId, Point> = {
  experience: [-2.6, 1.15, -0.3],
  projects: [2.6, 1.05, 0.25],
  education: [-2.4, -1.35, 0.35],
  skills: [2.45, -1.25, -0.25],
};
const side = (branch: BranchId) => Math.sign(branchPosition[branch][0]);

// The focused branch's items stack in a column on its outer side, alternating slightly in depth.
function itemPositions(branch: BranchId, count: number): Point[] {
  const [bx, by] = branchPosition[branch];
  const x = bx + side(branch) * 2.2, gap = 0.62, top = by + ((count - 1) * gap) / 2;
  return Array.from({ length: count }, (_, i) => [x, top - i * gap, i % 2 ? 0.2 : -0.2]);
}

// Render on demand: frames are drawn only while the camera eases to a new focus, then rendering stops.
function CameraRig({ focus }: { focus: BranchId | null }) {
  const { camera, invalidate } = useThree();
  const look = useRef(new THREE.Vector3());
  const goal = useMemo(() => {
    if (!focus) return { look: new THREE.Vector3(0, 0, 0), position: new THREE.Vector3(0, 0, 8.6) };
    const [bx, by] = branchPosition[focus];
    const center = new THREE.Vector3(bx + side(focus) * 1.1, by * 0.85, 0);
    return { look: center, position: new THREE.Vector3(center.x * 0.6, center.y * 0.6, 7.2) };
  }, [focus]);
  useEffect(() => { invalidate(); }, [goal, invalidate]);
  useFrame(() => {
    camera.position.lerp(goal.position, 0.12);
    look.current.lerp(goal.look, 0.12);
    camera.lookAt(look.current);
    if (camera.position.distanceTo(goal.position) > 0.002 || look.current.distanceTo(goal.look) > 0.002) invalidate();
  });
  return null;
}

// Labels are ordinary DOM buttons (rendered by the page's React tree); this only moves them to each node's
// projected screen position whenever a frame renders. No extra React roots, no per-frame React renders.
function LabelProjector({ nodes, labels }: { nodes: SceneNode[]; labels: RefObject<Map<string, HTMLButtonElement>> }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    for (const node of nodes) {
      const el = labels.current.get(node.id);
      if (!el) continue;
      // Column entries label beside their sphere (outer side); the name and sections label below theirs.
      const dx = node.labelSide === "right" ? node.size + 0.12 : node.labelSide === "left" ? -node.size - 0.12 : 0;
      const dy = node.labelSide === "below" ? -node.size - 0.2 : 0;
      v.set(node.position[0] + dx, node.position[1] + dy, node.position[2]).project(camera);
      const anchor = node.labelSide === "right" ? "translate(0, -50%)" : node.labelSide === "left" ? "translate(-100%, -50%)" : "translate(-50%, 0)";
      const x = ((v.x + 1) / 2) * size.width, y = ((1 - v.y) / 2) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) ${anchor}`;
      // Off-view labels are hidden (which also takes them out of the Tab order) so focus never lands on something clipped.
      el.style.visibility = x >= 0 && x <= size.width && y >= 0 && y <= size.height - 20 ? "visible" : "hidden";
    }
  });
  return null;
}

function Edges({ segments }: { segments: { from: Point; to: Point; planned: boolean }[] }) {
  const solid = useMemo(() => new Float32Array(segments.filter((s) => !s.planned).flatMap((s) => [...s.from, ...s.to])), [segments]);
  const dashed = useMemo(() => new Float32Array(segments.filter((s) => s.planned).flatMap((s) => [...s.from, ...s.to])), [segments]);
  const dashedRef = useRef<THREE.LineSegments>(null);
  useEffect(() => { dashedRef.current?.computeLineDistances(); }, [dashed]);
  return <>
    <lineSegments key={`solid-${solid.length}`}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[solid, 3]} /></bufferGeometry>
      <lineBasicMaterial color="#a99aff" transparent opacity={0.35} />
    </lineSegments>
    {dashed.length > 0 && <lineSegments key={`dashed-${dashed.length}`} ref={dashedRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[dashed, 3]} /></bufferGeometry>
      <lineDashedMaterial color="#a99aff" transparent opacity={0.35} dashSize={0.08} gapSize={0.08} />
    </lineSegments>}
  </>;
}

export default function ExplorerScene({ selection, onSelect }: { selection: Selection; onSelect: (selection: Selection) => void }) {
  const focused = selection.branch;
  const labels = useRef(new Map<string, HTMLButtonElement>());
  const items = useMemo(() => (focused ? branches.find((b) => b.id === focused)!.items : []), [focused]);
  const positions = useMemo(() => (focused ? itemPositions(focused, items.length) : []), [focused, items.length]);
  const nodes = useMemo<SceneNode[]>(() => [
    { id: "root", position: [0, 0, 0], label: personalInfo.name, size: 0.14, kind: "root", active: !focused, planned: false, select: { branch: null, item: null }, labelSide: "below" },
    ...branches.map((b): SceneNode => ({ id: b.id, position: branchPosition[b.id], label: b.label, size: 0.1, kind: "branch", active: focused === b.id && !selection.item, planned: false, select: { branch: b.id, item: null }, labelSide: "below" })),
    ...items.map((item, i): SceneNode => ({ id: item.id, position: positions[i], label: item.title, detail: item.planned ? "In progress" : undefined, size: 0.07, kind: "item", active: selection.item === item.id, planned: item.planned, select: { branch: item.branch, item: item.id }, labelSide: side(item.branch) > 0 ? "right" : "left" })),
  ], [focused, items, positions, selection.item]);
  const segments = useMemo(() => [
    ...branches.map((b) => ({ from: [0, 0, 0] as Point, to: branchPosition[b.id], planned: false })),
    ...items.map((item, i) => ({ from: branchPosition[item.branch], to: positions[i], planned: item.planned })),
  ], [items, positions]);

  return <div className="explorer-canvas">
    <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 8.6], fov: 42 }} aria-hidden="true">
      <fog attach="fog" args={["#08090d", 6.5, 13]} />
      <CameraRig focus={focused} />
      <Edges segments={segments} />
      {nodes.map((node) => <mesh key={node.id} position={node.position} onClick={(event) => { event.stopPropagation(); onSelect(node.select); }}>
        <sphereGeometry args={[node.size, 24, 24]} />
        <meshBasicMaterial color={node.active ? "#a99aff" : node.planned ? "#4a5060" : "#b8bdc8"} />
      </mesh>)}
      <LabelProjector nodes={nodes} labels={labels} />
    </Canvas>
    {/* The real controls: one button per node, in reading order (name, sections, then the focused section's entries). */}
    <div className="explorer-labels" role="group" aria-label="Resume map">
      {nodes.map((node) => <button key={node.id} type="button" ref={(el) => { if (el) labels.current.set(node.id, el); else labels.current.delete(node.id); }} className={`explorer-node is-${node.kind}${node.active ? " is-active" : ""}${node.planned ? " is-planned" : ""}`} aria-pressed={node.active} onClick={() => onSelect(node.select)}>
        {node.label}{node.detail && <small>{node.detail}</small>}
      </button>)}
    </div>
  </div>;
}
