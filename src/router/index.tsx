import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import FrontLayout from '@/components/layout/Layout';
import AdminLayout from '@/admin/layout/AdminLayout';
import RouteGuard from '@/admin/components/RouteGuard';

// 页面级代码分割
const Home = lazy(() => import('@/pages/Home'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AdminLogin = lazy(() => import('@/admin/pages/Login'));
const Dashboard = lazy(() => import('@/admin/pages/Dashboard'));
const Settings = lazy(() => import('@/admin/pages/Settings'));

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<div className="p-8 text-center text-muted">加载中…</div>}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: 'projects', element: withSuspense(<Projects />) },
      { path: 'projects/:slug', element: withSuspense(<ProjectDetail />) },
      { path: 'blog', element: withSuspense(<Blog />) },
      { path: 'blog/:slug', element: withSuspense(<BlogDetail />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: '/admin/login',
    element: withSuspense(<AdminLogin />),
  },
  {
    path: '/admin',
    element: (
      <RouteGuard>
        <AdminLayout />
      </RouteGuard>
    ),
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: 'settings', element: withSuspense(<Settings />) },
      // 后续迭代：posts / projects / skills 管理页
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
