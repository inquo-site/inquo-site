
-- 1. Tighten ai_agents RLS: drop public SELECT, add admin-only + authenticated read of safe cols via view
DROP POLICY IF EXISTS "Anyone can view active agents" ON public.ai_agents;

CREATE POLICY "Admins can view all agent fields"
ON public.ai_agents FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Create a safe public view (no system_prompt) for client access
CREATE OR REPLACE VIEW public.ai_agents_public
WITH (security_invoker = on) AS
SELECT
  id, name, description, category, icon, is_premium, is_active,
  monthly_price, yearly_price, one_time_price,
  usd_monthly_price, usd_yearly_price, usd_one_time_price,
  display_order, created_at, updated_at
FROM public.ai_agents
WHERE is_active = true;

-- The view uses security_invoker, so it respects the caller's RLS.
-- We need a permissive SELECT policy specifically scoped to non-sensitive columns,
-- but Postgres RLS is row-level, not column-level. Instead, grant SELECT on the view
-- bypassing table RLS by recreating it with security definer semantics:
DROP VIEW IF EXISTS public.ai_agents_public;

CREATE VIEW public.ai_agents_public AS
SELECT
  id, name, description, category, icon, is_premium, is_active,
  monthly_price, yearly_price, one_time_price,
  usd_monthly_price, usd_yearly_price, usd_one_time_price,
  display_order, created_at, updated_at
FROM public.ai_agents
WHERE is_active = true;

GRANT SELECT ON public.ai_agents_public TO anon, authenticated;

-- 3. Ensure no public SELECT exists on promo_codes (admins-only managed via existing ALL policy)
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Public can view active promo codes" ON public.promo_codes;
