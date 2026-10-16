import React from "react";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  PlusCircle,
  Eye,
  Heart,
  ArrowRight,
  TrendingUp,
  MapPin,
  Utensils,
  Shirt,
  BookOpen,
  Gift,
  Sparkles,
} from "lucide-react";
import {
  ReceiverStats,
  ReceiverNeedItem,
  ReceiverSmartMatchItem,
} from "../../../services/api/receiverApi";
import { DonationItem } from "../../../services/api/donorApi";
import { ReceiverTab } from "../types";
import { Car, Truck, Bike } from "lucide-react";

interface OverviewTabProps {
  userName: string;
  stats: ReceiverStats;
  categoryDistribution: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
    totalQuantity: number;
  }>;
  availableDonations: DonationItem[];
  recentNeeds: ReceiverNeedItem[];
  smartMatches?: ReceiverSmartMatchItem[];
  onNavigateTab: (tab: ReceiverTab) => void;
  onViewDonation: (donation: DonationItem) => void;
  onRequestDonation: (donation: DonationItem) => void;
  onViewNeed: (need: ReceiverNeedItem) => void;
  onSelectMatch?: (match: ReceiverSmartMatchItem) => void;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userName,
  stats,
  categoryDistribution,
  availableDonations,
  recentNeeds,
  smartMatches = [],
  onNavigateTab,
  onViewDonation,
  onRequestDonation,
  onViewNeed,
  onSelectMatch,
  loading,
}) => {
  const firstName = userName ? userName.split(" ")[0] : "Receiver";

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("food") || lower.includes("meal")) return Utensils;
    if (lower.includes("cloth") || lower.includes("blanket")) return Shirt;
    if (lower.includes("book")) return BookOpen;
    return Gift;
  };

  const statCards = [
    {
      label: "Available supplies",
      value: availableDonations.length,
      icon: <Search size={19} />,
      tone: "",
      sub: "ready in your community",
    },
    {
      label: "My total requests",
      value: stats.totalNeeds,
      icon: <Package size={19} />,
      tone: "rd-stat--people",
      sub: `${stats.totalItemsRequested} items requested`,
    },
    {
      label: "Pending / in-progress",
      value: stats.openCount + stats.inProgressCount,
      icon: <Clock size={19} />,
      tone: "rd-stat--pending",
      sub: `${stats.openCount} open, ${stats.inProgressCount} in transit`,
    },
    {
      label: "Fulfilled deliveries",
      value: stats.fulfilledCount,
      icon: <CheckCircle2 size={19} />,
      tone: "rd-stat--done",
      sub: "successfully delivered",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="rd-hero">
        <div className="rd-hero-copy">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.16)", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, marginBottom: "10px" }}>
            <Sparkles size={13} />
            SAHARA Community Support Network
          </div>
          <h1 className="rd-hero-title">
            Namaste, {firstName}. Support is nearby.
          </h1>
          <p className="rd-hero-text">
            {availableDonations.length > 0
              ? `${availableDonations.length} surplus donation${availableDonations.length !== 1 ? "s are" : " is"} currently ready from verified community donors.`
              : "Explore available supplies or submit a custom resource requirement."}
          </p>
          <div className="rd-hero-actions">
            <button
              onClick={() => onNavigateTab("Find Donations")}
              className="rd-btn rd-btn-ghost"
            >
              <Search size={16} /> Explore Available Supplies
            </button>
            <button
              onClick={() => onNavigateTab("Raise Need")}
              className="rd-btn rd-btn-ghost"
            >
              <PlusCircle size={16} /> Raise a Need Request
            </button>
          </div>
        </div>
        <div className="rd-hero-stat">
          <span className="rd-hero-num">{availableDonations.length}</span>
          <span className="rd-hero-label">supplies ready for pickup & distribution</span>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="rd-stats">
        {statCards.map((s) => (
          <div key={s.label} className={`rd-stat ${s.tone}`}>
            <div className="rd-stat-icon">{s.icon}</div>
            <p className="rd-stat-value">{loading ? "..." : s.value}</p>
            <p className="rd-stat-label">{s.label}</p>
            <span style={{ fontSize: "11.5px", color: "var(--faint)", marginTop: "4px", display: "block" }}>
              {s.sub}
            </span>
          </div>
        ))}
      </section>

      {/* Smart Matches & Delivery Logistics Section */}
      {smartMatches && smartMatches.length > 0 && (
        <section className="rd-card" style={{ padding: "20px 22px", background: "linear-gradient(180deg, #ffffff 0%, #f6fbf9 100%)", border: "1.5px solid #cce5df" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(11, 85, 99, 0.1)", color: "var(--forest)", padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                <Sparkles size={13} />
                Smart Matching System
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                Available Donations Matching Your Requests ({smartMatches.length})
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                Verified community supplies that fulfill your open needs. Select your delivery or pickup preference to receive them.
              </p>
            </div>
            <span style={{ fontSize: "12px", color: "var(--leaf)", fontWeight: 600 }}>
              Direct Match
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {smartMatches.slice(0, 4).map((match) => {
              const LogIcon = match.logistics.recommendedMode === "receiver_pickup"
                ? Car
                : match.logistics.recommendedMode === "donor_dropoff"
                ? Truck
                : Bike;

              return (
                <div
                  key={match.matchId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px 18px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #dbe6e4",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #0b5563, #15798c)",
                          color: "#ffffff",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "99px",
                        }}
                      >
                        {match.score}% Match
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          background: "#eaf5f2",
                          color: "#0b5563",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "99px",
                        }}
                      >
                        <LogIcon size={13} />
                        {match.logistics.label}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "14px" }}>
                      <span style={{ fontWeight: 700, color: "var(--forest)" }}>
                        Available: "{match.donation.title}" ({match.donation.quantity} {match.donation.unit})
                      </span>
                      <ArrowRight size={14} color="var(--muted)" />
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                        Your Need: "{match.need.title}" ({match.need.quantity} {match.need.unit})
                      </span>
                    </div>

                    <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--muted)" }}>
                      Donor: <strong>{match.donation.donorName || "Community Donor"}</strong> • Location: {match.donation.location?.city || "Nearby City"} • {match.logistics.description}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => onSelectMatch && onSelectMatch(match)}
                      className="rd-btn rd-btn-primary rd-btn-sm"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <Sparkles size={14} /> Accept & Deliver
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Needs Category Breakdown (if any) */}
      {categoryDistribution && categoryDistribution.length > 0 && (
        <section className="rd-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={18} color="var(--forest)" />
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Your Requests by Category</h3>
            </div>
            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Community Distribution</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {categoryDistribution.map((cat) => {
              const Icon = getCategoryIcon(cat.categoryName);
              return (
                <div
                  key={cat.categoryId || cat.categoryName}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <Icon size={16} color="var(--forest)" />
                  <span style={{ fontWeight: 600, fontSize: "13.5px" }}>{cat.categoryName}</span>
                  <span style={{ fontSize: "12px", background: "var(--card)", padding: "2px 8px", borderRadius: "99px", color: "var(--forest)", fontWeight: 700 }}>
                    {cat.count} ({cat.totalQuantity} items)
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Available Donations Section */}
      <section>
        <div className="rd-section-head">
          <div>
            <h2 className="rd-section-title">Available Supplies Near You</h2>
            <p className="rd-section-sub">Surplus meals, rations, blankets, and essentials posted by donors</p>
          </div>
          <button onClick={() => onNavigateTab("Find Donations")} className="rd-link-btn">
            View all ({availableDonations.length}) <ArrowRight size={14} />
          </button>
        </div>

        {availableDonations.length === 0 ? (
          <div className="rd-empty">
            <span className="rd-empty-icon">
              <Search size={22} />
            </span>
            <p>No supplies are currently listed. You can raise a custom need request.</p>
            <button
              onClick={() => onNavigateTab("Raise Need")}
              className="rd-btn rd-btn-primary rd-btn-sm"
            >
              <PlusCircle size={15} /> Raise a Need Request
            </button>
          </div>
        ) : (
          <div className="rd-grid">
            {availableDonations.slice(0, 3).map((d) => {
              const catName = typeof d.categoryId === "object" ? d.categoryId?.name : "General";
              const Icon = getCategoryIcon(catName);
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
                  {d.location?.city && (
                    <p className="rd-place">
                      <MapPin size={14} /> {d.location.city}
                    </p>
                  )}
                  <div className="rd-card-actions" style={{ marginTop: "14px" }}>
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
                      <Heart size={14} /> Request
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent My Needs Section */}
      <section>
        <div className="rd-section-head">
          <div>
            <h2 className="rd-section-title">My Recent Requests</h2>
            <p className="rd-section-sub">Track real-time progress on your community needs</p>
          </div>
          <button onClick={() => onNavigateTab("My Requests")} className="rd-link-btn">
            View all requests <ArrowRight size={14} />
          </button>
        </div>

        {recentNeeds.length === 0 ? (
          <div className="rd-empty">
            <span className="rd-empty-icon">
              <Package size={22} />
            </span>
            <p>You haven't submitted any resource requests yet.</p>
            <button
              onClick={() => onNavigateTab("Raise Need")}
              className="rd-btn rd-btn-primary rd-btn-sm"
            >
              <PlusCircle size={15} /> Raise a Need Request
            </button>
          </div>
        ) : (
          <div className="rd-list">
            {recentNeeds.slice(0, 3).map((need) => {
              const categoryName = typeof need.categoryId === "object" ? need.categoryId?.name : "General";
              return (
                <div key={need._id} className="rd-row">
                  <div className="rd-row-main">
                    <span className="rd-row-avatar">
                      <Package size={18} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p className="rd-row-title">{need.title}</p>
                      <p className="rd-row-sub">
                        {categoryName} • {need.quantity} {need.unit} • Needed in {need.location?.city || "Area"}
                      </p>
                    </div>
                  </div>
                  <div className="rd-row-side">
                    <span className={`rd-pill rd-pill--${need.status}`}>
                      {need.status}
                    </span>
                    <button
                      onClick={() => onViewNeed(need)}
                      className="rd-btn rd-btn-outline rd-btn-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default OverviewTab;
