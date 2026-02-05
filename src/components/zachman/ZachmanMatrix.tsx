import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Workflow, 
  MapPin, 
  Users, 
  Clock, 
  Target,
  ChevronRight
} from "lucide-react";

const columns = [
  { id: "what", name: "What", subtitle: "Data", icon: FileText },
  { id: "how", name: "How", subtitle: "Function", icon: Workflow },
  { id: "where", name: "Where", subtitle: "Network", icon: MapPin },
  { id: "who", name: "Who", subtitle: "People", icon: Users },
  { id: "when", name: "When", subtitle: "Time", icon: Clock },
  { id: "why", name: "Why", subtitle: "Motivation", icon: Target },
];

const rows = [
  { id: "planner", name: "Scope (Planner)", description: "Contextual" },
  { id: "owner", name: "Business (Owner)", description: "Conceptual" },
  { id: "designer", name: "System (Designer)", description: "Logical" },
  { id: "builder", name: "Technology (Builder)", description: "Physical" },
  { id: "subcontractor", name: "Component (Subcontractor)", description: "Detailed" },
  { id: "worker", name: "Operations (Worker)", description: "Functioning" },
];

// Sample cell data
const cellData: Record<string, { count: number; status: "complete" | "partial" | "empty" }> = {
  "planner-what": { count: 5, status: "complete" },
  "planner-how": { count: 3, status: "complete" },
  "planner-where": { count: 2, status: "partial" },
  "planner-who": { count: 4, status: "complete" },
  "planner-when": { count: 1, status: "partial" },
  "planner-why": { count: 6, status: "complete" },
  "owner-what": { count: 12, status: "complete" },
  "owner-how": { count: 8, status: "complete" },
  "owner-where": { count: 4, status: "partial" },
  "owner-who": { count: 6, status: "complete" },
  "owner-when": { count: 3, status: "partial" },
  "owner-why": { count: 5, status: "complete" },
  "designer-what": { count: 24, status: "complete" },
  "designer-how": { count: 18, status: "partial" },
  "designer-where": { count: 8, status: "partial" },
  "designer-who": { count: 10, status: "partial" },
  "designer-when": { count: 6, status: "empty" },
  "designer-why": { count: 4, status: "partial" },
  "builder-what": { count: 45, status: "partial" },
  "builder-how": { count: 32, status: "partial" },
  "builder-where": { count: 12, status: "empty" },
  "builder-who": { count: 8, status: "empty" },
  "builder-when": { count: 4, status: "empty" },
  "builder-why": { count: 2, status: "empty" },
  "subcontractor-what": { count: 0, status: "empty" },
  "subcontractor-how": { count: 0, status: "empty" },
  "subcontractor-where": { count: 0, status: "empty" },
  "subcontractor-who": { count: 0, status: "empty" },
  "subcontractor-when": { count: 0, status: "empty" },
  "subcontractor-why": { count: 0, status: "empty" },
  "worker-what": { count: 0, status: "empty" },
  "worker-how": { count: 0, status: "empty" },
  "worker-where": { count: 0, status: "empty" },
  "worker-who": { count: 0, status: "empty" },
  "worker-when": { count: 0, status: "empty" },
  "worker-why": { count: 0, status: "empty" },
};

interface ZachmanMatrixProps {
  onCellClick?: (row: string, col: string) => void;
}

export function ZachmanMatrix({ onCellClick }: ZachmanMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const handleCellClick = (rowId: string, colId: string) => {
    const cellKey = `${rowId}-${colId}`;
    setSelectedCell(cellKey);
    onCellClick?.(rowId, colId);
  };

  const getCellColor = (status: "complete" | "partial" | "empty") => {
    switch (status) {
      case "complete":
        return "bg-accent/10 border-accent/30 hover:border-accent";
      case "partial":
        return "bg-domain-business/10 border-domain-business/30 hover:border-domain-business";
      case "empty":
        return "bg-secondary/50 border-border hover:border-muted-foreground";
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header Row */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          <div className="p-3" /> {/* Empty corner cell */}
          {columns.map((col) => (
            <div
              key={col.id}
              className="p-3 bg-primary text-primary-foreground rounded-t-lg text-center"
            >
              <col.icon className="h-5 w-5 mx-auto mb-1 opacity-80" />
              <div className="font-semibold">{col.name}</div>
              <div className="text-xs opacity-70">{col.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Matrix Rows */}
        {rows.map((row, rowIndex) => (
          <div key={row.id} className="grid grid-cols-7 gap-1 mb-1">
            {/* Row Header */}
            <div
              className={cn(
                "p-3 text-white rounded-l-lg flex flex-col justify-center",
                rowIndex === 0 && "rounded-tl-lg",
                rowIndex === rows.length - 1 && "rounded-bl-lg"
              )}
              style={{
                backgroundColor: `hsl(var(--zachman-${row.id}))`,
              }}
            >
              <div className="font-semibold text-sm">{row.name}</div>
              <div className="text-xs opacity-70">{row.description}</div>
            </div>

            {/* Cells */}
            {columns.map((col) => {
              const cellKey = `${row.id}-${col.id}`;
              const data = cellData[cellKey] || { count: 0, status: "empty" as const };
              const isSelected = selectedCell === cellKey;
              const isHovered = hoveredCell === cellKey;

              return (
                <button
                  key={cellKey}
                  onClick={() => handleCellClick(row.id, col.id)}
                  onMouseEnter={() => setHoveredCell(cellKey)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={cn(
                    "zachman-cell relative group text-left",
                    getCellColor(data.status),
                    isSelected && "ring-2 ring-accent border-accent",
                    "min-h-[80px]"
                  )}
                >
                  <div className="flex flex-col h-full">
                    <span className="text-2xl font-bold text-foreground/80">
                      {data.count}
                    </span>
                    <span className="text-xs text-muted-foreground">artifacts</span>
                  </div>
                  
                  {/* Hover indicator */}
                  <ChevronRight 
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                      "opacity-0 group-hover:opacity-100 transition-opacity"
                    )} 
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 text-sm">
        <span className="text-muted-foreground">Cell Status:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/20 border border-accent/50" />
          <span>Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-domain-business/20 border border-domain-business/50" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary border border-border" />
          <span>Empty</span>
        </div>
      </div>
    </div>
  );
}
