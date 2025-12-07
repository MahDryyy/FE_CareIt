"use client";
import { useState } from "react";
import DashboardDokter from "./component/dashboard_Dokter";
import DashboardAdmin from "./component/dashboard_Admin_Ruangan";
import LandingPage from "./component/landingpage";
import Login from "./component/login";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "login" | "dashboard">("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"dokter" | "admin" | "">("");

  // Always start from landing page - removed auto-redirect to dashboard

  // Handle navigation from landing page to login
  const handleStartNow = () => {
    setCurrentPage("login");
  };

  // Handle back to landing page
  const handleBackToLanding = () => {
    setCurrentPage("landing");
  };

  // Handle login success
  const handleLoginSuccess = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role as "dokter" | "admin");
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);
    setCurrentPage("dashboard");
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    setCurrentPage("login");
  };

  // Render based on current page
  if (currentPage === "landing") {
    return <LandingPage onStartNow={handleStartNow} />;
  }

  if (currentPage === "login") {
    return <Login onLoginSuccess={handleLoginSuccess} onBackToLanding={handleBackToLanding} />;
  }

  // Render dashboard based on role
  if (userRole === "admin") {
    return <DashboardAdmin onLogout={handleLogout} />;
  }

  return <DashboardDokter onLogout={handleLogout} />;
}
