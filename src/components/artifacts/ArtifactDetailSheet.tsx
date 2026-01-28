import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArchitectureArtifact,
  ARTIFACT_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  DOMAIN_LABELS,
} from "@/types/artifacts";
import { Calendar, User, Tag, Layers, Clock, Pencil } from "lucide-react";

interface ArtifactDetailSheetProps {
  artifact: ArchitectureArtifact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function ArtifactDetailSheet({
  artifact,
  isOpen,
  onClose,
  onEdit,
  canEdit = false,
}: ArtifactDetailSheetProps) {
  if (!artifact) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{artifact.name}</SheetTitle>
              <SheetDescription className="mt-1">
                {DOMAIN_LABELS[artifact.domain]} Architecture Artifact
              </SheetDescription>
            </div>
            {canEdit && onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Type */}
          <div className="flex flex-wrap gap-2">
            <Badge className={STATUS_COLORS[artifact.status]} variant="outline">
              {STATUS_LABELS[artifact.status]}
            </Badge>
            <Badge variant="outline">
              {ARTIFACT_TYPE_LABELS[artifact.artifact_type]}
            </Badge>
            <Badge variant="secondary">v{artifact.version}</Badge>
          </div>

          {/* Description */}
          {artifact.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h4>
              <p className="text-sm leading-relaxed">{artifact.description}</p>
            </div>
          )}

          <Separator />

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Layers className="h-3 w-3" />
                <span>Domain</span>
              </div>
              <p className="text-sm font-medium capitalize">{artifact.domain}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Created</span>
              </div>
              <p className="text-sm font-medium">
                {new Date(artifact.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last Updated</span>
              </div>
              <p className="text-sm font-medium">
                {new Date(artifact.updated_at).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Version</span>
              </div>
              <p className="text-sm font-medium">{artifact.version}</p>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </div>
            {artifact.tags && artifact.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {artifact.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags assigned</p>
            )}
          </div>

          {/* Metadata */}
          {artifact.metadata && Object.keys(artifact.metadata).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Additional Metadata
                </h4>
                <div className="bg-muted/50 rounded-lg p-3">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(artifact.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
