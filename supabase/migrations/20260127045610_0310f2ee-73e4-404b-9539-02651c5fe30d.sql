-- Fix: PUBLIC_DATA_EXPOSURE - Restrict profile access to protect email addresses

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy for enterprise architects to view all profiles (for user management)
CREATE POLICY "Enterprise architects can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'enterprise_architect'::app_role));

-- Create a public view with limited fields for user directory features (excludes email)
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
  SELECT 
    id,
    full_name,
    avatar_url,
    created_at
  FROM public.profiles;