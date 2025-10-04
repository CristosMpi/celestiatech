import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import ScenarioBuilder from "./pages/ScenarioBuilder";
import MapImpacts from "./pages/MapImpacts";
import MitigationCompare from "./pages/MitigationCompare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex items-center px-6">
                <SidebarTrigger className="mr-4">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
                  <span className="font-bold text-xl text-foreground">Climate Analytics</span>
                </div>
              </header>
              <main className="flex-1 p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/scenario-builder" element={<ScenarioBuilder />} />
                  <Route path="/map-impacts" element={<MapImpacts />} />
                  <Route path="/mitigation-compare" element={<MitigationCompare />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
