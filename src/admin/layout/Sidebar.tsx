import { NavLink } from 'react-router-dom';

// 后台侧边栏（骨架）。

const items = [
  { to: '/admin', label: '首页', end: true },
  { to: '/admin/settings', label: '个人信息' },
];

export default function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r border-border bg-card">
      <div className="px-5 py-4 text-lg font-semibold text-ink">后台管理</div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-accent/20 text-accent' : 'text-muted hover:text-ink'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
