// Markdown 编辑器（骨架）：实时预览。
// 待迭代：react-markdown 预览、编辑/预览分屏、受控 value/onChange。

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-64 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent"
      placeholder="在此输入 Markdown 内容…"
    />
  );
}
