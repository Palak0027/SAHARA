
import React, { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { DonorTab, DonorNotification } from "./types";

interface DonorHeaderProps {
  activeTab: DonorTab;
  setSidebarOpen: (open: boolean) => void;
  onPostClick: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  notifications: DonorNotification[];
}

export const DonorHeader: React.FC<DonorHeaderProps> = ({
  activeTab,
  setSidebarOpen,
  onPostClick,
  onRefresh,
  refreshing,
  notifications,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const [language, setLanguage] = useState<"en" | "hi">(() => {
    try {
      return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  const hi = language === "hi";
  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const tabTitles: Record<DonorTab, string> = {
    Overview: hi ? "अवलोकन" : "Overview",
    "Post Donation": hi ? "दान पोस्ट करें" : "Post Donation",
    "My Donations": hi ? "मेरे दान" : "My Donations",
    Requests: hi ? "अनुरोध" : "Requests",
    Account: hi ? "खाता" : "Account",
  };

  const tabSubtitles: Record<DonorTab, string> = {
    Overview: hi
      ? "अपनी दान गतिविधियों और प्रभाव का सार देखें"
      : "Your donation activity & impact at a glance",
    "Post Donation": hi
      ? "ज़रूरतमंदों के लिए भोजन, कपड़े या आवश्यक वस्तुएँ साझा करें"
      : "Share food, clothes, or essentials with those in need",
    "My Donations": hi
      ? "अपने पोस्ट किए गए दानों को देखें और प्रबंधित करें"
      : "Track, view and manage your posted donations",
    Requests: hi
      ? "समुदाय की ज़रूरतों के अनुरोध देखें"
      : "Explore real-time community resource requests to fulfill",
    Account: hi
      ? "अपनी प्रोफ़ाइल, प्रभाव और प्राथमिकताएँ देखें"
      : "Your profile details, impact statistics, and preferences",
  };

  return (
    <header className="sd-header">
      <div className="sd-header-left">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="sd-icon-btn sd-menu-btn"
          aria-label={hi ? "मेनू खोलें" : "Open menu"}
          title={hi ? "मेनू खोलें" : "Open menu"}
        >
          <Menu size={19} />
        </button>

        <div>
          <p className="sd-header-kicker">
            {tabSubtitles[activeTab]}
          </p>
          <h2 className="sd-header-title">
            {tabTitles[activeTab]}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="sd-icon-btn"
          title={hi ? "डैशबोर्ड रीफ़्रेश करें" : "Refresh dashboard data"}
          aria-label={hi ? "डेटा रीफ़्रेश करें" : "Refresh data"}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "sd-spin" : ""}
          />
        </button>

        {activeTab !== "Post Donation" && (
          <button
            type="button"
            onClick={onPostClick}
            className="sd-btn sd-btn-primary sd-btn-sm"
            style={{ display: "none" }}
          >
            <Plus size={15} />
            {hi ? "पोस्ट करें" : "Post"}
          </button>
        )}

        <div className="sd-notif-wrap">
          <button
            type="button"
            onClick={() => setShowNotifications((value) => !value)}
            aria-label={hi ? "सूचनाएँ" : "Notifications"}
            className="sd-icon-btn"
            title={hi ? "सूचनाएँ देखें" : "View notifications"}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="sd-dot" />}
          </button>

          {showNotifications && (
            <>
              <button
                type="button"
                className="sd-notif-backdrop"
                aria-label={hi ? "सूचनाएँ बंद करें" : "Close notifications"}
                onClick={() => setShowNotifications(false)}
              />

              <div
                className="sd-notif"
                style={{
                  width: "320px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <strong>
                    {hi ? "सूचनाएँ" : "Notifications"}
                  </strong>

                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        background: "var(--leaf-soft)",
                        color: "var(--forest)",
                        padding: "2px 6px",
                        borderRadius: "99px",
                        fontWeight: 600,
                      }}
                    >
                      {hi
                        ? `${unreadCount} नई`
                        : `${unreadCount} new`}
                    </span>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "13px",
                    }}
                  >
                    {hi
                      ? "अभी कोई नई सूचना नहीं है।"
                      : "No new notifications at this time."}
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          background: notification.read
                            ? "transparent"
                            : "var(--paper)",
                          border: "1px solid var(--line)",
                          fontSize: "12.5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontWeight: 600,
                          }}
                        >
                          {notification.type === "success" && (
                            <CheckCircle2
                              size={14}
                              color="var(--green)"
                            />
                          )}

                          {notification.type === "warning" && (
                            <AlertTriangle
                              size={14}
                              color="var(--pending)"
                            />
                          )}

                          {notification.type === "info" && (
                            <Clock
                              size={14}
                              color="var(--leaf)"
                            />
                          )}

                          <span>{notification.title}</span>
                        </div>

                        <p
                          style={{
                            margin: "3px 0 0",
                            color: "var(--muted)",
                          }}
                        >
                          {notification.message}
                        </p>

                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--faint)",
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          {notification.time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DonorHeader;
