// 统一 Markdown 渲染器（骨架）。
// 待迭代：react-markdown + remark-gfm + rehype-highlight（代码高亮）
// + rehype-slug（标题锚点，供 TOC 使用）。

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 骨架阶段先以纯文本占位，阶段 2 接入真实 Markdown 渲染。
  return <div className="prose prose-invert max-w-none">{content}</div>;
}
