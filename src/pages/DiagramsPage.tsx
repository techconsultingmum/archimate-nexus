import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  GitBranch,
  Plus,
  Search,
  Network,
  Workflow,
  Database,
  Layers,
  FileImage,
  Clock,
  FolderOpen,
} from "lucide-react";

const diagramTypes = [
  { id: "archimate", name: "ArchiMate", icon: Layers, count: 0, description: "Enterprise architecture diagrams" },
  { id: "bpmn", name: "BPMN", icon: Workflow, count: 0, description: "Business process models" },
  { id: "uml", name: "UML", icon: Network, count: 0, description: "Unified Modeling Language" },
  { id: "erd", name: "ERD", icon: Database, count: 0, description: "Entity relationship diagrams" },
];

const DiagramsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Architecture Diagrams</h1>
            </div>
            <p className="text-muted-foreground">
              Create and manage enterprise architecture diagrams and visual models
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search diagrams..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Diagram
            </Button>
          </div>
        </div>

        {/* Diagram Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {diagramTypes.map((type) => (
            <Card key={type.id} className="hover:border-accent/50 transition-colors cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <type.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline">{type.count} diagrams</Badge>
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-accent transition-colors">
                  {type.name}
                </CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Recent Diagrams - Empty State */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Diagrams</CardTitle>
                <CardDescription>Your recently edited architecture diagrams</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileImage className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No diagrams yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-4">
                Start creating architecture diagrams to visualize your enterprise systems,
                processes, and data flows.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Diagram
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Diagram Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Diagram Templates</CardTitle>
            <CardDescription>Start with a pre-built template to save time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Application Landscape", category: "ArchiMate", icon: Layers },
                { name: "Business Process Flow", category: "BPMN", icon: Workflow },
                { name: "Data Model", category: "ERD", icon: Database },
              ].map((template) => (
                <div
                  key={template.name}
                  className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-accent/20">
                      <template.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-accent">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DiagramsPage;
