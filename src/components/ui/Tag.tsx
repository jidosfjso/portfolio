import { cn } from '@/lib/cn';

// 基础标签原子组件。

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {}

export default function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent',
        className,
      )}
      {...props}
    />
  );
}
