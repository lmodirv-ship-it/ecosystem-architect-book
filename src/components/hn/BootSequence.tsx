import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrainCircuit, Check } from "lucide-react";
import { HN_APPS } from "@/lib/hn/data";
import { TONE_TEXT } from "@/components/hn/primitives";

const BOOT_KEY = "hn-platform-booted-v1";

/** First-load boot animation — connects apps to HN Core one by one. */
export function BootSequence() {
  const apps = HN_APPS.filter((a) => a.id !== "add").slice(0, 7);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(BOOT_KEY)) return;
    setVisible(true);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setStep(i);
      if (i > apps.length) {
        window.clearInterval(id);
        window.setTimeout(() => {
          window.sessionStorage.setItem(BOOT_KEY, "1");
          setVisible(false);
        }, 700);
      }
    }, 340);
    return () => window.clearInterval(id);
  }, [apps.length]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex w-full max-w-md flex-col items-center px-6 text-center">
            <motion.div
              className="relative flex h-24 w-24 items-center justify-center"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-sky to-cyan blur-xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-background ring-2 ring-violet/50">
                <BrainCircuit className="h-7 w-7 text-violet" />
              </div>
            </motion.div>

            <div className="mt-4 font-display text-xl font-bold text-foreground">
              HN Core initializing
            </div>
            <div className="text-xs text-muted-foreground">
              Connecting subsystems…
            </div>

            <ul className="mt-6 w-full space-y-1.5">
              {apps.map((app, i) => {
                const done = i < step;
                const active = i === step;
                const Icon = app.icon;
                return (
                  <motion.li
                    key={app.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{
                      opacity: done || active ? 1 : 0.35,
                      x: 0,
                    }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-lg hn-glass px-3 py-2 text-left"
                  >
                    <Icon className={`h-4 w-4 ${TONE_TEXT[app.tone]}`} />
                    <span className="flex-1 text-sm text-foreground/90">
                      {app.name}
                    </span>
                    {done ? (
                      <Check className="h-3.5 w-3.5 text-mint" />
                    ) : active ? (
                      <span className="font-mono text-[10px] text-violet">
                        connecting…
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        idle
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            <AnimatePresence>
              {step > apps.length && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-full bg-mint/15 px-4 py-1.5 text-xs font-semibold text-mint ring-1 ring-mint/30"
                >
                  HN Platform Ready
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
