import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Building2, Database, AppWindow, Server, Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const domainConfig = {
  business: {
    title: "Business Architecture",
    icon: Building2,
    color: "domain-business",
    description: "Manage business capabilities, processes, organizations, and actors",
    categories: ["Capabilities", "Processes", "Organizations", "Actors", "Goals"],
  },
  data: {
    title: "Data Architecture",
    icon: Database,
    color: "domain-data",
    description: "Define data entities, relationships, flows, and governance",
    categories: ["Entities", "Data Flows", "Schemas", "Data Quality", "Master Data"],
  },
  application: {
    title: "Application Architecture",
    icon: AppWindow,
    color: "domain-application",
    description: "Document applications, services, APIs, and integrations",
    categories: ["Applications", "Services", "APIs", "Integrations", "Components"],
  },
  technology: {
    title: "Technology Architecture",
    icon: Server,
    color: "domain-technology",
    description: "Manage infrastructure, platforms, and technology standards",
    categories: ["Platforms", "Infrastructure", "Networks", "Standards", "Security"],
  },
};

const sampleArtifacts = [
  { id: 1, name: "Customer Management", type: "Capability", status: "Active", lastModified: "2 days ago" },
  { id: 2, name: "Order Processing", type: "Process", status: "Active", lastModified: "1 week ago" },
  { id: 3, name: "Payment Gateway Integration", type: "Service", status: "In Review", lastModified: "3 days ago" },
  { id: 4, name: "User Authentication", type: "Component", status: "Active", lastModified: "5 days ago" },
  { id: 5, name: "Data Warehouse", type: "Platform", status: "Planned", lastModified: "1 day ago" },
  { id: 6, name: "API Gateway", type: "Infrastructure", status: "Active", lastModified: "2 weeks ago" },
];

const RepositoryPage = () => {
  const { domain } = useParams<{ domain: string }>();
  const config = domainConfig[domain as keyof typeof domainConfig] || domainConfig.business;
  const Icon = config.icon;

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", `bg-${config.color}/10`)}>
              <Icon className={cn("h-8 w-8", `text-${config.color}`)} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
              <p className="text-muted-foreground mt-1">{config.description}</p>
            </div>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Artifact
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
            All
          </Badge>
          {config.categories.map((category) => (
            <Badge key={category} variant="outline" className="cursor-pointer hover:bg-secondary">
              {category}
            </Badge>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search artifacts..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <Button variant="ghost" size="icon" className="rounded-none border-r">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-none bg-secondary">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Artifacts Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="text-left p-4 font-semibold text-sm">Name</th>
                <th className="text-left p-4 font-semibold text-sm">Type</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">Last Modified</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {sampleArtifacts.map((artifact) => (
                <tr 
                  key={artifact.id} 
                  className="border-b last:border-0 hover:bg-secondary/30 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <span className="font-medium">{artifact.name}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{artifact.type}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant="secondary"
                      className={cn(
                        artifact.status === "Active" && "bg-green-100 text-green-700",
                        artifact.status === "In Review" && "bg-amber-100 text-amber-700",
                        artifact.status === "Planned" && "bg-blue-100 text-blue-700"
                      )}
                    >
                      {artifact.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    {artifact.lastModified}
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 6 of 156 artifacts
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RepositoryPage;
