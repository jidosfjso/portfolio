import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

// 根组件：挂载路由表。
export default function App() {
  return <RouterProvider router={router} />;
}
