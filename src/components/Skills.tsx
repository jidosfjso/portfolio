import type { Skill } from '@/types';
import Tag from '@/components/ui/Tag';

// 技能展示：按 category 分组，每项含名称、熟练度进度条、图标。

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  if (skills.length === 0) {
    return <p className="text-muted">暂无技能。</p>;
  }

  const groups = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([category, list]) => (
        <section key={category}>
          <h3 className="mb-4 text-lg font-semibold text-ink">{category}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((skill) => (
              <div
                key={skill.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    {skill.icon && <span aria-hidden="true">{skill.icon}</span>}
                    {skill.name}
                  </span>
                  <Tag>{skill.level}%</Tag>
                </div>
                <div
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={skill.level}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${skill.name} 熟练度 ${skill.level}%`}
                >
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
