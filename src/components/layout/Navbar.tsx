// 前台毛玻璃吸顶导航（骨架）。
// 待迭代：滚动背景强化、移动端汉堡菜单展开逻辑、激活态高亮。

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/projects', label: '项目' },
  { to: '/blog', label: '博客' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="text-lg font-semibold text-ink">
          Portfolio
        </a>

        {/* 桌面导航 */}
        <ul className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <a href={link.to} className="text-sm text-muted transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 移动端汉堡按钮（占位，待实现展开逻辑） */}
        <button
          type="button"
          aria-label="打开菜单"
          className="sm:hidden"
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1 block h-0.5 w-6 bg-ink" />
          <span className="mt-1 block h-0.5 w-6 bg-ink" />
        </button>
      </nav>
    </header>
  );
}
