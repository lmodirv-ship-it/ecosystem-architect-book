-- 1. Unique constraint required for ecosystem import (upsert on url)
CREATE UNIQUE INDEX IF NOT EXISTS sites_url_key ON public.sites (url);

-- 2. Rewrite demo seed with the REAL column names (owner_id, plan_name, active...)
CREATE OR REPLACE FUNCTION public.seed_demo_data(_admin uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  cust_ids uuid[];
  i int;
BEGIN
  IF _admin IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.customers WHERE owner_id = _admin) THEN RETURN; END IF;

  INSERT INTO public.products (owner_id, name, kind, price, currency, active)
  SELECT _admin, x.name, x.kind::product_kind, x.price, 'SAR', true
  FROM (VALUES
    ('HN Cloud Starter', 'subscription', 109),
    ('HN Cloud Pro', 'subscription', 372),
    ('HN AI Assistant', 'service', 184),
    ('HN Builder Suite', 'digital', 559),
    ('HN Analytics', 'service', 146)
  ) AS x(name, kind, price);

  WITH inserted AS (
    INSERT INTO public.customers (owner_id, name, email, status, lifetime_value, last_order_at, created_at)
    SELECT _admin,
      'عميل ' || i,
      'customer' || i || '@hn-groupe.net',
      (CASE WHEN i % 9 = 0 THEN 'blocked' WHEN i % 7 = 0 THEN 'inactive' WHEN i % 5 = 0 THEN 'vip' ELSE 'active' END)::customer_status,
      (random() * 7500 + 200)::numeric(12,2),
      now() - (random() * interval '30 days'),
      now() - (random() * interval '180 days')
    FROM generate_series(1, 20) AS i
    RETURNING id
  )
  SELECT array_agg(id) INTO cust_ids FROM inserted;

  FOR i IN 1..60 LOOP
    INSERT INTO public.orders (owner_id, customer_id, reference, amount, currency, status, payment_method, created_at)
    VALUES (_admin, cust_ids[1 + (i % array_length(cust_ids, 1))],
      'ORD-' || lpad(i::text, 5, '0'),
      (random() * 1500 + 75)::numeric(12,2), 'SAR',
      (CASE (i % 10) WHEN 0 THEN 'refunded' WHEN 1 THEN 'pending' WHEN 2 THEN 'cancelled' WHEN 3 THEN 'processing' ELSE 'completed' END)::order_status,
      (ARRAY['mada','visa','apple_pay','bank_transfer'])[1 + (i % 4)],
      now() - (random() * interval '30 days'));
  END LOOP;

  INSERT INTO public.payments (owner_id, customer_id, order_id, amount, currency, status, provider, method, processed_at, created_at)
  SELECT _admin, o.customer_id, o.id, o.amount, o.currency,
    (CASE WHEN o.status = 'refunded' THEN 'refunded'
          WHEN o.status = 'cancelled' THEN 'failed'
          WHEN o.status = 'pending' THEN 'pending'
          ELSE 'succeeded' END)::payment_status,
    'stripe', o.payment_method, o.created_at, o.created_at
  FROM public.orders o WHERE o.owner_id = _admin;

  FOR i IN 1..15 LOOP
    INSERT INTO public.subscriptions (owner_id, customer_id, plan_name, price, currency, status, started_at, current_period_end, created_at)
    VALUES (_admin, cust_ids[1 + (i % array_length(cust_ids, 1))],
      (ARRAY['Starter','Pro','Business'])[1 + (i % 3)],
      (ARRAY[109, 372, 559])[1 + (i % 3)]::numeric(12,2), 'SAR',
      (CASE WHEN i % 8 = 0 THEN 'expired' WHEN i % 11 = 0 THEN 'trial' ELSE 'active' END)::subscription_status,
      now() - (random() * interval '90 days'),
      now() + (random() * interval '30 days'),
      now() - (random() * interval '90 days'));
  END LOOP;

  FOR i IN 1..10 LOOP
    INSERT INTO public.invoices (owner_id, customer_id, number, amount, currency, status, due_at, paid_at)
    VALUES (_admin, cust_ids[1 + (i % array_length(cust_ids, 1))],
      'INV-' || lpad(i::text, 5, '0'),
      (random() * 3000 + 400)::numeric(12,2), 'SAR',
      (CASE (i % 4) WHEN 0 THEN 'paid' WHEN 1 THEN 'overdue' WHEN 2 THEN 'sent' ELSE 'draft' END)::invoice_status,
      now() + (random() * interval '15 days'),
      CASE WHEN i % 4 = 0 THEN now() - interval '2 days' ELSE NULL END);
  END LOOP;

  INSERT INTO public.tasks (owner_id, title, priority, status, due_at) VALUES
    (_admin, 'مراجعة الطلبات المعلّقة', 'high', 'todo', now() + interval '1 day'),
    (_admin, 'تحديث SSL لموقع hn-groupe.net', 'high', 'in_progress', now() + interval '2 days'),
    (_admin, 'الرد على تذاكر الدعم الحرجة', 'urgent', 'todo', now() + interval '4 hours'),
    (_admin, 'إعداد تقرير المبيعات الأسبوعي', 'medium', 'todo', now() + interval '3 days'),
    (_admin, 'مراجعة عملاء معرّضين للإلغاء', 'medium', 'in_progress', now() + interval '5 days'),
    (_admin, 'اختبار Builder الجديد', 'low', 'todo', now() + interval '7 days');

  INSERT INTO public.notifications (user_id, kind, title, message, is_read) VALUES
    (_admin, 'warning', 'انخفاض في الإيرادات', 'الإيرادات أقل بنسبة 12% مقارنة بالأسبوع الماضي', false),
    (_admin, 'info', 'عميل جديد', 'انضم عميل جديد إلى منصّتك', false),
    (_admin, 'warning', 'شهادة SSL', 'شهادة hn-driver.com تنتهي خلال 14 يوم', false),
    (_admin, 'success', 'دفعة ناجحة', 'تم استلام دفعة 559 ر.س', true),
    (_admin, 'error', 'دفعة فاشلة', 'محاولة دفع فاشلة تحتاج مراجعة', false);

  INSERT INTO public.calendar_events (owner_id, title, kind, start_at, end_at) VALUES
    (_admin, 'اجتماع مراجعة أسبوعية', 'meeting', now() + interval '2 days', now() + interval '2 days 1 hour'),
    (_admin, 'إطلاق ميزة Automation', 'campaign', now() + interval '5 days', now() + interval '5 days 2 hours'),
    (_admin, 'تجديد اشتراك Pro', 'renewal', now() + interval '7 days', now() + interval '7 days 1 hour'),
    (_admin, 'انتهاء شهادة SSL', 'expiry', now() + interval '14 days', now() + interval '14 days 1 hour');

  INSERT INTO public.support_tickets (owner_id, customer_id, subject, priority, status) VALUES
    (_admin, cust_ids[1], 'مشكلة في تسجيل الدخول', 'high', 'open'),
    (_admin, cust_ids[2], 'استفسار عن خطة Pro', 'low', 'pending'),
    (_admin, cust_ids[3], 'طلب استرجاع مبلغ', 'urgent', 'open'),
    (_admin, cust_ids[4], 'ميزة مقترحة: تصدير CSV', 'low', 'open');
