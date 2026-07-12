-- Make the uptime view respect the caller's RLS (invoker), not the owner.
ALTER VIEW public.sites_with_uptime SET (security_invoker = on);

-- Restrict uptime helper to signed-in users only.
REVOKE EXECUTE ON FUNCTION public.site_uptime_pct(uuid, int) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.site_uptime_pct(uuid, int) TO authenticated;