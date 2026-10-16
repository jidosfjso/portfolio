import { cn } from '@/lib/cn';

// 基础按钮原子组件。

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md px-5 py-2 font-medium transition-opacity hover:opacity-90',
        variant === 'primary' && 'bg-accent text-white',
        variant === 'ghost' && 'border border-border text-muted hover:text-ink',
        className,
      )}
      {...props}
    />
  );
}
