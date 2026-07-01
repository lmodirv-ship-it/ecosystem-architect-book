import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Rocket, X } from "lucide-react";
import { toast } from "sonner";
import { createProject } from "@/lib/hn/services/projects";
import type { ProjectKind } from "@/lib/hn/db-types";

const KIND_OPTIONS: { value: ProjectKind; label: string; arabic: string }[] = [
  { value: "website", label: "Website", arabic: "موقع" },
  { value: "application", label: "Application", arabic: "تطبيق ويب" },
  { value: "mobile", label: "Mobile", arabic: "جوّال" },
  { value: "ai", label: "AI Agent", arabic: "ذكاء اصطناعي" },
  { value: "media", label: "Media", arabic: "ميديا" },
  { value: "cloud", label: "Cloud", arabic: "سحابة" },
  { value: "database", label: "Database", arabic: "قاعدة بيانات" },
  { value: "api", label: "API", arabic: "API" },
  { value: "storage", label: "Storage", arabic: "تخزين" },
];

const BUILDER_TO_KIND: Record<string, ProjectKind> = {
  website: "website",
  application: "application",
  mobile: "mobile",
  ai: "ai",
  media: "media",
  cloud: "cloud",
  database: "database",
  design: "application",
  business: "application",
  "project-manager": "application",
};

export function CreateProjectDialog({
  open,
  onClose,
  builder,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  builder?: string;
  onCreated?: (id: string) => void;
}) {
  const qc = useQueryClient();
  const defaultKind: ProjectKind = builder ? (BUILDER_TO_KIND[builder] ?? "website") : "website";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<ProjectKind>(defaultKind);

  const mut = useMutation({
    mutationFn: () =>
      createProject({
        name: name.trim(),
        kind,
        description: description.trim() || undefined,
        builder,
      }),
    onSuccess: (row) => {
      toast.success(`تم إنشاء المشروع «${row.name}»`);
      qc.invalidateQueries({ queryKey: ["projects"] });
      setName("");
      setDescription("");
      onCreated?.(row.id);
      onClose();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "فشل إنشاء المشروع"),
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl hn-glass-strong ring-1 ring-white/10 p-6"
            dir="rtl"
          >
            <button
              onClick={onClose}
              className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-sky">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">مشروع جديد</h2>
                <p className="text-xs text-muted-foreground">
                  ستُسجَّل العملية في Activity Log تلقائيًا.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) {
                  toast.error("أدخل اسم المشروع");
                  return;
                }
                mut.mutate();
              }}
              className="space-y-3"
            >
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-foreground/80">الاسم</span>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: HN Driver v2"
                  className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 outline-none focus:ring-violet/60"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-foreground/80">النوع</span>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as ProjectKind)}
                  className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 outline-none focus:ring-violet/60"
                >
                  {KIND_OPTIONS.map((k) => (
                    <option key={k.value} value={k.value} className="bg-background">
                      {k.arabic} — {k.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-foreground/80">
                  الوصف (اختياري)
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="ماذا سيفعل هذا المشروع؟"
                  className="w-full resize-none rounded-xl bg-white/5 px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 outline-none focus:ring-violet/60"
                />
              </label>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={mut.isPending}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet via-sky to-cyan px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
                >
                  {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  إنشاء
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
