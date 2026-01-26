export type ArchitectureDomain = 
  | 'business'
  | 'data'
  | 'application'
  | 'technology'
  | 'ai'
  | 'cloud';

export type ArtifactType = 
  | 'capability'
  | 'process'
  | 'application'
  | 'service'
  | 'data_entity'
  | 'technology_component'
  | 'ai_model'
  | 'cloud_resource';

export type ArtifactStatus = 
  | 'draft'
  | 'under_review'
  | 'approved'
  | 'deprecated'
  | 'retired';

export interface ArchitectureArtifact {
  id: string;
  name: string;
  description: string | null;
  domain: ArchitectureDomain;
  artifact_type: ArtifactType;
  status: ArtifactStatus;
  version: string;
  owner_id: string | null;
  metadata: Record<string, unknown>;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export const DOMAIN_LABELS: Record<ArchitectureDomain, string> = {
  business: 'Business',
  data: 'Data',
  application: 'Application',
  technology: 'Technology',
  ai: 'AI',
  cloud: 'Cloud',
};

export const DOMAIN_COLORS: Record<ArchitectureDomain, string> = {
  business: 'bg-domain-business text-white',
  data: 'bg-domain-data text-white',
  application: 'bg-domain-application text-white',
  technology: 'bg-domain-technology text-white',
  ai: 'bg-domain-ai text-white',
  cloud: 'bg-domain-cloud text-white',
};

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  capability: 'Capability',
  process: 'Process',
  application: 'Application',
  service: 'Service',
  data_entity: 'Data Entity',
  technology_component: 'Technology Component',
  ai_model: 'AI Model',
  cloud_resource: 'Cloud Resource',
};

export const STATUS_LABELS: Record<ArtifactStatus, string> = {
  draft: 'Draft',
  under_review: 'Under Review',
  approved: 'Approved',
  deprecated: 'Deprecated',
  retired: 'Retired',
};

export const STATUS_COLORS: Record<ArtifactStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  under_review: 'bg-yellow-500/20 text-yellow-700 border-yellow-500',
  approved: 'bg-green-500/20 text-green-700 border-green-500',
  deprecated: 'bg-orange-500/20 text-orange-700 border-orange-500',
  retired: 'bg-red-500/20 text-red-700 border-red-500',
};

export const DOMAIN_ARTIFACT_TYPES: Record<ArchitectureDomain, ArtifactType[]> = {
  business: ['capability', 'process'],
  data: ['data_entity'],
  application: ['application', 'service'],
  technology: ['technology_component'],
  ai: ['ai_model'],
  cloud: ['cloud_resource'],
};
