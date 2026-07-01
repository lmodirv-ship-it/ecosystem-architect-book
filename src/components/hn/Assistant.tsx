import { motion } from "framer-motion";
import {
  BrainCircuit,
  Rocket,
  ShieldAlert,
  Sparkles,
  ListChecks,
  RefreshCw,
  Database,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  EnergyLine,
  GlassCard,
  SectionHeader,
  TONE_TEXT,
  type Tone,
} from "@/components/hn/primitives";

type Brief = { icon: LucideIcon; text: string; tone: Tone };

const BRIEF: Brief[] = [
  { icon: Rocket, text: "مشروع واحد بحاجة إلى مراجعة قبل النشر.", tone: "violet" },
  { icon: ShieldAlert, text: "شهادة SSL على نطاقين ستنتهي خلال 12 يومًا.", tone: "rose" },
  { icon: Database, text: "قاعدة بيانات لم تُنسخ احتياطيًا منذ 3 أيام.", tone: "amber" },
  { icon: RefreshCw, text: "تحديث جديد متوفر لـ HN Nawat.", tone: "cyan" },
  { icon: ListChecks, text: "5 مهام معلقة في مركز المشاريع.", tone: "sky" },
];

function greetingAr() {
  const h = new Date().getHours();
  if (h < 5) return "مساء الخير";
  if (h < 12) return "صباح الخير";
  if (h < 17) return "طاب يومك";
  if (h < 22) return "مساء الخير";
  return "ليلة هادئة";
}

export function Assistant() {
  return (
    <GlassCard strong className="relative overflow-hidden p-5" dir="rtl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet/30 blur-3xl" />
      <div className="relative">
        <SectionHeader title="مساعد HN" />
        <EnergyLine className="my-4" />

        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-sky to-cyan"
              animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background ring-1 ring-violet/40">
              <BrainCircuit className="h-6 w-6 text-violet" />
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {greetingAr()} 👋
            </div>
            <div className="font-display text-base font-semibold text-foreground">
              أهلًا، قائد HN
            </div>
            <div className="text-[11px] text-muted-foreground">
              إحاطة اليوم — جاهزة.
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {BRIEF.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                className="flex items-start gap-2.5 rounded-xl hn-glass px-3 py-2"
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${TONE_TEXT[b.tone]}`} />
                <p className="text-[12.5px] leading-relaxed text-foreground/90">
                  {b.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-violet/25 bg-violet/10 p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-violet">
            <Sparkles className="h-3.5 w-3.5" /> توصية اليوم
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">
            أقترح البدء بـ <span className="font-semibold">HN Cloud</span> —
            تجديد شهادات SSL أولوية اليوم.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
