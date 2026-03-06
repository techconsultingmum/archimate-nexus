import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Landmark, Briefcase, Database, AppWindow, Server, Shield, ArrowRight } from "lucide-react";

const referenceModels = [
  {
    id: "prm",
    name: "Performance Reference Model",
    abbr: "PRM",
    description: "Framework for measuring performance and results of IT investments",
    icon: Briefcase,
    color: "bg-domain-cloud",
    components: ["Mission & Business Results", "Customer Results", "Processes & Activities", "Technology"],
  },
  {
    id: "brm",
    name: "Business Reference Model",
    abbr: "BRM",
    description: "Function-driven framework for federal government operations",
    icon: Landmark,
    color: "bg-accent",
    components: ["Services for Citizens", "Mode of Delivery", "Support Delivery", "Government Operations"],
  },
  {
    id: "drm",
    name: "Data Reference Model",
    abbr: "DRM",
    description: "Describes data and information to support program and business operations",
    icon: Database,
    color: "bg-domain-data",
    components: ["Data Description", "Data Context", "Data Sharing"],
  },
  {
    id: "arm",
    name: "Application Reference Model",
    abbr: "ARM",
    description: "Categorizes applications and software components",
    icon: AppWindow,
    color: "bg-domain-business",
    components: ["Customer Services", "Process Automation", "Business Management", "Back Office"],
  },
  {
    id: "irm",
    name: "Infrastructure Reference Model",
    abbr: "IRM",
    description: "Describes the technical infrastructure supporting IT services",
    icon: Server,
    color: "bg-phase-e",
    components: ["Hosting", "Platform", "Network", "Security"],
  },
  {
    id: "srm",
    name: "Security Reference Model",
    abbr: "SRM",
    description: "Framework for security controls and risk management",
    icon: Shield,
    color: "bg-domain-technology",
    components: ["Governance", "Access Control", "Awareness", "Audit & Accountability"],
  },
];

const segments = [
  { name: "Strategic", description: "Cross-agency initiatives and shared services", count: 12 },
  { name: "Business", description: "Mission-specific operations and processes", count: 24 },
  { name: "Enterprise", description: "Infrastructure and common services", count: 8 },
];

const FEAFPage = () => {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <Landmark className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">FEAF</h1>
            <Badge variant="outline" className="text-xs w-fit">Federal Enterprise Architecture Framework</Badge>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            A framework for the U.S. federal government to promote shared development and resource optimization.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="bg-secondary/50 w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="models" className="text-xs sm:text-sm">Reference Models</TabsTrigger>
            <TabsTrigger value="segments" className="text-xs sm:text-sm">Segment Architecture</TabsTrigger>
            <TabsTrigger value="methodology" className="text-xs sm:text-sm">Methodology</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {referenceModels.map((rm) => (
                <Card key={rm.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg ${rm.color} flex items-center justify-center shrink-0`}>
                        <rm.icon className="h-5 sm:h-6 w-5 sm:w-6 text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors">
                          {rm.abbr}
                        </CardTitle>
                        <CardDescription className="text-xs truncate">{rm.name}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">{rm.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Components:</p>
                      <div className="flex flex-wrap gap-1">
                        {rm.components.map((comp, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {segments.map((seg) => (
                <Card key={seg.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                      {seg.name}
                      <Badge>{seg.count} segments</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{seg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline">
                      <span>View segments</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Segment Architecture Layers</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  FEAF segments provide a structured approach to enterprise architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="relative min-w-[300px]">
                    <div className="flex flex-col gap-2">
                      {["Strategic Goals", "Business Services", "Data & Information", "Applications", "Infrastructure"].map((layer, idx) => (
                        <div
                          key={layer}
                          className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20"
                          style={{ marginLeft: `${idx * 16}px` }}
                        >
                          <span className="font-medium text-sm sm:text-base">{layer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methodology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Collaborative Planning Methodology (CPM)</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  A six-step process for developing and using architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { step: 1, title: "Identify", desc: "Define architecture scope and purpose" },
                    { step: 2, title: "Architect", desc: "Develop segment architecture" },
                    { step: 3, title: "Invest", desc: "Align investments with architecture" },
                    { step: 4, title: "Implement", desc: "Execute transition plan" },
                    { step: 5, title: "Perform", desc: "Measure and optimize" },
                    { step: 6, title: "Govern", desc: "Maintain and evolve architecture" },
                  ].map((item) => (
                    <div key={item.step} className="p-4 rounded-lg bg-secondary/50 border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                          {item.step}
                        </div>
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default FEAFPage;
