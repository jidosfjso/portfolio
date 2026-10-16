import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormValues } from '@/lib/validators';
import { Input, Textarea } from '@/admin/components/FormField';

// 联系表单：react-hook-form + zod 校验，提交成功/失败均有明确反馈。
// 当前无后端，提交仅做本地模拟（模拟延迟 + 成功），接入后端时替换为真实请求。

type Feedback = { type: 'success' | 'error'; text: string } | null;

export default function ContactForm() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setFeedback(null);
    try {
      // 模拟提交：接入后端时替换为真实 API 调用
      await new Promise((resolve) => setTimeout(resolve, 600));
      // 真实场景：await contactApi.sendMessage(values);
      console.info('[contact] 留言已提交', values);
      setFeedback({ type: 'success', text: '留言已发送，感谢你的联系！' });
      reset();
    } catch {
      setFeedback({ type: 'error', text: '发送失败，请稍后重试。' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="姓名"
          placeholder="你的称呼"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="邮箱"
          type="email"
          placeholder="hello@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <Textarea
        label="留言"
        rows={5}
        placeholder="想说点什么…"
        error={errors.message?.message}
        {...register('message')}
      />

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
        {isSubmitting ? '发送中…' : '发送留言'}
      </button>
    </form>
  );
}
