import { readOrSeed, write, storageKeys, delay } from './client';
import { seedProfile } from '@/data/seed';
import type { Profile, ApiResult } from '@/types';

export async function getProfile(): Promise<ApiResult<Profile>> {
  await delay(120);
  const profile = readOrSeed<Profile>(storageKeys.profile, seedProfile);
  return { success: true, data: profile };
}

export async function updateProfile(data: Omit<Profile, 'id'>): Promise<ApiResult<Profile>> {
  await delay(120);
  const current = readOrSeed<Profile>(storageKeys.profile, seedProfile);
  const next: Profile = { ...data, id: current.id };
  write(storageKeys.profile, next);
  return { success: true, data: next };
}
