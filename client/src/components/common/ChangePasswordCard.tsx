import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { changePassword } from "../../services/api/auth";

export interface ChangePasswordCardProps {
  onSuccess?: (message: string) => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({
  onSuccess,
  className = "",
  title = "Security & Change Password",
  subtitle = "Ensure your account is protected with a secure and unique password.",
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isMinLength = newPassword.length >= 6;
  const isMatch = Boolean(confirmPassword && newPassword === confirmPassword);
  const isDifferent = Boolean(newPassword && currentPassword && newPassword !== currentPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!currentPassword.trim()) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password cannot be the same as your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        const msg = res.message || "Password changed successfully!";
        setSuccessMsg(msg);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (onSuccess) onSuccess(msg);
      } else {
        setError(res.message || "Failed to update password.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`sd-card ${className}`}
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "22px 24px",
        border: "1px solid #dce8e5",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "18px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#e8f4f2",
            color: "#0b5563",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <KeyRound size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#162828" }}>
            {title}
          </h3>
          <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#617775" }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#edfbf3",
            border: "1px solid #b7ebd0",
            color: "#166534",
            fontSize: "13.5px",
            marginBottom: "16px",
          }}
        >
          <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: "13.5px",
            marginBottom: "16px",
          }}
        >
          <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Current Password Field */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#283b3a",
              marginBottom: "6px",
            }}
          >
            Current Password <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your existing account password"
              required
              style={{
                width: "100%",
                padding: "10px 42px 10px 14px",
                borderRadius: "8px",
                border: "1px solid #cfdcd9",
                fontSize: "13.5px",
                outline: "none",
                transition: "border-color 0.15s ease",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: 0,
                color: "#6b8381",
                cursor: "pointer",
                padding: "4px",
                display: "grid",
                placeItems: "center",
              }}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password & Confirm Password Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {/* New Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#283b3a",
                marginBottom: "6px",
              }}
            >
              New Password <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                style={{
                  width: "100%",
                  padding: "10px 42px 10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cfdcd9",
                  fontSize: "13.5px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: 0,
                  color: "#6b8381",
                  cursor: "pointer",
                  padding: "4px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Length helper */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px", fontSize: "11.5px", color: newPassword ? (isMinLength ? "#16a34a" : "#dc2626") : "#718987" }}>
              <span>{isMinLength ? "✓" : "•"} Minimum 6 characters</span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#283b3a",
                marginBottom: "6px",
              }}
            >
              Confirm New Password <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                style={{
                  width: "100%",
                  padding: "10px 42px 10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cfdcd9",
                  fontSize: "13.5px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: 0,
                  color: "#6b8381",
                  cursor: "pointer",
                  padding: "4px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Match helper */}
            {confirmPassword && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px", fontSize: "11.5px", color: isMatch ? "#16a34a" : "#dc2626" }}>
                <span>{isMatch ? "✓ Passwords match" : "✕ Passwords do not match"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
          {(currentPassword || newPassword || confirmPassword) && (
            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setError(null);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #d3e0dd",
                background: "#ffffff",
                color: "#617775",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #0b5563, #15798c)",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 3px 10px rgba(11, 85, 99, 0.2)",
              transition: "transform 0.15s ease",
            }}
          >
            <Lock size={15} />
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordCard;
