import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  FileCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ComplianceMetric {
  name: string;
  value: number;
  total: number;
  status: "good" | "warning" | "critical";
}

const GovernancePage = () => {
  const [loading, setLoading] = useState(true);
  const [complianceScore, setComplianceScore] = useState(0);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);

  useEffect(() => {
    fetchGovernanceData();
  }, []);

  const fetchGovernanceData = async () => {
    try {
      const { data, error } = await supabase
        .from("architecture_artifacts")
        .select("status");

      if (error) throw error;

      const artifacts = data || [];
      const total = artifacts.length;
      const approved = artifacts.filter((a) => a.status === "approved").length;
      const draft = artifacts.filter((a) => a.status === "draft").length;
      const underReview = artifacts.filter((a) => a.status === "under_review").length;
      const deprecated = artifacts.filter((a) => a.status === "deprecated" || a.status === "retired").length;

      const score = total > 0 ? Math.round((approved / total) * 100) : 0;
      setComplianceScore(score);

      setMetrics([
        {
          name: "Approved Artifacts",
          value: approved,
          total,
          status: score >= 70 ? "good" : score >= 40 ? "warning" : "critical",
        },
        {
          name: "Pending Review",
          value: underReview,
          total,
          status: underReview <= 5 ? "good" : underReview <= 10 ? "warning" : "critical",
        },
        {
          name: "Draft Artifacts",
          value: draft,
          total,
          status: draft <= 10 ? "good" : draft <= 20 ? "warning" : "critical",
        },
        {
          name: "Deprecated/Retired",
          value: deprecated,
          total,
          status: "good",
        },
      ]);
    } catch (error) {
      console.error("Error fetching governance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const pendingReviews = [
    { id: 1, name: "API Gateway Service", domain: "Application", daysWaiting: 3 },
    { id: 2, name: "Customer Data Model", domain: "Data", daysWaiting: 5 },
    { id: 3, name: "Cloud Migration Plan", domain: "Cloud", daysWaiting: 2 },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Architecture Governance</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Monitor compliance, manage reviews, and enforce architecture standards
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
            <FileCheck className="h-4 w-4 mr-2" />
            New Review Request
          </Button>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compliance Score */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Compliance Score</CardTitle>
              <CardDescription>Overall architecture compliance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {loading ? (
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-secondary"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(complianceScore / 100) * 352} 352`}
                        className={getScoreColor(complianceScore)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`text-4xl font-bold ${getScoreColor(complianceScore)}`}>
                        {complianceScore}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {complianceScore >= 70
                      ? "Excellent compliance"
                      : complianceScore >= 40
                      ? "Needs improvement"
                      : "Critical attention required"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Compliance Metrics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Compliance Metrics</CardTitle>
              <CardDescription>Breakdown by artifact status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.map((metric) => (
                    <div key={metric.name} className="flex items-center gap-4">
                      <div className="shrink-0">{getStatusIcon(metric.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm truncate">{metric.name}</span>
                          <span className="text-sm text-muted-foreground shrink-0 ml-2">
                            {metric.value} / {metric.total}
                          </span>
                        </div>
                        <Progress
                          value={metric.total > 0 ? (metric.value / metric.total) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="space-y-4">
          <TabsList className="w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">Pending Reviews</TabsTrigger>
            <TabsTrigger value="policies" className="text-xs sm:text-sm">Policies</TabsTrigger>
            <TabsTrigger value="standards" className="text-xs sm:text-sm">Standards</TabsTrigger>
            <TabsTrigger value="audit" className="text-xs sm:text-sm">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Pending Architecture Reviews</CardTitle>
                <CardDescription>Artifacts awaiting governance approval</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>All reviews are up to date!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingReviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{review.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {review.domain} · Waiting {review.daysWaiting} days
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Review
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">Architecture Policies</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                  Define and manage architecture policies to ensure consistency
                  and compliance across all domains.
                </p>
                <Button>Create First Policy</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standards">
            <Card>
              <CardContent className="py-12 text-center">
                <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">Architecture Standards</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                  Document and enforce technology standards, patterns,
                  and best practices.
                </p>
                <Button>Define Standards</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">Audit Log</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                  Track all governance activities, approvals, and changes
                  for compliance and audit purposes.
                </p>
                <Button variant="outline">View Full Audit Log</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default GovernancePage;
