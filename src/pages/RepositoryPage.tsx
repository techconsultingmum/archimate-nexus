import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2, Database, AppWindow, Server, Brain, Cloud } from "lucide-react";
import { ArtifactsTable } from "@/components/artifacts/ArtifactsTable";
import { ArchitectureDomain } from "@/types/artifacts";
import { cn } from "@/lib/utils";

const domainConfig: Record<ArchitectureDomain, {
  title: string;
  icon: typeof Building2;
  color: string;
  description: string;
}> = {
  business: {
    title: "Business Architecture",
    icon: Building2,
    color: "domain-business",
    description: "Manage business capabilities, processes, and organizational structures",
  },
  data: {
    title: "Data Architecture",
    icon: Database,
    color: "domain-data",
    description: "Define data entities, relationships, flows, and governance",
  },
  application: {
    title: "Application Architecture",
    icon: AppWindow,
    color: "domain-application",
    description: "Document applications, services, APIs, and integrations",
  },
  technology: {
    title: "Technology Architecture",
    icon: Server,
    color: "domain-technology",
    description: "Manage infrastructure, platforms, and technology standards",
  },
  ai: {
    title: "AI Architecture",
    icon: Brain,
    color: "domain-ai",
    description: "AI/ML models, pipelines, datasets, and intelligent automation",
  },
  cloud: {
    title: "Cloud Architecture",
    icon: Cloud,
    color: "domain-cloud",
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
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl", `bg-${config.color}/10`)}>
            <Icon className={cn("h-8 w-8", `text-${config.color}`)} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
            <p className="text-muted-foreground mt-1">{config.description}</p>
          </div>
        </div>

        {/* Artifacts Table with CRUD */}
        <ArtifactsTable domain={validDomain} />
      </div>
    </AppLayout>
  );
};

export default RepositoryPage;
