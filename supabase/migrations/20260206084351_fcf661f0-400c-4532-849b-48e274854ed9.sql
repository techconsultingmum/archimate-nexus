-- Fix profiles_public view: Enable RLS properly
-- The view already has security_invoker but needs RLS on the underlying table to work

-- Drop existing view and recreate with proper settings
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate view with security_invoker - this will inherit RLS from profiles table
CREATE VIEW public.profiles_public
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.created_at
FROM public.profiles p;

-- Restrict access properly
REVOKE ALL ON public.profiles_public FROM anon;
REVOKE ALL ON public.profiles_public FROM public;
GRANT SELECT ON public.profiles_public TO authenticated;

-- Add comment
COMMENT ON VIEW public.profiles_public IS 'Public profile data (excludes email). Requires authentication and inherits RLS from profiles table.';