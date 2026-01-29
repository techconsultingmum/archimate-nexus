-- Fix 1: Drop the overly permissive SELECT policy on architecture_artifacts
-- and replace with domain-based access control
DROP POLICY IF EXISTS "Authenticated users can view artifacts" ON public.architecture_artifacts;

-- Create a more restrictive policy: users can view artifacts in their accessible domains
-- OR viewers can see approved artifacts only
CREATE POLICY "Users can view artifacts in accessible domains" 
ON public.architecture_artifacts 
FOR SELECT 
USING (
  -- Enterprise architects can see everything
  has_role(auth.uid(), 'enterprise_architect'::app_role)
  -- Other architects can see artifacts in their domains
  OR can_access_domain(auth.uid(), domain)
  -- Viewers can only see approved artifacts
  OR (has_role(auth.uid(), 'viewer'::app_role) AND status = 'approved')
);

-- Fix 2: The profiles_public is a VIEW not a table, so we need to handle it differently
-- First, check if it's a view and recreate it properly with security invoker
-- We need to ensure the base profiles table SELECT policy is working correctly

-- Drop the view first
DROP VIEW IF EXISTS public.profiles_public;

-- Recreate the view with security_invoker = true
-- This means the view will use the permissions of the user querying it
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
  SELECT 
    id,
    full_name,
    avatar_url,
    created_at
  FROM public.profiles;

-- Add a permissive SELECT policy for authenticated users to view public profile info
-- This works because profiles_public uses security_invoker, so it inherits RLS from profiles table
-- But since profiles table restricts access, we need a separate approach

-- Create a security definer function to safely get public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.avatar_url, p.created_at
  FROM public.profiles p
  WHERE p.id = profile_id
$$;

-- Create a function to get all public profiles (for listings)
CREATE OR REPLACE FUNCTION public.get_all_public_profiles()
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.avatar_url, p.created_at
  FROM public.profiles p
$$;