import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DomainCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  stats: { label: string; value: number }[];
  href: string;
  variant: "business" | "data" | "application" | "technology" | "ai" | "cloud";
}

const variantStyles = {
  business: "border-domain-business/30 hover:border-domain-business/60 [&_.domain-icon]:bg-domain-business/10 [&_.domain-icon]:text-domain-business",
  data: "border-domain-data/30 hover:border-domain-data/60 [&_.domain-icon]:bg-domain-data/10 [&_.domain-icon]:text-domain-data",
  application: "border-domain-application/30 hover:border-domain-application/60 [&_.domain-icon]:bg-domain-application/10 [&_.domain-icon]:text-domain-application",
  technology: "border-domain-technology/30 hover:border-domain-technology/60 [&_.domain-icon]:bg-domain-technology/10 [&_.domain-icon]:text-domain-technology",
  ai: "border-domain-ai/30 hover:border-domain-ai/60 [&_.domain-icon]:bg-domain-ai/10 [&_.domain-icon]:text-domain-ai",
  cloud: "border-domain-cloud/30 hover:border-domain-cloud/60 [&_.domain-icon]:bg-domain-cloud/10 [&_.domain-icon]:text-domain-cloud",
};

export function DomainCard({ title, description, icon, stats, href, variant }: DomainCardProps) {
  return (
    <Link to={href} className={cn("domain-card bg-card block group", variantStyles[variant])}>
      <div className="flex items-start gap-4">
        <div className="domain-icon p-3 rounded-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{title}</h3>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}
