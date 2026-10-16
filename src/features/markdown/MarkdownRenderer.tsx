import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/github-dark.css';

// 统一 Markdown 渲染器（前台博客详情 + 后台编辑器预览共用）。
// - remark-gfm：表格 / 任务列表等 GFM 语法；
// - rehype-highlight：代码块语法高亮（github-dark 主题）；
// - rehype-slug：为标题生成 id，供 TOC 锚点跳转使用。

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-ink prose-p:text-ink prose-strong:text-ink prose-a:text-accent prose-code:text-ink prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
