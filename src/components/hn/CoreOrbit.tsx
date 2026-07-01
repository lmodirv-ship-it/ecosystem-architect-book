import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { HN_APPS } from "@/lib/hn/data";
import { TONE_TEXT } from "@/components/hn/primitives";
import { CoreSphere } from "@/components/hn/CoreSphere";

/** HN Core orbital center — every application orbits the brain. */
export function CoreOrbit() {
  const apps = HN_APPS.filter((a) => a.id !== "add").slice(0, 8);
  const [hover, setHover] = useState<string | null>(null);
  const [launching, setLaunching] = useState<string | null>(null);
  const [sphereOpen, setSphereOpen] = useState(false);
  const navigate = useNavigate();

  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const rInner = 80;
  const rOrbit = 210;

  const handleLaunch = (id: string, href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLaunching(id);
    // Energy travels from core → app → open
    window.setTimeout(() => {
      navigate({ to: href });
    }, 520);
  };

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size, maxWidth: "100%" }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.72 0.19 295 / 0.55)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="line-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 295 / 0.7)" />
            <stop offset="100%" stopColor="oklch(0.75 0.16 220 / 0.2)" />
          </linearGradient>
        </defs>

        {/* Halo behind core */}
        <circle cx={cx} cy={cy} r={140} fill="url(#core-glow)" />

        {/* Breathing halo ring — pulses every 4s */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={rInner + 10}
          fill="none"
          stroke="oklch(0.78 0.19 295)"
          strokeWidth={1.5}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: [0.55, 0, 0.55], scale: [1, 1.55, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={rInner + 10}
          fill="none"
          stroke="oklch(0.85 0.15 240)"
          strokeWidth={1}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: [0.4, 0, 0.4], scale: [1, 1.8, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Slow rotating outer dashed ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={rOrbit + 24}
            fill="none"
            stroke="oklch(0.72 0.19 295 / 0.28)"
            strokeDasharray="1 10"
          />
        </motion.g>

        {/* Orbit rings */}
        <circle
          cx={cx}
          cy={cy}
          r={rOrbit}
          fill="none"
          stroke="oklch(0.7 0.05 260 / 0.25)"
          strokeDasharray="3 6"
        />
        <circle
          cx={cx}
          cy={cy}
          r={rOrbit - 40}
          fill="none"
          stroke="oklch(0.7 0.05 260 / 0.12)"
        />

        {/* Connection lines core → app */}
        {apps.map((app, i) => {
          const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * rOrbit;
          const y = cy + Math.sin(angle) * rOrbit;
          const active = hover === app.id || launching === app.id;
          return (
            <line
              key={app.id}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={active ? "oklch(0.85 0.2 295)" : "url(#line-grad)"}
              strokeWidth={active ? 2.2 : 0.8}
              opacity={active ? 1 : 0.55}
              style={{ transition: "all 220ms ease" }}
            />
          );
        })}

        {/* Ambient traveling pulses along each line */}
        {apps.map((app, i) => {
          const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * rOrbit;
          const y = cy + Math.sin(angle) * rOrbit;
          return (
            <motion.circle
              key={`p-${app.id}`}
              r={2.4}
              fill="oklch(0.9 0.18 295)"
              initial={{ cx, cy, opacity: 0 }}
              animate={{ cx: [cx, x], cy: [cy, y], opacity: [0, 1, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: (i * 2.4) / apps.length,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Launch pulse: bright bolt core → app, then app glows */}
        {launching &&
          apps
            .filter((a) => a.id === launching)
            .map((app, i) => {
              const idx = apps.findIndex((a) => a.id === app.id);
              const angle = (idx / apps.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(angle) * rOrbit;
              const y = cy + Math.sin(angle) * rOrbit;
              return (
                <motion.circle
                  key={`launch-${i}`}
                  r={6}
                  fill="oklch(0.95 0.2 295)"
                  initial={{ cx, cy, opacity: 1 }}
                  animate={{ cx: x, cy: y, opacity: [1, 1, 0] }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ filter: "drop-shadow(0 0 8px oklch(0.85 0.2 295))" }}
                />
              );
            })}
      </svg>

      {/* Rotating orbit container (icons counter-rotate to stay upright) */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        {apps.map((app, i) => {
          const angle = (i / apps.length) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * rOrbit;
          const y = cy + Math.sin(rad) * rOrbit;
          const Icon = app.icon;
          const isLaunching = launching === app.id;
          return (
            <motion.div
              key={app.id}
              className="absolute"
              style={{ left: x, top: y, translateX: "-50%", translateY: "-50%" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            >
              <Link
                to={app.href}
                onClick={handleLaunch(app.id, app.href)}
                onMouseEnter={() => setHover(app.id)}
                onMouseLeave={() => setHover(null)}
                className="group flex flex-col items-center"
              >
                <motion.div
                  animate={
                    isLaunching
                      ? { scale: [1, 1.35, 1.15], boxShadow: "0 0 40px oklch(0.85 0.2 295)" }
                      : {}
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl hn-glass-strong ring-1 ring-white/10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-violet/60 ${
                    hover === app.id ? "scale-110" : ""
                  }`}
                >
                  <Icon className={`h-6 w-6 ${TONE_TEXT[app.tone]}`} />
                  <span
                    className={`pointer-events-none absolute -inset-2 rounded-3xl bg-violet/20 blur-xl transition-opacity ${
                      hover === app.id || isLaunching ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </motion.div>
                <div className="mt-2 whitespace-nowrap rounded-md bg-background/60 px-1.5 text-[10px] font-medium text-foreground/85 backdrop-blur">
                  {app.name}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Core center */}
      <div
        className="absolute"
        style={{ left: cx, top: cy, transform: "translate(-50%,-50%)" }}
      >
        <button
          type="button"
          onClick={() => setSphereOpen(true)}
          onDoubleClick={() => navigate({ to: "/core" })}
          title="Open 3D Console — double-click to open HN Core page"
          className="group relative flex items-center justify-center"
          style={{ width: rInner * 2, height: rInner * 2 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-sky to-cyan opacity-70 blur-2xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-background/80 ring-2 ring-violet/40 backdrop-blur-xl group-hover:ring-violet/70"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <BrainCircuit className="h-7 w-7 text-violet" />
            <div className="mt-1 font-display text-sm font-bold text-foreground">
              HN Core
            </div>
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
              Tap to enter
            </div>
          </motion.div>
        </button>
      </div>

      {/* Tagline */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center">
        <div className="font-display text-[11px] uppercase tracking-[0.35em] text-muted-foreground/80">
          One Core · Infinite Applications
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground/70" dir="rtl">
          قلب واحد… ومنظومة لا حدود لها
        </div>
      </div>
    </div>
  );
}
