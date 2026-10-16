import type { Profile, Skill, Project, Post } from '@/types';

// 首次启动时用于初始化 localStorage 的示例数据。

export const seedProfile: Profile = {
  id: 'profile-1',
  name: '星璃',
  title: '计算机科学与技术本科大四学生',
  bio: '你好，我是星璃，一名热爱 Web 开发的计算机科学与技术专业学生。',
  avatar: '',
  email: 'hello@example.com',
  socials: [
    { id: 'gh', label: 'GitHub', url: 'https://github.com', icon: 'github' },
    { id: 'tw', label: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  ],
  timeline: [
    {
      id: 't1',
      period: '2023 – 至今',
      title: '计算机科学与技术本科大四学生',
      description: '主修计算机科学，专注 Web 前端开发。',
    },
  ],
};

export const seedSkills: Skill[] = [
  { id: 's1', name: 'React', category: '前端', level: 90 },
  { id: 's2', name: 'TypeScript', category: '前端', level: 85 },
  { id: 's3', name: 'Tailwind CSS', category: '前端', level: 80 },
  { id: 's4', name: 'Node.js', category: '后端', level: 75 },
  { id: 's5', name: 'Vite', category: '工具', level: 85 },
];

export const seedProjects: Project[] = [
  {
    id: 'p1',
    slug: 'portfolio',
    title: '个人作品集',
    summary: '一个深色主题的个人作品集网站。',
    content: '# 个人作品集\n\n这是一个示例项目介绍。',
    cover: '',
    tags: ['React', 'TypeScript', 'Tailwind'],
    links: [{ label: '源码', url: 'https://github.com' }],
    date: '2026-10-01',
  },
];

export const seedPosts: Post[] = [
  {
    id: 'b1',
    slug: 'hello-world',
    title: '你好，世界',
    summary: '第一篇示例博客文章。',
    content: '# 你好，世界\n\n这是博客的示例内容。',
    cover: '',
    tags: ['随笔'],
    date: '2026-10-01',
  },
];
