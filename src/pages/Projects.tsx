import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectApi } from '@/api';
import type { Project } from '@/types';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

// 项目列表：卡片网格，封面、标题、摘要、标签，点击进入详情页。

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    projectApi.listProjects().then((res) => {
      if (cancelled) return;
      if (res.data) setProjects(res.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-ink">项目</h1>
      <p className="mt-2 text-muted">精选作品与实践记录。</p>

      {loading ? (
        <p className="mt-10 text-muted">加载中…</p>
      ) : projects.length === 0 ? (
        <p className="mt-10 text-muted">暂无项目。</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-colors hover:border-accent">
                {project.cover && (
                  <div className="aspect-video w-full overflow-hidden bg-bg">
                    <img
                      src={project.cover}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-ink group-hover:text-accent">
                    {project.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{project.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
