import { useEffect, useRef } from 'react';

// Canvas 星空粒子背景。
// 性能策略（对应 TECH_DESIGN 4.1）：
// - requestAnimationFrame 驱动，页面不可见时暂停（document.hidden）；
// - <640px 降低粒子数量（40），桌面 150；
// - devicePixelRatio 缩放且上限 2，避免高分屏像素爆炸；
// - 尊重 prefers-reduced-motion：仅静态绘制一帧，不持续动画。

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number; // rad / ms
  twinkleOffset: number;
  accent: boolean;
}

const DPR_CAP = 2;
const MOBILE_BREAKPOINT = 640;
const MOBILE_COUNT = 40;
const DESKTOP_COUNT = 150;
const INK_RGB = '230, 234, 242'; // #E6EAF2
const ACCENT_RGB = '108, 140, 255'; // #6C8CFF

function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    r: Math.random() * 1.2 + 0.3,
    baseAlpha: Math.random() * 0.5 + 0.35,
    twinkleSpeed: Math.random() * 0.0016 + 0.0004,
    twinkleOffset: Math.random() * Math.PI * 2,
    accent: Math.random() < 0.18,
  }));
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId = 0;

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
        const alpha = p.baseAlpha * (0.35 + 0.65 * twinkle);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.accent ? ACCENT_RGB : INK_RGB}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < MOBILE_BREAKPOINT ? MOBILE_COUNT : DESKTOP_COUNT;
      particles = createParticles(count, width, height);
      drawFrame(0);
    };

    const step = (time: number) => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;
      }
      drawFrame(time);
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (prefersReducedMotion) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(step);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        start();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    start();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
