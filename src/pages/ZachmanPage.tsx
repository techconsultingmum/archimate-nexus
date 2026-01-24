import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ZachmanMatrix } from "@/components/zachman/ZachmanMatrix";
import { Button } from "@/components/ui/button";
import { Download, Filter, Plus, Grid3X3, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const cellDetails: Record<string, { title: string; description: string; artifacts: string[] }> = {
  "planner-what": {
    title: "Scope: Data (What)",
    description: "List of things important to the business",
    artifacts: ["Business Glossary", "Entity Catalog", "Core Data Domains", "Information Classification", "Data Ownership Matrix"],
  },
  "planner-how": {
    title: "Scope: Function (How)",
    description: "List of business processes",
    artifacts: ["Business Process Catalog", "Value Stream Map", "High-level Process Model"],
  },
  "owner-what": {
    title: "Business Model: Data (What)",
    description: "Semantic model from business perspective",
    artifacts: ["Conceptual Data Model", "Business Entity Definitions", "Data Dictionary", "Information Requirements"],
  },
  "designer-what": {
    title: "System Model: Data (What)",
    description: "Logical data model",
    artifacts: ["Logical Data Model", "Data Flow Diagrams", "Entity-Relationship Diagrams", "Data Architecture Blueprint"],
  },
};

const ZachmanPage = () => {
  const [selectedCell, setSelectedCell] = useState<{ row: string; col: string } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleCellClick = (row: string, col: string) => {
    setSelectedCell({ row, col });
    setSheetOpen(true);
  };

  const getCellDetails = () => {
    if (!selectedCell) return null;
    const key = `${selectedCell.row}-${selectedCell.col}`;
    return cellDetails[key] || {
      title: `${selectedCell.row} × ${selectedCell.col}`,
      description: "No detailed information available for this cell yet.",
      artifacts: [],
    };
  };

  const details = getCellDetails();

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Zachman Framework</h1>
            <p className="text-muted-foreground mt-1">
              Enterprise ontology matrix for comprehensive architecture classification
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Artifact
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs defaultValue="matrix" className="space-y-6">
          <TabsList>
            <TabsTrigger value="matrix" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Matrix View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matrix">
            <div className="bg-card rounded-xl border border-border p-6">
              <ZachmanMatrix onCellClick={handleCellClick} />
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="bg-card rounded-xl border border-border p-6 min-h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">List view coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Framework Description */}
        <div className="bg-secondary/30 rounded-xl p-6">
          <h3 className="font-semibold mb-3">About the Zachman Framework</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <p className="mb-3">
                The Zachman Framework is an enterprise ontology and fundamental structure 
                for Enterprise Architecture which provides a formal and structured way of 
                viewing and defining an enterprise.
              </p>
              <p>
                <strong className="text-foreground">Columns (Interrogatives):</strong> What, How, Where, Who, When, Why — 
                representing data, function, network, people, time, and motivation respectively.
              </p>
            </div>
            <div>
              <p className="mb-3">
                <strong className="text-foreground">Rows (Perspectives):</strong> From Planner to Worker, 
                each row represents a different stakeholder perspective, from strategic scope 
                to operational functioning.
              </p>
              <p>
                Click on any cell in the matrix to view and manage the artifacts 
                associated with that intersection of perspective and interrogative.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cell Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{details?.title}</SheetTitle>
            <SheetDescription>{details?.description}</SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Artifacts</h4>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {details?.artifacts && details.artifacts.length > 0 ? (
              <ul className="space-y-2">
                {details.artifacts.map((artifact, index) => (
                  <li 
                    key={index}
                    className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <span className="font-medium text-sm">{artifact}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No artifacts in this cell yet. Click "Add" to create one.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default ZachmanPage;
