import React from "react";
import logoImg from "../image/sahara-logo.jpeg";
import {
  Home,
  Plus,
  Package,
  Users,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { DonorTab } from "./types";

interface DonorSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: DonorTab;
  navigateTab: (tab: DonorTab) => void;
  userName: string;
  urgentNeedsCount: number;
  onLogout: () => void;
}

export const DonorSidebar: React.FC<DonorSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  navigateTab,
  userName,
  urgentNeedsCount,
  onLogout,
}) => {
  const navigation: { name: DonorTab; label: string; icon: React.ReactNode }[] = [
    { name: "Overview", label: "Overview", icon: <Home size={18} /> },
    { name: "Post Donation", label: "Post Donation", icon: <Plus size={18} /> },
    { name: "My Donations", label: "My Donations", icon: <Package size={18} /> },
    { name: "Requests", label: "Community Needs", icon: <Users size={18} /> },
    { name: "Account", label: "Profile & Account", icon: <Settings size={18} /> },
  ];

  const initial = userName ? userName.charAt(0).toUpperCase() : "D";

  return (
    <>
      {sidebarOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setSidebarOpen(false)}
          className="sd-overlay"
        />
      )}

      <aside className={`sd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sd-brand">
          <div className="sd-brand-main">
            <img src={logoImg} alt="SAHARA logo" className="sd-logo" />
            <div>
              <h1 className="sd-brand-name">SAHARA</h1>
              <p className="sd-brand-tag">Donor Portal</p>
            </div>
          </div>
          <button
            className="sd-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sd-nav" aria-label="Donor Navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => navigateTab(item.name)}
              className={`sd-nav-btn ${activeTab === item.name ? "is-active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.name === "Requests" && urgentNeedsCount > 0 && (
                <span className="sd-nav-badge" title={`${urgentNeedsCount} open needs`}>
                  {urgentNeedsCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sd-user">
          <div className="sd-avatar">{initial}</div>
          <div className="sd-user-info">
            <p className="sd-user-name" title={userName}>
              {userName}
            </p>
            <p className="sd-user-role">Verified Donor</p>
          </div>
          <button
            onClick={onLogout}
            className="sd-icon-btn-dark"
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

export default DonorSidebar;
