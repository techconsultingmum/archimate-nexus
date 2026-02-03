import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArtifactForm } from "./ArtifactForm";
import { ArtifactDetailSheet } from "./ArtifactDetailSheet";
import {
  ArchitectureArtifact,
  ArchitectureDomain,
  ARTIFACT_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  DOMAIN_LABELS,
} from "@/types/artifacts";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";

interface ArtifactsTableProps {
  domain: ArchitectureDomain;
}

export function ArtifactsTable({ domain }: ArtifactsTableProps) {
  const { canCreate, canEdit, canDelete, canAccessDomain } = useAuth();
  const { toast } = useToast();
  
  const [artifacts, setArtifacts] = useState<ArchitectureArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<ArchitectureArtifact | null>(null);
  const [deleteArtifact, setDeleteArtifact] = useState<ArchitectureArtifact | null>(null);
  const [viewArtifact, setViewArtifact] = useState<ArchitectureArtifact | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasDomainAccess = canAccessDomain(domain);

  useEffect(() => {
    fetchArtifacts();
  }, [domain]);

  const fetchArtifacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('architecture_artifacts')
        .select('*')
        .eq('domain', domain)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setArtifacts((data || []) as ArchitectureArtifact[]);
    } catch (error) {
      console.error('Error fetching artifacts:', error);
      toast({
        title: "Error",
        description: "Failed to load artifacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteArtifact) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('architecture_artifacts')
        .delete()
        .eq('id', deleteArtifact.id);

      if (error) throw error;

      toast({
        title: "Artifact deleted",
        description: `${deleteArtifact.name} has been deleted`,
      });

      setDeleteArtifact(null);
      fetchArtifacts();
    } catch (error) {
      console.error('Error deleting artifact:', error);
      toast({
        title: "Error",
        description: "Failed to delete artifact. You may not have permission.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredArtifacts = artifacts.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">{DOMAIN_LABELS[domain]} Artifacts</CardTitle>
              <CardDescription className="text-sm">
                Manage {domain} architecture components
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artifacts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {canCreate && hasDomainAccess && (
                <Button 
                  onClick={() => { setSelectedArtifact(null); setIsFormOpen(true); }}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Artifact
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredArtifacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {searchTerm ? "No artifacts found" : "No artifacts yet"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mb-4">
                {searchTerm 
                  ? "Try a different search term or clear your search."
                  : `Start documenting your ${domain} architecture components.`}
              </p>
              {canCreate && hasDomainAccess && !searchTerm && (
                <Button 
                  onClick={() => { setSelectedArtifact(null); setIsFormOpen(true); }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first artifact
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Version</TableHead>
                    <TableHead className="hidden lg:table-cell">Tags</TableHead>
                    <TableHead className="hidden sm:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtifacts.map((artifact) => (
                    <TableRow key={artifact.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{artifact.name}</p>
                          {artifact.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {artifact.description}
                            </p>
                          )}
                          {/* Mobile-only: Show type and date inline */}
                          <div className="sm:hidden flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {ARTIFACT_TYPE_LABELS[artifact.artifact_type]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(artifact.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">
                          {ARTIFACT_TYPE_LABELS[artifact.artifact_type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[artifact.status]} variant="outline">
                          {STATUS_LABELS[artifact.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        v{artifact.version}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {artifact.tags?.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(artifact.tags?.length || 0) > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(artifact.tags?.length || 0) - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {new Date(artifact.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => {
                                setViewArtifact(artifact);
                                setIsDetailSheetOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canEdit && hasDomainAccess && (
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => { setSelectedArtifact(artifact); setIsFormOpen(true); }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <DropdownMenuItem 
                                className="text-destructive cursor-pointer focus:text-destructive"
                                onClick={() => setDeleteArtifact(artifact)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      <ArtifactForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedArtifact(null); }}
        onSuccess={fetchArtifacts}
        domain={domain}
        artifact={selectedArtifact}
      />

      {/* Artifact Detail Sheet */}
      <ArtifactDetailSheet
        artifact={viewArtifact}
        isOpen={isDetailSheetOpen}
        onClose={() => {
          setIsDetailSheetOpen(false);
          setViewArtifact(null);
        }}
        onEdit={() => {
          setSelectedArtifact(viewArtifact);
          setIsDetailSheetOpen(false);
          setIsFormOpen(true);
        }}
        canEdit={canEdit && hasDomainAccess}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteArtifact} onOpenChange={() => setDeleteArtifact(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artifact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteArtifact?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
