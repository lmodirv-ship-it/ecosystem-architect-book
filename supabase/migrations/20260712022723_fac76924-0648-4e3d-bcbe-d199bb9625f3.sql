-- ============================================================
-- Phase 1 — Foundations: cron health checks + uptime + demo seed
-- ============================================================

-- 1) Extensions for cron + HTTP
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2) Uptime helper: percentage of successful checks over the last N hours
CREATE OR REPLACE FUNCTION public.site_uptime_pct(_site_id uuid, _hours int DEFAULT 24)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    ROUND(
      (COUNT(*) FILTER (WHERE is_up)::numeric / NULLIF(COUNT(*), 0)::numeric) * 100,
      1
    ),
    NULL
  )
  FROM public.health_checks
  WHERE site_id = _site_id
    AND checked_at >= now() - make_interval(hours => _hours)
$$;

GRANT EXECUTE ON FUNCTION public.site_uptime_pct(uuid, int) TO authenticated, anon;

-- 3) Convenience view: last uptime alongside site row (24h window)
CREATE OR REPLACE VIEW public.sites_with_uptime AS
SELECT
  s.*,
  public.site_uptime_pct(s.id, 24) AS uptime_24h_pct,
  (SELECT COUNT(*) FROM public.health_checks h
     WHERE h.site_id = s.id
       AND h.checked_at >= now() - interval '24 hours') AS checks_24h
FROM public.sites s;

GRANT SELECT ON public.sites_with_uptime TO authenticated;

-- 4) Schedule cron: fire /api/public/hooks/site-health every 5 minutes.
--    Uses pg_net to POST to the stable preview URL (works before publish).
SELECT cron.unschedule('hn-site-health-5min')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'hn-site-health-5min');

SELECT cron.schedule(
  'hn-site-health-5min',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--1a39b49a-314f-408c-840c-d03c89f22933-dev.lovable.app/api/public/hooks/site-health',
    headers := '{"content-type":"application/json"}'::jsonb,
    body := '{"limit":60}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);

-- ============================================================
-- 5) Demo seed for the Owner Dashboard (idempotent, admin-owned)
-- ============================================================
DO $$
DECLARE
  admin_id uuid;
  cust_ids uuid[];
  prod_ids uuid[];
  i int;
