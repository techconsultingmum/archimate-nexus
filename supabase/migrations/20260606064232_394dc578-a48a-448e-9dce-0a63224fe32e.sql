
-- 1) Restrict SELECT policy on artifacts to authenticated only
DROP POLICY IF EXISTS "Users can view artifacts in accessible domains" ON public.architecture_artifacts;
CREATE POLICY "Users can view artifacts in accessible domains"
  ON public.architecture_artifacts
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'enterprise_architect'::app_role)
    OR can_access_domain(auth.uid(), domain)
    OR (has_role(auth.uid(), 'viewer'::app_role) AND status = 'approved'::artifact_status)
  );

-- 2) Revoke EXECUTE from anon and authenticated on internal SECURITY DEFINER helpers.
--    These are referenced inside RLS policies / triggers and do not need direct API access.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.can_access_domain(uuid, architecture_domain) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_architect(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_artifact_tags() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Keep these callable by authenticated users (they enforce auth.uid() checks internally):
REVOKE EXECUTE ON FUNCTION public.get_public_profile(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_all_public_profiles() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_all_public_profiles() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_roles(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;
