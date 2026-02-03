import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2, Database, AppWindow, Server, Brain, Cloud } from "lucide-react";
import { ArtifactsTable } from "@/components/artifacts/ArtifactsTable";
import { ArchitectureDomain } from "@/types/artifacts";
import { cn } from "@/lib/utils";

const domainConfig: Record<ArchitectureDomain, {
  title: string;
  icon: typeof Building2;
  colorClass: string;
  bgClass: string;
  description: string;
}> = {
  business: {
    title: "Business Architecture",
    icon: Building2,
    colorClass: "text-domain-business",
    bgClass: "bg-domain-business/10",
    description: "Manage business capabilities, processes, and organizational structures",
  },
  data: {
    title: "Data Architecture",
    icon: Database,
    colorClass: "text-domain-data",
    bgClass: "bg-domain-data/10",
    description: "Define data entities, relationships, flows, and governance",
  },
  application: {
    title: "Application Architecture",
    icon: AppWindow,
    colorClass: "text-domain-application",
    bgClass: "bg-domain-application/10",
    description: "Document applications, services, APIs, and integrations",
  },
  technology: {
    title: "Technology Architecture",
    icon: Server,
    colorClass: "text-domain-technology",
    bgClass: "bg-domain-technology/10",
    description: "Manage infrastructure, platforms, and technology standards",
  },
  ai: {
    title: "AI Architecture",
    icon: Brain,
    colorClass: "text-domain-ai",
    bgClass: "bg-domain-ai/10",
    description: "AI/ML models, pipelines, datasets, and intelligent automation",
  },
  cloud: {
    title: "Cloud Architecture",
    icon: Cloud,
    colorClass: "text-domain-cloud",
    bgClass: "bg-domain-cloud/10",
    description: "Cloud infrastructure, services, and deployment patterns",
  },
};

const RepositoryPage = () => {
  const { domain } = useParams<{ domain: string }>();
  const validDomain = (domain && domain in domainConfig ? domain : 'business') as ArchitectureDomain;
  const config = domainConfig[validDomain];
  const Icon = config.icon;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className={cn("p-3 rounded-xl shrink-0", config.bgClass)}>
            <Icon className={cn("h-6 sm:h-8 w-6 sm:w-8", config.colorClass)} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{config.title}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">{config.description}</p>
          </div>
        </div>

        {/* Artifacts Table with CRUD */}
        <ArtifactsTable domain={validDomain} />
      </div>
    </AppLayout>
  );
};

export default RepositoryPage;
