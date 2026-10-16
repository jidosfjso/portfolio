import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectApi, postApi, skillApi } from '@/api';

// 后台首页：内容统计概览。

interface Stats {
  projects: number;
  posts: number;
  skills: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([projectApi.listProjects(), postApi.listPosts(), skillApi.listSkills()]).then(
      ([p, b, s]) => {
        if (cancelled) return;
        setStats({
          projects: p.data?.length ?? 0,
          posts: b.data?.length ?? 0,
          skills: s.data?.length ?? 0,
        });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: '项目', value: stats?.projects, to: '/admin/projects' },
    { label: '博客文章', value: stats?.posts, to: '/admin/posts' },
    { label: '技能', value: stats?.skills, to: '/admin/skills' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">后台首页</h1>
      <p className="mt-2 text-muted">内容统计概览</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <p className="text-3xl font-bold text-ink">{c.value ?? '…'}</p>
            <p className="mt-2 text-sm text-muted">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
