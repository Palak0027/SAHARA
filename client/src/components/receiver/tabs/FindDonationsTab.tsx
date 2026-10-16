import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Utensils,
  Shirt,
  BookOpen,
  Gift,
  Eye,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { DonationItem } from "../../../services/api/donorApi";

interface FindDonationsTabProps {
  donations: DonationItem[];
  loading: boolean;
  onViewDonation: (donation: DonationItem) => void;
  onRequestDonation: (donation: DonationItem) => void;
  onRefresh: () => void;
}

export const FindDonationsTab: React.FC<FindDonationsTabProps> = ({
  donations,
  loading,
  onViewDonation,
  onRequestDonation,
  onRefresh,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("food") || lower.includes("meal")) return Utensils;
    if (lower.includes("cloth") || lower.includes("blanket")) return Shirt;
    if (lower.includes("book")) return BookOpen;
    return Gift;
  };

  // Derive unique categories from active donations
  const categoriesList = ["All", ...Array.from(new Set(donations.map((d) => {
    return typeof d.categoryId === "object" ? d.categoryId?.name : "General";
  })))];

  const filteredDonations = donations.filter((d) => {
    const catName = typeof d.categoryId === "object" ? d.categoryId?.name : "General";
    if (categoryFilter !== "All" && catName !== categoryFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchCity = d.location?.city?.toLowerCase().includes(q);
      const matchDesc = d.description?.toLowerCase().includes(q);
      const matchCat = catName.toLowerCase().includes(q);
      return matchTitle || matchCity || matchDesc || matchCat;
    }

    return true;
  });

  return (
    <section>
      <div className="rd-section-head">
        <div>
          <h2 className="rd-section-title">Available Supplies</h2>
          <p className="rd-section-sub">
            Search and claim verified supplies and prepared food posted by donors in your area
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
        <div className="rd-chips" style={{ marginBottom: 0 }}>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rd-chip ${categoryFilter === cat ? "is-active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={16} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="rd-input"
            style={{ paddingLeft: "34px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13.5px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, category..."
          />
        </div>
      </div>

      {/* Donations Grid */}
      {filteredDonations.length === 0 ? (
        <div className="rd-empty">
          <span className="rd-empty-icon">
            <Search size={22} />
          </span>
          <p>
            {search
              ? `No available donations found matching "${search}".`
              : "No available donations found under this filter."}
          </p>
        </div>
      ) : (
        <div className="rd-grid">
          {filteredDonations.map((d) => {
            const catName = typeof d.categoryId === "object" ? d.categoryId?.name : "General";
            const Icon = getCategoryIcon(catName);
            const donorName = typeof d.donorId === "object" ? d.donorId?.name : "Community Donor";

            return (
              <article key={d._id} className="rd-donation">
                <div className="rd-donation-top">
                  <span className="rd-type-icon">
                    <Icon size={19} />
                  </span>
                  <span className="rd-pill rd-pill--available">Available</span>
                </div>

                <h3 className="rd-donation-title">{d.title}</h3>
                <p className="rd-donation-meta">
                  {catName} • {d.quantity} {d.unit}
                </p>
                <p className="rd-donation-desc">
                  {d.description || "Fresh supplies available for collection."}
                </p>

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

                  {d.foodDetails?.safeUntil && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--forest)", fontWeight: 600 }}>
                      <ShieldCheck size={14} color="var(--green)" />
                      <span>
                        Safe until:{" "}
                        {new Date(d.foodDetails.safeUntil).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rd-card-actions" style={{ marginTop: "16px" }}>
                  <button
                    onClick={() => onViewDonation(d)}
                    className="rd-btn rd-btn-outline rd-btn-sm"
                  >
                    <Eye size={14} /> Details
                  </button>
                  <button
                    onClick={() => onRequestDonation(d)}
                    className="rd-btn rd-btn-primary rd-btn-sm"
                  >
                    <Heart size={14} /> Request Supply
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FindDonationsTab;
