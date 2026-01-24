import { Building2, Database, AppWindow, Server, Layers, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DomainCard } from "@/components/dashboard/DomainCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TOGAFProgress } from "@/components/dashboard/TOGAFProgress";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Architecture Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Digital Transformation Initiative · Q4 2024
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Export Report</Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              New Artifact
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Artifacts"
            value="1,247"
            icon={<Layers className="h-5 w-5 text-primary" />}
            trend={{ value: 12, label: "this month" }}
          />
          <StatCard
            title="Requirements"
            value="342"
            icon={<Target className="h-5 w-5 text-domain-business" />}
            trend={{ value: 8, label: "linked" }}
          />
          <StatCard
            title="Open Gaps"
            value="23"
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            trend={{ value: -15, label: "vs last week" }}
          />
          <StatCard
            title="Compliance"
            value="94%"
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            trend={{ value: 3, label: "improvement" }}
          />
        </div>

        {/* Domain Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Architecture Repository</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DomainCard
              title="Business Architecture"
              description="Business capabilities, processes, and organizational structures"
              icon={<Building2 className="h-6 w-6" />}
              stats={[
                { label: "Capabilities", value: 48 },
                { label: "Processes", value: 156 },
                { label: "Actors", value: 32 },
              ]}
              href="/repository/business"
              variant="business"
            />
            <DomainCard
              title="Data Architecture"
              description="Data entities, relationships, and information flows"
              icon={<Database className="h-6 w-6" />}
              stats={[
                { label: "Entities", value: 234 },
                { label: "Data Flows", value: 89 },
                { label: "Schemas", value: 12 },
              ]}
              href="/repository/data"
              variant="data"
            />
            <DomainCard
              title="Application Architecture"
              description="Applications, services, and integrations"
              icon={<AppWindow className="h-6 w-6" />}
              stats={[
                { label: "Applications", value: 67 },
                { label: "Services", value: 142 },
                { label: "APIs", value: 89 },
              ]}
              href="/repository/application"
              variant="application"
            />
            <DomainCard
              title="Technology Architecture"
              description="Infrastructure, platforms, and technology standards"
              icon={<Server className="h-6 w-6" />}
              stats={[
                { label: "Platforms", value: 8 },
                { label: "Components", value: 312 },
                { label: "Standards", value: 45 },
              ]}
              href="/repository/technology"
              variant="technology"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TOGAFProgress />
          <RecentActivity />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
