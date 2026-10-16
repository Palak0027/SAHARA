import React, { useState } from "react";
import { Bell, Menu, PlusCircle, RefreshCw, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { ReceiverTab, ReceiverNotification } from "./types";

interface ReceiverHeaderProps {
  activeTab: ReceiverTab;
  setSidebarOpen: (open: boolean) => void;
  onRaiseNeedClick: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  notifications: ReceiverNotification[];
}

export const ReceiverHeader: React.FC<ReceiverHeaderProps> = ({
  activeTab,
  setSidebarOpen,
  onRaiseNeedClick,
  onRefresh,
  refreshing,
  notifications,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabSubtitles: Record<ReceiverTab, string> = {
    Overview: "Track resource relief and local community donations",
    "Find Donations": "Search, filter and claim resources posted by generous donors",
    "Raise Need": "Submit a resource request for immediate community fulfillment",
    "My Requests": "Track status of your submitted needs from match to delivery",
    Account: "Your profile details, beneficiary registrations, and settings",
  };

  return (
    <header className="rd-header">
      <div className="rd-header-left">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rd-icon-btn rd-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>
        <div>
          <p className="sd-header-kicker">{tabSubtitles[activeTab]}</p>
          <h2 className="rd-header-title">{activeTab}</h2>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="rd-icon-btn"
          title="Refresh dashboard data"
          aria-label="Refresh data"
        >
          <RefreshCw size={17} className={refreshing ? "rd-spin" : ""} />
        </button>

        {activeTab !== "Raise Need" && (
          <button
            onClick={onRaiseNeedClick}
            className="rd-btn rd-btn-primary rd-btn-sm"
          >
            <PlusCircle size={15} />
            Raise a Need
          </button>
        )}

        <div className="rd-notif-wrap">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            aria-label="Notifications"
            className="rd-icon-btn"
            title="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="rd-dot" />}
          </button>

          {showNotifications && (
            <>
              <button
                className="rd-notif-backdrop"
                aria-label="Close notifications"
                onClick={() => setShowNotifications(false)}
              />
              <div className="rd-notif" style={{ width: "320px", maxHeight: "400px", overflowY: "auto" }}>
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

export default ReceiverHeader;
