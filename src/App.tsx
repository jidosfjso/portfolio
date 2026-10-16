import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { AuthProvider } from '@/admin/auth/useAuth';

// 根组件：挂载路由表，并用 AuthProvider 包裹以共享后台登录态。
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
