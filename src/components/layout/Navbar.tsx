import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// 前台毛玻璃吸顶导航：滚动时背景加深，NavLink 激活态高亮。
// 移动端汉堡菜单：抽屉式，点击链接 / 遮罩 / Esc 关闭，焦点可访问。

const navLinks = [
  { to: '/', label: '首页', end: true },
  { to: '/projects', label: '项目' },
  { to: '/blog', label: '博客' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // 打开抽屉时锁定背景滚动 + 监听 Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${isActive ? 'text-accent' : 'text-muted hover:text-ink'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-lg font-semibold text-ink" aria-label="返回首页">
          Portfolio
        </NavLink>

        {/* 桌面导航 */}
        <ul className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 移动端汉堡按钮 */}
        <button
          type="button"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center sm:hidden"
        >
          <span className="sr-only">菜单</span>
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`}
          />
          <span
            className={`mt-1 block h-0.5 w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`mt-1 block h-0.5 w-6 bg-ink transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
          />
        </button>
      </nav>

      {/* 移动端抽屉 */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[57px] z-40 bg-bg/95 backdrop-blur-md sm:hidden"
          onClick={() => setOpen(false)}
        >
          <ul className="flex flex-col gap-1 p-4" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-4 py-3 text-base transition-colors ${
                      isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-card hover:text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
