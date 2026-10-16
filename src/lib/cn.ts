// 轻量 className 合并工具（避免额外依赖时的简化实现）

type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
