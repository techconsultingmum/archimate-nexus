-- Fix profiles_public view security
-- Drop the existing view
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate the view with SECURITY INVOKER to use caller's permissions
CREATE OR REPLACE VIEW public.profiles_public 
WITH (security_invoker = true)
AS 
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.created_at
FROM public.profiles p;

-- Add comment explaining the view's purpose and security
COMMENT ON VIEW public.profiles_public IS 'Public profile view exposing only non-sensitive fields. Uses SECURITY INVOKER to respect RLS policies on the underlying profiles table.';