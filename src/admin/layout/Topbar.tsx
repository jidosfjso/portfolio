import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api';

// 后台顶栏（骨架）：用户信息 + 登出。

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-bg px-6 py-3">
      <span className="text-sm text-muted">欢迎回来</span>
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm text-muted transition-colors hover:text-ink"
      >
        退出登录
      </button>
    </header>
  );
}
