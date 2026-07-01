import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { BrainCircuit, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { z } from "zod";
import { CosmicBackground } from "@/components/hn/CosmicBackground";

const searchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HN Platform" },
      { name: "description", content: "Access the HN Platform command center." },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect, mode: initialMode } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirect ?? "/" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: redirect ?? "/" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب — جارٍ تسجيل الدخول…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("مرحبًا بعودتك.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth",
      });
      if (result.error) throw result.error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تسجيل الدخول بواسطة Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <CosmicBackground />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-3xl hn-glass-strong ring-1 ring-white/10 p-8"
      >
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet via-sky to-cyan">
            <BrainCircuit className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold hn-gradient-text">HN Platform</h1>
          <p className="mt-1 text-sm text-muted-foreground" dir="rtl">
            {mode === "signin" ? "ادخل إلى مركز التحكم" : "أنشئ حسابك للدخول"}
          </p>
        </div>

        <button
          type="button"
          disabled={googleLoading}
          onClick={handleGoogle}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-white text-black py-3 text-sm font-semibold transition hover:bg-white/90 disabled:opacity-70"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 48 48" className="h-4 w-4">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.5l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.4 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.6H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.5z"/>
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.7-2.9-.7-4.7s.3-3.2.7-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-3.9-13.5-9.3l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
            </svg>
          )}
          <span>متابعة عبر Google</span>
        </button>

        <div className="relative my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-muted-foreground">أو</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
          {mode === "signup" && (
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs font-medium text-foreground/80">
                <UserIcon className="h-3.5 w-3.5" /> الاسم
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 outline-none focus:ring-violet/60"
                placeholder="اسمك"
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-xs font-medium text-foreground/80">
              <Mail className="h-3.5 w-3.5" /> البريد
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 outline-none focus:ring-violet/60"
              placeholder="you@hn-groupe.net"
            />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-xs font-medium text-foreground/80">
              <Lock className="h-3.5 w-3.5" /> كلمة السر
            </span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-foreground ring-1 ring-white/10 outline-none focus:ring-violet/60"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet via-sky to-cyan py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground" dir="rtl">
          {mode === "signin" ? (
            <>
              ليس لديك حساب؟{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-semibold text-violet hover:underline"
              >
                أنشئ حسابًا
              </button>
            </>
          ) : (
            <>
              لديك حساب؟{" "}
              <button
                onClick={() => setMode("signin")}
                className="font-semibold text-violet hover:underline"
              >
                سجّل الدخول
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
