import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Heart,
  Calendar,
  MapPin,
  AlertTriangle,
  Building,
  User,
  Eye,
} from "lucide-react";
import { CommunityNeed } from "../../../services/api/donorApi";

interface RequestsTabProps {
  needs: CommunityNeed[];
  loading: boolean;
  onViewNeed: (need: CommunityNeed) => void;
  onFulfillNeed: (need: CommunityNeed) => void;
  onRefresh: () => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({
  needs,
  loading,
  onViewNeed,
  onFulfillNeed,
  onRefresh,
}) => {
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const urgencyPills: Record<string, { bg: string; color: string; border: string }> = {
    critical: { bg: "#fbe8e8", color: "#b33a3a", border: "#f5c2c2" },
    high: { bg: "#fdf1d6", color: "#b7791f", border: "#fce0a6" },
    medium: { bg: "#e6f4f2", color: "#0e7c86", border: "#c2e6e2" },
    low: { bg: "#edf5f2", color: "#58706f", border: "#d3e3de" },
  };

  const filteredNeeds = needs.filter((need) => {
    if (urgencyFilter !== "All" && need.urgency !== urgencyFilter.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = need.title.toLowerCase().includes(q);
      const matchCity = need.location?.city?.toLowerCase().includes(q);
      const requester = need.receiverId?.name?.toLowerCase().includes(q);
      const catName = typeof need.categoryId === "object" ? need.categoryId?.name?.toLowerCase() : "";
      return matchTitle || matchCity || requester || catName?.includes(q);
    }

    return true;
  });

  return (
    <section>
      <div className="sd-section-head">
        <div>
          <h2 className="sd-section-title">Community Requests</h2>
          <p className="sd-section-sub">
            Review and fulfill urgent resource requests raised by community members, shelters & NGOs
          </p>
        </div>
      </div>

      {/* Filter Chips & Search */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
        <div className="sd-chips" style={{ marginBottom: 0 }}>
          {(["All", "Critical", "High", "Medium", "Low"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUrgencyFilter(u)}
              className={`sd-chip ${urgencyFilter === u ? "is-active" : ""}`}
            >
              {u === "All" ? "All Urgencies" : `${u} Urgency`}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "240px" }}>
          <Search size={16} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="sd-input"
            style={{ paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13.5px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by need, requester, city..."
          />
        </div>
      </div>

      {/* Needs List */}
      {filteredNeeds.length === 0 ? (
        <div className="sd-empty">
          <span className="sd-empty-icon">
            <Users size={22} />
          </span>
          <p>
            {searchQuery
              ? `No community requests found matching "${searchQuery}".`
              : "No community requests found under this filter."}
          </p>
        </div>
      ) : (
        <div className="sd-list">
          {filteredNeeds.map((need) => {
            const requester = need.receiverId?.name || "Community Member";
            const orgName = need.receiverId?.organization?.orgName;
            const categoryName = typeof need.categoryId === "object" ? need.categoryId?.name : "General";
            const style = urgencyPills[need.urgency] || urgencyPills.medium;

            return (
              <div key={need._id} className="sd-row" style={{ padding: "16px 20px" }}>
                <div className="sd-row-main" style={{ gap: "14px", flex: "1 1 500px" }}>
                  <span className="sd-row-avatar">
                    {requester.charAt(0).toUpperCase()}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: style.bg,
                          color: style.color,
                          border: `1px solid ${style.border}`,
                          padding: "2px 8px",
                          borderRadius: "99px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {need.urgency}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>
                        {categoryName}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "4px 0 2px" }}>
                      {need.title}
                    </h3>

                    <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 6px" }}>
                      {need.description}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "12.5px", color: "var(--muted)" }}>
                      <span style={{ fontWeight: 600, color: "var(--forest)" }}>
                        Quantity: {need.quantity} {need.unit}
                      </span>
                      <span>
                        Requester: {requester} {orgName ? `(${orgName})` : ""}
                      </span>
                      {need.location?.city && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={13} /> {need.location.city}
                        </span>
                      )}
                      {need.requiredBy && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--pending)" }}>
                          <Calendar size={13} /> Needed by:{" "}
                          {new Date(need.requiredBy).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sd-row-side" style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => onViewNeed(need)}
                    className="sd-btn sd-btn-outline sd-btn-sm"
                  >
                    <Eye size={14} /> Details
                  </button>
                  <button
                    onClick={() => onFulfillNeed(need)}
                    className="sd-btn sd-btn-primary sd-btn-sm"
                  >
                    <Heart size={14} /> Fulfill Need
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RequestsTab;
