import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postApi } from '@/api';
import type { Post } from '@/types';
import { Input, Textarea } from '@/admin/components/FormField';
import ConfirmDialog from '@/admin/components/ConfirmDialog';
import MarkdownEditor from '@/admin/components/MarkdownEditor';
import { postSchema, type PostFormValues, splitTags, joinTags } from '@/lib/validators';

type Feedback = { type: 'success' | 'error'; text: string } | null;

// 博客管理：Markdown 实时预览编辑，增删改，删除二次确认。

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { slug: '', title: '', summary: '', content: '', cover: '', tags: '', date: '' },
  });

  const load = useCallback(async () => {
    const res = await postApi.listPosts();
    if (res.data) setPosts(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startAdd = () => {
    setEditing(null);
    reset({ slug: '', title: '', summary: '', content: '', cover: '', tags: '', date: '' });
    setFeedback(null);
  };

  const startEdit = (post: Post) => {
    setEditing(post);
    reset({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      content: post.content,
      cover: post.cover,
      tags: joinTags(post.tags),
      date: post.date,
    });
    setFeedback(null);
  };

  const onSubmit = async (values: PostFormValues) => {
    const payload = {
      slug: values.slug,
      title: values.title,
      summary: values.summary,
      content: values.content,
      cover: values.cover ?? '',
      tags: splitTags(values.tags),
      date: values.date,
    };
    const res = editing
      ? await postApi.updatePost(editing.id, payload)
      : await postApi.createPost(payload);
    if (res.success) {
      setFeedback({ type: 'success', text: editing ? '已更新' : '已发布' });
      setEditing(null);
      reset({ slug: '', title: '', summary: '', content: '', cover: '', tags: '', date: '' });
      load();
    } else {
      setFeedback({ type: 'error', text: res.message ?? '操作失败' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await postApi.removePost(deleteTarget.id);
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
      <h1 className="text-2xl font-bold text-ink">博客管理</h1>
      <p className="mt-2 text-muted">撰写、编辑或删除博客文章。</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 rounded-lg border border-border bg-card p-5"
      >
        <h2 className="font-medium text-ink">{editing ? '编辑文章' : '新建文章'}</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="标题" placeholder="文章标题" error={errors.title?.message} {...register('title')} />
          <Input
            label="slug"
            placeholder="hello-world"
            hint="用于路由 /blog/:slug"
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

        <div className="mt-4">
          <span className="block text-sm text-muted">正文（Markdown）</span>
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
            {editing ? '保存' : '发布'}
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
        {posts.length === 0 ? (
          <p className="p-6 text-center text-muted">暂无文章。</p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1">
                  <p className="font-medium text-ink">{post.title}</p>
                  <p className="text-xs text-muted">
                    {post.date} · {post.tags.join(', ')}
                  </p>
                </div>
                <button type="button" onClick={() => startEdit(post)} className="text-sm text-accent hover:underline">
                  编辑
                </button>
                <button type="button" onClick={() => setDeleteTarget(post)} className="text-sm text-red-400 hover:underline">
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="删除文章"
        description={`确定要删除「${deleteTarget?.title ?? ''}」吗？此操作不可撤销。`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
