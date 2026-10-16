# 个人作品集网站 · 技术设计文档（TECH_DESIGN）

| 项目 | 内容 |
| --- | --- |
| 文档版本 | v1.0 |
| 技术栈 | React + TypeScript + Vite + Tailwind CSS |
| 更新日期 | 2026-10-16 |

---

## 1. 技术栈选型

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 构建工具 | Vite | 快速冷启动、HMR，官方 React 模板 |
| UI 框架 | React 18+（函数组件 + Hooks） | 生态成熟 |
| 语言 | TypeScript（strict） | 类型安全 |
| 样式 | Tailwind CSS | 原子化 CSS，快速构建深色主题 |
| 路由 | react-router-dom | 前台 + `/admin` 后台统一管理 |
| 表单 | react-hook-form + zod | 轻量，无重型 UI 库，zod 做校验 |
| Markdown | react-markdown + remark-gfm + rehype-highlight + rehype-slug | 渲染 + GFM + 代码高亮 + 标题锚点 |
| 粒子背景 | 原生 Canvas API | 无第三方依赖，性能可控 |
| 数据存储 | localStorage（模拟后端） | 前期无后端，通过 `src/api` 抽象 |

### 1.1 关于后端

- **前期无后端**：所有数据通过 `localStorage` 持久化，模拟 CRUD。
- **抽象隔离**：所有读写收敛到 `src/api`，组件/页面不直接操作 `localStorage`。
- **切换成本**：后续接入真实后端时，仅需替换 `src/api` 内实现，上层调用方与类型签名不变。

---

## 2. 目录结构（src）

```
src/
├── main.tsx                      # 入口，挂载 Router
├── App.tsx                       # 根组件，路由表
├── index.css                     # Tailwind 入口 + 全局样式
│
├── api/                          # 统一数据接口层（localStorage 模拟）
│   ├── index.ts                  # 导出所有 API
│   ├── client.ts                 # localStorage 封装（读/写/序列化/异常处理）
│   ├── profile.ts                # Profile 相关 CRUD
│   ├── skill.ts                  # Skill 相关 CRUD
│   ├── project.ts                # Project 相关 CRUD
│   ├── post.ts                   # Post 相关 CRUD
│   └── auth.ts                   # 登录/登出/鉴权（token 管理）
│
├── types/                        # 全站共享类型（前后台一致）
│   └── index.ts                  # Profile / Skill / Project / Post / Auth
│
├── data/                         # 种子/示例数据（首次初始化 localStorage）
│   └── seed.ts
│
├── lib/                          # 纯工具函数
│   └── cn.ts                     # className 合并工具（clsx 简化实现）
│
├── components/                   # 前台通用组件
│   ├── layout/
│   │   ├── Navbar.tsx            # 毛玻璃吸顶导航 + 移动端汉堡菜单
│   │   ├── Footer.tsx            # 页脚
│   │   └── Layout.tsx            # 前台布局容器
│   ├── Starfield.tsx             # Canvas 星空粒子背景
│   └── ui/                       # 基础 UI 原子组件（Button / Card / Tag 等）
│
├── pages/                        # 前台页面
│   ├── Home.tsx                  # 首页（Hero + 时间线 + 技能 + 项目 + 联系）
│   ├── Projects.tsx              # 项目列表（卡片网格）
│   ├── ProjectDetail.tsx         # 项目详情 /projects/:slug
│   ├── Blog.tsx                  # 博客列表
│   ├── BlogDetail.tsx            # 博客详情 /blog/:slug（Markdown + TOC）
│   └── NotFound.tsx              # 404
│
├── features/                     # 前台功能模块（可选，按模块组织）
│   ├── markdown/
│   │   ├── MarkdownRenderer.tsx  # 统一 Markdown 渲染（高亮 + 目录锚点）
│   │   └── Toc.tsx               # 目录组件
│   └── contact/
│       └── ContactForm.tsx       # 联系表单（zod 校验）
│
├── admin/                        # 后台（v1.1，与前台隔离）
│   ├── layout/
│   │   ├── AdminLayout.tsx       # 后台布局（侧边栏 + 顶栏）
│   │   ├── Sidebar.tsx           # 侧边栏导航
│   │   └── Topbar.tsx            # 顶栏（用户信息 + 登出）
│   ├── pages/
│   │   ├── Login.tsx             # /admin/login 登录页
│   │   ├── Dashboard.tsx         # /admin 首页
│   │   ├── Settings.tsx          # /admin/settings 个人信息管理
│   │   ├── PostsAdmin.tsx        # 博客管理（预留）
│   │   ├── ProjectsAdmin.tsx     # 项目管理（预留）
│   │   └── SkillsAdmin.tsx       # 技能管理（预留）
│   ├── components/
│   │   ├── MarkdownEditor.tsx    # Markdown 编辑器（实时预览）
│   │   ├── ConfirmDialog.tsx     # 二次确认弹窗
│   │   └── RouteGuard.tsx        # 路由守卫（未登录重定向）
│   └── auth/
│       └── useAuth.ts            # 登录态 Hook
│
└── router/
    └── index.tsx                 # 集中式路由表（前台 + /admin）
```

