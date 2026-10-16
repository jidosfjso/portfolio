import { useEffect, useState } from 'react';

// 目录（TOC）组件：从 MarkdownRenderer 收集的标题生成，点击平滑滚动到对应锚点，
// 并通过 IntersectionObserver 高亮当前可见标题。

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocProps {
  items: TocItem[];
}

export default function Toc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="目录" className="text-sm">
      <p className="mb-3 font-semibold text-ink">目录</p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: (item.level - 1) * 12 }}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 -ml-px pl-3 transition-colors ${
                activeId === item.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
