import { useEffect, useRef, useState } from 'react';
import MarkdownRenderer from '@/features/markdown/MarkdownRenderer';

// Markdown 编辑器：编辑 / 分屏 / 预览三种模式，实时预览。
// 预览内容做 200ms 防抖，避免长文档下每次按键都全量解析 Markdown。
// 供后台博客、项目管理复用。

type Mode = 'edit' | 'split' | 'preview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MODES: { key: Mode; label: string }[] = [
  { key: 'edit', label: '编辑' },
  { key: 'split', label: '分屏' },
  { key: 'preview', label: '预览' },
];

const PREVIEW_DEBOUNCE_MS = 200;

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>('split');
  const [preview, setPreview] = useState(value);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setPreview(value), PREVIEW_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [value]);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* 工具栏 */}
      <div className="flex items-center gap-1 border-b border-border bg-card px-2 py-1.5">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`rounded px-2.5 py-1 text-xs transition-colors ${
              mode === m.key ? 'bg-accent/20 text-accent' : 'text-muted hover:text-ink'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className={mode === 'split' ? 'grid grid-cols-1 md:grid-cols-2' : ''}>
        {mode !== 'preview' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="在此输入 Markdown 内容…"
            aria-label="Markdown 内容"
            className="min-h-72 w-full resize-y border-border bg-bg px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none focus:border-accent md:border-r"
          />
        )}
        {mode !== 'edit' && (
          <div className="min-h-72 overflow-auto border-t border-border px-4 py-3 md:border-t-0">
            <MarkdownRenderer content={preview} />
          </div>
        )}
      </div>
    </div>
  );
}