END $function$;

-- 3. Harden the seed trigger: demo data failure must never block signup
CREATE OR REPLACE FUNCTION public.tg_seed_admin_demo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.role = 'admin' THEN
    BEGIN
      PERFORM public.seed_demo_data(NEW.user_id);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'seed_demo_data failed: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
END $function$;

-- 4. Harden signup handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE user_count INT;
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    SELECT count(*) INTO user_count FROM auth.users;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, CASE WHEN user_count <= 1 THEN 'admin'::app_role ELSE 'viewer'::app_role END)
    ON CONFLICT (user_id, role) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  END;
  RETURN NEW;
END $function$;

-- 5. user_roles management for admins
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Read own roles or admin reads all" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. activity_log: own rows only (or admin), and allow writing own entries
DROP POLICY IF EXISTS "Activity readable by authenticated" ON public.activity_log;
CREATE POLICY "Read own activity or admin reads all" ON public.activity_log
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Insert own activity" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 7. Tighten business-table policies from public role to authenticated
DROP POLICY IF EXISTS own_customers ON public.customers;
CREATE POLICY own_customers ON public.customers FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_orders ON public.orders;
CREATE POLICY own_orders ON public.orders FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_payments ON public.payments;
CREATE POLICY own_payments ON public.payments FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_subscriptions ON public.subscriptions;
CREATE POLICY own_subscriptions ON public.subscriptions FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_invoices ON public.invoices;
CREATE POLICY own_invoices ON public.invoices FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_products ON public.products;
CREATE POLICY own_products ON public.products FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_tasks ON public.tasks;
CREATE POLICY own_tasks ON public.tasks FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_tickets ON public.support_tickets;
CREATE POLICY own_tickets ON public.support_tickets FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_events ON public.calendar_events;
CREATE POLICY own_events ON public.calendar_events FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS own_notifications ON public.notifications;
CREATE POLICY own_notifications ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT SELECT, INSERT ON public.activity_log TO authenticated;