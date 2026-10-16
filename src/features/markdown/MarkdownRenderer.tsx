import { createElement, useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/github-dark.css';
import type { TocItem } from './Toc';

// 统一 Markdown 渲染器（前台博客详情 + 后台编辑器预览共用）。
// - remark-gfm：表格 / 任务列表等 GFM 语法；
// - rehype-highlight：代码块语法高亮（github-dark 主题）；
// - rehype-slug：为标题生成 id，供 TOC 锚点跳转使用；
// - 通过自定义 h1-h6 组件收集标题，回调 onHeadingsChange 供 Toc 使用。

interface MarkdownRendererProps {
  content: string;
  onHeadingsChange?: (items: TocItem[]) => void;
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return extractText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return '';
}

export default function MarkdownRenderer({ content, onHeadingsChange }: MarkdownRendererProps) {
  const collectedRef = useRef<TocItem[]>([]);
  const lastSigRef = useRef<string>('');

  const heading = (level: number) => (props: { id?: string; children?: ReactNode }) => {
    const id = props.id;
    const text = extractText(props.children);
    if (id && text) {
      collectedRef.current.push({ id, text, level });
    }
    const Tag = `h${level}` as ElementType;
    return createElement(Tag, { id }, props.children);
  };

  useLayoutEffect(() => {
    const items = collectedRef.current;
    collectedRef.current = [];
    if (!onHeadingsChange) return;
    // 签名比对避免相同标题集合导致的无限 setState 循环
    const sig = items.map((i) => `${i.level}:${i.id}:${i.text}`).join('|');
    if (sig !== lastSigRef.current) {
      lastSigRef.current = sig;
      onHeadingsChange(items);
    }
  });

  return (
    <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:text-ink prose-p:text-ink prose-strong:text-ink prose-a:text-accent prose-code:text-ink prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          h1: heading(1),
          h2: heading(2),
          h3: heading(3),
          h4: heading(4),
          h5: heading(5),
          h6: heading(6),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
