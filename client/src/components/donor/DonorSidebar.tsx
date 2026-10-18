
import React, { useEffect, useState } from "react";
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
  const [language, setLanguage] = useState<"en" | "hi">(() => {
    try {
      return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  const hi = language === "hi";

  useEffect(() => {
    const syncLanguage = (event?: Event) => {
      const detail = (event as CustomEvent<string> | undefined)?.detail;

      try {
        const storedLanguage = localStorage.getItem("sahara-language");

        setLanguage(
          detail === "hi" || (!detail && storedLanguage === "hi")
            ? "hi"
            : "en"
        );
      } catch {
        setLanguage(detail === "hi" ? "hi" : "en");
      }
    };

    window.addEventListener("sahara-language-change", syncLanguage);
    window.addEventListener("storage", syncLanguage);

    return () => {
      window.removeEventListener("sahara-language-change", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  const navigation: {
    name: DonorTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      name: "Overview",
      label: hi ? "अवलोकन" : "Overview",
      icon: <Home size={18} />,
    },
    {
      name: "Post Donation",
      label: hi ? "दान पोस्ट करें" : "Post Donation",
      icon: <Plus size={18} />,
    },
    {
      name: "My Donations",
      label: hi ? "मेरे दान" : "My Donations",
      icon: <Package size={18} />,
    },
    {
      name: "Requests",
      label: hi ? "समुदाय की ज़रूरतें" : "Community Needs",
      icon: <Users size={18} />,
    },
    {
      name: "Account",
      label: hi ? "प्रोफ़ाइल और खाता" : "Profile & Account",
      icon: <Settings size={18} />,
    },
  ];

  const initial = userName ? userName.charAt(0).toUpperCase() : "D";

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label={hi ? "मेनू बंद करें" : "Close menu overlay"}
          onClick={() => setSidebarOpen(false)}
          className="sd-overlay"
        />
      )}

      <aside className={`sd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sd-brand">
          <div className="sd-brand-main">
            <img
              src={logoImg}
              alt="SAHARA logo"
              className="sd-logo"
            />

            <div>
              <h1 className="sd-brand-name">SAHARA</h1>
              <p className="sd-brand-tag">
                {hi ? "दाता पोर्टल" : "Donor Portal"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="sd-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label={hi ? "मेनू बंद करें" : "Close menu"}
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="sd-nav"
          aria-label={hi ? "दाता नेविगेशन" : "Donor Navigation"}
        >
          {navigation.map((item) => (
            <button
              type="button"
              key={item.name}
              onClick={() => {
                navigateTab(item.name);
                setSidebarOpen(false);
              }}
              className={`sd-nav-btn ${
                activeTab === item.name ? "is-active" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>

              {item.name === "Requests" && urgentNeedsCount > 0 && (
                <span
                  className="sd-nav-badge"
                  title={
                    hi
                      ? `${urgentNeedsCount} खुले अनुरोध`
                      : `${urgentNeedsCount} open needs`
                  }
                >
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

            <p className="sd-user-role">
              {hi ? "सत्यापित दाता" : "Verified Donor"}
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="sd-icon-btn-dark"
            title={hi ? "लॉग आउट करें" : "Log out"}
            aria-label={hi ? "लॉग आउट करें" : "Log out"}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default DonorSidebar;
