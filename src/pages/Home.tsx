import Starfield from '@/components/Starfield';
import Hero from '@/components/Hero';

// 首页：Hero 已完成；时间线 / 技能 / 项目 / 联系 待阶段 2 后续实现。

export default function Home() {
  return (
    <>
      <Starfield />
      <Hero />

      {/* 其余模块占位 */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">时间线（待实现）</div>
          <div className="rounded-lg border border-border bg-card p-6">技能（待实现）</div>
          <div className="rounded-lg border border-border bg-card p-6">项目（待实现）</div>
          <div className="rounded-lg border border-border bg-card p-6">联系表单（待实现）</div>
        </div>
      </section>
    </>
  );
}
