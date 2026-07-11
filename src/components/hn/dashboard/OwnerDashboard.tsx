import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Users, ShoppingCart, Repeat, CreditCard, TrendingUp, DollarSign,
  Wallet, PackageCheck, AlertTriangle, CheckCircle2, XCircle, Bell,
  UserPlus, FilePlus, Ticket as TicketIcon, Layers, Send, Percent, LinkIcon,
  Calendar as CalendarIcon, Clock, MessageSquare, ArrowUpRight, ShieldCheck,
  Database, Mail, Gauge, HardDrive, Zap, Activity, Sparkles, Loader2,
} from "lucide-react";
import { GlassCard, SectionHeader, EnergyLine, GlowIcon, StatusDot, type Tone } from "@/components/hn/primitives";
import {
  fetchActivityKpis, fetchSalesKpis, fetchSubscriptionKpis, fetchPaymentKpis,
  fetchRevenueSeries, fetchRecentOrders, fetchRecentCustomers, fetchUnreadNotifications,
  fetchOpenTasks, fetchUpcomingEvents, fetchOpenTickets, fetchInventoryCounts,
} from "@/lib/hn/services/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const currency = (n: number) =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(n || 0);
const num = (n: number) => new Intl.NumberFormat("ar-SA").format(n || 0);

export function OwnerDashboard() {
  return (
    <div className="space-y-6" dir="rtl">
      <SiteHeader />
      <KpiActivity />
      <div className="grid gap-6 lg:grid-cols-2">
        <KpiSales />
        <KpiSubscriptions />
      </div>
      <KpiPayments />
      <RevenueChart />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <NotificationsPanel />
      </div>
      <QuickActions />
      <div className="grid gap-6 lg:grid-cols-3">
        <SiteInventory />
        <SystemStatus />
        <PerformancePanel />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TasksPanel />
        <CalendarPanel />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCustomers />
        <SupportPanel />
      </div>
      <HnAiInsights />
    </div>
  );
}

/* -------------------- Header -------------------- */
function SiteHeader() {
  const { user } = useAuth();
  const name = (user?.user_metadata as { display_name?: string } | undefined)?.display_name || user?.email || "HN Owner";
  return (
    <GlassCard strong className="p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet to-sky text-lg font-bold text-primary-foreground ring-1 ring-white/10">
          HN
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-semibold text-foreground">لوحة تحكم {name}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-0.5 text-[11px] font-medium text-mint ring-1 ring-mint/30">
              <StatusDot tone="mint" /> نشط
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/15 px-2.5 py-0.5 text-[11px] font-medium text-violet ring-1 ring-violet/30">
              الخطة: Pro
            </span>
            <span className="text-[11px] text-muted-foreground">التجديد: 15 يوم</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            آخر تسجيل دخول اليوم · {new Date().toLocaleDateString("ar-SA", { dateStyle: "full" })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <HeaderBtn icon={LinkIcon} label="فتح الموقع" tone="sky" />
          <HeaderBtn icon={Bell} label="الإشعارات" tone="amber" />
          <HeaderBtn icon={ShieldCheck} label="إعدادات سريعة" tone="violet" />
        </div>
      </div>
    </GlassCard>
  );
}
function HeaderBtn({ icon: Icon, label, tone }: { icon: typeof LinkIcon; label: string; tone: Tone }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-xl hn-glass px-3 py-2 text-xs text-foreground transition hover:ring-1 hover:ring-violet/40">
      <GlowIcon icon={Icon} tone={tone} size="sm" />
      {label}
    </button>
  );
}

/* -------------------- KPI Sections -------------------- */
function KpiCard({
  icon: Icon, label, value, delta, tone, hint,
}: {
  icon: typeof Users; label: string; value: string | number; delta?: string; tone: Tone; hint?: string;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <GlowIcon icon={Icon} tone={tone} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-semibold text-foreground">{value}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className={cn("truncate", delta?.startsWith("-") ? "text-rose" : "text-mint")}>{delta ?? "—"}</span>
        <span className="text-muted-foreground">{hint}</span>
      </div>
    </GlassCard>
  );
}

