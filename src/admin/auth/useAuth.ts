import { useCallback, useState } from 'react';
import { authApi } from '@/api';
import type { LoginPayload, AdminUser } from '@/types';

// 登录态 Hook：基于 localStorage 中的 token 与 user 信息。
// 登录成功后回写 user，供顶栏展示；登出清除。

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => authApi.getCurrentUser());
  const [isAuthed, setIsAuthed] = useState<boolean>(() => authApi.isAuthenticated());

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
