import React, { useEffect, useState } from "react";
import { Bell, Menu, PlusCircle, RefreshCw, CheckCircle2, Clock, AlertTriangle, Languages, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ReceiverTab, ReceiverNotification } from "./types";

interface ReceiverHeaderProps {
  activeTab: ReceiverTab;
  setSidebarOpen: (open: boolean) => void;
  onRaiseNeedClick: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  notifications: ReceiverNotification[];
}

export const ReceiverHeader: React.FC<ReceiverHeaderProps> = ({ activeTab, setSidebarOpen, onRaiseNeedClick, onRefresh, refreshing, notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">(() => {
    try { return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en"; } catch { return "en"; }
  });
  const hi = language === "hi";
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const syncLanguage = (event?: Event) => {
      const detail = (event as CustomEvent<string> | undefined)?.detail;
      try { setLanguage(detail === "hi" || (!detail && localStorage.getItem("sahara-language") === "hi") ? "hi" : "en"); }
      catch { setLanguage(detail === "hi" ? "hi" : "en"); }
    };
    window.addEventListener("sahara-language-change", syncLanguage);
    window.addEventListener("storage", syncLanguage);
    return () => {
      window.removeEventListener("sahara-language-change", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  const toggleLanguage = () => {
    const next = hi ? "en" : "hi";
    setLanguage(next);
    try { localStorage.setItem("sahara-language", next); } catch { /* storage may be unavailable */ }
    window.dispatchEvent(new CustomEvent("sahara-language-change", { detail: next }));
  };

  const titles: Record<ReceiverTab, string> = {
    Overview: hi ? "अवलोकन" : "Overview",
    "Find Donations": hi ? "दान खोजें" : "Find Supplies",
    "Raise Need": hi ? "ज़रूरत दर्ज करें" : "Raise a Need",
    "My Requests": hi ? "मेरे अनुरोध" : "My Requests",
    Account: hi ? "प्रोफ़ाइल और खाता" : "Profile & Account",
  };
  const subtitles: Record<ReceiverTab, string> = {
    Overview: hi ? "स्थानीय समुदाय के दान और सहायता देखें" : "Track resource relief and local community donations",
    "Find Donations": hi ? "दाताओं द्वारा साझा की गई वस्तुएँ खोजें" : "Search, filter and claim resources posted by generous donors",
    "Raise Need": hi ? "समुदाय की ज़रूरत के लिए अनुरोध भेजें" : "Submit a resource request for immediate community fulfillment",
    "My Requests": hi ? "अपने अनुरोधों की स्थिति देखें" : "Track status of your submitted needs from match to delivery",
    Account: hi ? "अपनी प्रोफ़ाइल और लाभार्थी विवरण प्रबंधित करें" : "Your profile details, beneficiary registrations, and settings",
  };

  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [switching, setSwitching] = useState(false);

  const handleSwitchToDonor = async () => {
    if (switching) return;
    try {
      setSwitching(true);
      await switchRole("donor");
      navigate("/donator-dashboard");
    } catch (err: any) {
      console.error("Failed to switch to donor:", err);
      alert(err?.response?.data?.message || err.message || "Failed to switch mode");
    } finally {
      setSwitching(false);
    }
  };

  return <header className="rd-header">
    <div className="rd-header-left">
      <button type="button" onClick={() => setSidebarOpen(true)} className="rd-icon-btn rd-menu-btn" aria-label={hi ? "मेनू खोलें" : "Open menu"}><Menu size={19} /></button>
      <div><p className="sd-header-kicker">{subtitles[activeTab]}</p><h2 className="rd-header-title">{titles[activeTab]}</h2></div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
      <button type="button" onClick={toggleLanguage} className="rd-btn rd-btn-outline rd-btn-sm" title={hi ? "भाषा बदलें" : "Change language"} aria-label={hi ? "Switch to English" : "हिंदी में बदलें"} style={{ display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}><Languages size={16} />{hi ? "English" : "हिंदी"}</button>
      
      {/* Switch Role Button */}
      <button
        type="button"
        onClick={handleSwitchToDonor}
        disabled={switching}
        title={hi ? "दाता (Donor) मोड में बदलें" : "Switch to Donor Mode"}
        aria-label={hi ? "Switch to Donor" : "Switch to Donor"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "linear-gradient(135deg, #2F5547 0%, #065A6B 100%)",
          color: "#ffffff",
          border: 0,
          borderRadius: "8px",
          padding: "6px 12px",
          fontSize: "0.82rem",
          fontWeight: 700,
          cursor: switching ? "not-allowed" : "pointer",
          boxShadow: "0 2px 6px rgba(47, 85, 71, 0.25)",
          whiteSpace: "nowrap",
          transition: "all 0.15s ease",
          opacity: switching ? 0.7 : 1,
        }}
      >
        <ArrowLeftRight size={14} className={switching ? "rd-spin" : ""} />
        <span>{switching ? (hi ? "बदल रहे हैं..." : "Switching...") : (hi ? "दाता मोड" : "Donor Mode")}</span>
      </button>

      <button type="button" onClick={onRefresh} disabled={refreshing} className="rd-icon-btn" title={hi ? "डैशबोर्ड रीफ़्रेश करें" : "Refresh dashboard data"} aria-label={hi ? "डेटा रीफ़्रेश करें" : "Refresh data"}><RefreshCw size={17} className={refreshing ? "rd-spin" : ""} /></button>
      {activeTab !== "Raise Need" && <button type="button" onClick={onRaiseNeedClick} className="rd-btn rd-btn-primary rd-btn-sm"><PlusCircle size={15} />{hi ? "ज़रूरत दर्ज करें" : "Raise a Need"}</button>}
      <div className="rd-notif-wrap">
        <button type="button" onClick={() => setShowNotifications((v) => !v)} aria-label={hi ? "सूचनाएँ" : "Notifications"} className="rd-icon-btn" title={hi ? "सूचनाएँ देखें" : "View notifications"}><Bell size={18} />{unreadCount > 0 && <span className="rd-dot" />}</button>
        {showNotifications && <>
          <button className="rd-notif-backdrop" aria-label={hi ? "सूचनाएँ बंद करें" : "Close notifications"} onClick={() => setShowNotifications(false)} />
          <div className="rd-notif" style={{ width: "320px", maxWidth: "calc(100vw - 32px)", maxHeight: "400px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}><strong>{hi ? "सूचनाएँ" : "Notifications"}</strong>{unreadCount > 0 && <span style={{ fontSize: "11px", background: "var(--leaf-soft)", color: "var(--forest)", padding: "2px 6px", borderRadius: "99px", fontWeight: 600 }}>{hi ? `${unreadCount} नई` : `${unreadCount} new`}</span>}</div>
            {notifications.length === 0 ? <p style={{ color: "var(--muted)", fontSize: "13px" }}>{hi ? "अभी कोई नई सूचना नहीं है।" : "No new notifications at this time."}</p> : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{notifications.map((n) => <div key={n.id} style={{ padding: "8px 10px", borderRadius: "8px", background: n.read ? "transparent" : "var(--paper)", border: "1px solid var(--line)", fontSize: "12.5px" }}><div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>{n.type === "success" && <CheckCircle2 size={14} color="var(--green)" />}{n.type === "warning" && <AlertTriangle size={14} color="var(--pending)" />}{n.type === "info" && <Clock size={14} color="var(--leaf)" />}<span>{n.title}</span></div><p style={{ margin: "3px 0 0", color: "var(--muted)" }}>{n.message}</p><span style={{ fontSize: "11px", color: "var(--faint)", display: "block", marginTop: "4px" }}>{n.time}</span></div>)}</div>}
          </div>
        </>}
      </div>
    </div>
  </header>;
};
export default ReceiverHeader;
