import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Briefcase,
  Database,
  AppWindow,
  Brain,
  Cloud,
  Server,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const architectRoles = [
  {
    id: "enterprise",
    title: "Enterprise Architect",
    description: "Oversees the complete enterprise architecture landscape, ensuring alignment with business strategy",
    icon: Building2,
    color: "bg-role-enterprise",
    responsibilities: [
      "Define enterprise architecture vision and strategy",
      "Ensure alignment between IT and business goals",
      "Manage architecture governance and compliance",
      "Oversee cross-domain architecture decisions",
    ],
    artifacts: ["Architecture Vision", "Principles Catalog", "Stakeholder Map", "Business Capability Model"],
    activeProjects: 12,
    pendingReviews: 5,
  },
  {
    id: "solution",
    title: "Solution Architect",
    description: "Designs end-to-end solutions that address specific business problems and requirements",
    icon: Briefcase,
    color: "bg-role-solution",
    responsibilities: [
      "Design solution architectures for projects",
      "Define integration patterns and interfaces",
      "Ensure solutions meet non-functional requirements",
      "Bridge gap between enterprise and project teams",
    ],
    artifacts: ["Solution Architecture Document", "Integration Specifications", "Deployment Views", "Technical Design"],
    activeProjects: 8,
    pendingReviews: 3,
  },
  {
    id: "application",
    title: "Application Architect",
    description: "Focuses on application design, frameworks, and development standards",
    icon: AppWindow,
    color: "bg-role-application",
    responsibilities: [
      "Define application architecture patterns",
      "Establish development standards and frameworks",
      "Design application integration strategies",
      "Ensure application security and performance",
    ],
    artifacts: ["Application Portfolio", "API Catalog", "Service Definitions", "Component Diagrams"],
    activeProjects: 15,
    pendingReviews: 7,
  },
  {
    id: "data",
    title: "Data Architect",
    description: "Designs and manages data models, data flows, and information architecture",
    icon: Database,
    color: "bg-role-data",
    responsibilities: [
      "Design enterprise data models",
      "Define data governance policies",
      "Manage data quality and lineage",
      "Design data integration patterns",
    ],
    artifacts: ["Data Models", "Data Dictionary", "Data Flow Diagrams", "Master Data Definitions"],
    activeProjects: 6,
    pendingReviews: 4,
  },
  {
    id: "business",
    title: "Business Architect",
    description: "Bridges business strategy with technology solutions through capability and process modeling",
    icon: Users,
    color: "bg-role-business",
    responsibilities: [
      "Model business capabilities and processes",
      "Define business requirements",
      "Map business to IT alignment",
      "Identify business improvement opportunities",
    ],
    artifacts: ["Business Capability Map", "Process Models", "Value Streams", "Organization Charts"],
    activeProjects: 10,
    pendingReviews: 6,
  },
  {
    id: "ai",
    title: "AI Architect",
    description: "Designs AI/ML solutions, data pipelines, and intelligent automation strategies",
    icon: Brain,
    color: "bg-role-ai",
    responsibilities: [
      "Design AI/ML solution architectures",
      "Define model training and deployment pipelines",
      "Establish AI governance and ethics frameworks",
      "Integrate AI capabilities into enterprise systems",
    ],
    artifacts: ["AI Solution Designs", "ML Pipeline Architecture", "Model Catalog", "AI Ethics Guidelines"],
    activeProjects: 4,
    pendingReviews: 2,
  },
  {
    id: "cloud",
    title: "Cloud Architect",
    description: "Designs cloud infrastructure, migration strategies, and cloud-native solutions",
    icon: Cloud,
    color: "bg-role-cloud",
    responsibilities: [
      "Design cloud infrastructure and platforms",
      "Define cloud migration strategies",
      "Establish cloud security and compliance",
      "Optimize cloud costs and performance",
    ],
    artifacts: ["Cloud Architecture Diagrams", "Migration Roadmaps", "Landing Zone Designs", "Cost Models"],
    activeProjects: 9,
    pendingReviews: 4,
  },
];

