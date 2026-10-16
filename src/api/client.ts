// localStorage 统一封装：序列化、异常处理。
// 后续切换真实后端时，仅需在此层替换为 fetch 实现。

const PREFIX = 'portfolio:';

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] read "${key}" failed`, err);
    return fallback;
  }
}

export function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] write "${key}" failed`, err);
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.warn(`[storage] remove "${key}" failed`, err);
  }
}

export const storageKeys = {
  profile: 'profile',
  skills: 'skills',
  projects: 'projects',
  posts: 'posts',
  token: 'token',
  user: 'user',
} as const;
