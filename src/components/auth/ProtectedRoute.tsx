import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { AppRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  requiredDomain?: string;
}

export function ProtectedRoute({ children, requiredRole, requiredDomain }: ProtectedRouteProps) {
  const { user, isLoading, hasRole, canAccessDomain } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  return <>{children}</>;
}
