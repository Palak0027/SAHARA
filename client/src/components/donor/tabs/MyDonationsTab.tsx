import React, { useState } from "react";
import {
  Package,
  Plus,
  Eye,
  Edit2,
  Trash2,
  XCircle,
  MapPin,
  Calendar,
  Utensils,
  Shirt,
  BookOpen,
  Gift,
  Search,
  Filter,
} from "lucide-react";
import { DonationItem, donorApi } from "../../../services/api/donorApi";
import { DonationFilter } from "../types";

interface MyDonationsTabProps {
  donations: DonationItem[];
  filter: DonationFilter;
  setFilter: (f: DonationFilter) => void;
  onViewDonation: (donation: DonationItem) => void;
  onEditDonation: (donation: DonationItem) => void;
  onPostClick: () => void;
  onRefresh: () => void;
}

export const MyDonationsTab: React.FC<MyDonationsTabProps> = ({
  donations,
  filter,
  setFilter,
  onViewDonation,
  onEditDonation,
  onPostClick,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="sd-pill sd-pill--available">Available</span>;
      case "matched":
        return <span className="sd-pill sd-pill--matched">Matched</span>;
      case "in_transit":
        return <span className="sd-pill sd-pill--in_transit">In Transit</span>;
      case "completed":
        return <span className="sd-pill sd-pill--completed">Completed</span>;
      case "cancelled":
        return <span className="sd-pill sd-pill--cancelled">Cancelled</span>;
      default:
        return <span className="sd-pill">{status}</span>;
    }
  };

  // Filter donations based on filter tab and search query
  const filteredDonations = donations.filter((d) => {
    // Status filter
    if (filter === "available" && d.status !== "available") return false;
    if (filter === "in_progress" && !["matched", "accepted", "in_transit"].includes(d.status)) return false;
    if (filter === "completed" && d.status !== "completed") return false;
    if (filter === "cancelled" && d.status !== "cancelled") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchCity = d.location?.city?.toLowerCase().includes(q);
      const catName = typeof d.categoryId === "object" ? d.categoryId?.name?.toLowerCase() : "";
      const matchCat = catName.includes(q);
      return matchTitle || matchCity || matchCat;
    }

    return true;
  });

  const handleCancelDonation = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this donation? It will no longer be visible for community pickup.")) {
      return;
    }

    try {
      setActionLoadingId(id);
      await donorApi.updateDonation(id, { status: "cancelled" });
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "Failed to cancel donation");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (!window.confirm("Permanently delete this donation record? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoadingId(id);
      await donorApi.deleteDonation(id);
      onRefresh();
    } catch (err: any) {
      alert(err?.message || "Failed to delete donation");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section>
      <div className="sd-section-head">
        <div>
          <h2 className="sd-section-title">My Donations</h2>
          <p className="sd-section-sub">
            Track pickup, transit status, and history of your shared supplies
          </p>
        </div>
        <button onClick={onPostClick} className="sd-btn sd-btn-primary sd-btn-sm">
          <Plus size={15} /> Post New Donation
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
        <div className="sd-chips" style={{ marginBottom: 0 }}>
          {(
            [
              { id: "All", label: "All Donations" },
              { id: "available", label: "Available" },
              { id: "in_progress", label: "In Progress" },
              { id: "completed", label: "Delivered & Completed" },
              { id: "cancelled", label: "Cancelled" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`sd-chip ${filter === f.id ? "is-active" : ""}`}
            >
              {f.label}
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
            placeholder="Search by title, city, category..."
          />
        </div>
      </div>

      {/* Donation Grid */}
      {filteredDonations.length === 0 ? (
        <div className="sd-empty">
          <span className="sd-empty-icon">
            <Package size={22} />
          </span>
          <p>
            {searchQuery
              ? `No donations found matching "${searchQuery}".`
              : "No donations in this category."}
          </p>
          <button onClick={onPostClick} className="sd-btn sd-btn-primary sd-btn-sm">
            <Plus size={15} /> Post a Donation
          </button>
        </div>
      ) : (
        <div className="sd-grid">
          {filteredDonations.map((d) => {
            const catName = typeof d.categoryId === "object" ? d.categoryId?.name : "General";
            const Icon = getCategoryIcon(catName);
            const isAvailable = d.status === "available";
            const canCancel = ["available", "matched"].includes(d.status);
            const canDelete = ["available", "cancelled"].includes(d.status);
            const isLoading = actionLoadingId === d._id;

            return (
              <article key={d._id} className="sd-donation">
                <div className="sd-donation-top">
                  <span className="sd-type-icon">
                    <Icon size={19} />
                  </span>
                  {getStatusBadge(d.status)}
                </div>

                <h3 className="sd-donation-title">{d.title}</h3>
                <p className="sd-donation-meta">
                  {catName} • {d.quantity} {d.unit}
                </p>
                <p className="sd-donation-desc">
                  {d.description || "No description provided."}
                </p>

                {/* Meta details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px", fontSize: "12.5px", color: "var(--muted)" }}>
                  {d.location?.city && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={14} color="var(--forest)" />
                      <span>{d.location.address ? `${d.location.address}, ` : ""}{d.location.city}</span>
                    </div>
                  )}

                  {d.availableUntil && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={14} color="var(--pending)" />
                      <span>
                        Available until:{" "}
                        {new Date(d.availableUntil).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card footer actions */}
                <div className="sd-donation-foot" style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => onViewDonation(d)}
                      className="sd-link-btn"
                      title="View full donation details"
                    >
                      <Eye size={15} /> Details
                    </button>

                    {isAvailable && (
                      <button
                        onClick={() => onEditDonation(d)}
                        className="sd-link-btn"
                        style={{ color: "var(--forest)" }}
                        title="Edit donation"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    {canCancel && (
                      <button
                        onClick={() => handleCancelDonation(d._id)}
                        disabled={isLoading}
                        className="sd-btn sd-btn-danger sd-btn-sm"
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        title="Cancel donation"
                      >
                        Cancel
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteDonation(d._id)}
                        disabled={isLoading}
                        className="sd-btn sd-btn-outline sd-btn-sm"
                        style={{ padding: "4px 8px", fontSize: "12px", color: "var(--rejected)" }}
                        title="Delete record"
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

export default MyDonationsTab;
