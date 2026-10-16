import React, { useState } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Shield,
  Building,
  LogOut,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { User } from "../../../context/AuthContext";
import ChangePasswordCard from "../../common/ChangePasswordCard";

interface AccountTabProps {
  user: User | null;
  onLogout: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({ user, onLogout }) => {
  const [emailNotifs, setEmailNotifs] = useState(() => {
    return localStorage.getItem("rd_email_notifs") !== "false";
  });
  const [appNotifs, setAppNotifs] = useState(() => {
    return localStorage.getItem("rd_app_notifs") !== "false";
  });

  const handleToggleEmail = (val: boolean) => {
    setEmailNotifs(val);
    localStorage.setItem("rd_email_notifs", String(val));
  };

  const handleToggleApp = (val: boolean) => {
    setAppNotifs(val);
    localStorage.setItem("rd_app_notifs", String(val));
  };

  const userName = user?.name || "Receiver User";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <section className="rd-narrow rd-stack">
      <div className="rd-section-head">
        <div>
          <h2 className="rd-section-title">Receiver Account & Profile</h2>
          <p className="rd-section-sub">
            Your verification credentials, registered address, and alert preferences
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rd-card">
        <div className="rd-profile-head">
          <div className="rd-avatar">{initial}</div>
          <div>
            <h3 className="rd-profile-name">{userName}</h3>
            <p className="rd-profile-role" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Shield size={13} color="var(--forest)" />
              {user?.organization?.orgName
                ? `Organization: ${user.organization.orgName}`
                : `Community Beneficiary (${user?.receiverType || "Individual"})`}
            </p>
          </div>
        </div>

        <div className="rd-fields">
          <div className="rd-field">
            <span className="rd-field-label">Representative / User Name</span>
            <p className="rd-field-value">{user?.name || "Not available"}</p>
          </div>

          <div className="rd-field">
            <span className="rd-field-label">Phone Contact</span>
            <p className="rd-field-value">{user?.phone || "Not available"}</p>
          </div>

          <div className="rd-field">
            <span className="rd-field-label">Email Address</span>
            <p className="rd-field-value">{user?.email || "Not specified"}</p>
          </div>

          <div className="rd-field">
            <span className="rd-field-label">Beneficiary Type</span>
            <p className="rd-field-value" style={{ textTransform: "capitalize" }}>
              {user?.receiverType || "Individual"}
            </p>
          </div>

          <div className="rd-field" style={{ gridColumn: "1 / -1" }}>
            <span className="rd-field-label">Default Delivery Location</span>
            <p className="rd-field-value">
              {user?.location?.address || "Address not specified"}
              {user?.location?.city ? `, ${user.location.city}` : ""}
              {user?.location?.pincode ? ` - ${user.location.pincode}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Organization Credentials (if registered as NGO/Shelter) */}
      {user?.organization?.orgName && (
        <div className="rd-card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Building size={18} color="var(--forest)" />
            <h3 className="rd-card-title" style={{ margin: 0 }}>Organization Verification</h3>
          </div>

          <div className="rd-fields">
            <div className="rd-field">
              <span className="rd-field-label">Registered Name</span>
              <p className="rd-field-value">{user.organization.orgName}</p>
            </div>
            <div className="rd-field">
              <span className="rd-field-label">Registration / Society No.</span>
              <p className="rd-field-value">{user.organization.regNumber || "Pending submission"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Card */}
      <div className="rd-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Bell size={18} color="var(--forest)" />
          <h3 className="rd-card-title" style={{ margin: 0 }}>Notification Alerts</h3>
        </div>

        <div className="rd-toggle-row">
          <div>
            <p className="rd-toggle-title">Volunteer Match Alerts</p>
            <p className="rd-toggle-desc">Get instant notification when a donor or volunteer accepts your request</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={appNotifs}
            aria-label="Toggle App notifications"
            onClick={() => handleToggleApp(!appNotifs)}
            className="rd-switch"
          />
        </div>

        <div className="rd-toggle-row">
          <div>
            <p className="rd-toggle-title">SMS & Delivery Updates</p>
            <p className="rd-toggle-desc">Receive real-time OTP and dispatch updates on your registered phone</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={emailNotifs}
            aria-label="Toggle Email notifications"
            onClick={() => handleToggleEmail(!emailNotifs)}
            className="rd-switch"
          />
        </div>
      </div>

      {/* Security & Password */}
      <ChangePasswordCard />

      {/* Logout */}
      <button
        onClick={onLogout}
        className="rd-btn rd-btn-outline rd-btn-block rd-logout"
        style={{ marginTop: "8px" }}
      >
        <LogOut size={16} /> Log Out of Account
      </button>
    </section>
  );
};

export default AccountTab;
