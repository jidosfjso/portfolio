// 目录（TOC）组件（骨架）。
// 待迭代：从标题数据生成目录、点击平滑滚动、当前项高亮。

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocProps {
  items: TocItem[];
}

export default function Toc({ items }: TocProps) {
  return (
    <nav aria-label="目录">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: (item.level - 1) * 12 }}>
            <a href={`#${item.id}`} className="text-sm text-muted hover:text-ink">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
