/**
 * Dashboard aggregation queries — powers /_app/ (Owner Dashboard).
 * Every query is scoped to the current owner via RLS (auth.uid()).
 */
import { supabase } from "@/integrations/supabase/client";

// Loose type helper because generated types may not include the new tables yet.
// deno-lint-ignore no-explicit-any
const sb = supabase as unknown as any;

export type Kpi = { value: number; delta?: number };

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}
function daysAgo(n: number) {
  const x = new Date();
  x.setDate(x.getDate() - n);
  return x.toISOString();
}

async function count(table: string, filters: Record<string, unknown> = {}) {
  let q = sb.from(table).select("*", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const { count: c } = await q;
  return c ?? 0;
}
async function countGte(table: string, col: string, value: string) {
  const { count: c } = await sb.from(table).select("*", { count: "exact", head: true }).gte(col, value);
  return c ?? 0;
}
async function sumAmount(table: string, since?: string, extraStatus?: string) {
  let q = sb.from(table).select("amount");
  if (since) q = q.gte("created_at", since);
  if (extraStatus) q = q.eq("status", extraStatus);
  const { data } = await q;
  return (data ?? []).reduce((s: number, r: { amount: number | string }) => s + Number(r.amount || 0), 0);
}

export async function fetchActivityKpis() {
  const today = startOfDay();
  const [customersToday, ordersToday, subsToday] = await Promise.all([
    countGte("customers", "created_at", today),
    countGte("orders", "created_at", today),
    countGte("subscriptions", "created_at", today),
  ]);
  return { customersToday, ordersToday, subsToday };
}

export async function fetchSalesKpis() {
  const today = startOfDay();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();

  const [salesToday, salesMonth, salesYear, orderCount] = await Promise.all([
    sumAmount("orders", today, "completed"),
    sumAmount("orders", monthStart.toISOString(), "completed"),
    sumAmount("orders", yearStart, "completed"),
    count("orders", { status: "completed" }),
  ]);
  const avgOrder = orderCount ? salesMonth / orderCount : 0;
  return { salesToday, salesMonth, salesYear, avgOrder };
}

export async function fetchSubscriptionKpis() {
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  const [active, expired, expiringSoon] = await Promise.all([
    count("subscriptions", { status: "active" }),
    count("subscriptions", { status: "expired" }),
    sb
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .lte("current_period_end", soon.toISOString())
      .then((r: { count: number | null }) => r.count ?? 0),
  ]);
  const total = active + expired || 1;
  const renewalRate = Math.round((active / total) * 100);
  return { active, expired, expiringSoon, renewalRate };
}

export async function fetchPaymentKpis() {
  const [succeeded, failed, refundedRows] = await Promise.all([
    count("payments", { status: "succeeded" }),
    count("payments", { status: "failed" }),
    sb.from("payments").select("refunded_amount"),
  ]);
  const refunded = (refundedRows.data ?? []).reduce(
    (s: number, r: { refunded_amount: number | string }) => s + Number(r.refunded_amount || 0),
    0,
  );
  return { succeeded, failed, refunded };
}

export async function fetchRevenueSeries(days = 14) {
  const since = daysAgo(days);
  const { data } = await sb
    .from("payments")
    .select("amount, created_at, status")
    .gte("created_at", since)
    .eq("status", "succeeded");
  const buckets: { date: string; total: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    buckets.push({ date: d.toISOString().slice(0, 10), total: 0 });
  }
  for (const row of (data ?? []) as { amount: number | string; created_at: string }[]) {
    const key = row.created_at.slice(0, 10);
    const b = buckets.find((x) => x.date === key);
    if (b) b.total += Number(row.amount || 0);
  }
  return buckets;
}

export async function fetchRecentOrders(limit = 5) {
  const { data } = await sb
    .from("orders")
    .select("id, reference, amount, currency, status, created_at, customer_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as {
    id: string;
    reference: string | null;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    customer_id: string | null;
  }[];
}

export async function fetchRecentCustomers(limit = 5) {
  const { data } = await sb
    .from("customers")
    .select("id, name, avatar_url, lifetime_value, status, last_order_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as {
    id: string;
    name: string;
    avatar_url: string | null;
    lifetime_value: number;
    status: string;
    last_order_at: string | null;
    created_at: string;
  }[];
}

export async function fetchUnreadNotifications() {
  const { data } = await sb
    .from("notifications")
    .select("*")
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(10);
  return (data ?? []) as {
    id: string;
    kind: string;
    title: string;
    message: string | null;
    link: string | null;
    created_at: string;
  }[];
}

export async function fetchOpenTasks(limit = 6) {
  const { data } = await sb
    .from("tasks")
    .select("*")
    .in("status", ["todo", "in_progress"])
    .order("due_at", { ascending: true, nullsFirst: false })
    .limit(limit);
  return (data ?? []) as {
    id: string;
    title: string;
    priority: string;
    status: string;
    due_at: string | null;
  }[];
}

export async function fetchUpcomingEvents(days = 14) {
  const now = new Date().toISOString();
  const until = new Date();
  until.setDate(until.getDate() + days);
  const { data } = await sb
    .from("calendar_events")
    .select("*")
    .gte("start_at", now)
    .lte("start_at", until.toISOString())
    .order("start_at", { ascending: true })
    .limit(8);
  return (data ?? []) as {
    id: string;
    title: string;
    kind: string;
    start_at: string;
  }[];
}

export async function fetchOpenTickets() {
  const { data } = await sb
    .from("support_tickets")
    .select("*")
    .in("status", ["open", "pending"])
    .order("created_at", { ascending: false })
    .limit(5);
  return (data ?? []) as {
    id: string;
    subject: string;
    priority: string;
    status: string;
    created_at: string;
  }[];
}

export async function fetchInventoryCounts() {
  const [customers, products, orders, invoices, tickets] = await Promise.all([
    count("customers"),
    count("products"),
    count("orders"),
    count("invoices"),
    count("support_tickets"),
  ]);
  return { customers, products, orders, invoices, tickets };
}
