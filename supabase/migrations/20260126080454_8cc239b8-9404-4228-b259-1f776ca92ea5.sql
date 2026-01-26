-- Create domain enum for architecture artifacts
CREATE TYPE public.architecture_domain AS ENUM (
  'business',
  'data',
  'application',
  'technology',
  'ai',
  'cloud'
);

-- Create artifact type enum
CREATE TYPE public.artifact_type AS ENUM (
  'capability',
  'process',
  'application',
  'service',
  'data_entity',
  'technology_component',
  'ai_model',
  'cloud_resource'
);

-- Create artifact status enum
CREATE TYPE public.artifact_status AS ENUM (
  'draft',
  'under_review',
  'approved',
  'deprecated',
  'retired'
);

-- Create architecture_artifacts table
CREATE TABLE public.architecture_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  domain architecture_domain NOT NULL,
  artifact_type artifact_type NOT NULL,
  status artifact_status NOT NULL DEFAULT 'draft',
  version TEXT NOT NULL DEFAULT '1.0',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.architecture_artifacts ENABLE ROW LEVEL SECURITY;

-- Create function to check if user can access domain
CREATE OR REPLACE FUNCTION public.can_access_domain(_user_id UUID, _domain architecture_domain)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
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
  )
$$;

-- RLS Policies for architecture_artifacts

-- Everyone authenticated can view all artifacts
CREATE POLICY "Authenticated users can view artifacts"
ON public.architecture_artifacts
FOR SELECT
TO authenticated
USING (true);

-- Users with domain access can create artifacts in their domain
CREATE POLICY "Domain architects can create artifacts"
ON public.architecture_artifacts
FOR INSERT
TO authenticated
WITH CHECK (
  can_access_domain(auth.uid(), domain)
);

-- Users with domain access can update artifacts in their domain
CREATE POLICY "Domain architects can update artifacts"
ON public.architecture_artifacts
FOR UPDATE
TO authenticated
USING (can_access_domain(auth.uid(), domain))
WITH CHECK (can_access_domain(auth.uid(), domain));

-- Only enterprise architects can delete artifacts
CREATE POLICY "Enterprise architects can delete artifacts"
ON public.architecture_artifacts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'enterprise_architect'));

-- Trigger for updated_at
CREATE TRIGGER update_architecture_artifacts_updated_at
BEFORE UPDATE ON public.architecture_artifacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();