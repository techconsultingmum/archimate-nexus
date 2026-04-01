
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _role app_role;
  _user_count int;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Check if this is the very first user (bootstrap admin)
  SELECT count(*) INTO _user_count FROM public.user_roles;
  
  IF _user_count = 0 THEN
    -- First user becomes enterprise_architect automatically
    _role := 'enterprise_architect';
  ELSE
    -- Read requested role from signup metadata, default to viewer
    _role := COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'requested_role', ''),
      'viewer'
    )::app_role;
    
    -- Prevent self-assignment of enterprise_architect
    IF _role = 'enterprise_architect' THEN
      _role := 'viewer';
    END IF;
  END IF;
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  RETURN NEW;
END;
$function$;
