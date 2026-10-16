import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/admin/auth/useAuth';

// 后台登录页（骨架）：账号密码登录。
// 待迭代：react-hook-form + zod 校验、错误提示、登录后回跳来源页。

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const ok = await login({
      username: String(form.get('username') ?? ''),
      password: String(form.get('password') ?? ''),
    });
    if (ok) {
      const from = (location.state as { from?: string } | null)?.from ?? '/admin';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-8"
      >
        <h1 className="text-xl font-semibold text-ink">后台登录</h1>
        <label className="mt-6 block text-sm text-muted" htmlFor="username">
          账号
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-ink outline-none focus:border-accent"
        />
        <label className="mt-4 block text-sm text-muted" htmlFor="password">
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-ink outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-accent py-2 font-medium text-white transition-opacity hover:opacity-90"
        >
          登录
        </button>
      </form>
    </div>
  );
}
