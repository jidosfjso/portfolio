import { read, write, storageKeys } from './client';
import { seedProjects } from '@/data/seed';
import type { Project, ApiResult } from '@/types';

function loadAll(): Project[] {
  const stored = read<Project[] | null>(storageKeys.projects, null);
  return stored ?? seedProjects;
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
