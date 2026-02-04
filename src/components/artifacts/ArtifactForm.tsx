import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import {
  ArchitectureArtifact,
  ArchitectureDomain,
  ArtifactType,
  ArtifactStatus,
  ARTIFACT_TYPE_LABELS,
  STATUS_LABELS,
  DOMAIN_ARTIFACT_TYPES,
} from "@/types/artifacts";
import { artifactFormSchema, parseFormData } from "@/lib/validation";

interface ArtifactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  domain: ArchitectureDomain;
  artifact?: ArchitectureArtifact | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  version?: string;
  tags?: string;
}

export function ArtifactForm({ isOpen, onClose, onSuccess, domain, artifact }: ArtifactFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    artifact_type: DOMAIN_ARTIFACT_TYPES[domain][0],
    status: 'draft' as ArtifactStatus,
    version: '1.0',
    tags: '',
  });

  // Reset form when artifact changes or dialog opens/closes
  const resetForm = useCallback(() => {
    setFormData({
      name: artifact?.name || '',
      description: artifact?.description || '',
      artifact_type: artifact?.artifact_type || DOMAIN_ARTIFACT_TYPES[domain][0],
      status: artifact?.status || 'draft' as ArtifactStatus,
      version: artifact?.version || '1.0',
      tags: artifact?.tags?.join(', ') || '',
    });
    setErrors({});
  }, [artifact, domain]);

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validationResult = parseFormData(artifactFormSchema, {
      name: formData.name,
      description: formData.description || null,
      artifact_type: formData.artifact_type,
      status: formData.status,
      version: formData.version,
      tags: formData.tags,
    });

    if (!validationResult.success && 'errors' in validationResult) {
      setErrors(validationResult.errors as FormErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .slice(0, 20); // Max 20 tags

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        domain,
        artifact_type: formData.artifact_type,
        status: formData.status,
        version: formData.version.trim() || '1.0',
        tags: tagsArray,
        updated_by: user?.id,
      };

      if (artifact) {
        // Update existing artifact
        const { error } = await supabase
          .from('architecture_artifacts')
          .update(payload)
          .eq('id', artifact.id);

        if (error) throw error;

        toast({
          title: "Artifact updated",
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        // Create new artifact
        const { error } = await supabase
          .from('architecture_artifacts')
          .insert({
            ...payload,
            created_by: user?.id,
            owner_id: user?.id,
          });

        if (error) throw error;

        toast({
          title: "Artifact created",
          description: `${formData.name} has been created successfully`,
        });
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error saving artifact:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save artifact",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTypes = DOMAIN_ARTIFACT_TYPES[domain];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{artifact ? 'Edit Artifact' : 'Create New Artifact'}</DialogTitle>
            <DialogDescription>
              {artifact ? 'Update the artifact details below' : `Add a new ${domain} architecture artifact`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter artifact name"
                maxLength={100}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter artifact description"
                rows={3}
                maxLength={1000}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "description-error" : undefined}
              />
              {errors.description && (
                <p id="description-error" className="text-sm text-destructive">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.artifact_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, artifact_type: value as ArtifactType }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ARTIFACT_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ArtifactStatus }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_LABELS) as ArtifactStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="1.0"
                maxLength={20}
                aria-invalid={!!errors.version}
                aria-describedby={errors.version ? "version-error" : undefined}
              />
              {errors.version && (
                <p id="version-error" className="text-sm text-destructive">{errors.version}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated, max 20)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., critical, core, legacy"
                maxLength={500}
                aria-describedby="tags-hint"
              />
              <p id="tags-hint" className="text-xs text-muted-foreground">
                Each tag max 50 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : artifact ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
