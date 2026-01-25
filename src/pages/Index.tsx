import { Building2, Database, AppWindow, Server, Layers, Target, AlertTriangle, CheckCircle, Brain, Cloud, Users, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DomainCard } from "@/components/dashboard/DomainCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TOGAFProgress } from "@/components/dashboard/TOGAFProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Architecture Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Enterprise Architecture Platform · Digital Transformation Initiative
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
            value="1,547"
            icon={<Layers className="h-5 w-5 text-primary" />}
            trend={{ value: 18, label: "this month" }}
          />
          <StatCard
            title="Requirements"
            value="428"
            icon={<Target className="h-5 w-5 text-domain-business" />}
            trend={{ value: 12, label: "linked" }}
          />
          <StatCard
            title="Open Gaps"
            value="19"
            icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            trend={{ value: -23, label: "vs last week" }}
          />
          <StatCard
            title="Compliance"
            value="96%"
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            trend={{ value: 4, label: "improvement" }}
          />
        </div>

        {/* Framework Quick Access */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Supported Frameworks</CardTitle>
                <CardDescription>TOGAF · Zachman · DoDAF · FEAF</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">4 Frameworks</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="/togaf" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-a/20 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-phase-a" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">TOGAF ADM</p>
                    <p className="text-xs text-muted-foreground">Lifecycle</p>
                  </div>
                </div>
              </a>
              <a href="/zachman" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-c-data/20 flex items-center justify-center">
                    <Target className="h-5 w-5 text-phase-c-data" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">Zachman</p>
                    <p className="text-xs text-muted-foreground">6×6 Matrix</p>
                  </div>
                </div>
              </a>
              <a href="/dodaf" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-d/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-phase-d" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">DoDAF</p>
                    <p className="text-xs text-muted-foreground">Defense</p>
                  </div>
                </div>
              </a>
              <a href="/feaf" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-g/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-phase-g" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">FEAF</p>
                    <p className="text-xs text-muted-foreground">Federal</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Domain Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Architecture Repository</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <DomainCard
              title="AI Architecture"
              description="AI/ML models, pipelines, and intelligent systems"
              icon={<Brain className="h-6 w-6" />}
              stats={[
                { label: "Models", value: 24 },
                { label: "Pipelines", value: 18 },
                { label: "Datasets", value: 56 },
              ]}
              href="/repository/ai"
              variant="ai"
            />
            <DomainCard
              title="Cloud Architecture"
              description="Cloud infrastructure, services, and deployment patterns"
              icon={<Cloud className="h-6 w-6" />}
              stats={[
                { label: "Environments", value: 6 },
                { label: "Services", value: 89 },
                { label: "Resources", value: 234 },
              ]}
              href="/repository/cloud"
              variant="cloud"
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