BEGIN
  -- Pick first admin. If none exists yet, skip silently.
  SELECT ur.user_id INTO admin_id
  FROM public.user_roles ur
  WHERE ur.role = 'admin'
  ORDER BY ur.id
  LIMIT 1;

  IF admin_id IS NULL THEN
    RAISE NOTICE 'No admin yet; demo seed skipped.';
    RETURN;
  END IF;

  -- Bail if already seeded
  IF EXISTS (SELECT 1 FROM public.customers WHERE user_id = admin_id) THEN
    RAISE NOTICE 'Demo data already present for admin %', admin_id;
    RETURN;
  END IF;

  -- Products
  WITH inserted AS (
    INSERT INTO public.products (user_id, name, sku, price, currency, status)
    SELECT admin_id, x.name, x.sku, x.price, 'USD', 'active'
    FROM (VALUES
      ('HN Cloud Starter', 'HNC-START', 29),
      ('HN Cloud Pro', 'HNC-PRO', 99),
      ('HN AI Assistant', 'HN-AI', 49),
      ('HN Builder Suite', 'HN-BUILD', 149),
      ('HN Analytics', 'HN-ANL', 39)
    ) AS x(name, sku, price)
    RETURNING id
  )
  SELECT array_agg(id) INTO prod_ids FROM inserted;

  -- Customers (20)
  WITH inserted AS (
    INSERT INTO public.customers (user_id, name, email, status, lifetime_value, last_order_at, created_at)
    SELECT
      admin_id,
      'Customer ' || i,
      'customer' || i || '@hn-groupe.net',
      CASE WHEN i % 7 = 0 THEN 'churned' ELSE 'active' END,
      (random() * 2000 + 50)::numeric(12,2),
      now() - (random() * interval '30 days'),
      now() - (random() * interval '180 days')
    FROM generate_series(1, 20) AS i
    RETURNING id
  )
  SELECT array_agg(id) INTO cust_ids FROM inserted;

  -- Orders (60 across last 30 days)
  FOR i IN 1..60 LOOP
    INSERT INTO public.orders (user_id, customer_id, reference, amount, currency, status, created_at)
    VALUES (
      admin_id,
      cust_ids[1 + (i % array_length(cust_ids, 1))],
      'ORD-' || lpad(i::text, 5, '0'),
      (random() * 400 + 20)::numeric(12,2),
      'USD',
      CASE (i % 10)
        WHEN 0 THEN 'refunded'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'failed'
        ELSE 'completed'
      END,
      now() - (random() * interval '30 days')
    );
  END LOOP;

  -- Payments (mirror completed orders)
  INSERT INTO public.payments (user_id, order_id, amount, currency, status, provider, created_at)
  SELECT admin_id, o.id, o.amount, o.currency,
         CASE WHEN o.status = 'refunded' THEN 'refunded'
              WHEN o.status = 'failed' THEN 'failed'
              WHEN o.status = 'pending' THEN 'pending'
              ELSE 'succeeded' END,
         'stripe',
         o.created_at
  FROM public.orders o
  WHERE o.user_id = admin_id;

  -- Subscriptions (15)
  FOR i IN 1..15 LOOP
    INSERT INTO public.subscriptions (
      user_id, customer_id, plan, status, amount, currency,
      current_period_start, current_period_end, created_at
    ) VALUES (
      admin_id,
      cust_ids[1 + (i % array_length(cust_ids, 1))],
      CASE (i % 3) WHEN 0 THEN 'starter' WHEN 1 THEN 'pro' ELSE 'business' END,
      CASE WHEN i % 8 = 0 THEN 'expired' ELSE 'active' END,
      (ARRAY[29, 99, 149])[1 + (i % 3)]::numeric(12,2),
      'USD',
      now() - interval '10 days',
      now() + (random() * interval '30 days'),
      now() - (random() * interval '90 days')
    );
  END LOOP;

  -- Invoices (10)
  FOR i IN 1..10 LOOP
    INSERT INTO public.invoices (user_id, customer_id, number, amount, currency, status, issued_at, due_at)
    VALUES (
      admin_id,
      cust_ids[1 + (i % array_length(cust_ids, 1))],
      'INV-' || lpad(i::text, 5, '0'),
      (random() * 800 + 100)::numeric(12,2),
      'USD',
      CASE (i % 4) WHEN 0 THEN 'paid' WHEN 1 THEN 'overdue' ELSE 'sent' END,
      now() - (random() * interval '20 days'),
      now() + (random() * interval '15 days')
    );
  END LOOP;

  -- Tasks (8)
  INSERT INTO public.tasks (user_id, title, priority, status, due_at)
  VALUES
    (admin_id, 'مراجعة الطلبات المعلّقة', 'high', 'todo', now() + interval '1 day'),
    (admin_id, 'تحديث SSL لموقع hn-groupe.net', 'high', 'in_progress', now() + interval '2 days'),
    (admin_id, 'الرد على تذاكر الدعم الحرجة', 'urgent', 'todo', now() + interval '4 hours'),
    (admin_id, 'إعداد تقرير المبيعات الأسبوعي', 'medium', 'todo', now() + interval '3 days'),
    (admin_id, 'مراجعة عملاء معرّضين للإلغاء', 'medium', 'in_progress', now() + interval '5 days'),
    (admin_id, 'اختبار Builder الجديد', 'low', 'todo', now() + interval '7 days'),
    (admin_id, 'تحديث توثيق Architecture Bible', 'low', 'todo', now() + interval '10 days'),
    (admin_id, 'مزامنة قاعدة بيانات HN Cloud', 'medium', 'todo', now() + interval '2 days');

  -- Notifications (6)
  INSERT INTO public.notifications (user_id, kind, title, message, is_read)
  VALUES
    (admin_id, 'alert', 'انخفاض في الإيرادات', 'الإيرادات أقل بنسبة 12% مقارنة بالأسبوع الماضي', false),
    (admin_id, 'info', 'عميل جديد', 'انضم عميل جديد إلى منصّتك', false),
    (admin_id, 'warning', 'شهادة SSL', 'شهادة hn-driver.com تنتهي خلال 14 يوم', false),
    (admin_id, 'success', 'دفعة ناجحة', 'تم استلام دفعة $149 من Customer 3', true),
    (admin_id, 'error', 'دفعة فاشلة', 'محاولة دفع فاشلة تحتاج مراجعة', false),
    (admin_id, 'info', 'تحديث النظام', 'HN Platform v1.1 متاح للتحديث', false);

  -- Calendar events (5)
  INSERT INTO public.calendar_events (user_id, title, kind, start_at, end_at)
  VALUES
    (admin_id, 'اجتماع مراجعة أسبوعية', 'meeting', now() + interval '2 days', now() + interval '2 days 1 hour'),
    (admin_id, 'إطلاق ميزة Automation', 'launch', now() + interval '5 days', now() + interval '5 days 2 hours'),
    (admin_id, 'صيانة قاعدة البيانات', 'maintenance', now() + interval '7 days', now() + interval '7 days 3 hours'),
    (admin_id, 'مكالمة مع عميل Pro', 'call', now() + interval '1 day', now() + interval '1 day 30 minutes'),
    (admin_id, 'تجديد اشتراك النطاق', 'reminder', now() + interval '10 days', now() + interval '10 days 15 minutes');

  -- Support tickets (4)
  INSERT INTO public.support_tickets (user_id, subject, priority, status)
  VALUES
    (admin_id, 'مشكلة في تسجيل الدخول', 'high', 'open'),
    (admin_id, 'استفسار عن خطة Pro', 'low', 'pending'),
    (admin_id, 'طلب استرجاع مبلغ', 'urgent', 'open'),
    (admin_id, 'ميزة مقترحة: تصدير CSV', 'low', 'open');

  RAISE NOTICE 'Demo data seeded for admin %', admin_id;
END $$;