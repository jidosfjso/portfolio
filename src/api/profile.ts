import { read, write, storageKeys } from './client';
import { seedProfile } from '@/data/seed';
import type { Profile, ApiResult } from '@/types';

export async function getProfile(): Promise<ApiResult<Profile>> {
  await delay(120);
  const profile = read<Profile | null>(storageKeys.profile, null) ?? seedProfile;
  return { success: true, data: profile };
}

export async function updateProfile(data: Omit<Profile, 'id'>): Promise<ApiResult<Profile>> {
  await delay(120);
  const current = read<Profile | null>(storageKeys.profile, null) ?? seedProfile;
  const next: Profile = { ...data, id: current.id };
  write(storageKeys.profile, next);
  return { success: true, data: next };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
