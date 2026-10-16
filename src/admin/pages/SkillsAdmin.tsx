import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillApi } from '@/api';
import type { Skill } from '@/types';
import { Input } from '@/admin/components/FormField';
import ConfirmDialog from '@/admin/components/ConfirmDialog';
import { skillSchema, type SkillFormValues } from '@/lib/validators';

type Feedback = { type: 'success' | 'error'; text: string } | null;

// 技能管理：增删改，删除二次确认。

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: '', category: '', level: 50, icon: '' },
  });

  const level = watch('level');

  const load = useCallback(async () => {
    const res = await skillApi.listSkills();
    if (res.data) setSkills(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startAdd = () => {
    setEditing(null);
    reset({ name: '', category: '', level: 50, icon: '' });
    setFeedback(null);
  };

  const startEdit = (skill: Skill) => {
    setEditing(skill);
    reset({ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon ?? '' });
    setFeedback(null);
  };

  const onSubmit = async (values: SkillFormValues) => {
    const payload = {
      name: values.name,
      category: values.category,
      level: values.level,
      icon: values.icon || undefined,
    };
    const res = editing
      ? await skillApi.updateSkill(editing.id, payload)
      : await skillApi.createSkill(payload);
    if (res.success) {
      setFeedback({ type: 'success', text: editing ? '已更新' : '已添加' });
      setEditing(null);
      reset({ name: '', category: '', level: 50, icon: '' });
      load();
    } else {
      setFeedback({ type: 'error', text: res.message ?? '操作失败' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await skillApi.removeSkill(deleteTarget.id);
    if (res.success) {
      setFeedback({ type: 'success', text: '已删除' });
      load();
    } else {
      setFeedback({ type: 'error', text: res.message ?? '删除失败' });
    }
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-ink">技能管理</h1>
      <p className="mt-2 text-muted">新增、编辑或删除技能。</p>

      {/* 表单 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 rounded-lg border border-border bg-card p-5"
      >
        <h2 className="font-medium text-ink">{editing ? '编辑技能' : '新增技能'}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="技能名称" placeholder="如 React" error={errors.name?.message} {...register('name')} />
          <Input label="分类" placeholder="如 前端 / 后端 / 工具" error={errors.category?.message} {...register('category')} />
        </div>
        <div className="mt-4">
          <label htmlFor="level" className="block text-sm text-muted">
            熟练度（{level}%）
          </label>
          <input
            id="level"
            type="range"
            min={0}
            max={100}
            className="mt-2 w-full accent-[#6c8cff]"
            aria-invalid={!!errors.level}
            {...register('level', { valueAsNumber: true })}
          />
          {errors.level && (
            <p role="alert" className="mt-1 text-xs text-red-400">
              {errors.level.message}
            </p>
          )}
        </div>
        <Input label="图标（可选）" placeholder="图标名或 emoji，可留空" className="mt-4" {...register('icon')} />

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-accent px-5 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {editing ? '保存' : '添加'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={startAdd}
              className="rounded-md border border-border px-5 py-2 text-sm text-muted hover:text-ink"
            >
              取消编辑
            </button>
          )}
        </div>
      </form>

      {feedback && (
        <p
          role="status"
          className={`mt-4 rounded-md px-3 py-2 text-sm ${
            feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}
        >
          {feedback.text}
        </p>
      )}

      {/* 列表 */}
      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        {skills.length === 0 ? (
          <p className="p-6 text-center text-muted">暂无技能。</p>
        ) : (
          <ul className="divide-y divide-border">
            {skills.map((skill) => (
              <li key={skill.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1">
                  <p className="font-medium text-ink">{skill.name}</p>
                  <p className="text-xs text-muted">
                    {skill.category} · {skill.level}%
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(skill)}
                  className="text-sm text-accent hover:underline"
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(skill)}
                  className="text-sm text-red-400 hover:underline"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="删除技能"
        description={`确定要删除「${deleteTarget?.name ?? ''}」吗？此操作不可撤销。`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
