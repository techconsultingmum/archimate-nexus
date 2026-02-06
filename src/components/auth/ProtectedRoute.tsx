import { ReactNode, forwardRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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

    if (isLoading) {
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

    if (requiredRole && !hasRole(requiredRole)) {
      return <Navigate to="/" replace />;
    }

    if (requiredDomain && !canAccessDomain(requiredDomain)) {
      return <Navigate to="/" replace />;
    }

    return <div ref={ref}>{children}</div>;
  }
);
