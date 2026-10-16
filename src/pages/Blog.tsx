import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '@/api';
import type { Post } from '@/types';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

// 博客列表：按日期倒序展示文章卡片（标题、摘要、标签、封面、日期）。

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('zh-CN');
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    postApi.listPosts().then((res) => {
      if (cancelled) return;
      if (res.data) {
        const sorted = [...res.data].sort((a, b) => (a.date < b.date ? 1 : -1));
        setPosts(sorted);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">博客</h1>
          <p className="mt-2 text-muted">技术笔记与思考。</p>
        </div>
        <Link
          to="/admin/posts"
          className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          写文章
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-muted">加载中…</p>
      ) : posts.length === 0 ? (
        <p className="mt-10 text-muted">暂无文章。</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-colors hover:border-accent">
                {post.cover && (
                  <div className="aspect-video w-full overflow-hidden bg-bg">
                    <img
                      src={post.cover}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <time className="text-xs text-muted" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-2 text-lg font-semibold text-ink group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{post.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
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
