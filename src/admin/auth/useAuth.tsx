import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '@/api';
import type { LoginPayload, AdminUser } from '@/types';

// 登录态 Context：后台所有组件共享同一份 user / isAuthed，避免各 useAuth 实例状态不同步。

interface AuthContextValue {
  user: AdminUser | null;
  isAuthed: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(() => ({ user, isAuthed, login, logout }), [user, isAuthed, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必须在 <AuthProvider> 内使用');
  }
  return ctx;
}
