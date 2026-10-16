import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileApi } from '@/api';
import { Input, Textarea } from '@/admin/components/FormField';
import { profileSchema, type ProfileFormValues } from '@/lib/validators';

// 个人信息管理：react-hook-form + zod，社交链接 / 时间线支持增删。

type Feedback = { type: 'success' | 'error'; text: string } | null;

export default function Settings() {
  const [feedback, setFeedback] = useState<Feedback>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      email: '',
      socials: [],
      timeline: [],
    },
  });

  const socialFields = useFieldArray({ control, name: 'socials' });
  const timelineFields = useFieldArray({ control, name: 'timeline' });

  useEffect(() => {
    let cancelled = false;
    profileApi.getProfile().then((res) => {
      if (cancelled || !res.data) return;
      const p = res.data;
      reset({
        name: p.name,
        title: p.title,
        bio: p.bio,
        avatar: p.avatar,
        email: p.email,
        socials: p.socials.map((s) => ({ label: s.label, url: s.url })),
        timeline: p.timeline.map((t) => ({
          period: t.period,
          title: t.title,
          description: t.description,
        })),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setFeedback(null);
    const res = await profileApi.updateProfile({
      name: values.name,
      title: values.title,
      bio: values.bio ?? '',
      avatar: values.avatar ?? '',
      email: values.email,
      socials: values.socials.map((s) => ({ id: crypto.randomUUID(), ...s })),
      timeline: values.timeline.map((t) => ({
        id: crypto.randomUUID(),
        period: t.period,
        title: t.title,
        description: t.description ?? '',
      })),
    });
    setFeedback(
      res.success
        ? { type: 'success', text: '保存成功' }
        : { type: 'error', text: res.message ?? '保存失败' },
    );
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">个人信息管理</h1>
      <p className="mt-2 text-muted">编辑姓名、定位、简介、联系方式与时间线。</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="姓名" placeholder="你的名字" error={errors.name?.message} {...register('name')} />
          <Input label="定位" placeholder="如：前端开发工程师" error={errors.title?.message} {...register('title')} />
        </div>

        <Input label="邮箱" type="email" placeholder="hello@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="头像 URL" placeholder="https://…（可留空）" hint="留空时展示姓名首字" {...register('avatar')} />
        <Textarea label="简介" rows={3} placeholder="一句话介绍自己" error={errors.bio?.message} {...register('bio')} />

        {/* 社交链接 */}
        <section className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-ink">社交链接</h2>
            <button
              type="button"
              onClick={() => socialFields.append({ label: '', url: '' })}
              className="text-sm text-accent hover:underline"
            >
              + 添加链接
            </button>
          </div>
          {socialFields.fields.length === 0 && (
            <p className="mt-3 text-sm text-muted">暂无社交链接。</p>
          )}
          <div className="mt-3 space-y-3">
            {socialFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3">
                <Input
                  label="名称"
                  placeholder="如 GitHub"
                  error={errors.socials?.[index]?.label?.message}
                  className="flex-1"
                  {...register(`socials.${index}.label`)}
                />
                <Input
                  label="链接"
                  placeholder="https://"
                  error={errors.socials?.[index]?.url?.message}
                  className="flex-1"
                  {...register(`socials.${index}.url`)}
                />
                <button
                  type="button"
                  onClick={() => socialFields.remove(index)}
                  aria-label="删除该链接"
                  className="mt-6 text-sm text-red-400 hover:underline"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 时间线 */}
        <section className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-ink">时间线</h2>
            <button
              type="button"
              onClick={() => timelineFields.append({ period: '', title: '', description: '' })}
              className="text-sm text-accent hover:underline"
            >
              + 添加经历
            </button>
          </div>
          {timelineFields.fields.length === 0 && (
            <p className="mt-3 text-sm text-muted">暂无经历。</p>
          )}
          <div className="mt-3 space-y-4">
            {timelineFields.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-md border border-border p-3">
                <div className="flex items-start gap-3">
                  <Input
                    label="时间区间"
                    placeholder="如 2021 – 至今"
                    error={errors.timeline?.[index]?.period?.message}
                    className="flex-1"
                    {...register(`timeline.${index}.period`)}
                  />
                  <Input
                    label="标题"
                    placeholder="职位 / 学历"
                    error={errors.timeline?.[index]?.title?.message}
                    className="flex-1"
                    {...register(`timeline.${index}.title`)}
                  />
                </div>
                <Textarea
                  label="描述"
                  rows={2}
                  placeholder="简要说明"
                  error={errors.timeline?.[index]?.description?.message}
                  {...register(`timeline.${index}.description`)}
                />
                <button
                  type="button"
                  onClick={() => timelineFields.remove(index)}
                  className="text-sm text-red-400 hover:underline"
                >
                  删除该条
                </button>
              </div>
            ))}
          </div>
        </section>

        {feedback && (
          <p
            role="status"
            className={`rounded-md px-3 py-2 text-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {feedback.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-accent px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '保存中…' : '保存'}
        </button>
      </form>
    </div>
  );
}
