-- Drop and recreate the profiles_public view with proper security
-- The view will use security_invoker but we need RLS on the underlying table
-- to control access. Since profiles already has RLS, we need to ensure
-- the view respects it properly.

-- First, drop the existing view
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate the view with security_invoker = true
-- This ensures RLS from the profiles table is enforced
CREATE VIEW public.profiles_public
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.created_at
FROM public.profiles p;

-- Grant select to authenticated users only
REVOKE ALL ON public.profiles_public FROM anon;
REVOKE ALL ON public.profiles_public FROM public;
GRANT SELECT ON public.profiles_public TO authenticated;

-- Add a comment explaining the purpose
COMMENT ON VIEW public.profiles_public IS 'Public profile information (excludes email). Requires authentication.';