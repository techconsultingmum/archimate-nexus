import { useState, useEffect } from "react";
import { FileText, GitBranch, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABELS, DOMAIN_LABELS, ArchitectureDomain, ArtifactStatus } from "@/types/artifacts";

interface ActivityItem {
  id: string;
  title: string;
  action: string;
  domain: string;
  time: string;
  status: 'updated' | 'created' | 'approved' | 'warning';
}

const statusIcons = {
  updated: FileText,
  linked: GitBranch,
  approved: CheckCircle,
  created: Clock,
  warning: AlertCircle,
};

const statusColors = {
  updated: "text-domain-application",
  linked: "text-domain-data",
  approved: "text-green-500",
  created: "text-muted-foreground",
  warning: "text-domain-business",
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentArtifacts();
  }, []);

  const fetchRecentArtifacts = async () => {
    try {
      const { data, error } = await supabase
        .from('architecture_artifacts')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const formattedActivities: ActivityItem[] = (data || []).map((artifact) => {
        const isNew = new Date(artifact.created_at).getTime() === new Date(artifact.updated_at).getTime();
        const timeDiff = Date.now() - new Date(artifact.updated_at).getTime();
        const timeAgo = formatTimeAgo(timeDiff);
        const domain = artifact.domain as keyof typeof DOMAIN_LABELS;
        const status = artifact.status as keyof typeof STATUS_LABELS;
        
        return {
          id: artifact.id,
          title: artifact.name,
          action: isNew 
            ? `New ${DOMAIN_LABELS[domain]} artifact created` 
            : `Updated to ${STATUS_LABELS[status]}`,
          domain: DOMAIN_LABELS[domain],
          time: timeAgo,
          status: isNew ? 'created' : status === 'approved' ? 'approved' : 'updated',
        };
      });

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching recent artifacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
          <p className="text-xs mt-1">Create artifacts to see activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = statusIcons[activity.status as keyof typeof statusIcons];
            const colorClass = statusColors[activity.status as keyof typeof statusColors];
            
            return (
              <div key={activity.id} className="flex items-start gap-3 group cursor-pointer hover:bg-secondary/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                <div className={cn("mt-0.5", colorClass)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.domain} · {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
