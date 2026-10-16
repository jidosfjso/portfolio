import { forwardRef } from 'react';

// 后台表单基础字段：统一深色样式 + 无障碍（label 关联 / aria-invalid / aria-describedby）。

function buildIds(id: string | undefined, name: string | undefined) {
  const inputId = id ?? name ?? 'field';
  return { inputId, errorId: `${inputId}-error` };
}

const baseInputClass = (error?: string) =>
  `mt-2 w-full rounded-md border bg-bg px-3 py-2 text-ink outline-none transition-colors focus:border-accent ${
    error ? 'border-red-500/60' : 'border-border'
  }`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, name, className, ...props },
  ref,
) {
  const { inputId, errorId } = buildIds(id, name);
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={baseInputClass(error)}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, name, className, ...props },
  ref,
) {
  const { inputId, errorId } = buildIds(id, name);
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-muted">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={baseInputClass(error)}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});
