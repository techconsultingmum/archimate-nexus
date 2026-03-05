
-- Fix get_user_roles: add access control so only the user themselves or enterprise architects can call it
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
 RETURNS app_role[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow users to query their own roles, or enterprise architects to query anyone's
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN (
    SELECT COALESCE(array_agg(role), ARRAY[]::app_role[])
    FROM public.user_roles
    WHERE user_id = _user_id
  );
END;
$function$;

-- Fix is_architect: restrict to self or enterprise architect
CREATE OR REPLACE FUNCTION public.is_architect(_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'enterprise_architect') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role != 'viewer'
  );
END;
$function$;

-- Fix can_access_domain: restrict to self or enterprise architect
CREATE OR REPLACE FUNCTION public.can_access_domain(_user_id uuid, _domain architecture_domain)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
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
      OR (ur.role = 'solution_architect' AND _domain IN ('application', 'technology', 'data'))
      OR (ur.role = 'ai_architect' AND _domain IN ('ai', 'data', 'application'))
      OR (ur.role = 'cloud_architect' AND _domain IN ('cloud', 'technology', 'application'))
    )
  );
END;
$function$;
