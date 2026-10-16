import { useParams } from 'react-router-dom';

// 博客详情（骨架）：/blog/:slug，待阶段 2 实现 Markdown 渲染 + 代码高亮 + TOC。

export default function BlogDetail() {
  const { slug } = useParams();
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-ink">博客详情</h1>
      <p className="mt-4 text-muted">slug: {slug}（待实现）</p>
    </section>
  );
}
