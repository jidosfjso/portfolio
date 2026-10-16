import { read, remove, write, storageKeys, delay } from './client';
import type { LoginPayload, LoginResponse, ApiResult, AdminUser } from '@/types';

// 演示阶段的账号与「后端」校验逻辑。
// TODO: 接入真实后端后必须删除此处硬编码凭证，改由服务端校验。
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

export async function login(payload: LoginPayload): Promise<ApiResult<LoginResponse>> {
  // 模拟网络延迟
  await delay(300);

  if (payload.username === DEMO_USERNAME && payload.password === DEMO_PASSWORD) {
    const token = `mock-token-${Date.now()}`;
    const user: AdminUser = {
      id: 'admin-1',
      username: DEMO_USERNAME,
      displayName: '站长',
    };
    // 只存 token，不存密码；user 仅存展示信息，不存敏感数据
    write(storageKeys.token, token);
    write(storageKeys.user, user);
    return { success: true, data: { token, user } };
  }

  return { success: false, message: '账号或密码错误' };
}

export async function logout(): Promise<ApiResult<null>> {
  remove(storageKeys.token);
  remove(storageKeys.user);
  return { success: true, data: null };
}

export function getToken(): string | null {
  return read<string | null>(storageKeys.token, null);
}

export function getCurrentUser(): AdminUser | null {
  return read<AdminUser | null>(storageKeys.user, null);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
