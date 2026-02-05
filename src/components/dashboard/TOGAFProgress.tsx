import { cn } from "@/lib/utils";

const phases = [
  { id: "preliminary", name: "Preliminary", short: "P", status: "completed", progress: 100 },
  { id: "a", name: "Architecture Vision", short: "A", status: "completed", progress: 100 },
  { id: "b", name: "Business Architecture", short: "B", status: "completed", progress: 100 },
  { id: "c", name: "Information Systems", short: "C", status: "in-progress", progress: 65 },
  { id: "d", name: "Technology Architecture", short: "D", status: "upcoming", progress: 0 },
  { id: "e", name: "Opportunities & Solutions", short: "E", status: "upcoming", progress: 0 },
  { id: "f", name: "Migration Planning", short: "F", status: "upcoming", progress: 0 },
  { id: "g", name: "Implementation Governance", short: "G", status: "upcoming", progress: 0 },
  { id: "h", name: "Architecture Change Mgmt", short: "H", status: "upcoming", progress: 0 },
];

const phaseColors: Record<string, string> = {
  preliminary: "bg-phase-preliminary",
  a: "bg-phase-a",
  b: "bg-phase-b",
  c: "bg-phase-c-app",
  d: "bg-phase-d",
  e: "bg-phase-e",
  f: "bg-phase-f",
  g: "bg-phase-g",
  h: "bg-phase-h",
};

export function TOGAFProgress() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">TOGAF ADM Progress</h3>
        <span className="text-sm text-muted-foreground">Digital Transformation Initiative</span>
      </div>

      {/* Circular Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(4 / 9) * 352} 352`}
              className="text-accent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold">44%</span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
        </div>
      </div>

      {/* Phase List */}
      <div className="space-y-2">
        {phases.map((phase) => (
          <div key={phase.id} className="flex items-center gap-3 group cursor-pointer hover:bg-secondary/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                phase.status === "completed" ? phaseColors[phase.id] : 
                phase.status === "in-progress" ? phaseColors[phase.id] : "bg-muted text-muted-foreground"
              )}
            >
              {phase.short}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm font-medium truncate",
                  phase.status === "upcoming" && "text-muted-foreground"
                )}>
                  {phase.name}
                </span>
                <span className={cn(
                  "text-xs",
                  phase.status === "completed" ? "text-accent" :
                  phase.status === "in-progress" ? "text-accent" : "text-muted-foreground"
                )}>
                  {phase.progress}%
                </span>
              </div>
              {phase.status !== "upcoming" && (
                <div className="mt-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", phaseColors[phase.id])}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
