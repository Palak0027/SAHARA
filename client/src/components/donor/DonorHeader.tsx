import React, { useState } from "react";
import { Bell, Menu, Plus, RefreshCw, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabSubtitles: Record<DonorTab, string> = {
    Overview: "Your donation activity & impact at a glance",
    "Post Donation": "Share food, clothes, or essentials with those in need",
    "My Donations": "Track, view and manage your posted donations",
    Requests: "Explore real-time community resource requests to fulfill",
    Account: "Your profile details, impact statistics, and preferences",
  };

  return (
    <header className="sd-header">
      <div className="sd-header-left">
        <button
          onClick={() => setSidebarOpen(true)}
          className="sd-icon-btn sd-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>
        <div>
          <p className="sd-header-kicker">{tabSubtitles[activeTab]}</p>
          <h2 className="sd-header-title">{activeTab}</h2>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="sd-icon-btn"
          title="Refresh dashboard data"
          aria-label="Refresh data"
        >
          <RefreshCw size={17} className={refreshing ? "sd-spin" : ""} />
        </button>

        {activeTab !== "Post Donation" && (
          <button
            onClick={onPostClick}
            className="sd-btn sd-btn-primary sd-btn-sm"
            style={{ display: "none" }}
          >
            <Plus size={15} />
            Post
          </button>
        )}

        <div className="sd-notif-wrap">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            aria-label="Notifications"
            className="sd-icon-btn"
            title="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="sd-dot" />}
          </button>

          {showNotifications && (
            <>
              <button
                className="sd-notif-backdrop"
                aria-label="Close notifications"
                onClick={() => setShowNotifications(false)}
              />
              <div className="sd-notif" style={{ width: "320px", maxHeight: "400px", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <strong>Notifications</strong>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: "11px", background: "var(--leaf-soft)", color: "var(--forest)", padding: "2px 6px", borderRadius: "99px", fontWeight: 600 }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "13px" }}>No new notifications at this time.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          background: n.read ? "transparent" : "var(--paper)",
                          border: "1px solid var(--line)",
                          fontSize: "12.5px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                          {n.type === "success" && <CheckCircle2 size={14} color="var(--green)" />}
                          {n.type === "warning" && <AlertTriangle size={14} color="var(--pending)" />}
                          {n.type === "info" && <Clock size={14} color="var(--leaf)" />}
                          <span>{n.title}</span>
                        </div>
                        <p style={{ margin: "3px 0 0", color: "var(--muted)" }}>{n.message}</p>
                        <span style={{ fontSize: "11px", color: "var(--faint)", display: "block", marginTop: "4px" }}>
                          {n.time}
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
