# Chapter 03 — Digital Architecture (المعمار الرقمي)

> الطبقات التقنية: Frontend, Backend, DB, AI, Security, Cloud, Search, Memory, Automation, Monitoring.

## Frontend

TanStack Start + React 19 + Tailwind v4. مكوّنات موحّدة عبر HN Design Language. لا CSS مخصّص خارج التوكنز الدلالية.

## Backend

Server Functions (createServerFn) للعمليات الداخلية، وServer Routes للـWebhooks. لا Edge Functions إلا للحالات المبرَّرة.

## Database

PostgreSQL عبر Lovable Cloud. مخطّط موحّد، مفاتيح UUID، RLS على كل جدول، وصلاحيات صريحة GRANT.

## AI Layer

Lovable AI Gateway. توجيه ذكي بين النماذج، ذاكرة طويلة عبر Nawat، حدود أمان (Guardrails).

## Observability

Logs, Metrics, Traces — قابلة للاستعلام من داخل Platform. أي خطأ في أي طبقة يظهر في Command Center.
