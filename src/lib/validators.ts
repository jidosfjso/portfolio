import { z } from 'zod';

// 全站表单校验 schema（zod）。
// 约定：可选字段用 `.optional()` 而非 `.default()`，保证 input/output 类型一致，
// 便于与 react-hook-form 的 zodResolver 无缝配合；默认值由 useForm 的 defaultValues 提供。

// ===== 登录 =====

export const loginSchema = z.object({
  username: z.string().min(1, '请输入账号'),
  password: z.string().min(1, '请输入密码'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

// ===== 个人信息 =====

export const socialLinkSchema = z.object({
  label: z.string().min(1, '请输入名称'),
  url: z.url('请输入有效链接'),
});
export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

export const timelineItemSchema = z.object({
  period: z.string().min(1, '请输入时间区间'),
  title: z.string().min(1, '请输入标题'),
  description: z.string().optional(),
});
export type TimelineItemFormValues = z.infer<typeof timelineItemSchema>;

export const profileSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  title: z.string().min(1, '请输入定位'),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  email: z.email('请输入有效邮箱'),
  socials: z.array(socialLinkSchema),
  timeline: z.array(timelineItemSchema),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

// ===== 技能 =====

export const skillSchema = z.object({
  name: z.string().min(1, '请输入技能名称'),
  category: z.string().min(1, '请输入分类'),
  level: z.number().int('熟练度须为整数').min(0, '熟练度范围 0–100').max(100, '熟练度范围 0–100'),
  icon: z.string().optional(),
});
export type SkillFormValues = z.infer<typeof skillSchema>;

// ===== 标签（字符串 ↔ 数组）=====

export function splitTags(input: string | undefined): string[] {
  if (!input) return [];
  return input
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function joinTags(tags: string[]): string {
  return tags.join(', ');
}

// ===== 博客 =====

const slugSchema = z
  .string()
  .min(1, '请输入 slug')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 仅含小写字母、数字与连字符');

export const postSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1, '请输入标题'),
  summary: z.string().min(1, '请输入摘要'),
  content: z.string().min(1, '请输入正文'),
  cover: z.string().optional(),
  tags: z.string().optional(),
  date: z.string().min(1, '请选择日期'),
});
export type PostFormValues = z.infer<typeof postSchema>;

// ===== 项目 =====

export const projectSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1, '请输入标题'),
  summary: z.string().min(1, '请输入摘要'),
  content: z.string().min(1, '请输入详情'),
  cover: z.string().optional(),
  tags: z.string().optional(),
  links: z.array(
    z.object({
      label: z.string().min(1, '请输入名称'),
      url: z.url('请输入有效链接'),
    }),
  ),
  date: z.string().min(1, '请选择日期'),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;
