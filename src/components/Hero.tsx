import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '@/api';
import type { Profile } from '@/types';

// 首页 Hero：头像、姓名、一句话定位、简介、行动按钮、社交链接。
// 数据来自 src/api（localStorage 模拟），与后台个人信息管理打通。

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let cancelled = false;
    profileApi.getProfile().then((res) => {
      if (!cancelled && res.success && res.data) setProfile(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <span className="text-muted">加载中…</span>
      </section>
    );
  }

  const initial = profile.name.trim().charAt(0) || '?';

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* 头像 */}
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-accent/40 bg-card text-3xl font-bold text-accent sm:h-28 sm:w-28">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.name} 的头像`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{initial}</span>
          )}
        </div>

        {/* 姓名 */}
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {profile.name}
        </h1>

        {/* 一句话定位（渐变强调） */}
        <p
          className="mt-4 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl"
          style={{ backgroundImage: 'linear-gradient(90deg, #6c8cff, #38bdf8)' }}
        >
          {profile.title}
        </p>

        {/* 简介 */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {profile.bio}
        </p>

        {/* 行动按钮 */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/projects"
            className="rounded-md bg-accent px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            查看项目
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md border border-border px-6 py-3 font-medium text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            联系我
          </a>
        </div>

        {/* 社交链接 */}
        {profile.socials.length > 0 && (
          <ul className="mt-8 flex items-center gap-5">
            {profile.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
