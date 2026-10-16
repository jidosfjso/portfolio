import type { TimelineItem } from '@/types';

// 个人介绍时间线：单列纵向，宽屏下左右交错增强视觉节奏。

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  if (items.length === 0) {
    return <p className="text-muted">暂无经历。</p>;
  }

  return (
    <ol className="relative">
      {/* 中心线 */}
      <span
        aria-hidden="true"
        className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"
      />
      {items.map((item, index) => {
        const leftSide = index % 2 === 0;
        return (
          <li
            key={item.id}
            className={`relative mb-8 flex md:mb-12 ${
              leftSide ? 'md:justify-start' : 'md:justify-end'
            }`}
          >
            {/* 节点圆点 */}
            <span
              aria-hidden="true"
              className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-bg md:left-1/2"
            />
            <div
              className={`ml-10 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
                leftSide ? 'md:mr-auto md:pr-8 md:text-right' : 'md:ml-auto md:pl-8'
              }`}
            >
              <span className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent">
                {item.period}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
