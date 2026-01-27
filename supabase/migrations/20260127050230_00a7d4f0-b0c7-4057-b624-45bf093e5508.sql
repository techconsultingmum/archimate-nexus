-- Fix 1: MISSING_RLS - Add DELETE policy for profiles (GDPR compliance)
-- Enterprise architects can delete any profile for user management
CREATE POLICY "Enterprise architects can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'enterprise_architect'::app_role));

-- Fix 2: INPUT_VALIDATION - Add server-side validation for architecture_artifacts

-- Add constraint for name field (required, max 100 chars)
ALTER TABLE public.architecture_artifacts
ADD CONSTRAINT artifact_name_length CHECK (
  char_length(name) > 0 AND char_length(name) <= 100
);

-- Add constraint for description field (optional, max 1000 chars)
ALTER TABLE public.architecture_artifacts
ADD CONSTRAINT artifact_description_length CHECK (
  description IS NULL OR char_length(description) <= 1000
);

-- Add constraint for version field (semver-like format)
ALTER TABLE public.architecture_artifacts
ADD CONSTRAINT artifact_version_format CHECK (
  version ~ '^[0-9]+\.[0-9]+(\.[0-9]+)?(-[a-zA-Z0-9]+)?$'
);

-- Create validation trigger for tags array
CREATE OR REPLACE FUNCTION public.validate_artifact_tags()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Check max number of tags (20)
  IF NEW.tags IS NOT NULL AND array_length(NEW.tags, 1) > 20 THEN
    RAISE EXCEPTION 'Too many tags (maximum 20 allowed)';
  END IF;
  
  -- Check max length per tag (50 chars)
  IF NEW.tags IS NOT NULL AND EXISTS (
    SELECT 1 FROM unnest(NEW.tags) AS tag 
    WHERE char_length(tag) > 50
  ) THEN
    RAISE EXCEPTION 'Tag too long (maximum 50 characters per tag)';
  END IF;
  
  -- Check for empty tags after trimming
  IF NEW.tags IS NOT NULL AND EXISTS (
    SELECT 1 FROM unnest(NEW.tags) AS tag 
    WHERE char_length(trim(tag)) = 0
  ) THEN
    RAISE EXCEPTION 'Empty tags are not allowed';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for tag validation on insert and update
CREATE TRIGGER validate_artifact_tags_trigger
  BEFORE INSERT OR UPDATE ON public.architecture_artifacts
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_artifact_tags();