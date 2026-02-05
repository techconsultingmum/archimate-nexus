import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import TOGAFPage from "./pages/TOGAFPage";
import ZachmanPage from "./pages/ZachmanPage";
import DoDAFPage from "./pages/DoDAFPage";
import FEAFPage from "./pages/FEAFPage";
import RepositoryPage from "./pages/RepositoryPage";
import RolesPage from "./pages/RolesPage";
import UserManagementPage from "./pages/UserManagementPage";
import DiagramsPage from "./pages/DiagramsPage";
import RequirementsPage from "./pages/RequirementsPage";
import GovernancePage from "./pages/GovernancePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="system" storageKey="ea-tool-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/togaf" element={
                  <ProtectedRoute>
                    <TOGAFPage />
                  </ProtectedRoute>
                } />
                <Route path="/zachman" element={
                  <ProtectedRoute>
                    <ZachmanPage />
                  </ProtectedRoute>
                } />
                <Route path="/dodaf" element={
                  <ProtectedRoute>
                    <DoDAFPage />
                  </ProtectedRoute>
                } />
                <Route path="/feaf" element={
                  <ProtectedRoute>
                    <FEAFPage />
                  </ProtectedRoute>
                } />
                <Route path="/repository/:domain" element={
                  <ProtectedRoute>
                    <RepositoryPage />
                  </ProtectedRoute>
                } />
                <Route path="/roles" element={
                  <ProtectedRoute>
                    <RolesPage />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute requiredRole="enterprise_architect">
                    <UserManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/diagrams" element={
                  <ProtectedRoute>
                    <DiagramsPage />
                  </ProtectedRoute>
                } />
                <Route path="/requirements" element={
                  <ProtectedRoute>
                    <RequirementsPage />
                  </ProtectedRoute>
                } />
                <Route path="/governance" element={
                  <ProtectedRoute>
                    <GovernancePage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
