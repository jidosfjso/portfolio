import { readOrSeed, write, storageKeys, delay } from './client';
import { seedPosts } from '@/data/seed';
import type { Post, ApiResult } from '@/types';

function loadAll(): Post[] {
  return readOrSeed<Post[]>(storageKeys.posts, seedPosts);
}

export async function listPosts(): Promise<ApiResult<Post[]>> {
  await delay(120);
  return { success: true, data: loadAll() };
}

export async function getPostBySlug(slug: string): Promise<ApiResult<Post | null>> {
  await delay(120);
  const found = loadAll().find((p) => p.slug === slug) ?? null;
  return { success: true, data: found };
}

export async function createPost(data: Omit<Post, 'id'>): Promise<ApiResult<Post>> {
  await delay(120);
  const all = loadAll();
  if (all.some((p) => p.slug === data.slug)) {
    return { success: false, message: 'slug 已存在，请更换' };
  }
  const next: Post = { ...data, id: crypto.randomUUID() };
  write(storageKeys.posts, [...all, next]);
  return { success: true, data: next };
}

export async function updatePost(id: string, data: Omit<Post, 'id'>): Promise<ApiResult<Post>> {
  await delay(120);
  const all = loadAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return { success: false, message: '文章不存在' };
  if (all.some((p) => p.slug === data.slug && p.id !== id)) {
    return { success: false, message: 'slug 已存在，请更换' };
  }
  const next: Post = { ...data, id };
  all[idx] = next;
  write(storageKeys.posts, all);
  return { success: true, data: next };
}

export async function removePost(id: string): Promise<ApiResult<null>> {
  await delay(120);
  const all = loadAll().filter((p) => p.id !== id);
  write(storageKeys.posts, all);
  return { success: true, data: null };
}
