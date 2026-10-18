
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
  language?: "en" | "hi";
}

export const MyDonationsTab: React.FC<MyDonationsTabProps> = ({
  donations,
  filter,
  setFilter,
  onViewDonation,
  onEditDonation,
  onPostClick,
  onRefresh,
  language = "en",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const isHindi = language === "hi";

  const t = {
    heading: isHindi ? "मेरे दान" : "My Donations",
    subtitle: isHindi
      ? "अपने दान की पिकअप, परिवहन स्थिति और इतिहास देखें"
      : "Track pickup, transit status, and history of your shared supplies",
    postNew: isHindi ? "नया दान दें" : "Post New Donation",
    allDonations: isHindi ? "सभी दान" : "All Donations",
    available: isHindi ? "उपलब्ध" : "Available",
    inProgress: isHindi ? "प्रगति में" : "In Progress",
    completed: isHindi ? "वितरित और पूर्ण" : "Delivered & Completed",
    cancelled: isHindi ? "रद्द किए गए" : "Cancelled",
    searchPlaceholder: isHindi
      ? "शीर्षक, शहर या श्रेणी से खोजें..."
      : "Search by title, city, category...",
    noMatching: isHindi
      ? "के लिए कोई दान नहीं मिला:"
      : "No donations found matching",
    noCategory: isHindi
      ? "इस श्रेणी में कोई दान नहीं है।"
      : "No donations in this category.",
    postDonation: isHindi ? "दान दें" : "Post a Donation",
    details: isHindi ? "विवरण" : "Details",
    edit: isHindi ? "संपादित करें" : "Edit",
    cancel: isHindi ? "रद्द करें" : "Cancel",
    delete: isHindi ? "हटाएँ" : "Delete",
    general: isHindi ? "सामान्य" : "General",
    noDescription: isHindi
      ? "कोई विवरण नहीं दिया गया।"
      : "No description provided.",
    availableUntil: isHindi ? "उपलब्धता की अंतिम तिथि:" : "Available until:",
    confirmCancel: isHindi
      ? "क्या आप वाकई इस दान को रद्द करना चाहते हैं? इसके बाद यह समुदाय द्वारा पिकअप के लिए दिखाई नहीं देगा।"
      : "Are you sure you want to cancel this donation? It will no longer be visible for community pickup.",
    confirmDelete: isHindi
      ? "क्या आप इस दान रिकॉर्ड को स्थायी रूप से हटाना चाहते हैं? यह कार्रवाई वापस नहीं की जा सकती।"
      : "Permanently delete this donation record? This action cannot be undone.",
    cancelFailed: isHindi
      ? "दान रद्द नहीं किया जा सका।"
      : "Failed to cancel donation",
    deleteFailed: isHindi
      ? "दान रिकॉर्ड हटाया नहीं जा सका।"
      : "Failed to delete donation",
    viewTitle: isHindi ? "दान का पूरा विवरण देखें" : "View full donation details",
    editTitle: isHindi ? "दान संपादित करें" : "Edit donation",
    cancelTitle: isHindi ? "दान रद्द करें" : "Cancel donation",
    deleteTitle: isHindi ? "रिकॉर्ड हटाएँ" : "Delete record",
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: t.available,
      matched: isHindi ? "मिलान हो गया" : "Matched",
      accepted: isHindi ? "स्वीकार किया गया" : "Accepted",
      in_transit: isHindi ? "रास्ते में" : "In Transit",
      completed: isHindi ? "पूर्ण" : "Completed",
      cancelled: t.cancelled,
    };

    return labels[status] || status;
  };

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
        return (
          <span className="sd-pill sd-pill--available">
            {getStatusLabel(status)}
          </span>
        );
      case "matched":
      case "accepted":
        return (
          <span className="sd-pill sd-pill--matched">
            {getStatusLabel(status)}
          </span>
        );
      case "in_transit":
        return (
          <span className="sd-pill sd-pill--in_transit">
            {getStatusLabel(status)}
          </span>
        );
      case "completed":
        return (
          <span className="sd-pill sd-pill--completed">
            {getStatusLabel(status)}
          </span>
        );
      case "cancelled":
        return (
          <span className="sd-pill sd-pill--cancelled">
            {getStatusLabel(status)}
          </span>
        );
      default:
        return <span className="sd-pill">{getStatusLabel(status)}</span>;
    }
  };

  const filteredDonations = donations.filter((d) => {
    if (filter === "available" && d.status !== "available") return false;

    if (
      filter === "in_progress" &&
      !["matched", "accepted", "in_transit"].includes(d.status)
    ) {
      return false;
    }

    if (filter === "completed" && d.status !== "completed") return false;
    if (filter === "cancelled" && d.status !== "cancelled") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchCity = d.location?.city?.toLowerCase().includes(q);
      const catName =
        typeof d.categoryId === "object"
          ? d.categoryId?.name?.toLowerCase()
          : "";
      const matchCat = catName.includes(q);

      return matchTitle || matchCity || matchCat;
    }

    return true;
  });

  const handleCancelDonation = async (id: string) => {
    if (!window.confirm(t.confirmCancel)) return;

    try {
      setActionLoadingId(id);
      await donorApi.updateDonation(id, { status: "cancelled" });
      onRefresh();
    } catch (err: any) {
      alert(err?.message || t.cancelFailed);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (!window.confirm(t.confirmDelete)) return;

    try {
      setActionLoadingId(id);
      await donorApi.deleteDonation(id);
      onRefresh();
    } catch (err: any) {
      alert(err?.message || t.deleteFailed);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section>
      <div className="sd-section-head">
        <div>
          <h2 className="sd-section-title">{t.heading}</h2>
          <p className="sd-section-sub">{t.subtitle}</p>
        </div>

        <button onClick={onPostClick} className="sd-btn sd-btn-primary sd-btn-sm">
          <Plus size={15} /> {t.postNew}
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div className="sd-chips" style={{ marginBottom: 0 }}>
          {(
            [
              { id: "All", label: t.allDonations },
              { id: "available", label: t.available },
              { id: "in_progress", label: t.inProgress },
              { id: "completed", label: t.completed },
              { id: "cancelled", label: t.cancelled },
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
          <Search
            size={16}
            color="var(--muted)"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            className="sd-input"
            style={{
              paddingLeft: "34px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "13.5px",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
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
              ? `${t.noMatching} "${searchQuery}".`
              : t.noCategory}
          </p>

          <button
            onClick={onPostClick}
            className="sd-btn sd-btn-primary sd-btn-sm"
          >
            <Plus size={15} /> {t.postDonation}
          </button>
        </div>
      ) : (
        <div className="sd-grid">
          {filteredDonations.map((d) => {
            const catName =
              typeof d.categoryId === "object"
                ? d.categoryId?.name
                : t.general;

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
                  {d.description || t.noDescription}
                </p>

                {/* Meta details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    marginTop: "12px",
                    fontSize: "12.5px",
                    color: "var(--muted)",
                  }}
                >
                  {d.location?.city && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <MapPin size={14} color="var(--forest)" />
                      <span>
                        {d.location.address ? `${d.location.address}, ` : ""}
                        {d.location.city}
                      </span>
                    </div>
                  )}

                  {d.availableUntil && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Calendar size={14} color="var(--pending)" />
                      <span>
                        {t.availableUntil}{" "}
                        {new Date(d.availableUntil).toLocaleDateString(
                          isHindi ? "hi-IN" : "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
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
                      title={t.viewTitle}
                    >
                      <Eye size={15} /> {t.details}
                    </button>

                    {isAvailable && (
                      <button
                        onClick={() => onEditDonation(d)}
                        className="sd-link-btn"
                        style={{ color: "var(--forest)" }}
                        title={t.editTitle}
                      >
                        <Edit2 size={14} /> {t.edit}
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
                        title={t.cancelTitle}
                      >
                        {t.cancel}
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteDonation(d._id)}
                        disabled={isLoading}
                        className="sd-btn sd-btn-outline sd-btn-sm"
                        style={{
                          padding: "4px 8px",
                          fontSize: "12px",
                          color: "var(--rejected)",
                        }}
                        title={t.deleteTitle}
                        aria-label={t.deleteTitle}
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
