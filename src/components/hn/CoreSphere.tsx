import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  X,
  BrainCircuit,
  Cloud,
  Database,
  Wrench,
  BarChart3,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TONE_TEXT, type Tone } from "@/components/hn/primitives";

type Node = {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
};

const NODES: Node[] = [
  { id: "ai", name: "AI", href: "/ai-center", icon: BrainCircuit, tone: "violet" },
  { id: "cloud", name: "Cloud", href: "/cloud", icon: Cloud, tone: "sky" },
  { id: "db", name: "DB", href: "/database", icon: Database, tone: "mint" },
  { id: "builder", name: "Builder", href: "/builders", icon: Wrench, tone: "amber" },
  { id: "analytics", name: "Analytics", href: "/analytics", icon: BarChart3, tone: "cyan" },
  { id: "nawat", name: "Nawat", href: "/nawat", icon: Sparkles, tone: "rose" },
];

const RADIUS = 170;

/** Draggable 3D sphere modal for HN Core. Rotate with pointer, click any node to enter. */
export function CoreSphere({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rot, setRot] = useState({ x: -15, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  // Auto-rotate when idle
  useEffect(() => {
    if (!open) return;
    let stopped = false;
    const step = () => {
      if (stopped) return;
      if (!dragging.current) {
        setRot((r) => ({ x: r.x, y: r.y + 0.25 }));
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      stopped = true;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setRot((r) => ({
      x: Math.max(-75, Math.min(75, r.x - dy * 0.4)),
      y: r.y + dx * 0.4,
    }));
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/85 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Cosmic glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.72_0.19_295/0.35),transparent_60%)]" />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full hn-glass-strong ring-1 ring-white/10 text-foreground/80 hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute left-1/2 top-8 -translate-x-1/2 text-center"
          >
            <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              HN Core
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold hn-gradient-text">
              Central Brain — 3D Console
            </h2>
            <p className="mt-1 text-xs text-muted-foreground" dir="rtl">
              اسحب لتدوير الكرة · اضغط أي عنصر للدخول إليه
            </p>
          </motion.div>

          {/* Sphere */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative flex h-[440px] w-[440px] cursor-grab items-center justify-center active:cursor-grabbing touch-none select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* Faint sphere wireframe */}
              <div
                className="absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
                }}
              >
                {[0, 30, 60, 90, 120, 150].map((a) => (
                  <div
                    key={`ring-${a}`}
                    className="absolute inset-0 rounded-full border border-violet/15"
                    style={{ transform: `rotateY(${a}deg)` }}
                  />
                ))}
                {[-60, -30, 0, 30, 60].map((a) => (
                  <div
                    key={`ringx-${a}`}
                    className="absolute inset-0 rounded-full border border-sky/10"
                    style={{ transform: `rotateX(${a}deg)` }}
                  />
                ))}

                {/* Nodes on sphere surface */}
                {NODES.map((n, i) => {
                  // Distribute around equator with slight vertical offset
                  const theta = (i / NODES.length) * Math.PI * 2;
                  const phi = ((i % 2 === 0 ? 1 : -1) * Math.PI) / 8;
                  const x = RADIUS * Math.cos(phi) * Math.cos(theta);
                  const y = RADIUS * Math.sin(phi);
                  const z = RADIUS * Math.cos(phi) * Math.sin(theta);
                  return (
                    <SphereNode
                      key={n.id}
                      node={n}
                      x={x}
                      y={y}
                      z={z}
                      counter={{ x: -rot.x, y: -rot.y }}
                    />
                  );
                })}
              </div>

              {/* Core sphere at center */}
              <motion.div
                className="pointer-events-none absolute h-24 w-24 rounded-full bg-gradient-to-br from-violet via-sky to-cyan blur-md"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="pointer-events-none absolute flex h-16 w-16 items-center justify-center rounded-full bg-background/80 ring-2 ring-violet/50 backdrop-blur-xl">
                <BrainCircuit className="h-6 w-6 text-violet" />
              </div>
            </div>
          </motion.div>

          {/* Footer tagline */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="font-display text-[11px] uppercase tracking-[0.35em] text-muted-foreground/80">
              One Core · Infinite Applications
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground/70" dir="rtl">
              قلب واحد… ومنظومة لا حدود لها
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SphereNode({
  node,
  x,
  y,
  z,
  counter,
}: {
  node: Node;
  x: number;
  y: number;
  z: number;
  counter: { x: number; y: number };
}) {
  const Icon = node.icon;
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Counter-rotate so icons always face viewer */}
      <div
        style={{
          transform: `rotateY(${counter.y}deg) rotateX(${counter.x}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <Link
          to={node.href}
          className="group flex flex-col items-center"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl hn-glass-strong ring-1 ring-white/15 transition-all duration-200 group-hover:scale-110 group-hover:ring-violet/60">
            <Icon className={`h-7 w-7 ${TONE_TEXT[node.tone]}`} />
            <span className="pointer-events-none absolute -inset-2 rounded-3xl bg-violet/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="mt-1.5 whitespace-nowrap rounded-md bg-background/70 px-2 py-0.5 text-[10px] font-medium text-foreground/90 backdrop-blur">
            {node.name}
          </div>
        </Link>
      </div>
    </div>
  );
}
