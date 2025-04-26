
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import MainLayout from "@/layouts/MainLayout";

// This is a wrapper component that will redirect to login or render the dashboard
const Index = () => {
  const navigate = useNavigate();
  // Simulate authenticated state - in a real app, this would come from an auth context
  const isAuthenticated = true; // For demo purposes, assume user is authenticated

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // This will briefly show before redirecting
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default Index;
