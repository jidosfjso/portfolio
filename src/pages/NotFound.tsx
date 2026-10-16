import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-32 text-center">
      <h1 className="text-5xl font-bold text-ink">404</h1>
      <p className="mt-4 text-muted">页面不存在或已被移动。</p>
      <Link to="/" className="mt-6 inline-block text-accent hover:underline">
        返回首页
      </Link>
    </section>
  );
}
