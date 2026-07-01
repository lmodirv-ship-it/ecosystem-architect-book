import { useEffect, useRef } from "react";

/** Animated cosmic backdrop: twinkling stars + drifting particles + connections + data streams. */
export function CosmicBackground({ density = 60 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    type Star = { x: number; y: number; r: number; phase: number; speed: number };
    type Stream = { x: number; y: number; len: number; speed: number; hue: number };
    let pts: P[] = [];
    let stars: Star[] = [];
    let streams: Stream[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      }));
      stars = Array.from({ length: Math.floor(density * 1.6) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.9 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.2,
      }));
      streams = Array.from({ length: 8 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 40 + Math.random() * 90,
        speed: 0.4 + Math.random() * 0.9,
        hue: Math.random() > 0.5 ? 295 : 220,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Twinkling stars
      for (const s of stars) {
        const a = 0.35 + 0.45 * Math.sin(t * s.speed + s.phase);
        ctx.fillStyle = `oklch(0.95 0.02 260 / ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Data streams (vertical falling lines)
      for (const st of streams) {
        st.y += st.speed;
        if (st.y - st.len > h) {
          st.y = -st.len;
          st.x = Math.random() * w;
        }
        const grad = ctx.createLinearGradient(st.x, st.y - st.len, st.x, st.y);
        grad.addColorStop(0, `oklch(0.75 0.16 ${st.hue} / 0)`);
        grad.addColorStop(1, `oklch(0.8 0.18 ${st.hue} / 0.55)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y - st.len);
        ctx.lineTo(st.x, st.y);
        ctx.stroke();
      }

      // Drifting particles + connections
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const alpha = 1 - Math.sqrt(d2) / 140;
            ctx.strokeStyle = `oklch(0.72 0.19 295 / ${alpha * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "oklch(0.85 0.15 240 / 0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,oklch(0.72_0.19_295/0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,oklch(0.75_0.16_220/0.12),transparent_55%)]" />
    </div>
  );
}
