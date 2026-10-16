import React, { useState } from "react";
import {
  Package,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Utensils,
  Shirt,
  BookOpen,
  Gift,
  Search,
} from "lucide-react";
import { ReceiverNeedItem, receiverApi } from "../../../services/api/receiverApi";
import { NeedFilter } from "../types";

interface MyRequestsTabProps {
  needs: ReceiverNeedItem[];
  filter: NeedFilter;
  setFilter: (f: NeedFilter) => void;
  onViewNeed: (need: ReceiverNeedItem) => void;
  onEditNeed: (need: ReceiverNeedItem) => void;
  onRaiseNeedClick: () => void;
  onRefresh: () => void;
}

export const MyRequestsTab: React.FC<MyRequestsTabProps> = ({
  needs,
  filter,
  setFilter,
  onViewNeed,
  onEditNeed,
  onRaiseNeedClick,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("food") || lower.includes("meal")) return Utensils;
    if (lower.includes("cloth") || lower.includes("blanket")) return Shirt;
    if (lower.includes("book")) return BookOpen;
    return Gift;
  };

  const urgencyPills: Record<string, { bg: string; color: string; border: string }> = {
    critical: { bg: "#fbe8e8", color: "#b33a3a", border: "#f5c2c2" },
    high: { bg: "#fdf1d6", color: "#b7791f", border: "#fce0a6" },
    medium: { bg: "#e6f4f2", color: "#0e7c86", border: "#c2e6e2" },
    low: { bg: "#edf5f2", color: "#58706f", border: "#d3e3de" },
  };

  const filteredNeeds = needs.filter((n) => {
    if (filter === "open" && n.status !== "open") return false;
    if (filter === "in_progress" && !["matched", "accepted", "in_transit"].includes(n.status)) return false;
    if (filter === "fulfilled" && n.status !== "fulfilled") return false;
    if (filter === "cancelled" && n.status !== "cancelled") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchCity = n.location?.city?.toLowerCase().includes(q);
      const catName = typeof n.categoryId === "object" ? n.categoryId?.name?.toLowerCase() : "";
      const matchCat = catName.includes(q);
      return matchTitle || matchCity || matchCat;
    }

    return true;
  });

  const handleCancelNeed = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this need request?")) {
      return;
    }

    try {
      setActionLoadingId(id);
      await receiverApi.updateNeed(id, { status: "cancelled" });
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "Failed to cancel need request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteNeed = async (id: string) => {
    if (!window.confirm("Permanently delete this need request record?")) {
      return;
    }

    try {
      setActionLoadingId(id);
      await receiverApi.deleteNeed(id);
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "Failed to delete request");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section>
      <div className="rd-section-head">
        <div>
          <h2 className="rd-section-title">My Resource Requests</h2>
          <p className="rd-section-sub">
            Track fulfillment, volunteer assignments, and delivery verification
          </p>
        </div>
        <button onClick={onRaiseNeedClick} className="rd-btn rd-btn-primary rd-btn-sm">
          <PlusCircle size={15} /> Raise a Need
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
        <div className="rd-chips" style={{ marginBottom: 0 }}>
          {(
            [
              { id: "All", label: "All Requests" },
              { id: "open", label: "Open & Waiting" },
              { id: "in_progress", label: "Matched / In Transit" },
              { id: "fulfilled", label: "Fulfilled Deliveries" },
              { id: "cancelled", label: "Cancelled" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rd-chip ${filter === f.id ? "is-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "240px" }}>
          <Search size={16} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="rd-input"
            style={{ paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13.5px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, city, category..."
          />
        </div>
      </div>

      {/* Needs Grid */}
      {filteredNeeds.length === 0 ? (
        <div className="rd-empty">
          <span className="rd-empty-icon">
            <Package size={22} />
          </span>
          <p>
            {searchQuery
              ? `No requests found matching "${searchQuery}".`
              : "No requests found under this filter."}
          </p>
          <button onClick={onRaiseNeedClick} className="rd-btn rd-btn-primary rd-btn-sm">
            <PlusCircle size={15} /> Raise a Need Request
          </button>
        </div>
      ) : (
        <div className="rd-grid">
          {filteredNeeds.map((n) => {
            const catName = typeof n.categoryId === "object" ? n.categoryId?.name : "General";
            const Icon = getCategoryIcon(catName);
            const isOpen = n.status === "open";
            const canCancel = ["open", "matched"].includes(n.status);
            const canDelete = ["open", "cancelled"].includes(n.status);
            const isLoading = actionLoadingId === n._id;
            const urgencyStyle = urgencyPills[n.urgency] || urgencyPills.medium;

            return (
              <article key={n._id} className="rd-donation">
                <div className="rd-donation-top">
                  <span className="rd-type-icon">
                    <Icon size={19} />
                  </span>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span
                      style={{
                        background: urgencyStyle.bg,
                        color: urgencyStyle.color,
                        border: `1px solid ${urgencyStyle.border}`,
                        padding: "2px 8px",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {n.urgency}
                    </span>
                    <span className={`rd-pill rd-pill--${n.status}`}>{n.status}</span>
                  </div>
                </div>

                <h3 className="rd-donation-title">{n.title}</h3>
                <p className="rd-donation-meta">
                  {catName} • {n.quantity} {n.unit}
                </p>
                <p className="rd-donation-desc">
                  {n.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px", fontSize: "12.5px", color: "var(--muted)" }}>
                  {n.location?.city && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={14} color="var(--forest)" />
                      <span>{n.location.address ? `${n.location.address}, ` : ""}{n.location.city}</span>
                    </div>
                  )}

                  {n.requiredBy && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={14} color="var(--pending)" />
                      <span>
                        Needed by:{" "}
                        {new Date(n.requiredBy).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rd-card-actions" style={{ marginTop: "16px", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => onViewNeed(n)}
                      className="rd-link-btn"
                    >
                      <Eye size={14} /> Details
                    </button>
                    {isOpen && (
                      <button
                        onClick={() => onEditNeed(n)}
                        className="rd-link-btn"
                        style={{ color: "var(--forest)" }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    {canCancel && (
                      <button
                        onClick={() => handleCancelNeed(n._id)}
                        disabled={isLoading}
                        className="rd-btn rd-btn-danger rd-btn-sm"
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                      >
                        Cancel
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteNeed(n._id)}
                        disabled={isLoading}
                        className="rd-btn rd-btn-outline rd-btn-sm"
                        style={{ padding: "4px 8px", fontSize: "12px", color: "var(--rejected)" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyRequestsTab;
