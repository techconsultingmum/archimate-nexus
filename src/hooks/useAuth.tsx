import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole, Profile, UserRole, ROLE_PERMISSIONS } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  primaryRole: AppRole;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canAccessDomain: (domain: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (rolesData && rolesData.length > 0) {
        setRoles(rolesData.map(r => r.role as AppRole));
      } else {
        setRoles(['viewer']);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  // Get primary role (highest privilege)
  const roleHierarchy: AppRole[] = [
    'enterprise_architect',
    'solution_architect',
    'ai_architect',
    'cloud_architect',
    'application_architect',
    'data_architect',
    'business_architect',
    'viewer',
  ];

  const primaryRole = roles.reduce<AppRole>((highest, current) => {
    const highestIndex = roleHierarchy.indexOf(highest);
    const currentIndex = roleHierarchy.indexOf(current);
    return currentIndex < highestIndex ? current : highest;
  }, 'viewer');

  // Aggregate permissions from all roles
  const permissions = roles.reduce(
    (acc, role) => {
      const rolePerms = ROLE_PERMISSIONS[role];
      return {
        canEdit: acc.canEdit || rolePerms.canEdit,
        canCreate: acc.canCreate || rolePerms.canCreate,
        canDelete: acc.canDelete || rolePerms.canDelete,
        canManageUsers: acc.canManageUsers || rolePerms.canManageUsers,
        domains: [...new Set([...acc.domains, ...rolePerms.domains])],
      };
    },
    { canEdit: false, canCreate: false, canDelete: false, canManageUsers: false, domains: [] as string[] }
  );

  const canAccessDomain = (domain: string) => {
    if (hasRole('enterprise_architect')) return true;
    return permissions.domains.includes(domain.toLowerCase());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        primaryRole,
        isLoading,
        signIn,
        signUp,
        signOut,
        hasRole,
        canEdit: permissions.canEdit,
        canCreate: permissions.canCreate,
        canDelete: permissions.canDelete,
        canManageUsers: permissions.canManageUsers,
        canAccessDomain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
