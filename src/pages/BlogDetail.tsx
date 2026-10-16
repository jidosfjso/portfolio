import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postApi } from '@/api';
import type { Post } from '@/types';
import MarkdownRenderer from '@/features/markdown/MarkdownRenderer';
import Toc, { type TocItem } from '@/features/markdown/Toc';
import Tag from '@/components/ui/Tag';

// 博客详情 /blog/:slug：Markdown 渲染（代码高亮 + 标题锚点）+ 自动 TOC。

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('zh-CN');
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setHeadings([]);
    postApi.getPostBySlug(slug).then((res) => {
      if (cancelled) return;
      setPost(res.data ?? null);
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

  if (!post) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">文章不存在</h1>
        <Link to="/blog" className="mt-4 inline-block text-accent hover:underline">
          返回博客列表
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Link to="/blog" className="text-sm text-muted hover:text-accent">
        ← 返回博客
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article>
          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              className="aspect-video w-full rounded-lg border border-border object-cover"
            />
          )}
          <h1 className="mt-6 text-3xl font-bold text-ink sm:text-4xl">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <MarkdownRenderer content={post.content} onHeadingsChange={setHeadings} />
          </div>
        </article>

        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Toc items={headings} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
