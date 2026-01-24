import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TOGAFPage from "./pages/TOGAFPage";
import ZachmanPage from "./pages/ZachmanPage";
import DoDAFPage from "./pages/DoDAFPage";
import FEAFPage from "./pages/FEAFPage";
import RepositoryPage from "./pages/RepositoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/togaf" element={<TOGAFPage />} />
          <Route path="/zachman" element={<ZachmanPage />} />
          <Route path="/dodaf" element={<DoDAFPage />} />
          <Route path="/feaf" element={<FEAFPage />} />
          <Route path="/repository/:domain" element={<RepositoryPage />} />
          {/* Placeholder routes */}
          <Route path="/diagrams" element={<Index />} />
          <Route path="/requirements" element={<Index />} />
          <Route path="/governance" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
