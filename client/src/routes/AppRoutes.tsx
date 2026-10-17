import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";

import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import DonatorDashboard from "../pages/DonatorDashboard";
import ReceiverDashboard from "../pages/ReceiverDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import VolunteerDashboard from "../pages/VolunteerDashboard";

import {
  useAuth,
  type UserRole,
} from "../context/AuthContext";

// --------------------------------------------------
// Loading Screen
// --------------------------------------------------

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8F5]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />

        <p className="text-sm text-gray-500">
          Loading SAHARA...
        </p>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Protected Route
// --------------------------------------------------

function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}

// --------------------------------------------------
// Role Route
// --------------------------------------------------

function RoleRoute({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Use activeRole first because the backend
  // sends activeRole for authenticated users.
  // Fall back to role if activeRole is missing.

  const currentRole =
    user.activeRole || user.role;

  // Correct role → allow dashboard

  if (currentRole === role) {
    return <>{children}</>;
  }

  // If role doesn't match, redirect to
  // the user's own dashboard.

  if (currentRole === "admin") {
    return (
      <Navigate
        to="/admin-dashboard"
        replace
      />
    );
  }

  if (currentRole === "volunteer") {
    return (
      <Navigate
        to="/volunteer-dashboard"
        replace
      />
    );
  }

  if (currentRole === "receiver") {
    return (
      <Navigate
        to="/receiver-dashboard"
        replace
      />
    );
  }

  if (currentRole === "donor") {
    return (
      <Navigate
        to="/donator-dashboard"
        replace
      />
    );
  }

  // Unknown / missing role

  return (
    <Navigate
      to="/"
      replace
    />
  );
}

// --------------------------------------------------
// App Routes
// --------------------------------------------------

export default function AppRoutes() {
  return (
    <Routes>
      {/* -------------------------------------------
          PUBLIC PAGES
      ------------------------------------------- */}

      <Route
        path="/"
        element={<App />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* -------------------------------------------
          FORGOT PASSWORD
      ------------------------------------------- */}

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* -------------------------------------------
          RESET PASSWORD
      ------------------------------------------- */}

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* -------------------------------------------
          DONOR DASHBOARD
      ------------------------------------------- */}

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

      {/* -------------------------------------------
          RECEIVER DASHBOARD
      ------------------------------------------- */}

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

      {/* -------------------------------------------
          VOLUNTEER DASHBOARD
      ------------------------------------------- */}

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

      {/* -------------------------------------------
          ADMIN DASHBOARD
      ------------------------------------------- */}

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

      {/* -------------------------------------------
          UNKNOWN ROUTE
      ------------------------------------------- */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}
