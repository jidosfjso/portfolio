import { useCallback, useState } from 'react';
import { authApi } from '@/api';
import type { LoginPayload, AdminUser } from '@/types';

// 登录态 Hook：基于 localStorage 中的 token。
// 待迭代：token 过期校验、用户信息持久化。

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(authApi.isAuthenticated());

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    const res = await authApi.login(payload);
    if (res.success && res.data) {
      setUser(res.data.user);
      setIsAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthed(false);
  }, []);

  return { user, isAuthed, login, logout };
}
