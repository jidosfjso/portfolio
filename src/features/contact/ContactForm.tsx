// 联系表单（骨架）。
// 待迭代：react-hook-form + zod 校验、提交成功/失败反馈。

export default function ContactForm() {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm text-muted">
          姓名
        </label>
        <input
          id="contact-name"
          name="name"
          className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-ink outline-none focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm text-muted">
          邮箱
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-ink outline-none focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm text-muted">
          留言
        </label>
        <textarea
          id="contact-message"
          name="message"
          className="mt-2 min-h-32 w-full rounded-md border border-border bg-bg px-3 py-2 text-ink outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-accent px-5 py-2 font-medium text-white transition-opacity hover:opacity-90"
      >
        发送
      </button>
    </form>
  );
}
