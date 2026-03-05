import { ReactNode, forwardRef, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { AppRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  requiredDomain?: string;
}

// Use forwardRef to avoid React warnings when used with React Router v7
export const ProtectedRoute = forwardRef<HTMLDivElement, ProtectedRouteProps>(
  function ProtectedRoute({ children, requiredRole, requiredDomain }, ref) {
    const { user, isLoading, hasRole, canAccessDomain } = useAuth();
    const location = useLocation();
    const [serverVerified, setServerVerified] = useState<boolean | null>(
      requiredRole ? null : true
    );

    // Server-side role verification for role-gated routes
    useEffect(() => {
      if (!requiredRole || !user) {
        setServerVerified(requiredRole ? null : true);
        return;
      }

      let cancelled = false;
      const verify = async () => {
        try {
          const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: requiredRole });
          if (!cancelled) setServerVerified(data === true);
        } catch {
          if (!cancelled) setServerVerified(false);
        }
      };
      verify();

      return () => { cancelled = true; };
    }, [requiredRole, user?.id]);

    if (isLoading || serverVerified === null) {
      return (
        <div ref={ref} className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (requiredRole && (!hasRole(requiredRole) || !serverVerified)) {
      return <Navigate to="/" replace />;
    }

    if (requiredDomain && !canAccessDomain(requiredDomain)) {
      return <Navigate to="/" replace />;
    }

    return <div ref={ref}>{children}</div>;
  }
);
