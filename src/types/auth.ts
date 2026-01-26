export type AppRole = 
  | 'enterprise_architect'
  | 'solution_architect'
  | 'ai_architect'
  | 'cloud_architect'
  | 'application_architect'
  | 'data_architect'
  | 'business_architect'
  | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_at: string;
  assigned_by: string | null;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  enterprise_architect: 'Enterprise Architect',
  solution_architect: 'Solution Architect',
  ai_architect: 'AI Architect',
  cloud_architect: 'Cloud Architect',
  application_architect: 'Application Architect',
  data_architect: 'Data Architect',
  business_architect: 'Business Architect',
  viewer: 'Viewer',
};

export const ROLE_COLORS: Record<AppRole, string> = {
  enterprise_architect: 'bg-role-enterprise text-white',
  solution_architect: 'bg-role-solution text-white',
  ai_architect: 'bg-role-ai text-white',
  cloud_architect: 'bg-role-cloud text-white',
  application_architect: 'bg-role-application text-white',
  data_architect: 'bg-role-data text-white',
  business_architect: 'bg-role-business text-white',
  viewer: 'bg-muted text-muted-foreground',
};

export const ROLE_PERMISSIONS: Record<AppRole, {
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  domains: string[];
}> = {
  enterprise_architect: {
    canEdit: true,
    canCreate: true,
    canDelete: true,
    canManageUsers: true,
    domains: ['business', 'data', 'application', 'technology', 'ai', 'cloud'],
  },
  solution_architect: {
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canManageUsers: false,
    domains: ['application', 'technology', 'data'],
  },
  ai_architect: {
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canManageUsers: false,
    domains: ['ai', 'data', 'application'],
  },
  cloud_architect: {
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canManageUsers: false,
    domains: ['cloud', 'technology', 'application'],
  },
  application_architect: {
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canManageUsers: false,
    domains: ['application'],
  },
  data_architect: {
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canManageUsers: false,
    domains: ['data'],
  },
  business_architect: {
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canManageUsers: false,
    domains: ['business'],
  },
  viewer: {
    canEdit: false,
    canCreate: false,
    canDelete: false,
    canManageUsers: false,
    domains: [],
  },
};
