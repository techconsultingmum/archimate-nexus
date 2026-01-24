import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TOGAFWheel } from "@/components/togaf/TOGAFWheel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Plus, Settings } from "lucide-react";

const TOGAFPage = () => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>("c");

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">TOGAF ADM</h1>
            <p className="text-muted-foreground mt-1">
              Architecture Development Method lifecycle management
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Deliverable
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="wheel" className="space-y-6">
          <TabsList>
            <TabsTrigger value="wheel">ADM Wheel</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="deliverables">All Deliverables</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="wheel" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <TOGAFWheel
                selectedPhase={selectedPhase}
                onSelectPhase={setSelectedPhase}
              />
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="bg-card rounded-xl border border-border p-6 min-h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Timeline view coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="deliverables">
            <div className="bg-card rounded-xl border border-border p-6 min-h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Deliverables catalog coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="governance">
            <div className="bg-card rounded-xl border border-border p-6 min-h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Governance workflows coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Phase Mapping Info */}
        <div className="bg-secondary/30 rounded-xl p-6">
          <h3 className="font-semibold mb-3">TOGAF to Zachman Mapping</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Each TOGAF ADM phase maps to specific cells in the Zachman Framework. 
            Click on a phase above to see the corresponding Zachman perspectives.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-card rounded-lg p-3">
              <span className="font-medium text-phase-b">Phase B</span>
              <p className="text-muted-foreground text-xs mt-1">→ Business Owner Row</p>
            </div>
            <div className="bg-card rounded-lg p-3">
              <span className="font-medium text-phase-c-data">Phase C (Data)</span>
              <p className="text-muted-foreground text-xs mt-1">→ What Column (Designer)</p>
            </div>
            <div className="bg-card rounded-lg p-3">
              <span className="font-medium text-phase-c-app">Phase C (App)</span>
              <p className="text-muted-foreground text-xs mt-1">→ How Column (Designer)</p>
            </div>
            <div className="bg-card rounded-lg p-3">
              <span className="font-medium text-phase-d">Phase D</span>
              <p className="text-muted-foreground text-xs mt-1">→ Builder Row</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TOGAFPage;
