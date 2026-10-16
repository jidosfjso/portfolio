import { readOrSeed, write, storageKeys, delay } from './client';
import { seedProjects } from '@/data/seed';
import type { Project, ApiResult } from '@/types';

function loadAll(): Project[] {
  return readOrSeed<Project[]>(storageKeys.projects, seedProjects);
}

export async function listProjects(): Promise<ApiResult<Project[]>> {
  await delay(120);
  return { success: true, data: loadAll() };
}

export async function getProjectBySlug(slug: string): Promise<ApiResult<Project | null>> {
  await delay(120);
  const found = loadAll().find((p) => p.slug === slug) ?? null;
  return { success: true, data: found };
}

export async function createProject(data: Omit<Project, 'id'>): Promise<ApiResult<Project>> {
  await delay(120);
  const all = loadAll();
  if (all.some((p) => p.slug === data.slug)) {
    return { success: false, message: 'slug 已存在，请更换' };
  }
  const next: Project = { ...data, id: crypto.randomUUID() };
  write(storageKeys.projects, [...all, next]);
  return { success: true, data: next };
}

export async function updateProject(
  id: string,
  data: Omit<Project, 'id'>,
): Promise<ApiResult<Project>> {
  await delay(120);
  const all = loadAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return { success: false, message: '项目不存在' };
  if (all.some((p) => p.slug === data.slug && p.id !== id)) {
    return { success: false, message: 'slug 已存在，请更换' };
  }
  const next: Project = { ...data, id };
  all[idx] = next;
  write(storageKeys.projects, all);
  return { success: true, data: next };
}

export async function removeProject(id: string): Promise<ApiResult<null>> {
  await delay(120);
  const all = loadAll().filter((p) => p.id !== id);
  write(storageKeys.projects, all);
  return { success: true, data: null };
}
