import React, { useEffect, useState } from "react";
import logoImg from "../image/sahara-logo.jpeg";
import { Home, Search, PlusCircle, Package, Settings, X, LogOut } from "lucide-react";
import { ReceiverTab } from "./types";

interface ReceiverSidebarProps {
  sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void;
  activeTab: ReceiverTab; navigateTab: (tab: ReceiverTab) => void;
  userName: string; openNeedsCount: number; availableDonationsCount: number; onLogout: () => void;
}
export const ReceiverSidebar: React.FC<ReceiverSidebarProps> = ({ sidebarOpen, setSidebarOpen, activeTab, navigateTab, userName, openNeedsCount, availableDonationsCount, onLogout }) => {
  const [language, setLanguage] = useState<"en" | "hi">(() => { try { return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en"; } catch { return "en"; } });
  const hi = language === "hi";
  useEffect(() => {
    const syncLanguage = (event?: Event) => { const detail = (event as CustomEvent<string> | undefined)?.detail; try { setLanguage(detail === "hi" || (!detail && localStorage.getItem("sahara-language") === "hi") ? "hi" : "en"); } catch { setLanguage(detail === "hi" ? "hi" : "en"); } };
    window.addEventListener("sahara-language-change", syncLanguage); window.addEventListener("storage", syncLanguage);
    return () => { window.removeEventListener("sahara-language-change", syncLanguage); window.removeEventListener("storage", syncLanguage); };
  }, []);
  const navigation: { name: ReceiverTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { name: "Overview", label: hi ? "अवलोकन" : "Overview", icon: <Home size={18} /> },
    { name: "Find Donations", label: hi ? "सामग्री खोजें" : "Find Supplies", icon: <Search size={18} />, badge: availableDonationsCount },
    { name: "Raise Need", label: hi ? "ज़रूरत दर्ज करें" : "Raise a Need", icon: <PlusCircle size={18} /> },
    { name: "My Requests", label: hi ? "मेरे अनुरोध" : "My Requests", icon: <Package size={18} />, badge: openNeedsCount },
    { name: "Account", label: hi ? "प्रोफ़ाइल और खाता" : "Profile & Account", icon: <Settings size={18} /> },
  ];
  const initial = userName ? userName.charAt(0).toUpperCase() : "R";
  return <>
    {sidebarOpen && <button type="button" aria-label={hi ? "मेनू बंद करें" : "Close menu overlay"} onClick={() => setSidebarOpen(false)} className="rd-overlay" />}
    <aside className={`rd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
      <div className="rd-brand"><div className="rd-brand-main"><img src={logoImg} alt="SAHARA logo" className="rd-logo" /><div><h1 className="rd-brand-name">SAHARA</h1><p className="rd-brand-tag">{hi ? "प्राप्तकर्ता समुदाय" : "Receiver Community"}</p></div></div><button type="button" className="rd-close-btn" onClick={() => setSidebarOpen(false)} aria-label={hi ? "मेनू बंद करें" : "Close menu"}><X size={20} /></button></div>
      <nav className="rd-nav" aria-label={hi ? "प्राप्तकर्ता नेविगेशन" : "Receiver Navigation"}>{navigation.map((item) => <button type="button" key={item.name} onClick={() => { navigateTab(item.name); setSidebarOpen(false); }} className={`rd-nav-btn ${activeTab === item.name ? "is-active" : ""}`}>{item.icon}<span>{item.label}</span>{Boolean(item.badge && item.badge > 0) && <span className="rd-nav-badge" title={hi ? `${item.badge} आइटम` : `${item.badge} items`}>{item.badge}</span>}</button>)}</nav>
      <div className="rd-user"><div className="rd-avatar">{initial}</div><div className="rd-user-info"><p className="rd-user-name" title={userName}>{userName}</p><p className="rd-user-role">{hi ? "सामुदायिक प्राप्तकर्ता" : "Community Receiver"}</p></div><button type="button" onClick={onLogout} className="rd-icon-btn-dark" title={hi ? "लॉग आउट करें" : "Log out"} aria-label={hi ? "लॉग आउट करें" : "Log out"}><LogOut size={17} /></button></div>
    </aside>
  </>;
};
export default ReceiverSidebar;
