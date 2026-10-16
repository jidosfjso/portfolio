import { cn } from '@/lib/cn';

// 基础卡片原子组件。

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-card', className)}
      {...props}
    />
  );
}