function SectionTitle({ title, tone = "violet" as Tone }: { title: string; tone?: Tone }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={cn("h-4 w-1 rounded-full",
        tone === "violet" && "bg-violet",
        tone === "sky" && "bg-sky",
        tone === "cyan" && "bg-cyan",
        tone === "mint" && "bg-mint",
        tone === "amber" && "bg-amber",
        tone === "rose" && "bg-rose",
      )} />
      <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

function KpiActivity() {
  const { data } = useQuery({ queryKey: ["dash", "activity"], queryFn: fetchActivityKpis });
  return (
    <section>
      <SectionTitle title="النشاط" tone="violet" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard icon={Users} tone="violet" label="الزوار اليوم" value={num(0)} hint="قريبًا: Analytics" />
        <KpiCard icon={Activity} tone="sky" label="المستخدمون النشطون" value={num(0)} />
        <KpiCard icon={UserPlus} tone="mint" label="عملاء جدد اليوم" value={num(data?.customersToday ?? 0)} />
        <KpiCard icon={ShoppingCart} tone="amber" label="طلبات جديدة" value={num(data?.ordersToday ?? 0)} />
        <KpiCard icon={Repeat} tone="cyan" label="اشتراكات جديدة" value={num(data?.subsToday ?? 0)} />
      </div>
    </section>
  );
}

function KpiSales() {
  const { data } = useQuery({ queryKey: ["dash", "sales"], queryFn: fetchSalesKpis });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="المبيعات" action={<Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">التفاصيل <ArrowUpRight className="h-3 w-3" /></Link>} />
      <EnergyLine className="my-4" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat icon={DollarSign} tone="mint" label="اليوم" value={currency(data?.salesToday ?? 0)} />
        <MiniStat icon={TrendingUp} tone="sky" label="هذا الشهر" value={currency(data?.salesMonth ?? 0)} />
        <MiniStat icon={Wallet} tone="violet" label="سنوي" value={currency(data?.salesYear ?? 0)} />
        <MiniStat icon={PackageCheck} tone="amber" label="متوسط الطلب" value={currency(data?.avgOrder ?? 0)} />
      </div>
    </GlassCard>
  );
}

function KpiSubscriptions() {
  const { data } = useQuery({ queryKey: ["dash", "subs"], queryFn: fetchSubscriptionKpis });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="الاشتراكات" action={<Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">التفاصيل <ArrowUpRight className="h-3 w-3" /></Link>} />
      <EnergyLine className="my-4" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat icon={CheckCircle2} tone="mint" label="نشطة" value={num(data?.active ?? 0)} />
        <MiniStat icon={XCircle} tone="rose" label="منتهية" value={num(data?.expired ?? 0)} />
        <MiniStat icon={AlertTriangle} tone="amber" label="تنتهي قريبًا" value={num(data?.expiringSoon ?? 0)} />
        <MiniStat icon={Percent} tone="violet" label="معدل التجديد" value={`${data?.renewalRate ?? 0}%`} />
      </div>
    </GlassCard>
  );
}

function KpiPayments() {
  const { data } = useQuery({ queryKey: ["dash", "payments"], queryFn: fetchPaymentKpis });
  return (
    <section>
      <SectionTitle title="المدفوعات" tone="cyan" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={CheckCircle2} tone="mint" label="مدفوعات ناجحة" value={num(data?.succeeded ?? 0)} />
        <KpiCard icon={XCircle} tone="rose" label="مدفوعات فاشلة" value={num(data?.failed ?? 0)} />
        <KpiCard icon={Repeat} tone="amber" label="مبالغ مسترجعة" value={currency(data?.refunded ?? 0)} />
        <KpiCard icon={CreditCard} tone="sky" label="وسائل الدفع" value="Visa · Mada · Apple Pay" />
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, tone, label, value }: { icon: typeof Users; tone: Tone; label: string; value: string }) {
  return (
    <div className="rounded-xl hn-glass p-3">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <GlowIcon icon={Icon} tone={tone} size="sm" />
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-1.5 font-display text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}

/* -------------------- Revenue Chart -------------------- */
function RevenueChart() {
  const { data } = useQuery({ queryKey: ["dash", "revenue-series"], queryFn: () => fetchRevenueSeries(14) });
  const pts = data ?? [];
  const max = Math.max(1, ...pts.map((p) => p.total));
  const width = 800, height = 160, pad = 8;
  const step = pts.length > 1 ? (width - pad * 2) / (pts.length - 1) : 0;
  const points = pts.map((p, i) => {
    const x = pad + i * step;
    const y = height - pad - (p.total / max) * (height - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <GlassCard className="p-5">
      <SectionHeader
        title="نمو الإيرادات (آخر 14 يومًا)"
        action={<span className="text-[11px] text-muted-foreground">SAR</span>}
      />
      <EnergyLine className="my-4" />
      <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
        <defs>
          <linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 295)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.72 0.19 295)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {pts.length > 0 && (
          <>
            <polygon points={`${pad},${height - pad} ${points} ${width - pad},${height - pad}`} fill="url(#rev-fill)" />
            <polyline points={points} fill="none" stroke="oklch(0.72 0.19 295)" strokeWidth="2" />
          </>
        )}
        {pts.length === 0 && (
          <text x="50%" y="50%" textAnchor="middle" fill="oklch(0.65 0.02 280)" fontSize="12">لا توجد بيانات بعد</text>
        )}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {pts.filter((_, i) => i % 3 === 0).map((p) => <span key={p.date}>{p.date.slice(5)}</span>)}
      </div>
    </GlassCard>
  );
}

/* -------------------- Recent Orders -------------------- */
function RecentOrders() {
  const { data, isLoading } = useQuery({ queryKey: ["dash", "recent-orders"], queryFn: () => fetchRecentOrders(6) });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="آخر الطلبات" action={<Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground">عرض الكل</Link>} />
      <EnergyLine className="my-4" />
      {isLoading ? <Loader /> : (data?.length ?? 0) === 0 ? <Empty text="لا توجد طلبات بعد" /> : (
        <div className="divide-y divide-border/50">
          {data!.map((o) => (
            <div key={o.id} className="flex items-center gap-3 py-2.5">
              <GlowIcon icon={ShoppingCart} tone="sky" size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-foreground">{o.reference ?? o.id.slice(0, 8)}</div>
                <div className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleString("ar-SA")}</div>
              </div>
              <StatusPill status={o.status} />
              <div className="w-24 text-left font-mono text-sm text-foreground">{currency(Number(o.amount))}</div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone: Tone =
    status === "completed" || status === "succeeded" || status === "active" || status === "paid" ? "mint" :
    status === "pending" || status === "processing" || status === "draft" || status === "trial" ? "amber" :
    status === "failed" || status === "cancelled" || status === "expired" || status === "overdue" ? "rose" : "sky";
  return (
    <span className={cn(
      "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
      tone === "mint" && "bg-mint/10 text-mint ring-mint/30",
      tone === "amber" && "bg-amber/10 text-amber ring-amber/30",
      tone === "rose" && "bg-rose/10 text-rose ring-rose/30",
      tone === "sky" && "bg-sky/10 text-sky ring-sky/30",
    )}>{status}</span>
  );
}

/* -------------------- Notifications / Alerts -------------------- */
function NotificationsPanel() {
  const { data, isLoading } = useQuery({ queryKey: ["dash", "notifications"], queryFn: fetchUnreadNotifications });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="التنبيهات" action={<span className="text-[11px] text-muted-foreground">{data?.length ?? 0} غير مقروءة</span>} />
      <EnergyLine className="my-4" />
      {isLoading ? <Loader /> : (data?.length ?? 0) === 0 ? (
        <Empty text="لا توجد تنبيهات جديدة" />
      ) : (
        <ul className="space-y-3">
          {data!.map((n) => {
            const tone: Tone = n.kind === "error" ? "rose" : n.kind === "warning" ? "amber" : n.kind === "success" ? "mint" : "violet";
            return (
              <li key={n.id} className="flex items-start gap-3 rounded-xl hn-glass p-3">
                <GlowIcon icon={Bell} tone={tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground">{n.title}</div>
                  {n.message && <div className="text-[11px] text-muted-foreground">{n.message}</div>}
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(n.created_at).toLocaleDateString("ar-SA")}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}

/* -------------------- Quick Actions -------------------- */
function QuickActions() {
  const items = [
    { icon: UserPlus, label: "إضافة عميل", tone: "violet" as Tone },
    { icon: PackageCheck, label: "منتج جديد", tone: "sky" as Tone },
    { icon: Layers, label: "إنشاء خطة", tone: "cyan" as Tone },
    { icon: FilePlus, label: "إرسال فاتورة", tone: "mint" as Tone },
    { icon: Percent, label: "إنشاء كوبون", tone: "amber" as Tone },
    { icon: LinkIcon, label: "صفحة دفع", tone: "rose" as Tone },
    { icon: Send, label: "دعوة موظف", tone: "violet" as Tone },
  ];
  return (
    <GlassCard className="p-5">
      <SectionHeader title="اختصارات سريعة" />
      <EnergyLine className="my-4" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {items.map((it) => (
          <button key={it.label} className="group flex flex-col items-center gap-2 rounded-xl hn-glass p-3 text-center transition hover:ring-1 hover:ring-violet/40">
            <GlowIcon icon={it.icon} tone={it.tone} />
            <span className="text-xs text-foreground">{it.label}</span>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}

/* -------------------- Site inventory / stats -------------------- */
function SiteInventory() {
  const { data } = useQuery({ queryKey: ["dash", "inventory"], queryFn: fetchInventoryCounts });
  const rows: [typeof Users, string, number][] = [
    [Users, "عملاء", data?.customers ?? 0],
    [PackageCheck, "منتجات", data?.products ?? 0],
    [ShoppingCart, "طلبات", data?.orders ?? 0],
    [FilePlus, "فواتير", data?.invoices ?? 0],
    [TicketIcon, "تذاكر", data?.tickets ?? 0],
  ];
  return (
    <GlassCard className="p-5">
      <SectionHeader title="إحصائيات الموقع" />
      <EnergyLine className="my-4" />
      <ul className="space-y-3">
        {rows.map(([Icon, label, val]) => (
          <li key={label} className="flex items-center gap-3">
            <GlowIcon icon={Icon} tone="violet" size="sm" />
            <span className="flex-1 text-sm text-foreground">{label}</span>
            <span className="font-mono text-sm text-foreground">{num(val)}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/* -------------------- System status -------------------- */
function SystemStatus() {
  const rows: { label: string; tone: Tone; icon: typeof Database; value: string }[] = [
    { label: "اتصال HN-PAY", tone: "mint", icon: Zap, value: "متصل" },
    { label: "قاعدة البيانات", tone: "mint", icon: Database, value: "مستقرة" },
    { label: "البريد الإلكتروني", tone: "mint", icon: Mail, value: "يعمل" },
    { label: "Webhooks", tone: "amber", icon: Activity, value: "قيد المراقبة" },
    { label: "النسخ الاحتياطي", tone: "mint", icon: HardDrive, value: "اليوم" },
    { label: "آخر مزامنة", tone: "sky", icon: Clock, value: "قبل دقيقتين" },
    { label: "إصدار النظام", tone: "violet", icon: Sparkles, value: "v1.0.0" },
  ];
  return (
    <GlassCard className="p-5">
      <SectionHeader title="حالة النظام" />
      <EnergyLine className="my-4" />
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3">
            <GlowIcon icon={r.icon} tone={r.tone} size="sm" />
            <span className="flex-1 text-sm text-foreground">{r.label}</span>
            <span className="text-[11px] text-muted-foreground">{r.value}</span>
            <StatusDot tone={r.tone} />
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/* -------------------- Performance -------------------- */
function PerformancePanel() {
  const bars: { label: string; value: number; tone: Tone }[] = [
    { label: "سرعة الموقع", value: 92, tone: "mint" },
    { label: "زمن الاستجابة", value: 78, tone: "sky" },
    { label: "التخزين", value: 34, tone: "violet" },
    { label: "قاعدة البيانات", value: 41, tone: "cyan" },
    { label: "API", value: 66, tone: "amber" },
  ];
  return (
    <GlassCard className="p-5">
      <SectionHeader title="أداء الموقع" action={<Gauge className="h-4 w-4 text-muted-foreground" />} />
      <EnergyLine className="my-4" />
      <ul className="space-y-3">
        {bars.map((b) => (
          <li key={b.label}>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="text-foreground">{b.label}</span>
              <span className="font-mono text-muted-foreground">{b.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
              <div
                className={cn("h-full rounded-full",
                  b.tone === "mint" && "bg-gradient-to-r from-mint to-cyan",
                  b.tone === "sky" && "bg-gradient-to-r from-sky to-violet",
                  b.tone === "violet" && "bg-gradient-to-r from-violet to-sky",
                  b.tone === "cyan" && "bg-gradient-to-r from-cyan to-mint",
                  b.tone === "amber" && "bg-gradient-to-r from-amber to-rose",
                )}
                style={{ width: `${b.value}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/* -------------------- Tasks -------------------- */
function TasksPanel() {
  const { data, isLoading } = useQuery({ queryKey: ["dash", "tasks"], queryFn: () => fetchOpenTasks(6) });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="المهام" action={<Link to="/automation" className="text-xs text-muted-foreground hover:text-foreground">عرض الكل</Link>} />
      <EnergyLine className="my-4" />
      {isLoading ? <Loader /> : (data?.length ?? 0) === 0 ? <Empty text="لا توجد مهام مفتوحة" /> : (
        <ul className="space-y-3">
          {data!.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-xl hn-glass p-3">
              <GlowIcon icon={CheckCircle2} tone={t.priority === "urgent" ? "rose" : t.priority === "high" ? "amber" : "violet"} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-foreground">{t.title}</div>
                <div className="text-[11px] text-muted-foreground">
                  {t.due_at ? `يستحق ${new Date(t.due_at).toLocaleDateString("ar-SA")}` : "بدون موعد"}
                </div>
              </div>
              <StatusPill status={t.status} />
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

/* -------------------- Calendar -------------------- */
function CalendarPanel() {
  const { data, isLoading } = useQuery({ queryKey: ["dash", "events"], queryFn: () => fetchUpcomingEvents(14) });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="التقويم — الأسبوعان القادمان" action={<CalendarIcon className="h-4 w-4 text-muted-foreground" />} />
      <EnergyLine className="my-4" />
      {isLoading ? <Loader /> : (data?.length ?? 0) === 0 ? <Empty text="لا توجد أحداث قادمة" /> : (
        <ul className="space-y-3">
          {data!.map((e) => (
            <li key={e.id} className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-violet/10 ring-1 ring-violet/30">
                <span className="font-mono text-[10px] text-violet">
                  {new Date(e.start_at).toLocaleDateString("ar-SA", { month: "short" })}
                </span>
                <span className="font-display text-sm font-semibold text-foreground">
                  {new Date(e.start_at).getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-foreground">{e.title}</div>
                <div className="text-[11px] text-muted-foreground">{e.kind}</div>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {new Date(e.start_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

/* -------------------- Recent Customers -------------------- */
function RecentCustomers() {
  const { data, isLoading } = useQuery({ queryKey: ["dash", "customers"], queryFn: () => fetchRecentCustomers(5) });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="آخر العملاء" action={<Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground">إدارة</Link>} />
      <EnergyLine className="my-4" />
      {isLoading ? <Loader /> : (data?.length ?? 0) === 0 ? <Empty text="لا يوجد عملاء بعد" /> : (
        <ul className="space-y-3">
          {data!.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet to-sky text-xs font-semibold text-primary-foreground">
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {c.last_order_at ? `آخر عملية: ${new Date(c.last_order_at).toLocaleDateString("ar-SA")}` : "لم يشترِ بعد"}
                </div>
              </div>
              <div className="text-left">
                <div className="font-mono text-sm text-foreground">{currency(Number(c.lifetime_value))}</div>
                <StatusPill status={c.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

/* -------------------- Support Tickets / Messages -------------------- */
function SupportPanel() {
  const { data, isLoading } = useQuery({ queryKey: ["dash", "tickets"], queryFn: fetchOpenTickets });
  return (
    <GlassCard className="p-5">
      <SectionHeader title="الرسائل والدعم" action={<MessageSquare className="h-4 w-4 text-muted-foreground" />} />
      <EnergyLine className="my-4" />
      {isLoading ? <Loader /> : (data?.length ?? 0) === 0 ? <Empty text="لا توجد تذاكر مفتوحة" /> : (
        <ul className="space-y-3">
          {data!.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <GlowIcon icon={TicketIcon} tone={t.priority === "urgent" ? "rose" : t.priority === "high" ? "amber" : "sky"} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-foreground">{t.subject}</div>
                <div className="text-[11px] text-muted-foreground">{new Date(t.created_at).toLocaleString("ar-SA")}</div>
              </div>
              <StatusPill status={t.status} />
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

/* -------------------- HN AI Insights -------------------- */
function HnAiInsights() {
  return (
    <GlassCard strong className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet/10 via-transparent to-sky/10" />
      <div className="relative flex items-start gap-4">
        <GlowIcon icon={Sparkles} tone="violet" size="lg" />
        <div className="min-w-0 flex-1">
          <SectionHeader
            title="لوحة HN AI — رؤى ذكية"
            action={<span className="rounded-full bg-violet/15 px-2.5 py-0.5 text-[10px] font-medium text-violet ring-1 ring-violet/30">قريبًا</span>}
          />
          <ul className="mt-3 grid gap-2 text-sm text-foreground/90 md:grid-cols-2">
            <li className="flex items-start gap-2"><TrendingUp className="mt-0.5 h-4 w-4 text-mint" /> رصد الاتجاهات الأسبوعية للإيرادات.</li>
            <li className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-violet" /> أكثر خدمة مبيعًا هذا الشهر.</li>
            <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber" /> العملاء المعرضون لإلغاء الاشتراك.</li>
            <li className="flex items-start gap-2"><CreditCard className="mt-0.5 h-4 w-4 text-rose" /> تنبيه بمدفوعات فاشلة تحتاج متابعة.</li>
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}

/* -------------------- helpers -------------------- */
function Loader() {
  return (
    <div className="flex items-center justify-center py-10 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-violet" />
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">{text}</div>;
}
