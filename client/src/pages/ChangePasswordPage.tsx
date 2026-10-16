import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Sparkles } from "lucide-react";
import ChangePasswordCard from "../components/common/ChangePasswordCard";
import { useAuth } from "../context/AuthContext";
import logoImg from "../components/image/sahara-logo.jpeg";

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackToDashboard = () => {
    const role = user?.activeRole || user?.role;
    if (role === "receiver") {
      navigate("/receiver-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "volunteer") {
      navigate("/volunteer-dashboard");
    } else {
      navigate("/donator-dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f6",
        padding: "30px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={handleBackToDashboard}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #cfded9",
            background: "#ffffff",
            color: "#0b5563",
            fontSize: "13.5px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={logoImg}
            alt="SAHARA Logo"
            style={{ width: "32px", height: "32px", borderRadius: "8px", objectFit: "cover" }}
          />
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#0b5563", letterSpacing: "0.5px" }}>
            SAHARA
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#e5f4ef",
              color: "#0b5563",
              padding: "4px 12px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            <Shield size={13} />
            Account Security Center
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#162828", margin: 0 }}>
            Change Account Password
          </h1>
          <p style={{ fontSize: "14px", color: "#5d7472", margin: "6px 0 0" }}>
            Update your login credentials securely for your verified SAHARA profile.
          </p>
        </div>

        <ChangePasswordCard
          onSuccess={() => {
            setTimeout(() => {
              handleBackToDashboard();
            }, 1800);
          }}
        />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