const RolesPage = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Architect Roles</h1>
            <p className="text-muted-foreground mt-1">
              Role-specific dashboards and responsibilities
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Manage Permissions
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Role Overview</TabsTrigger>
            <TabsTrigger value="matrix">Responsibility Matrix</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architectRoles.map((role) => (
                <Card key={role.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-lg ${role.color} flex items-center justify-center`}>
                        <role.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {role.activeProjects} active
                        </Badge>
                        {role.pendingReviews > 0 && (
                          <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                            {role.pendingReviews} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="mt-3">{role.title}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Responsibilities</h4>
                      <ul className="space-y-1">
                        {role.responsibilities.slice(0, 3).map((resp, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 mt-0.5 text-accent shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Primary Artifacts</h4>
                      <div className="flex flex-wrap gap-1">
                        {role.artifacts.slice(0, 3).map((artifact, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {artifact}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matrix">
            <Card>
              <CardHeader>
                <CardTitle>Responsibility Assignment Matrix (RACI)</CardTitle>
                <CardDescription>
                  Defines the role each architect plays in key architecture activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Activity</th>
                        {architectRoles.slice(0, 5).map((role) => (
                          <th key={role.id} className="text-center p-3 font-medium">
                            {role.title.replace(" Architect", "")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { activity: "Architecture Vision", values: ["A", "R", "C", "C", "R"] },
                        { activity: "Business Capability Modeling", values: ["A", "C", "I", "C", "R"] },
                        { activity: "Solution Design", values: ["A", "R", "C", "C", "C"] },
                        { activity: "Data Architecture", values: ["A", "C", "C", "R", "I"] },
                        { activity: "Application Design", values: ["A", "R", "R", "C", "I"] },
                        { activity: "Integration Patterns", values: ["A", "R", "R", "C", "I"] },
                        { activity: "Governance Reviews", values: ["R", "C", "C", "C", "C"] },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{row.activity}</td>
                          {row.values.map((val, valIdx) => (
                            <td key={valIdx} className="text-center p-3">
                              <Badge
                                variant={
                                  val === "R" ? "default" :
                                  val === "A" ? "secondary" :
                                  "outline"
                                }
                                className={
                                  val === "R" ? "bg-accent text-accent-foreground" :
                                  val === "A" ? "bg-primary text-primary-foreground" :
                                  ""
                                }
                              >
                                {val}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
                  <span><Badge className="bg-primary text-primary-foreground mr-1">A</Badge> Accountable</span>
                  <span><Badge className="bg-accent text-accent-foreground mr-1">R</Badge> Responsible</span>
                  <span><Badge variant="outline" className="mr-1">C</Badge> Consulted</span>
                  <span><Badge variant="outline" className="mr-1">I</Badge> Informed</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Architecture Review Workflow</CardTitle>
                <CardDescription>
                  Standard workflow for architecture reviews and approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="flex items-center justify-center gap-2 py-8">
                  {[
                    { step: 1, title: "Draft", icon: Clock, status: "completed" },
                    { step: 2, title: "Review", icon: Users, status: "completed" },
                    { step: 3, title: "Approval", icon: CheckCircle, status: "current" },
                    { step: 4, title: "Published", icon: Server, status: "pending" },
                  ].map((step, idx, arr) => (
                    <div key={idx} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center ${
                            step.status === "completed" ? "bg-accent text-accent-foreground" :
                            step.status === "current" ? "bg-primary text-primary-foreground" :
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          <step.icon className="h-6 w-6" />
                        </div>
                        <span className="mt-2 font-medium text-sm">{step.title}</span>
                        <span className="text-xs text-muted-foreground capitalize">{step.status}</span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="w-12 sm:w-20 h-0.5 bg-border mx-2 mt-[-2rem]" />
                      )}
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

export default RolesPage;
