import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Database, AppWindow, Server, Layers, Target, AlertTriangle, CheckCircle, Brain, Cloud, Users, Download, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DomainCard } from "@/components/dashboard/DomainCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TOGAFProgress } from "@/components/dashboard/TOGAFProgress";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DomainStats {
  domain: string;
  count: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { profile, canCreate } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalArtifacts: 0,
    draftCount: 0,
    approvedCount: 0,
    domainCounts: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('architecture_artifacts')
        .select('domain, status');

      if (error) throw error;

      const artifacts = data || [];
      const domainCounts: Record<string, number> = {};
      let draftCount = 0;
      let approvedCount = 0;

      artifacts.forEach((a) => {
        domainCounts[a.domain] = (domainCounts[a.domain] || 0) + 1;
        if (a.status === 'draft') draftCount++;
        if (a.status === 'approved') approvedCount++;
      });

      setStats({
        totalArtifacts: artifacts.length,
        draftCount,
        approvedCount,
        domainCounts,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setExporting(true);
      const { data, error } = await supabase
        .from('architecture_artifacts')
        .select('*')
        .order('domain', { ascending: true });

      if (error) throw error;

      // Create CSV content
      const headers = ['Name', 'Domain', 'Type', 'Status', 'Version', 'Description', 'Tags', 'Created At', 'Updated At'];
      const rows = (data || []).map(a => [
        a.name,
        a.domain,
        a.artifact_type,
        a.status,
        a.version,
        a.description || '',
        (a.tags || []).join('; '),
        new Date(a.created_at).toISOString(),
        new Date(a.updated_at).toISOString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `architecture-artifacts-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: "Export successful",
        description: `Exported ${data?.length || 0} artifacts to CSV`,
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: "Export failed",
        description: "Failed to export artifacts",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const complianceRate = stats.totalArtifacts > 0 
    ? Math.round((stats.approvedCount / stats.totalArtifacts) * 100) 
    : 0;

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Architect'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Enterprise Architecture Platform · Digital Transformation Initiative
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportReport} disabled={exporting}>
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Report
            </Button>
            {canCreate && (
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate('/repository/business')}
              >
                New Artifact
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Artifacts"
            value={loading ? "..." : stats.totalArtifacts.toLocaleString()}
            icon={<Layers className="h-5 w-5 text-primary" />}
            trend={{ value: stats.totalArtifacts, label: "in repository" }}
          />
          <StatCard
            title="Draft Artifacts"
            value={loading ? "..." : stats.draftCount.toLocaleString()}
            icon={<Target className="h-5 w-5 text-domain-business" />}
            trend={{ value: stats.draftCount, label: "pending review" }}
          />
          <StatCard
            title="Approved"
            value={loading ? "..." : stats.approvedCount.toLocaleString()}
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            trend={{ value: stats.approvedCount, label: "artifacts" }}
          />
          <StatCard
            title="Compliance"
            value={loading ? "..." : `${complianceRate}%`}
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            trend={{ value: complianceRate, label: "approved rate" }}
          />
        </div>

        {/* Framework Quick Access */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Supported Frameworks</CardTitle>
                <CardDescription>TOGAF · Zachman · DoDAF · FEAF</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">4 Frameworks</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="/togaf" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-a/20 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-phase-a" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">TOGAF ADM</p>
                    <p className="text-xs text-muted-foreground">Lifecycle</p>
                  </div>
                </div>
              </a>
              <a href="/zachman" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-c-data/20 flex items-center justify-center">
                    <Target className="h-5 w-5 text-phase-c-data" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">Zachman</p>
                    <p className="text-xs text-muted-foreground">6×6 Matrix</p>
                  </div>
                </div>
              </a>
              <a href="/dodaf" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-d/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-phase-d" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">DoDAF</p>
                    <p className="text-xs text-muted-foreground">Defense</p>
                  </div>
                </div>
              </a>
              <a href="/feaf" className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-phase-g/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-phase-g" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-accent">FEAF</p>
                    <p className="text-xs text-muted-foreground">Federal</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Domain Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Architecture Repository</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DomainCard
              title="Business Architecture"
              description="Business capabilities, processes, and organizational structures"
              icon={<Building2 className="h-6 w-6" />}
              stats={[
                { label: "Artifacts", value: stats.domainCounts['business'] || 0 },
              ]}
              href="/repository/business"
              variant="business"
            />
            <DomainCard
              title="Data Architecture"
              description="Data entities, relationships, and information flows"
              icon={<Database className="h-6 w-6" />}
              stats={[
                { label: "Artifacts", value: stats.domainCounts['data'] || 0 },
              ]}
              href="/repository/data"
              variant="data"
            />
            <DomainCard
              title="Application Architecture"
              description="Applications, services, and integrations"
              icon={<AppWindow className="h-6 w-6" />}
              stats={[
                { label: "Artifacts", value: stats.domainCounts['application'] || 0 },
              ]}
              href="/repository/application"
              variant="application"
            />
            <DomainCard
              title="Technology Architecture"
              description="Infrastructure, platforms, and technology standards"
              icon={<Server className="h-6 w-6" />}
              stats={[
                { label: "Artifacts", value: stats.domainCounts['technology'] || 0 },
              ]}
              href="/repository/technology"
              variant="technology"
            />
            <DomainCard
              title="AI Architecture"
              description="AI/ML models, pipelines, and intelligent systems"
              icon={<Brain className="h-6 w-6" />}
              stats={[
                { label: "Artifacts", value: stats.domainCounts['ai'] || 0 },
              ]}
              href="/repository/ai"
              variant="ai"
            />
            <DomainCard
              title="Cloud Architecture"
              description="Cloud infrastructure, services, and deployment patterns"
              icon={<Cloud className="h-6 w-6" />}
              stats={[
                { label: "Artifacts", value: stats.domainCounts['cloud'] || 0 },
              ]}
              href="/repository/cloud"
              variant="cloud"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <TOGAFProgress />
          <RecentActivity />
          <UserDashboard />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
