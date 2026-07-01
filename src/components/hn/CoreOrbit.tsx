import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { HN_APPS } from "@/lib/hn/data";
import { TONE_TEXT } from "@/components/hn/primitives";

/** HN Core orbital center — every application orbits the brain. */
export function CoreOrbit() {
  const apps = HN_APPS.filter((a) => a.id !== "add").slice(0, 8);
  const [hover, setHover] = useState<string | null>(null);

  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const rInner = 80;
  const rOrbit = 210;

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size, maxWidth: "100%" }}
    >
      {/* Orbit rings */}
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
          const active = hover === app.id;
          return (
            <line
              key={app.id}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={active ? "oklch(0.72 0.19 295)" : "url(#line-grad)"}
              strokeWidth={active ? 1.6 : 0.8}
              opacity={active ? 1 : 0.55}
              style={{ transition: "all 220ms ease" }}
            />
          );
        })}

        {/* Traveling pulses along each line */}
        {apps.map((app, i) => {
          const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * rOrbit;
          const y = cy + Math.sin(angle) * rOrbit;
          return (
            <motion.circle
              key={`p-${app.id}`}
              r={2.4}
              fill="oklch(0.85 0.18 295)"
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
                onMouseEnter={() => setHover(app.id)}
                onMouseLeave={() => setHover(null)}
                className="group flex flex-col items-center"
              >
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl hn-glass-strong ring-1 ring-white/10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-violet/60 ${
                    hover === app.id ? "scale-110" : ""
                  }`}
                >
                  <Icon className={`h-6 w-6 ${TONE_TEXT[app.tone]}`} />
                  <span
                    className={`pointer-events-none absolute -inset-2 rounded-3xl bg-violet/20 blur-xl transition-opacity ${
                      hover === app.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
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
        style={{
          left: cx,
          top: cy,
          transform: "translate(-50%,-50%)",
        }}
      >
        <Link
          to="/core"
          className="group relative flex items-center justify-center"
          style={{ width: rInner * 2, height: rInner * 2 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-sky to-cyan opacity-70 blur-2xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-background/80 ring-2 ring-violet/40 backdrop-blur-xl group-hover:ring-violet/70">
            <BrainCircuit className="h-7 w-7 text-violet" />
            <div className="mt-1 font-display text-sm font-bold text-foreground">
              HN Core
            </div>
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
              Central Brain
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
