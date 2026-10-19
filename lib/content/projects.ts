import "server-only";

import { PROJECTS } from "@/data/projects";
import { projectSchema, type ProjectRecord } from "@/lib/schemas/project";

import { getHome } from "./home";
import { CONTENT_TAGS, cachedCollection } from "./repository";

/** The seed doubles as the fallback, so the site never renders empty. */
const FALLBACK: ProjectRecord[] = PROJECTS.map((project, index) => ({
  ...project,
  order: index,
  published: true,
}));

const readProjects = cachedCollection({
  collection: "projects",
  tag: CONTENT_TAGS.projects,
  schema: projectSchema,
  fallback: FALLBACK,
});

/** Every published project, in admin-defined order. */
export async function getProjects(): Promise<ProjectRecord[]> {
  const projects = await readProjects();
  return projects.filter((project) => project.published);
}

/** Including unpublished — for the admin list only. */
export async function getAllProjects(): Promise<ProjectRecord[]> {
  return readProjects();
}

/** Resolve an ordered list of ids against the published set. */
function pick(projects: ProjectRecord[], ids: string[]): ProjectRecord[] {
  const byId = new Map(projects.map((project) => [project.id, project]));
  return ids
    .map((id) => byId.get(id))
    .filter((project): project is ProjectRecord => Boolean(project));
}

/**
 * Homepage carousel, in the order chosen in the CMS.
 *
 * If the selection has gone stale - a chosen project deleted or unpublished -
 * this falls back to the old implicit rule rather than rendering a broken
 * three-card layout.
 */
export async function getFeaturedProjects(): Promise<ProjectRecord[]> {
  const [projects, home] = await Promise.all([getProjects(), getHome()]);
  const picked = pick(projects, home.composition.featuredProjectIds);
  return picked.length >= 3
    ? picked
    : projects.filter((project) => project.video);
}

/** The sticky cards in the "All Properties" section (strictly 2 landmark developments). */
export async function getListingProjects(): Promise<ProjectRecord[]> {
  const [projects, home] = await Promise.all([getProjects(), getHome()]);
  const picked = pick(projects, home.composition.listingProjectIds);
  const target = picked.length > 0 ? picked : projects;
  return target.slice(0, 2);
}

/** The single project named in the Explore section overlay. */
export async function getExploreProject(): Promise<ProjectRecord | null> {
  const [projects, home] = await Promise.all([getProjects(), getHome()]);
  return (
    projects.find(
      (project) => project.id === home.composition.exploreProjectId
    ) ??
    projects[0] ??
    null
  );
}
