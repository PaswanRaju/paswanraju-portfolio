import { education, experience, projects, skillGroups } from "../data/site";

// Resume Explorer structure, built from the centralized site data. It only holds ids and labels;
// the explorer looks up every fact (dates, descriptions, links, statuses) from data/site.ts when it renders.
export type BranchId = "experience" | "education" | "projects" | "skills";
export type ExplorerItem = { id: string; branch: BranchId; title: string; subtitle: string; planned: boolean };
export type Branch = { id: BranchId; label: string; items: ExplorerItem[] };

export const branches: Branch[] = [
  { id: "experience", label: "Experience", items: experience.map((job) => ({ id: `experience:${job.title}`, branch: "experience", title: job.title, subtitle: `${job.company} · ${job.date}`, planned: false })) },
  { id: "education", label: "Education", items: [{ id: "education:uta", branch: "education", title: education.school, subtitle: education.degree, planned: false }] },
  { id: "projects", label: "Projects", items: projects.map((project) => ({ id: `projects:${project.title}`, branch: "projects", title: project.title, subtitle: project.status, planned: project.status !== "Completed" })) },
  { id: "skills", label: "Skills", items: skillGroups.map((group) => ({ id: `skills:${group.label}`, branch: "skills", title: group.label, subtitle: group.state, planned: group.state !== "Hands-on" })) },
];

export const findBranch = (id: BranchId) => branches.find((branch) => branch.id === id)!;
export const findItem = (id: string) => branches.flatMap((branch) => branch.items).find((item) => item.id === id);
export const experienceFor = (item: ExplorerItem) => experience.find((job) => `experience:${job.title}` === item.id);
export const projectFor = (item: ExplorerItem) => projects.find((project) => `projects:${project.title}` === item.id);
export const skillGroupFor = (item: ExplorerItem) => skillGroups.find((group) => `skills:${group.label}` === item.id);