---

## 3. TypeScript 数据类型定义

> 前后台共用同一套类型，定义于 `src/types/index.ts`。

```ts
// ===== 基础通用 =====
export interface Skill {
  id: string;
  name: string;          // 技能名称
  category: string;      // 分组：前端 / 后端 / 工具 …
  level: number;         // 熟练度 0–100
  icon?: string;         // 图标名（映射到图标库或 emoji）
}

export interface Profile {
  id: string;
  name: string;          // 姓名/昵称
  title: string;         // 一句话定位（副标题）
  bio: string;           // 个人简介（支持 markdown）
  avatar: string;        // 头像 URL
  email: string;         // 联系邮箱
  socials: SocialLink[]; // 社交链接
  timeline: TimelineItem[]; // 时间线经历
}

export interface SocialLink {
  id: string;
  label: string;         // 显示名，如 GitHub
  url: string;
  icon?: string;
}

export interface TimelineItem {
  id: string;
  period: string;        // 时间区间，如 "2021 – 2024"
  title: string;         // 标题，如 "前端工程师 @ 某公司"
  description: string;   // 描述
}

export interface Project {
  id: string;
  slug: string;          // 唯一标识，用于路由 /projects/:slug
  title: string;
  summary: string;       // 摘要（列表卡片展示）
  content: string;       // 详情正文（markdown）
  cover: string;         // 封面图 URL
  tags: string[];        // 标签
  links: ProjectLink[];  // Demo / 源码链接
  date: string;          // 发布日期 ISO
}

export interface ProjectLink {
  label: string;         // "Demo" | "源码"
  url: string;
}

export interface Post {
  id: string;
  slug: string;          // 唯一标识，用于路由 /blog/:slug
  title: string;
  summary: string;       // 摘要
  content: string;       // 正文（markdown）
  cover: string;         // 封面图 URL
  tags: string[];        // 标签
  date: string;          // 发布日期 ISO
}

// ===== 后台 · 登录鉴权 =====
export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;         // 仅返回 token，不返回密码
  user: AdminUser;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
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
  message?: string;      // 成功/失败提示
}
```

---

## 4. 关键技术难点与方案

### 4.1 星空 Canvas 性能

**难点**：粒子数量过多、每帧全量重绘会导致移动端掉帧。

**方案**：

- 使用 `requestAnimationFrame` 驱动渲染循环，页面不可见时暂停（`document.hidden` 监听）。
- 粒子数量按设备自适应：`<640px` 降低粒子数（如桌面 150 → 移动 40）。
- 采用「离屏绘制 + 少量对象」：粒子用轻量对象（x/y/vx/vy/r），避免每帧创建新对象。
- 使用 `devicePixelRatio` 缩放画布，避免高分屏模糊；同时限制最大 DPR（如 2）控制像素量。
- **尊重 `prefers-reduced-motion`**：匹配到该偏好时，静止渲染一帧（不持续动画）或大幅降频。
- 目标：移动端帧率 ≥ 50fps。

