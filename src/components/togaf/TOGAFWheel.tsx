import { cn } from "@/lib/utils";

interface Phase {
  id: string;
  name: string;
  short: string;
  description: string;
  deliverables: string[];
  status: "completed" | "in-progress" | "upcoming";
}

const phases: Phase[] = [
  {
    id: "preliminary",
    name: "Preliminary",
    short: "P",
    description: "Prepare the organization for TOGAF projects",
    deliverables: ["Architecture Principles", "Organization Model", "Tailored Architecture Framework"],
    status: "completed",
  },
  {
    id: "a",
    name: "Architecture Vision",
    short: "A",
    description: "Define the scope and vision of the architecture project",
    deliverables: ["Statement of Architecture Work", "Architecture Vision", "Communications Plan"],
    status: "completed",
  },
  {
    id: "b",
    name: "Business Architecture",
    short: "B",
    description: "Develop the Business Architecture to support the vision",
    deliverables: ["Business Architecture Document", "Gap Analysis", "Business Requirements"],
    status: "completed",
  },
  {
    id: "c",
    name: "Information Systems Architecture",
    short: "C",
    description: "Develop Data and Application Architectures",
    deliverables: ["Data Architecture", "Application Architecture", "Gap Analysis"],
    status: "in-progress",
  },
  {
    id: "d",
    name: "Technology Architecture",
    short: "D",
    description: "Develop the Technology Architecture",
    deliverables: ["Technology Architecture", "Architecture Definition Document"],
    status: "upcoming",
  },
  {
    id: "e",
    name: "Opportunities & Solutions",
    short: "E",
    description: "Identify delivery vehicles and opportunities",
    deliverables: ["Implementation Strategy", "Project Portfolio"],
    status: "upcoming",
  },
  {
    id: "f",
    name: "Migration Planning",
    short: "F",
    description: "Create actionable implementation and migration plan",
    deliverables: ["Implementation and Migration Plan", "Transition Architectures"],
    status: "upcoming",
  },
  {
    id: "g",
    name: "Implementation Governance",
    short: "G",
    description: "Provide architectural oversight of implementation",
    deliverables: ["Architecture Contract", "Compliance Assessments"],
    status: "upcoming",
  },
  {
    id: "h",
    name: "Architecture Change Management",
    short: "H",
    description: "Manage changes to the architecture",
    deliverables: ["Change Requests", "Updated Architecture"],
    status: "upcoming",
  },
];

interface TOGAFWheelProps {
  selectedPhase: string | null;
  onSelectPhase: (phaseId: string) => void;
}

const phasePositions = [
  { x: 50, y: 8 },   // Preliminary (top)
  { x: 85, y: 20 },  // A
  { x: 95, y: 50 },  // B
  { x: 85, y: 80 },  // C
  { x: 50, y: 92 },  // D
  { x: 15, y: 80 },  // E
  { x: 5, y: 50 },   // F
  { x: 15, y: 20 },  // G
  { x: 50, y: 50 },  // H (center - Requirements Management)
];

const phaseColors: Record<string, string> = {
  preliminary: "from-phase-preliminary to-phase-preliminary/80",
  a: "from-phase-a to-phase-a/80",
  b: "from-phase-b to-phase-b/80",
  c: "from-phase-c-app to-phase-c-app/80",
  d: "from-phase-d to-phase-d/80",
  e: "from-phase-e to-phase-e/80",
  f: "from-phase-f to-phase-f/80",
  g: "from-phase-g to-phase-g/80",
  h: "from-phase-h to-phase-h/80",
};

export function TOGAFWheel({ selectedPhase, onSelectPhase }: TOGAFWheelProps) {
  const selectedPhaseData = phases.find(p => p.id === selectedPhase);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Wheel Visualization */}
      <div className="relative aspect-square max-w-lg mx-auto">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-border" />
        
        {/* Phase nodes */}
        {phases.slice(0, 8).map((phase, index) => {
          const pos = phasePositions[index];
          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              className={cn(
                "absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 rounded-full",
                "flex items-center justify-center text-lg font-bold text-white",
                "transition-all duration-300 hover:scale-110 shadow-lg",
                "bg-gradient-to-br",
                phaseColors[phase.id],
                selectedPhase === phase.id && "ring-4 ring-accent ring-offset-2 ring-offset-background scale-110",
                phase.status === "upcoming" && "opacity-50"
              )}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {phase.short}
            </button>
          );
        })}

        {/* Center - Requirements Management */}
        <button
          onClick={() => onSelectPhase("req")}
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-24 h-24 rounded-full bg-gradient-to-br from-phase-req to-phase-req/80",
            "flex flex-col items-center justify-center text-white shadow-xl",
            "transition-all duration-300 hover:scale-105",
            selectedPhase === "req" && "ring-4 ring-accent ring-offset-2 ring-offset-background"
          )}
        >
          <span className="text-xs font-medium">Requirements</span>
          <span className="text-xs">Management</span>
        </button>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <defs>
            <marker id="arrowhead" markerWidth="4" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <polygon points="0 0, 4 1.5, 0 3" className="fill-border" />
            </marker>
          </defs>
          {/* Circular path connecting phases */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            className="text-border"
          />
        </svg>
      </div>

      {/* Phase Details */}
      <div className="space-y-6">
        {selectedPhaseData ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl font-bold text-white",
                phaseColors[selectedPhaseData.id]
              )}>
                {selectedPhaseData.short}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedPhaseData.name}</h3>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  selectedPhaseData.status === "completed" ? "bg-green-100 text-green-700" :
                  selectedPhaseData.status === "in-progress" ? "bg-accent/20 text-accent" :
                  "bg-muted text-muted-foreground"
                )}>
                  {selectedPhaseData.status.replace("-", " ")}
                </span>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">{selectedPhaseData.description}</p>
            
            <div>
              <h4 className="font-semibold mb-3">Key Deliverables</h4>
              <ul className="space-y-2">
                {selectedPhaseData.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a phase to view details</p>
          </div>
        )}

        {/* Phase Legend */}
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground">All Phases</h4>
          <div className="grid grid-cols-3 gap-2">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={cn(
                  "text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  selectedPhase === phase.id ? "bg-accent/10 text-accent" : "hover:bg-secondary"
                )}
              >
                <span className="font-medium">{phase.short}:</span>{" "}
                <span className="text-muted-foreground">{phase.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
