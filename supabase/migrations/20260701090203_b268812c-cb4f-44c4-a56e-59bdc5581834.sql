
-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE public.site_status AS ENUM ('online', 'offline', 'degraded', 'unknown');
CREATE TYPE public.project_kind AS ENUM ('website', 'application', 'mobile', 'ai', 'media', 'cloud', 'database', 'api', 'storage');
CREATE TYPE public.project_status AS ENUM ('draft', 'building', 'live', 'archived', 'error');

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- ===== ROLES =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- ===== SITES (Ecosystem Registry) =====
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  app_type TEXT,
  server TEXT,
  version TEXT,
  status public.site_status NOT NULL DEFAULT 'unknown',
  ssl_expires_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  last_latency_ms INTEGER,
  last_status_code INTEGER,
  linked_database TEXT,
  linked_project_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX sites_category_idx ON public.sites(category);
CREATE INDEX sites_status_idx ON public.sites(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sites TO authenticated;
GRANT ALL ON public.sites TO service_role;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sites readable by authenticated" ON public.sites FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage sites" ON public.sites FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors update sites" ON public.sites FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'editor'));

-- ===== HEALTH CHECKS =====
CREATE TABLE public.health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_up BOOLEAN NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  error TEXT
);
CREATE INDEX health_checks_site_time_idx ON public.health_checks(site_id, checked_at DESC);
GRANT SELECT ON public.health_checks TO authenticated;
GRANT ALL ON public.health_checks TO service_role;
ALTER TABLE public.health_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Health checks readable by authenticated" ON public.health_checks FOR SELECT TO authenticated USING (true);

-- ===== PROJECTS (Builder output) =====
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  kind public.project_kind NOT NULL,
  status public.project_status NOT NULL DEFAULT 'draft',
  description TEXT,
  builder TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  linked_site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_id, slug)
);
CREATE INDEX projects_owner_idx ON public.projects(owner_id);
CREATE INDEX projects_kind_idx ON public.projects(kind);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own projects or admins all" ON public.projects FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own projects" ON public.projects FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users update own projects or admins" ON public.projects FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users delete own projects or admins" ON public.projects FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ===== ACTIVITY LOG =====
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX activity_log_created_idx ON public.activity_log(created_at DESC);
CREATE INDEX activity_log_user_idx ON public.activity_log(user_id);
GRANT SELECT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activity readable by authenticated" ON public.activity_log FOR SELECT TO authenticated USING (true);

-- ===== TRIGGERS =====
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER touch_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER touch_sites BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER touch_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Auto-create profile + first admin on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INT;
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  SELECT count(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'viewer');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
