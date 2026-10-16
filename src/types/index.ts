// ===== 全站共享类型（前台与后台保持一致）=====

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  description: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  socials: SocialLink[];
  timeline: TimelineItem[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0–100
  icon?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // markdown
  cover: string;
  tags: string[];
  links: ProjectLink[];
  date: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // markdown
  cover: string;
  tags: string[];
  date: string;
}

// ===== 后台 · 登录鉴权 =====

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

// ===== 后台 · 表单 =====
// 表单值类型统一由 zod schema 推导，定义在 src/lib/validators.ts，
// 此处不再重复声明，避免与 zod 推导结果不一致。

// ===== API 统一返回 =====

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}
