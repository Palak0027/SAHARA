import React, { useState } from "react";
import {
  Shield,
  Building,
  LogOut,
  Bell,
} from "lucide-react";
import { User } from "../../../context/AuthContext";
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
  const hi = language === "hi";

  const [emailNotifs, setEmailNotifs] = useState(() => {
    return localStorage.getItem("rd_email_notifs") !== "false";
  });
  const [appNotifs, setAppNotifs] = useState(() => {
    return localStorage.getItem("rd_app_notifs") !== "false";
  });

  const handleToggleEmail = (value: boolean) => {
    setEmailNotifs(value);
    localStorage.setItem("rd_email_notifs", String(value));
  };

  const handleToggleApp = (value: boolean) => {
    setAppNotifs(value);
    localStorage.setItem("rd_app_notifs", String(value));
  };

  const t = {
    heading: hi ? "रिसीवर खाता और प्रोफ़ाइल" : "Receiver Account & Profile",
    subtitle: hi
      ? "अपने सत्यापन विवरण, पंजीकृत पते और सूचना प्राथमिकताओं को प्रबंधित करें"
      : "Your verification credentials, registered address, and alert preferences",
    organization: hi ? "संस्था" : "Organization",
    communityBeneficiary: hi ? "सामुदायिक लाभार्थी" : "Community Beneficiary",
    individual: hi ? "व्यक्तिगत" : "Individual",
    representative: hi ? "प्रतिनिधि / उपयोगकर्ता का नाम" : "Representative / User Name",
    phone: hi ? "संपर्क फ़ोन नंबर" : "Phone Contact",
    email: hi ? "ईमेल पता" : "Email Address",
    beneficiaryType: hi ? "लाभार्थी का प्रकार" : "Beneficiary Type",
    deliveryLocation: hi ? "डिफ़ॉल्ट डिलीवरी स्थान" : "Default Delivery Location",
    unavailable: hi ? "उपलब्ध नहीं" : "Not available",
    unspecified: hi ? "निर्दिष्ट नहीं" : "Not specified",
    addressUnspecified: hi ? "पता निर्दिष्ट नहीं" : "Address not specified",
    organizationVerification: hi ? "संस्था सत्यापन" : "Organization Verification",
    registeredName: hi ? "पंजीकृत नाम" : "Registered Name",
    registrationNumber: hi ? "पंजीकरण / सोसायटी नंबर" : "Registration / Society No.",
    pendingSubmission: hi ? "जमा करना बाकी है" : "Pending submission",
    notifications: hi ? "सूचना अलर्ट" : "Notification Alerts",
    volunteerAlerts: hi ? "स्वयंसेवक मिलान अलर्ट" : "Volunteer Match Alerts",
    volunteerDescription: hi
      ? "जब कोई दाता या स्वयंसेवक आपके अनुरोध को स्वीकार करे, तो तुरंत सूचना पाएँ"
      : "Get instant notification when a donor or volunteer accepts your request",
    deliveryUpdates: hi ? "SMS और डिलीवरी अपडेट" : "SMS & Delivery Updates",
    deliveryDescription: hi
      ? "अपने पंजीकृत फ़ोन पर OTP और भेजे जाने से जुड़े रीयल-टाइम अपडेट पाएँ"
      : "Receive real-time OTP and dispatch updates on your registered phone",
    logout: hi ? "खाते से लॉग आउट करें" : "Log Out of Account",
    toggleApp: hi ? "ऐप सूचनाएँ चालू/बंद करें" : "Toggle App notifications",
    toggleEmail: hi ? "SMS और डिलीवरी सूचनाएँ चालू/बंद करें" : "Toggle SMS and delivery notifications",
  };

  const userName = user?.name || (hi ? "रिसीवर उपयोगकर्ता" : "Receiver User");
  const initial = userName.charAt(0).toUpperCase();
  const receiverType = user?.receiverType || "Individual";
  const receiverTypeLabel =
    receiverType.toLowerCase() === "individual"
      ? t.individual
      : receiverType.toLowerCase() === "family"
        ? hi ? "परिवार" : "Family"
        : receiverType.toLowerCase() === "community"
          ? hi ? "समुदाय" : "Community"
          : receiverType.toLowerCase() === "organization" || receiverType.toLowerCase() === "organisation"
            ? hi ? "संस्था" : "Organization"
            : receiverType;

  return (
    <section className="rd-narrow rd-stack">
      <div className="rd-section-head">
        <div>
          <h2 className="rd-section-title">{t.heading}</h2>
          <p className="rd-section-sub">{t.subtitle}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rd-card">
        <div className="rd-profile-head">
          <div className="rd-avatar">{initial}</div>
          <div>
            <h3 className="rd-profile-name">{userName}</h3>
            <p
              className="rd-profile-role"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Shield size={13} color="var(--forest)" />
              {user?.organization?.orgName
                ? `${t.organization}: ${user.organization.orgName}`
                : `${t.communityBeneficiary} (${receiverTypeLabel})`}
            </p>
          </div>
        </div>

        <div className="rd-fields">
          <div className="rd-field">
            <span className="rd-field-label">{t.representative}</span>
            <p className="rd-field-value">{user?.name || t.unavailable}</p>
          </div>

          <div className="rd-field">
            <span className="rd-field-label">{t.phone}</span>
            <p className="rd-field-value">{user?.phone || t.unavailable}</p>
          </div>

          <div className="rd-field">
            <span className="rd-field-label">{t.email}</span>
            <p className="rd-field-value">{user?.email || t.unspecified}</p>
          </div>

          <div className="rd-field">
            <span className="rd-field-label">{t.beneficiaryType}</span>
            <p className="rd-field-value" style={{ textTransform: "capitalize" }}>
              {receiverTypeLabel}
            </p>
          </div>

          <div className="rd-field" style={{ gridColumn: "1 / -1" }}>
            <span className="rd-field-label">{t.deliveryLocation}</span>
            <p className="rd-field-value">
              {user?.location?.address || t.addressUnspecified}
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
            <h3 className="rd-card-title" style={{ margin: 0 }}>
              {t.organizationVerification}
            </h3>
          </div>

          <div className="rd-fields">
            <div className="rd-field">
              <span className="rd-field-label">{t.registeredName}</span>
              <p className="rd-field-value">{user.organization.orgName}</p>
            </div>
            <div className="rd-field">
              <span className="rd-field-label">{t.registrationNumber}</span>
              <p className="rd-field-value">
                {user.organization.regNumber || t.pendingSubmission}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Card */}
      <div className="rd-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Bell size={18} color="var(--forest)" />
          <h3 className="rd-card-title" style={{ margin: 0 }}>{t.notifications}</h3>
        </div>

        <div className="rd-toggle-row">
          <div>
            <p className="rd-toggle-title">{t.volunteerAlerts}</p>
            <p className="rd-toggle-desc">{t.volunteerDescription}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={appNotifs}
            aria-label={t.toggleApp}
            onClick={() => handleToggleApp(!appNotifs)}
            className="rd-switch"
          />
        </div>

        <div className="rd-toggle-row">
          <div>
            <p className="rd-toggle-title">{t.deliveryUpdates}</p>
            <p className="rd-toggle-desc">{t.deliveryDescription}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={emailNotifs}
            aria-label={t.toggleEmail}
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
        <LogOut size={16} /> {t.logout}
      </button>
    </section>
  );
};

export default AccountTab;
