
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
  language?: "en" | "hi";
}

export const AccountTab: React.FC<AccountTabProps> = ({
  user,
  onLogout,
  language = "en",
}) => {
  const [impact, setImpact] = useState<MyImpactData | null>(null);
  const [loadingImpact, setLoadingImpact] = useState(true);

  const [emailNotifs, setEmailNotifs] = useState(() => {
    return localStorage.getItem("sd_email_notifs") !== "false";
  });

  const [appNotifs, setAppNotifs] = useState(() => {
    return localStorage.getItem("sd_app_notifs") !== "false";
  });

  const isHindi = language === "hi";

  const t = {
    heading: isHindi ? "प्रोफ़ाइल और प्राथमिकताएँ" : "Profile & Preferences",
    subtitle: isHindi
      ? "अपनी व्यक्तिगत प्रोफ़ाइल और सूचनाएँ प्रबंधित करें और अपने योगदान का प्रभाव देखें"
      : "Manage your personal profile, notification alerts, and view your verified impact",
    donorAccount: isHindi
      ? "सत्यापित SAHARA दाता खाता"
      : "Verified SAHARA Donor Account",
    fullName: isHindi ? "पूरा नाम" : "Full Name",
    mobile: isHindi ? "मोबाइल नंबर" : "Mobile Number",
    email: isHindi ? "ईमेल पता" : "Email Address",
    city: isHindi ? "पंजीकृत शहर" : "Registered City",
    pickupAddress: isHindi ? "डिफ़ॉल्ट पिकअप पता" : "Default Pickup Address",
    notAvailable: isHindi ? "उपलब्ध नहीं" : "Not available",
    notSpecified: isHindi ? "निर्दिष्ट नहीं" : "Not specified",
    notProvided: isHindi
      ? "प्रोफ़ाइल में उपलब्ध नहीं"
      : "Not provided in profile",
    lifetimeImpact: isHindi ? "आपका कुल योगदान" : "Your Lifetime Impact",
    totalContributions: isHindi ? "कुल योगदान" : "Total Contributions",
    peopleSupported: isHindi ? "लाभान्वित लोग" : "People Supported",
    deliveriesCompleted: isHindi ? "पूरी की गई डिलीवरी" : "Deliveries Completed",
    notificationPreferences: isHindi
      ? "सूचना संबंधी प्राथमिकताएँ"
      : "Notification Preferences",
    appNotifications: isHindi
      ? "ऐप के अंदर सूचना अलर्ट"
      : "In-App Notification Alerts",
    appNotificationDescription: isHindi
      ? "स्वयंसेवक नियुक्त होने या सामान पहुँचने पर तुरंत अलर्ट पाएँ"
      : "Get instant alerts when volunteers are assigned or items are delivered",
    emailNotifications: isHindi
      ? "SMS और ईमेल सारांश"
      : "SMS & Email Summaries",
    emailNotificationDescription: isHindi
      ? "साप्ताहिक योगदान सारांश और समुदाय की तत्काल आवश्यकताओं के अलर्ट पाएँ"
      : "Receive weekly impact summaries and urgent community need alerts",
    logout: isHindi ? "खाते से लॉग आउट करें" : "Log Out of Account",
    toggleApp: isHindi ? "ऐप सूचनाएँ चालू/बंद करें" : "Toggle App notifications",
    toggleEmail: isHindi
      ? "ईमेल सूचनाएँ चालू/बंद करें"
      : "Toggle Email notifications",
  };

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
        // Keep the page usable if impact data cannot be loaded.
      } finally {
        setLoadingImpact(false);
      }
    };

    fetchImpact();
  }, []);

  const userName = user?.name || (isHindi ? "दाता" : "Donor User");
  const initial = userName.charAt(0).toUpperCase();

  return (
    <section className="sd-narrow sd-stack">
      <div className="sd-section-head">
        <div>
          <h2 className="sd-section-title">{t.heading}</h2>
          <p className="sd-section-sub">{t.subtitle}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="sd-card">
        <div className="sd-profile-head">
          <div className="sd-avatar">{initial}</div>
          <div>
            <h3 className="sd-profile-name">{userName}</h3>
            <p
              className="sd-profile-role"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Shield size={13} color="var(--forest)" />
              {t.donorAccount}
            </p>
          </div>
        </div>

        <div className="sd-fields">
          <div className="sd-field">
            <span className="sd-field-label">{t.fullName}</span>
            <p className="sd-field-value">
              {user?.name || t.notAvailable}
            </p>
          </div>

          <div className="sd-field">
            <span className="sd-field-label">{t.mobile}</span>
            <p className="sd-field-value">
              {user?.phone || t.notAvailable}
            </p>
          </div>

          <div className="sd-field">
            <span className="sd-field-label">{t.email}</span>
            <p className="sd-field-value">
              {user?.email || t.notSpecified}
            </p>
          </div>

          <div className="sd-field">
            <span className="sd-field-label">{t.city}</span>
            <p className="sd-field-value">
              {user?.location?.city || t.notAvailable}
            </p>
          </div>

          <div className="sd-field" style={{ gridColumn: "1 / -1" }}>
            <span className="sd-field-label">{t.pickupAddress}</span>
            <p className="sd-field-value">
              {user?.location?.address || t.notProvided}
              {user?.location?.pincode
                ? ` - ${user.location.pincode}`
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="sd-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <Award size={20} color="var(--forest)" />
          <h3 className="sd-card-title" style={{ margin: 0 }}>
            {t.lifetimeImpact}
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "var(--paper)",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--forest)",
                display: "block",
              }}
            >
              {loadingImpact ? "..." : impact?.totalDonations ?? 0}
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              {t.totalContributions}
            </span>
          </div>

          <div
            style={{
              background: "var(--paper)",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--cloth)",
                display: "block",
              }}
            >
              {loadingImpact ? "..." : impact?.peopleHelped ?? 0}
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              {t.peopleSupported}
            </span>
          </div>

          <div
            style={{
              background: "var(--paper)",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--green)",
                display: "block",
              }}
            >
              {loadingImpact ? "..." : impact?.completedDonations ?? 0}
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              {t.deliveriesCompleted}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications Card */}
      <div className="sd-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <Bell size={18} color="var(--forest)" />
          <h3 className="sd-card-title" style={{ margin: 0 }}>
            {t.notificationPreferences}
          </h3>
        </div>

        <div className="sd-toggle-row">
          <div>
            <p className="sd-toggle-title">{t.appNotifications}</p>
            <p className="sd-toggle-desc">
              {t.appNotificationDescription}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={appNotifs}
            aria-label={t.toggleApp}
            onClick={() => handleToggleApp(!appNotifs)}
            className="sd-switch"
          />
        </div>

        <div className="sd-toggle-row">
          <div>
            <p className="sd-toggle-title">{t.emailNotifications}</p>
            <p className="sd-toggle-desc">
              {t.emailNotificationDescription}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={emailNotifs}
            aria-label={t.toggleEmail}
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
        <LogOut size={16} /> {t.logout}
      </button>
    </section>
  );
};

export default AccountTab;
