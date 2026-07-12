-- Reusable demo seed as a function; safe to call multiple times per admin.
CREATE OR REPLACE FUNCTION public.seed_demo_data(_admin uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cust_ids uuid[];
  i int;
BEGIN
  IF _admin IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.customers WHERE user_id = _admin) THEN RETURN; END IF;

  INSERT INTO public.products (user_id, name, sku, price, currency, status)
  SELECT _admin, x.name, x.sku, x.price, 'USD', 'active'
  FROM (VALUES
    ('HN Cloud Starter', 'HNC-START', 29),
    ('HN Cloud Pro', 'HNC-PRO', 99),
    ('HN AI Assistant', 'HN-AI', 49),
    ('HN Builder Suite', 'HN-BUILD', 149),
    ('HN Analytics', 'HN-ANL', 39)
  ) AS x(name, sku, price);

  WITH inserted AS (
    INSERT INTO public.customers (user_id, name, email, status, lifetime_value, last_order_at, created_at)
    SELECT _admin,
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

  FOR i IN 1..60 LOOP
    INSERT INTO public.orders (user_id, customer_id, reference, amount, currency, status, created_at)
    VALUES (_admin, cust_ids[1 + (i % array_length(cust_ids, 1))],
      'ORD-' || lpad(i::text, 5, '0'),
      (random() * 400 + 20)::numeric(12,2), 'USD',
      CASE (i % 10) WHEN 0 THEN 'refunded' WHEN 1 THEN 'pending' WHEN 2 THEN 'failed' ELSE 'completed' END,
      now() - (random() * interval '30 days'));
  END LOOP;

  INSERT INTO public.payments (user_id, order_id, amount, currency, status, provider, created_at)
  SELECT _admin, o.id, o.amount, o.currency,
    CASE WHEN o.status = 'refunded' THEN 'refunded'
         WHEN o.status = 'failed' THEN 'failed'
         WHEN o.status = 'pending' THEN 'pending'
         ELSE 'succeeded' END,
    'stripe', o.created_at
  FROM public.orders o WHERE o.user_id = _admin;

  FOR i IN 1..15 LOOP
    INSERT INTO public.subscriptions (user_id, customer_id, plan, status, amount, currency,
      current_period_start, current_period_end, created_at)
    VALUES (_admin, cust_ids[1 + (i % array_length(cust_ids, 1))],
      CASE (i % 3) WHEN 0 THEN 'starter' WHEN 1 THEN 'pro' ELSE 'business' END,
      CASE WHEN i % 8 = 0 THEN 'expired' ELSE 'active' END,
      (ARRAY[29, 99, 149])[1 + (i % 3)]::numeric(12,2), 'USD',
      now() - interval '10 days', now() + (random() * interval '30 days'),
      now() - (random() * interval '90 days'));
  END LOOP;

  FOR i IN 1..10 LOOP
    INSERT INTO public.invoices (user_id, customer_id, number, amount, currency, status, issued_at, due_at)
    VALUES (_admin, cust_ids[1 + (i % array_length(cust_ids, 1))],
      'INV-' || lpad(i::text, 5, '0'),
      (random() * 800 + 100)::numeric(12,2), 'USD',
      CASE (i % 4) WHEN 0 THEN 'paid' WHEN 1 THEN 'overdue' ELSE 'sent' END,
      now() - (random() * interval '20 days'), now() + (random() * interval '15 days'));
  END LOOP;

  INSERT INTO public.tasks (user_id, title, priority, status, due_at) VALUES
    (_admin, 'مراجعة الطلبات المعلّقة', 'high', 'todo', now() + interval '1 day'),
    (_admin, 'تحديث SSL لموقع hn-groupe.net', 'high', 'in_progress', now() + interval '2 days'),
    (_admin, 'الرد على تذاكر الدعم الحرجة', 'urgent', 'todo', now() + interval '4 hours'),
    (_admin, 'إعداد تقرير المبيعات الأسبوعي', 'medium', 'todo', now() + interval '3 days'),
    (_admin, 'مراجعة عملاء معرّضين للإلغاء', 'medium', 'in_progress', now() + interval '5 days'),
    (_admin, 'اختبار Builder الجديد', 'low', 'todo', now() + interval '7 days');

  INSERT INTO public.notifications (user_id, kind, title, message, is_read) VALUES
    (_admin, 'alert', 'انخفاض في الإيرادات', 'الإيرادات أقل بنسبة 12% مقارنة بالأسبوع الماضي', false),
    (_admin, 'info', 'عميل جديد', 'انضم عميل جديد إلى منصّتك', false),
    (_admin, 'warning', 'شهادة SSL', 'شهادة hn-driver.com تنتهي خلال 14 يوم', false),
    (_admin, 'success', 'دفعة ناجحة', 'تم استلام دفعة $149', true),
    (_admin, 'error', 'دفعة فاشلة', 'محاولة دفع فاشلة تحتاج مراجعة', false);

  INSERT INTO public.calendar_events (user_id, title, kind, start_at, end_at) VALUES
    (_admin, 'اجتماع مراجعة أسبوعية', 'meeting', now() + interval '2 days', now() + interval '2 days 1 hour'),
    (_admin, 'إطلاق ميزة Automation', 'launch', now() + interval '5 days', now() + interval '5 days 2 hours'),
    (_admin, 'صيانة قاعدة البيانات', 'maintenance', now() + interval '7 days', now() + interval '7 days 3 hours'),
    (_admin, 'مكالمة مع عميل Pro', 'call', now() + interval '1 day', now() + interval '1 day 30 minutes');

  INSERT INTO public.support_tickets (user_id, subject, priority, status) VALUES
    (_admin, 'مشكلة في تسجيل الدخول', 'high', 'open'),
    (_admin, 'استفسار عن خطة Pro', 'low', 'pending'),
    (_admin, 'طلب استرجاع مبلغ', 'urgent', 'open'),
    (_admin, 'ميزة مقترحة: تصدير CSV', 'low', 'open');
END $$;

REVOKE EXECUTE ON FUNCTION public.seed_demo_data(uuid) FROM PUBLIC, anon, authenticated;

-- Trigger: whenever an admin role is granted, auto-seed demo data.
CREATE OR REPLACE FUNCTION public.tg_seed_admin_demo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    PERFORM public.seed_demo_data(NEW.user_id);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_admin_role_seed_demo ON public.user_roles;
CREATE TRIGGER on_admin_role_seed_demo
AFTER INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.tg_seed_admin_demo();