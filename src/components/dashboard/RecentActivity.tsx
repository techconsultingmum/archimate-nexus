import { FileText, GitBranch, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "artifact",
    title: "Customer Management Application",
    action: "Updated architecture diagram",
    user: "Sarah Chen",
    time: "2 hours ago",
    status: "updated",
  },
  {
    id: 2,
    type: "requirement",
    title: "REQ-0142: API Gateway Implementation",
    action: "Linked to Phase D deliverable",
    user: "Michael Ross",
    time: "4 hours ago",
    status: "linked",
  },
  {
    id: 3,
    type: "approval",
    title: "Technology Reference Model v2.1",
    action: "Approved by Architecture Review Board",
    user: "Jennifer Wu",
    time: "1 day ago",
    status: "approved",
  },
  {
    id: 4,
    type: "baseline",
    title: "Q4 2024 Target Architecture",
    action: "Baseline created",
    user: "John Architect",
    time: "2 days ago",
    status: "created",
  },
  {
    id: 5,
    type: "gap",
    title: "Data Integration Layer",
    action: "Gap analysis completed - 3 gaps identified",
    user: "Emily Davis",
    time: "3 days ago",
    status: "warning",
  },
];

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
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
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
                  {activity.user} · {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
