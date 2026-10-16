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

// ===== 后台 · 表单（zod 推导）=====

export type ProfileFormValues = Omit<Profile, 'id'>;
export type SkillFormValues = Omit<Skill, 'id'>;
export type ProjectFormValues = Omit<Project, 'id'>;
export type PostFormValues = Omit<Post, 'id'>;

// ===== API 统一返回 =====

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}
