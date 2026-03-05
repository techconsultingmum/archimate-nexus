
-- Harden get_all_public_profiles: restrict to enterprise architects only
CREATE OR REPLACE FUNCTION public.get_all_public_profiles()
 RETURNS TABLE(id uuid, full_name text, avatar_url text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'enterprise_architect') THEN
    -- Non-enterprise architects only get their own profile
    RETURN QUERY SELECT p.id, p.full_name, p.avatar_url, p.created_at
    FROM public.profiles p
    WHERE p.id = auth.uid();
  ELSE
    RETURN QUERY SELECT p.id, p.full_name, p.avatar_url, p.created_at
    FROM public.profiles p;
  END IF;
END;
$function$;

-- Harden get_public_profile: restrict to own profile or enterprise architect
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
 RETURNS TABLE(id uuid, full_name text, avatar_url text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF profile_id != auth.uid() AND NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN QUERY SELECT p.id, p.full_name, p.avatar_url, p.created_at
  FROM public.profiles p
  WHERE p.id = profile_id;
END;
$function$;
