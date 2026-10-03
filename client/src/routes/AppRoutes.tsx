import { Navigate, Route, Routes } from "react-router-dom";

import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DonatorDashboard from "../pages/DonatorDashboard";
import ReceiverDashboard from "../pages/ReceiverDashboard";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ed]">
        <p className="text-green-700 font-medium">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RoleRoute({
  role,
  children,
}: {
  role: "donor" | "receiver";
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user?.activeRole !== role) {
    if (user?.activeRole === "receiver") {
      return <Navigate to="/receiver-dashboard" replace />;
    }

    return <Navigate to="/donator-dashboard" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<App />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Donor Dashboard */}
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

      {/* Receiver Dashboard */}
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

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}