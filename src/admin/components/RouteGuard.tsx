import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/admin/auth/useAuth';

// 路由守卫：未登录时重定向到 /admin/login，并记录来源以便登录后回跳。
// 通过 useAuth 读取共享登录态，登出后立即触发重定向。

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthed } = useAuth();

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
