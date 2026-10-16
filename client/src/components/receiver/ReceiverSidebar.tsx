import React from "react";
import logoImg from "../image/sahara-logo.jpeg";
import {
  Home,
  Search,
  PlusCircle,
  Package,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { ReceiverTab } from "./types";

interface ReceiverSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: ReceiverTab;
  navigateTab: (tab: ReceiverTab) => void;
  userName: string;
  openNeedsCount: number;
  availableDonationsCount: number;
  onLogout: () => void;
}

export const ReceiverSidebar: React.FC<ReceiverSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  navigateTab,
  userName,
  openNeedsCount,
  availableDonationsCount,
  onLogout,
}) => {
  const navigation: { name: ReceiverTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { name: "Overview", label: "Overview", icon: <Home size={18} /> },
    { name: "Find Donations", label: "Find Supplies", icon: <Search size={18} />, badge: availableDonationsCount },
    { name: "Raise Need", label: "Raise a Need", icon: <PlusCircle size={18} /> },
    { name: "My Requests", label: "My Requests", icon: <Package size={18} />, badge: openNeedsCount },
    { name: "Account", label: "Profile & Account", icon: <Settings size={18} /> },
  ];

  const initial = userName ? userName.charAt(0).toUpperCase() : "R";

  return (
    <>
      {sidebarOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setSidebarOpen(false)}
          className="rd-overlay"
        />
      )}

      <aside className={`rd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="rd-brand">
          <div className="rd-brand-main">
            <img src={logoImg} alt="SAHARA logo" className="rd-logo" />
            <div>
              <h1 className="rd-brand-name">SAHARA</h1>
              <p className="rd-brand-tag">Receiver Community</p>
            </div>
          </div>
          <button
            className="rd-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="rd-nav" aria-label="Receiver Navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => navigateTab(item.name)}
              className={`rd-nav-btn ${activeTab === item.name ? "is-active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="rd-nav-badge" title={`${item.badge} items`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="rd-user">
          <div className="rd-avatar">{initial}</div>
          <div className="rd-user-info">
            <p className="rd-user-name" title={userName}>
              {userName}
            </p>
            <p className="rd-user-role">Community Receiver</p>
          </div>
          <button
            onClick={onLogout}
            className="rd-icon-btn-dark"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default ReceiverSidebar;