### 4.2 Markdown 解析与 TOC

**难点**：代码高亮 + 自动目录 + 锚点跳转。

**方案**：

- `react-markdown` 负责解析，`remark-gfm` 支持表格/任务列表等 GFM 语法。
- `rehype-highlight` + `highlight.js` 做代码块高亮（按需引入常用语言与主题）。
- `rehype-slug` 为标题生成 `id`，用于 TOC 锚点跳转。
- 自定义组件映射：在 `react-markdown` 的 `components` 中遍历标题，收集生成 TOC 数据；点击 TOC 平滑滚动到对应标题。
- TOC 数据结构：`{ id, text, level }[]`，递归遍历。

### 4.3 后台路由守卫

**难点**：未登录用户访问 `/admin` 需重定向，登录后放行。

**方案**：

- 封装 `RouteGuard` 组件，包住 `/admin` 下受保护路由。
- `RouteGuard` 内部读取 `useAuth()` 的登录态（token 是否存在 + 是否有效）。
- 未登录时渲染 `<Navigate to="/admin/login" replace />`，并记录来源路径，登录成功后回跳。
- 登录态用 `localStorage` 存 token，`useAuth` 提供 `login/logout/isAuthenticated`。

### 4.4 localStorage 封装 API

**难点**：统一读写、异常处理、方便切换后端。

**方案**：

- `client.ts` 封装 `read(key)` / `write(key, value)` / `remove(key)`，统一 `JSON` 序列化与 `try/catch`。
- 每个领域（profile/skill/project/post/auth）暴露异步风格接口：`list()`、`getById(id)`、`create(data)`、`update(id, data)`、`remove(id)`。
- 接口返回 `Promise<ApiResult<T>>`，模拟网络延迟（可选），上层可用 `async/await` 调用，未来替换为 `fetch` 即可。
- 首次启动用 `data/seed.ts` 初始化默认数据。

### 4.5 表单 zod 校验

**难点**：所有表单统一校验，避免重复代码。

**方案**：

- 每个表单定义 zod schema（如 `loginSchema`、`profileSchema`、`skillSchema`）。
- `react-hook-form` 的 `zodResolver` 集成，实时校验 + 提交校验。
- 校验错误以中文提示展示，与 `aria-invalid` / `aria-describedby` 关联，满足无障碍。

### 4.6 移动端性能优化

- 图片懒加载（`loading="lazy"`）与 `width/height` 占位，避免布局抖动。
- 粒子数量自适应 + DPR 上限。
- 代码分割：`React.lazy` 按路由懒加载页面。
- Tailwind 构建时 Purge，产物体积最小化。

---

## 5. 关键配置文件

| 文件 | 说明 |
| --- | --- |
| `vite.config.ts` | Vite + React 插件 + `@tailwindcss/vite` + 路径别名 `@` |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | TS 严格模式 + 路径映射 |
| `src/index.css` | Tailwind 入口，自定义主题 token（背景 `#0B0F1A`、文字 `#E6EAF2`） |
| `index.html` | HTML 模板，`lang="zh-CN"`、meta 视口、无障碍 |

---

## 6. 数据流

```
组件/页面
   │ 调用
   ▼
src/api/*  (统一接口，Promise<ApiResult<T>>)
   │ 读写
   ▼
client.ts  (localStorage JSON 封装)
   │
   ▼
localStorage  ──(后续)──▶  真实后端 HTTP
```

- 前台页面只读数据：`list()` / `getBySlug()`。
- 后台页面读写数据：`create/update/remove`。
- 登录：`auth.login(payload)` → `token` 存 localStorage。

---

## 7. 部署方案

1. 代码推送到 GitHub 仓库。
2. Vercel 或 Cloudflare Pages 关联该仓库。
3. 构建命令：`npm run build`；输出目录：`dist`。
4. 由于是纯静态 SPA，需配置 SPA 回退（所有路由重写到 `index.html`），保证 `/blog/:slug` 等深层路由刷新不 404。
