import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, Layers, GitBranch, Target, Users, Cpu, Network } from "lucide-react";

const viewpoints = [
  {
    id: "av",
    name: "All Viewpoint",
    abbr: "AV",
    description: "Overarching aspects of architecture across all views",
    icon: Eye,
    models: ["AV-1: Overview and Summary", "AV-2: Integrated Dictionary"],
    color: "bg-blue-500"
  },
  {
    id: "cv",
    name: "Capability Viewpoint",
    abbr: "CV",
    description: "Capability-based planning and organizational relationships",
    icon: Target,
    models: ["CV-1: Vision", "CV-2: Capability Taxonomy", "CV-3: Capability Phasing", "CV-4: Capability Dependencies"],
    color: "bg-purple-500"
  },
  {
    id: "diy",
    name: "Data & Information",
    abbr: "DIV",
    description: "Data assets, information exchanges, and data models",
    icon: Layers,
    models: ["DIV-1: Conceptual Data Model", "DIV-2: Logical Data Model", "DIV-3: Physical Data Model"],
    color: "bg-green-500"
  },
  {
    id: "ov",
    name: "Operational Viewpoint",
    abbr: "OV",
    description: "Operational activities, nodes, and information exchanges",
    icon: Users,
    models: ["OV-1: High-Level Concept", "OV-2: Operational Resource Flow", "OV-3: Operational Resource Flow Matrix", "OV-4: Organizational Relationships", "OV-5a/b: Activity Models", "OV-6a/b/c: Rules & State Models"],
    color: "bg-amber-500"
  },
  {
    id: "pv",
    name: "Project Viewpoint",
    abbr: "PV",
    description: "Project portfolio and capability delivery",
    icon: GitBranch,
    models: ["PV-1: Project Portfolio", "PV-2: Project Timelines", "PV-3: Project to Capability Mapping"],
    color: "bg-rose-500"
  },
  {
    id: "sv",
    name: "Services Viewpoint",
    abbr: "SvcV",
    description: "Service taxonomy, interfaces, and evolution",
    icon: Network,
    models: ["SvcV-1: Services Context", "SvcV-2: Services Resource Flow", "SvcV-3a/b: Systems-Services Matrix", "SvcV-4: Services Functionality"],
    color: "bg-cyan-500"
  },
  {
    id: "stv",
    name: "Standards Viewpoint",
    abbr: "StdV",
    description: "Technical standards and conventions",
    icon: Shield,
    models: ["StdV-1: Standards Profile", "StdV-2: Standards Forecast"],
    color: "bg-indigo-500"
  },
  {
    id: "syv",
    name: "Systems Viewpoint",
    abbr: "SV",
    description: "System design, functions, and physical resources",
    icon: Cpu,
    models: ["SV-1: Systems Interface", "SV-2: Systems Resource Flow", "SV-3: Systems-Systems Matrix", "SV-4: Systems Functionality", "SV-5a/b: Operational-Systems Traceability", "SV-6: Systems Resource Flow Matrix"],
    color: "bg-orange-500"
  },
];

const DoDAFPage = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">DoDAF 2.0</h1>
            <Badge variant="outline" className="text-xs">Department of Defense Architecture Framework</Badge>
          </div>
          <p className="text-muted-foreground">
            A comprehensive, model-based framework for complex, large-scale, and system-intensive defense projects.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="viewpoints" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="viewpoints">Viewpoints</TabsTrigger>
            <TabsTrigger value="fitfor">Fit-for-Purpose</TabsTrigger>
            <TabsTrigger value="meta">Meta Model</TabsTrigger>
          </TabsList>

          <TabsContent value="viewpoints" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {viewpoints.map((vp) => (
                <Card key={vp.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${vp.color} flex items-center justify-center`}>
                        <vp.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {vp.abbr}
                        </CardTitle>
                        <CardDescription className="text-xs">{vp.name}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3">{vp.description}</p>
                    <div className="space-y-1">
                      {vp.models.slice(0, 3).map((model, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs mr-1 mb-1">
                          {model.split(":")[0]}
                        </Badge>
                      ))}
                      {vp.models.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{vp.models.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fitfor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fit-for-Purpose Views</CardTitle>
                <CardDescription>
                  DoDAF emphasizes creating architecture products that serve specific stakeholder needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-semibold mb-2">Capability Planning</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on what capabilities are needed and when they should be delivered.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-semibold mb-2">Operational Planning</h4>
                    <p className="text-sm text-muted-foreground">
                      Understand operational processes and resource flows.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-semibold mb-2">Systems Engineering</h4>
                    <p className="text-sm text-muted-foreground">
                      Design and analyze system interfaces and data flows.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DoDAF Meta Model (DM2)</CardTitle>
                <CardDescription>
                  The underlying data model that ensures consistency across all architecture products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Core Entities</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Performer", "Activity", "Resource", "Location", "Capability", "Project", "Service", "System"].map((entity) => (
                        <Badge key={entity} variant="outline">{entity}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Relationships</h4>
                    <div className="flex flex-wrap gap-2">
                      {["performs", "consumes", "produces", "hosts", "implements", "supports"].map((rel) => (
                        <Badge key={rel} variant="secondary">{rel}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DoDAFPage;
