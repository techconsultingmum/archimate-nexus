import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Loader2,
} from "lucide-react";

interface Requirement {
  id: string;
  name: string;
  type: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "completed";
  linkedArtifacts: number;
}

const RequirementsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    // Simulate loading - in a real app, this would fetch from the database
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const priorityColors = {
    high: "bg-red-500/20 text-red-700 border-red-500",
    medium: "bg-yellow-500/20 text-yellow-700 border-yellow-500",
    low: "bg-green-500/20 text-green-700 border-green-500",
  };

  const statusColors = {
    open: "bg-blue-500/20 text-blue-700",
    in_progress: "bg-yellow-500/20 text-yellow-700",
    completed: "bg-green-500/20 text-green-700",
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Requirements</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage and trace architecture requirements across all domains
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Requirement</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Open
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="truncate">In Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="mt-2">
                <Progress value={completionRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{completionRate}% complete</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requirements Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="w-full sm:w-auto overflow-x-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="functional" className="text-xs sm:text-sm">Functional</TabsTrigger>
              <TabsTrigger value="non-functional" className="text-xs sm:text-sm">Non-Func</TabsTrigger>
              <TabsTrigger value="constraints" className="text-xs sm:text-sm">Constraints</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requirements..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : requirements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No requirements yet</h3>
                    <p className="text-muted-foreground text-sm max-w-md mb-4">
                      Start documenting your architecture requirements to ensure
                      traceability and alignment with business goals.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Requirement
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Requirement</TableHead>
                          <TableHead className="hidden sm:table-cell">Type</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden lg:table-cell">Linked Artifacts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requirements.map((req) => (
                          <TableRow key={req.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-mono text-sm">{req.id}</TableCell>
                            <TableCell className="font-medium">{req.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="outline">{req.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={priorityColors[req.priority]} variant="outline">
                                {req.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge className={statusColors[req.status]}>
                                {req.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{req.linkedArtifacts}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functional">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No functional requirements defined yet.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="non-functional">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No non-functional requirements defined yet.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="constraints">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No constraints defined yet.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default RequirementsPage;
