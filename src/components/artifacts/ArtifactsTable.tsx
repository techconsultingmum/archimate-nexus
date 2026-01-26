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
  Filter,
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
        description: "Failed to delete artifact",
        variant: "destructive",
      });
    }
  };

  const filteredArtifacts = artifacts.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{DOMAIN_LABELS[domain]} Architecture Artifacts</CardTitle>
              <CardDescription>
                Manage {domain} architecture components and capabilities
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artifacts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {canCreate && hasDomainAccess && (
                <Button onClick={() => { setSelectedArtifact(null); setIsFormOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Artifact
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredArtifacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No artifacts found</p>
              {canCreate && hasDomainAccess && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => { setSelectedArtifact(null); setIsFormOpen(true); }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first artifact
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Updated</TableHead>
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {ARTIFACT_TYPE_LABELS[artifact.artifact_type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[artifact.status]} variant="outline">
                        {STATUS_LABELS[artifact.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      v{artifact.version}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {artifact.tags?.slice(0, 2).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {artifact.tags?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{artifact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(artifact.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {canEdit && hasDomainAccess && (
                            <DropdownMenuItem onClick={() => { setSelectedArtifact(artifact); setIsFormOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <DropdownMenuItem 
                              className="text-destructive"
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
