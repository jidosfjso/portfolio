import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/admin/auth/useAuth';
import { Input } from '@/admin/components/FormField';
import { loginSchema, type LoginFormValues } from '@/lib/validators';

// 后台登录页：账号密码登录，zod 校验，登录后回跳来源页。
// 密码不明文存储，仅写入 token（见 src/api/auth.ts）。

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    const ok = await login(values);
    if (ok) {
      const from = (location.state as { from?: string } | null)?.from ?? '/admin';
      navigate(from, { replace: true });
    } else {
      setSubmitError('账号或密码错误');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm rounded-lg border border-border bg-card p-8"
      >
        <h1 className="text-xl font-semibold text-ink">后台登录</h1>
        <p className="mt-1 text-sm text-muted">演示账号：admin / admin123</p>

        {submitError && (
          <p role="alert" className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {submitError}
          </p>
        )}

        <Input
          label="账号"
          autoComplete="username"
          placeholder="请输入账号"
          error={errors.username?.message}
          className="mt-6"
          {...register('username')}
        />

        <Input
          label="密码"
          type="password"
          autoComplete="current-password"
          placeholder="请输入密码"
          error={errors.password?.message}
          className="mt-4"
          {...register('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-accent py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '登录中…' : '登录'}
        </button>
      </form>
    </div>
  );
}
