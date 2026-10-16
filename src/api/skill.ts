import { read, write, storageKeys } from './client';
import { seedSkills } from '@/data/seed';
import type { Skill, ApiResult } from '@/types';

function loadAll(): Skill[] {
  const stored = read<Skill[] | null>(storageKeys.skills, null);
  return stored ?? seedSkills;
}

export async function listSkills(): Promise<ApiResult<Skill[]>> {
  await delay(120);
  return { success: true, data: loadAll() };
}

export async function createSkill(data: Omit<Skill, 'id'>): Promise<ApiResult<Skill>> {
  await delay(120);
  const all = loadAll();
  const next: Skill = { ...data, id: crypto.randomUUID() };
  write(storageKeys.skills, [...all, next]);
  return { success: true, data: next };
}

export async function updateSkill(id: string, data: Omit<Skill, 'id'>): Promise<ApiResult<Skill>> {
  await delay(120);
  const all = loadAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return { success: false, message: '技能不存在' };
  const next: Skill = { ...data, id };
  all[idx] = next;
  write(storageKeys.skills, all);
  return { success: true, data: next };
}

export async function removeSkill(id: string): Promise<ApiResult<null>> {
  await delay(120);
  const all = loadAll().filter((s) => s.id !== id);
  write(storageKeys.skills, all);
  return { success: true, data: null };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
