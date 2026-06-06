
-- Add explicit NULL auth.uid() guards to all SECURITY DEFINER helpers

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE(id uuid, full_name text, avatar_url text, created_at timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF profile_id != auth.uid() AND NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RAISE EXCEPTION 'access denied';
  END IF;
  RETURN QUERY SELECT p.id, p.full_name, p.avatar_url, p.created_at
  FROM public.profiles p WHERE p.id = profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_all_public_profiles()
RETURNS TABLE(id uuid, full_name text, avatar_url text, created_at timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RETURN QUERY SELECT p.id, p.full_name, p.avatar_url, p.created_at
    FROM public.profiles p WHERE p.id = auth.uid();
  ELSE
    RETURN QUERY SELECT p.id, p.full_name, p.avatar_url, p.created_at
    FROM public.profiles p;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS app_role[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RAISE EXCEPTION 'access denied';
  END IF;
  RETURN (
    SELECT COALESCE(array_agg(role), ARRAY[]::app_role[])
    FROM public.user_roles WHERE user_id = _user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_architect(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RAISE EXCEPTION 'access denied';
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role != 'viewer'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.can_access_domain(_user_id uuid, _domain architecture_domain)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RAISE EXCEPTION 'access denied';
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
    AND (
      ur.role = 'enterprise_architect'
      OR (ur.role = 'business_architect' AND _domain = 'business')
      OR (ur.role = 'data_architect' AND _domain = 'data')
      OR (ur.role = 'application_architect' AND _domain = 'application')
      OR (ur.role = 'solution_architect' AND _domain IN ('application','technology','data'))
      OR (ur.role = 'ai_architect' AND _domain IN ('ai','data','application'))
      OR (ur.role = 'cloud_architect' AND _domain IN ('cloud','technology','application'))
    )
  );
END;
$$;

-- Re-assert EXECUTE revocations (CREATE OR REPLACE doesn't reset grants, but be explicit)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.can_access_domain(uuid, architecture_domain) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_architect(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_public_profile(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_all_public_profiles() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_roles(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_public_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;
