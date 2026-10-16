import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '@/api';

// 路由守卫：未登录时重定向到 /admin/login，并记录来源以便登录后回跳。

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!authApi.isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
