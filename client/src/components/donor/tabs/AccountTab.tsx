import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  Award,
  LogOut,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { User } from "../../../context/AuthContext";
import { MyImpactData, donorApi } from "../../../services/api/donorApi";
import ChangePasswordCard from "../../common/ChangePasswordCard";

interface AccountTabProps {
  user: User | null;
  onLogout: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({ user, onLogout }) => {
  const [impact, setImpact] = useState<MyImpactData | null>(null);
  const [loadingImpact, setLoadingImpact] = useState(true);

  const [emailNotifs, setEmailNotifs] = useState(() => {
    return localStorage.getItem("sd_email_notifs") !== "false";
  });
  const [appNotifs, setAppNotifs] = useState(() => {
    return localStorage.getItem("sd_app_notifs") !== "false";
  });

  const handleToggleEmail = (val: boolean) => {
    setEmailNotifs(val);
    localStorage.setItem("sd_email_notifs", String(val));
  };

  const handleToggleApp = (val: boolean) => {
    setAppNotifs(val);
    localStorage.setItem("sd_app_notifs", String(val));
  };

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        setLoadingImpact(true);
        const res = await donorApi.getMyImpact();
        if (res.success && res.impact) {
          setImpact(res.impact);
        }
      } catch {
        // Fallback or quiet fail
      } finally {
        setLoadingImpact(false);
      }
    };

    fetchImpact();
  }, []);

  const userName = user?.name || "Donor User";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <section className="sd-narrow sd-stack">
      <div className="sd-section-head">
        <div>
          <h2 className="sd-section-title">Profile & Preferences</h2>
          <p className="sd-section-sub">
            Manage your personal profile, notification alerts, and view your verified impact
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="sd-card">
        <div className="sd-profile-head">
          <div className="sd-avatar">{initial}</div>
          <div>
            <h3 className="sd-profile-name">{userName}</h3>
            <p className="sd-profile-role" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Shield size={13} color="var(--forest)" />
              Verified SAHARA Donor Account
            </p>
          </div>
        </div>

        <div className="sd-fields">
          <div className="sd-field">
            <span className="sd-field-label">Full Name</span>
            <p className="sd-field-value">{user?.name || "Not available"}</p>
          </div>

          <div className="sd-field">
            <span className="sd-field-label">Mobile Number</span>
            <p className="sd-field-value">{user?.phone || "Not available"}</p>
          </div>

          <div className="sd-field">
            <span className="sd-field-label">Email Address</span>
            <p className="sd-field-value">{user?.email || "Not specified"}</p>
          </div>

          <div className="sd-field">
            <span className="sd-field-label">Registered City</span>
            <p className="sd-field-value">{user?.location?.city || "Not available"}</p>
          </div>

          <div className="sd-field" style={{ gridColumn: "1 / -1" }}>
            <span className="sd-field-label">Default Pickup Address</span>
            <p className="sd-field-value">
              {user?.location?.address || "Not provided in profile"}
              {user?.location?.pincode ? ` - ${user.location.pincode}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="sd-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Award size={20} color="var(--forest)" />
          <h3 className="sd-card-title" style={{ margin: 0 }}>Your Lifetime Impact</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          <div style={{ background: "var(--paper)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--forest)", display: "block" }}>
              {loadingImpact ? "..." : impact?.totalDonations ?? 0}
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>Total Contributions</span>
          </div>

          <div style={{ background: "var(--paper)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--cloth)", display: "block" }}>
              {loadingImpact ? "..." : impact?.peopleHelped ?? 0}
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>People Supported</span>
          </div>

          <div style={{ background: "var(--paper)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--green)", display: "block" }}>
              {loadingImpact ? "..." : impact?.completedDonations ?? 0}
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>Deliveries Completed</span>
          </div>
        </div>
      </div>

      {/* Notifications Card */}
      <div className="sd-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Bell size={18} color="var(--forest)" />
          <h3 className="sd-card-title" style={{ margin: 0 }}>Notification Preferences</h3>
        </div>

        <div className="sd-toggle-row">
          <div>
            <p className="sd-toggle-title">In-App Notification Alerts</p>
            <p className="sd-toggle-desc">Get instant alerts when volunteers are assigned or items are delivered</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={appNotifs}
            aria-label="Toggle App notifications"
            onClick={() => handleToggleApp(!appNotifs)}
            className="sd-switch"
          />
        </div>

        <div className="sd-toggle-row">
          <div>
            <p className="sd-toggle-title">SMS & Email Summaries</p>
            <p className="sd-toggle-desc">Receive weekly impact summaries and urgent community need alerts</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={emailNotifs}
            aria-label="Toggle Email notifications"
            onClick={() => handleToggleEmail(!emailNotifs)}
            className="sd-switch"
          />
        </div>
      </div>

      {/* Security & Password */}
      <ChangePasswordCard />

      {/* Logout */}
      <button
        onClick={onLogout}
        className="sd-btn sd-btn-outline sd-btn-block sd-logout"
        style={{ marginTop: "8px" }}
      >
        <LogOut size={16} /> Log Out of Account
      </button>
    </section>
  );
};

export default AccountTab;
