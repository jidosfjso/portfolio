import { read, remove, write, storageKeys } from './client';
import type { LoginPayload, LoginResponse, ApiResult, AdminUser } from '@/types';

// 演示阶段的账号与「后端」校验逻辑。
// 注意：真实密码不应存放在前端，此处仅用于 localStorage 模拟阶段。
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
    // 只存 token，不存密码
    write(storageKeys.token, token);
    return { success: true, data: { token, user } };
  }

  return { success: false, message: '账号或密码错误' };
}

export async function logout(): Promise<ApiResult<null>> {
  remove(storageKeys.token);
  return { success: true, data: null };
}

export function getToken(): string | null {
  return read<string | null>(storageKeys.token, null);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
