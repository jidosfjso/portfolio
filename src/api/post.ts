import { read, write, storageKeys } from './client';
import { seedPosts } from '@/data/seed';
import type { Post, ApiResult } from '@/types';

function loadAll(): Post[] {
  const stored = read<Post[] | null>(storageKeys.posts, null);
  return stored ?? seedPosts;
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
  const next: Post = { ...data, id: crypto.randomUUID() };
  write(storageKeys.posts, [...all, next]);
  return { success: true, data: next };
}

export async function updatePost(id: string, data: Omit<Post, 'id'>): Promise<ApiResult<Post>> {
  await delay(120);
  const all = loadAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return { success: false, message: '文章不存在' };
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
