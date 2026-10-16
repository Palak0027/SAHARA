import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";

import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DonatorDashboard from "../pages/DonatorDashboard";
import ReceiverDashboard from "../pages/ReceiverDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import VolunteerDashboard from "../pages/VolunteerDashboard";
import ChangePasswordPage from "../pages/ChangePasswordPage";

import { useAuth, type UserRole } from "../context/AuthContext";


// ===============================
// PROTECTED ROUTE
// ===============================

function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8F5]">
        <p className="text-[#4F7C68]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}


// ===============================
// ROLE ROUTE
// ===============================

function RoleRoute({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const { user } = useAuth();

  const currentRole = user?.activeRole || user?.role;

  if (currentRole === role) {
    return <>{children}</>;
  }

  // Redirect user to their actual dashboard
  if (currentRole === "receiver") {
    return <Navigate to="/receiver-dashboard" replace />;
  }

  if (currentRole === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (currentRole === "volunteer") {
    return <Navigate to="/volunteer-dashboard" replace />;
  }

  return <Navigate to="/donator-dashboard" replace />;
}


// ===============================
// APP ROUTES
// ===============================

export default function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          HOMEPAGE
      ========================= */}
      <Route
        path="/"
        element={<App />}
      />


      {/* =========================
          AUTH
      ========================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =========================
          DONATOR
      ========================= */}
      <Route
        path="/donator-dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="donor">
              <DonatorDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />


      {/* =========================
          RECEIVER
      ========================= */}
      <Route
        path="/receiver-dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="receiver">
              <ReceiverDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN
      ========================= */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />


      {/* =========================
          VOLUNTEER
      ========================= */}
      <Route
        path="/volunteer-dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="volunteer">
              <VolunteerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />


      {/* =========================
          CHANGE PASSWORD
      ========================= */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />


      {/* =========================
          UNKNOWN URL
      ========================= */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}