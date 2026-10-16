import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/admin/auth/useAuth';

// 后台顶栏：当前用户信息 + 登出。

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-bg px-6 py-3">
      <span className="text-sm text-muted">欢迎，{user?.displayName ?? '管理员'}</span>
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
