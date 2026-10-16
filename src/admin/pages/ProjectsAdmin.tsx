import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectApi } from '@/api';
import type { Project } from '@/types';
import { Input, Textarea } from '@/admin/components/FormField';
import ConfirmDialog from '@/admin/components/ConfirmDialog';
import MarkdownEditor from '@/admin/components/MarkdownEditor';
import { projectSchema, type ProjectFormValues, splitTags, joinTags } from '@/lib/validators';

type Feedback = { type: 'success' | 'error'; text: string } | null;

// 项目管理：Markdown 实时预览编辑，增删改，删除二次确认。

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { slug: '', title: '', summary: '', content: '', cover: '', tags: '', links: [], date: '' },
  });

  const linkFields = useFieldArray({ control, name: 'links' });

  const load = useCallback(async () => {
    const res = await projectApi.listProjects();
    if (res.data) setProjects(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startAdd = () => {
    setEditing(null);
    reset({ slug: '', title: '', summary: '', content: '', cover: '', tags: '', links: [], date: '' });
    setFeedback(null);
  };

  const startEdit = (project: Project) => {
    setEditing(project);
    reset({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      content: project.content,
      cover: project.cover,
      tags: joinTags(project.tags),
      links: project.links.map((l) => ({ label: l.label, url: l.url })),
      date: project.date,
    });
    setFeedback(null);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    const payload = {
      slug: values.slug,
      title: values.title,
      summary: values.summary,
      content: values.content,
      cover: values.cover ?? '',
      tags: splitTags(values.tags),
      links: values.links,
      date: values.date,
    };
    const res = editing
      ? await projectApi.updateProject(editing.id, payload)
      : await projectApi.createProject(payload);
    if (res.success) {
      setFeedback({ type: 'success', text: editing ? '已更新' : '已添加' });
      setEditing(null);
      reset({ slug: '', title: '', summary: '', content: '', cover: '', tags: '', links: [], date: '' });
      load();
    } else {
      setFeedback({ type: 'error', text: res.message ?? '操作失败' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await projectApi.removeProject(deleteTarget.id);
    if (res.success) {
      setFeedback({ type: 'success', text: '已删除' });
      load();
    } else {
      setFeedback({ type: 'error', text: res.message ?? '删除失败' });
    }
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-ink">项目管理</h1>
      <p className="mt-2 text-muted">新增、编辑或删除项目。</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 rounded-lg border border-border bg-card p-5"
      >
        <h2 className="font-medium text-ink">{editing ? '编辑项目' : '新增项目'}</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="标题" placeholder="项目名称" error={errors.title?.message} {...register('title')} />
          <Input
            label="slug"
            placeholder="my-project"
            hint="用于路由 /projects/:slug"
            error={errors.slug?.message}
            {...register('slug')}
          />
          <Input label="日期" type="date" error={errors.date?.message} {...register('date')} />
        </div>

        <Input label="封面 URL" placeholder="https://…（可留空）" className="mt-4" {...register('cover')} />
        <Input
          label="标签"
          placeholder="用逗号分隔，如：React, TypeScript"
          className="mt-4"
          {...register('tags')}
        />
        <Textarea label="摘要" rows={2} placeholder="一句话摘要" className="mt-4" error={errors.summary?.message} {...register('summary')} />

        {/* 项目链接 */}
        <section className="mt-4 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">相关链接（Demo / 源码）</span>
            <button
              type="button"
              onClick={() => linkFields.append({ label: '', url: '' })}
              className="text-sm text-accent hover:underline"
            >
              + 添加链接
            </button>
          </div>
          {linkFields.fields.length === 0 && (
            <p className="mt-2 text-sm text-muted">暂无链接。</p>
          )}
          <div className="mt-2 space-y-2">
            {linkFields.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3">
                <Input
                  label="名称"
                  placeholder="如 Demo"
                  error={errors.links?.[index]?.label?.message}
                  className="flex-1"
                  {...register(`links.${index}.label`)}
                />
                <Input
                  label="链接"
                  placeholder="https://"
                  error={errors.links?.[index]?.url?.message}
                  className="flex-1"
                  {...register(`links.${index}.url`)}
                />
                <button
                  type="button"
                  onClick={() => linkFields.remove(index)}
                  aria-label="删除该链接"
                  className="mt-6 text-sm text-red-400 hover:underline"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4">
          <span className="block text-sm text-muted">详情（Markdown）</span>
          <Controller
            control={control}
            name="content"
            render={({ field }) => <MarkdownEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.content && (
            <p role="alert" className="mt-1 text-xs text-red-400">
              {errors.content.message}
            </p>
          )}
        </div>

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

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        {projects.length === 0 ? (
          <p className="p-6 text-center text-muted">暂无项目。</p>
        ) : (
          <ul className="divide-y divide-border">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1">
                  <p className="font-medium text-ink">{project.title}</p>
                  <p className="text-xs text-muted">
                    {project.date} · {project.tags.join(', ')}
                  </p>
                </div>
                <button type="button" onClick={() => startEdit(project)} className="text-sm text-accent hover:underline">
                  编辑
                </button>
                <button type="button" onClick={() => setDeleteTarget(project)} className="text-sm text-red-400 hover:underline">
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="删除项目"
        description={`确定要删除「${deleteTarget?.title ?? ''}」吗？此操作不可撤销。`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
