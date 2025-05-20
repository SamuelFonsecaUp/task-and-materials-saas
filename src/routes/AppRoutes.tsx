
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Materials from "@/pages/Materials";
import Clients from "@/pages/Clients";
import CrmProspects from "@/pages/CrmProspects";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login route - accessible to all */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes by role */}
      
      {/* Dashboard - Accessible to all roles */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } 
            allowedRoles={["client", "collaborator", "admin"]} 
          />
        } 
      />
      
      {/* Tasks - Accessible to collaborators and admins */}
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <Tasks />
              </MainLayout>
            } 
            allowedRoles={["collaborator", "admin"]} 
          />
        } 
      />
      
      {/* Projects - Accessible to collaborators and admins */}
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <Projects />
              </MainLayout>
            } 
            allowedRoles={["collaborator", "admin"]} 
          />
        } 
      />
      
      {/* Materials - Accessible to collaborators and admins */}
      <Route 
        path="/materials" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <Materials />
              </MainLayout>
            } 
            allowedRoles={["collaborator", "admin"]} 
          />
        } 
      />
      
      {/* Clients - Accessible only to admins */}
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <Clients />
              </MainLayout>
            } 
            allowedRoles={["admin"]} 
          />
        } 
      />
      
      {/* CRM Prospects - Accessible to collaborators and admins */}
      <Route 
        path="/crm-prospects" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <CrmProspects />
              </MainLayout>
            } 
            allowedRoles={["collaborator", "admin"]} 
          />
        } 
      />
      
      {/* Profile - Accessible to all roles */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <Profile />
              </MainLayout>
            } 
            allowedRoles={["client", "collaborator", "admin"]} 
          />
        } 
      />
      
      {/* Settings - Accessible to collaborators and admins */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute 
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            } 
            allowedRoles={["collaborator", "admin"]} 
          />
        } 
      />
      
      {/* Home page redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 page for routes not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
