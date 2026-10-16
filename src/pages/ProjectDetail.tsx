import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectApi } from '@/api';
import type { Project } from '@/types';
import MarkdownRenderer from '@/features/markdown/MarkdownRenderer';
import Tag from '@/components/ui/Tag';

// 项目详情 /projects/:slug：封面、标题、摘要、技术栈标签、Markdown 正文、Demo/源码链接。

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    projectApi.getProjectBySlug(slug).then((res) => {
      if (cancelled) return;
      setProject(res.data ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-muted">加载中…</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">项目不存在</h1>
        <Link to="/projects" className="mt-4 inline-block text-accent hover:underline">
          返回项目列表
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-16">
      <Link to="/projects" className="text-sm text-muted hover:text-accent">
        ← 返回项目
      </Link>

      {project.cover && (
        <img
          src={project.cover}
          alt={project.title}
          className="mt-6 aspect-video w-full rounded-lg border border-border object-cover"
        />
      )}

      <h1 className="mt-6 text-3xl font-bold text-ink sm:text-4xl">{project.title}</h1>
      <p className="mt-3 text-muted">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      {project.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-4 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}

      <div className="mt-8">
        <MarkdownRenderer content={project.content} />
      </div>
    </article>
  );
}
