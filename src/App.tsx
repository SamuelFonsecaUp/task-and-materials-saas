
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Materials from "./pages/Materials";
import Clients from "./pages/Clients";
import MainLayout from "./layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route 
            path="/projects" 
            element={
              <MainLayout>
                <Projects />
              </MainLayout>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <MainLayout>
                <Tasks />
              </MainLayout>
            } 
          />
          <Route 
            path="/materials" 
            element={
              <MainLayout>
                <Materials />
              </MainLayout>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <MainLayout>
                <Clients />
              </MainLayout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
