import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, ROLE_COLORS, ROLE_PERMISSIONS, AppRole } from '@/types/auth';
import { User, Shield, Layers, Edit3, Plus, Trash2, Users } from 'lucide-react';

export function UserDashboard() {
  const { profile, roles, primaryRole, canEdit, canCreate, canDelete, canManageUsers } = useAuth();

  const permissions = ROLE_PERMISSIONS[primaryRole];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          My Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-lg font-semibold text-primary-foreground">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium">{profile?.full_name || 'User'}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>My Roles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge key={role} className={ROLE_COLORS[role]}>
                {ROLE_LABELS[role]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Layers className="h-4 w-4" />
            <span>Permissions</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PermissionBadge enabled={canEdit} icon={Edit3} label="Edit" />
            <PermissionBadge enabled={canCreate} icon={Plus} label="Create" />
            <PermissionBadge enabled={canDelete} icon={Trash2} label="Delete" />
            <PermissionBadge enabled={canManageUsers} icon={Users} label="Manage Users" />
          </div>
        </div>

        {/* Accessible Domains */}
        {permissions.domains.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Accessible Domains</p>
            <div className="flex flex-wrap gap-1">
              {permissions.domains.map((domain) => (
                <Badge key={domain} variant="outline" className="text-xs capitalize">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PermissionBadge({ 
  enabled, 
  icon: Icon, 
  label 
}: { 
  enabled: boolean; 
  icon: React.ComponentType<{ className?: string }>; 
  label: string;
}) {
  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
        enabled 
          ? 'bg-accent/10 text-accent' 
          : 'bg-muted text-muted-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}
