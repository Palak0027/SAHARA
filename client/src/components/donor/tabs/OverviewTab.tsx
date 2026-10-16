import React from "react";
import {
  Package,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  Heart,
  ArrowRight,
  TrendingUp,
  MapPin,
  Utensils,
  Shirt,
  Gift,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  DonorStats,
  CategoryDistribution,
  DonationItem,
  CommunityNeed,
  SmartMatchItem,
} from "../../../services/api/donorApi";
import { DonorTab } from "../types";
import { Car, Truck, Bike } from "lucide-react";

interface OverviewTabProps {
  userName: string;
  stats: DonorStats;
  categoryDistribution: CategoryDistribution[];
  recentDonations: DonationItem[];
  recentNeeds: CommunityNeed[];
  smartMatches?: SmartMatchItem[];
  onNavigateTab: (tab: DonorTab) => void;
  onViewDonation: (donation: DonationItem) => void;
  onViewNeed: (need: CommunityNeed) => void;
  onSelectMatch?: (match: SmartMatchItem) => void;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userName,
  stats,
  categoryDistribution,
  recentDonations,
  recentNeeds,
  smartMatches = [],
  onNavigateTab,
  onViewDonation,
  onViewNeed,
  onSelectMatch,
  loading,
}) => {
  const firstName = userName ? userName.split(" ")[0] : "Donor";

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

  const statCards = [
    {
      label: "Total donations",
      value: stats.totalDonations,
      icon: <Package size={19} />,
      tone: "",
      sub: `${stats.totalItemsDonated} items given`,
    },
    {
      label: "Estimated lives reached",
      value: stats.estimatedPeopleImpacted || Math.round(stats.totalItemsDonated * 1.5),
      icon: <Users size={19} />,
      tone: "sd-stat--people",
      sub: "direct community impact",
    },
    {
      label: "Completed deliveries",
      value: stats.completedCount,
      icon: <CheckCircle2 size={19} />,
      tone: "sd-stat--done",
      sub: `${stats.availableCount} currently active`,
    },
    {
      label: "Needs waiting for help",
      value: recentNeeds.length,
      icon: <Clock size={19} />,
      tone: "sd-stat--pending",
      sub: "in your community",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="sd-hero">
        <div className="sd-hero-copy">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.16)", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, marginBottom: "10px" }}>
            <Sparkles size={13} />
            SAHARA Verified Giver Community
          </div>
          <h1 className="sd-hero-title">
            Namaste, {firstName}. Your giving is touching lives.
          </h1>
          <p className="sd-hero-text">
            Every meal, cloth, and necessity you share creates immediate relief for local families and shelter homes. Thank you for making a difference.
          </p>
          <div className="sd-hero-actions">
            <button
              onClick={() => onNavigateTab("Post Donation")}
              className="sd-btn sd-btn-ghost"
            >
              <Plus size={16} /> Post New Donation
            </button>
            <button
              onClick={() => onNavigateTab("Requests")}
              className="sd-btn sd-btn-ghost"
            >
              <Heart size={16} /> Browse Community Needs
            </button>
          </div>
        </div>
        <div className="sd-hero-stat">
          <span className="sd-hero-num">{stats.estimatedPeopleImpacted || Math.round(stats.totalItemsDonated * 1.5)}</span>
          <span className="sd-hero-label">people supported through your contributions</span>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="sd-stats">
        {statCards.map((s) => (
          <div key={s.label} className={`sd-stat ${s.tone}`}>
            <div className="sd-stat-icon">{s.icon}</div>
            <p className="sd-stat-value">{loading ? "..." : s.value}</p>
            <p className="sd-stat-label">{s.label}</p>
            <span style={{ fontSize: "11.5px", color: "var(--faint)", marginTop: "4px", display: "block" }}>
              {s.sub}
            </span>
          </div>
        ))}
      </section>

      {/* Smart Matches & Delivery Logistics Section */}
      {smartMatches && smartMatches.length > 0 && (
        <section className="sd-card" style={{ padding: "20px 22px", background: "linear-gradient(180deg, #ffffff 0%, #f6fbf9 100%)", border: "1.5px solid #cce5df" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(11, 85, 99, 0.1)", color: "var(--forest)", padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                <Sparkles size={13} />
                Smart Logistics Matching Active
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                High-Compatibility Community Matches ({smartMatches.length})
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                These verified community needs match the supplies you have posted. Pick a delivery scenario to fulfill them.
              </p>
            </div>
            <span style={{ fontSize: "12px", color: "var(--leaf)", fontWeight: 600 }}>
              Live Recommendations
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
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: match.need.urgency === "critical" ? "#b33a3a" : "var(--leaf)",
                          background: "#fef3f2",
                          padding: "2px 8px",
                          borderRadius: "99px",
                        }}
                      >
                        {match.need.urgency} urgency
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "14px" }}>
                      <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                        Your "{match.donation.title}" ({match.donation.quantity} {match.donation.unit})
                      </span>
                      <ArrowRight size={14} color="var(--muted)" />
                      <span style={{ fontWeight: 600, color: "var(--forest)" }}>
                        Requested: "{match.need.title}" ({match.need.quantity} {match.need.unit})
                      </span>
                    </div>

                    <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--muted)" }}>
                      Receiver: <strong>{match.need.receiverName || match.need.organization || "Local Community"}</strong> • Destination: {match.need.location?.city || "Nearby"} • {match.logistics.description}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => onSelectMatch && onSelectMatch(match)}
                      className="sd-btn sd-btn-primary sd-btn-sm"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <Sparkles size={14} /> Match & Deliver
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Category Breakdown (if any) */}
      {categoryDistribution && categoryDistribution.length > 0 && (
        <section className="sd-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={18} color="var(--forest)" />
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Your Giving by Category</h3>
            </div>
            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Live Distribution</span>
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

      {/* Recent Donations Section */}
      <section>
        <div className="sd-section-head">
          <div>
            <h2 className="sd-section-title">Recent Donations</h2>
            <p className="sd-section-sub">Your latest shared donations and status updates</p>
          </div>
          <button onClick={() => onNavigateTab("My Donations")} className="sd-link-btn">
            View all ({stats.totalDonations}) <ArrowRight size={14} />
          </button>
        </div>

        {recentDonations.length === 0 ? (
          <div className="sd-empty">
            <span className="sd-empty-icon">
              <Heart size={22} />
            </span>
            <p>You haven't posted any donations yet.</p>
            <button
              onClick={() => onNavigateTab("Post Donation")}
              className="sd-btn sd-btn-primary sd-btn-sm"
            >
              <Plus size={15} /> Post Your First Donation
            </button>
          </div>
        ) : (
          <div className="sd-grid">
            {recentDonations.slice(0, 3).map((d) => {
              const catName = typeof d.categoryId === "object" ? d.categoryId?.name : "General";
              const Icon = getCategoryIcon(catName);
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
                  {d.location?.city && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>
                      <MapPin size={13} /> {d.location.city}
                    </div>
                  )}
                  <div className="sd-donation-foot">
                    <span>
                      {new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <button
                      onClick={() => onViewDonation(d)}
                      className="sd-link-btn"
                    >
                      <Eye size={15} /> Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Community Needs / Urgent Requests Section */}
      <section>
        <div className="sd-section-head">
          <div>
            <h2 className="sd-section-title">Community Requests</h2>
            <p className="sd-section-sub">Direct needs raised by verified local families & NGO shelters</p>
          </div>
          <button onClick={() => onNavigateTab("Requests")} className="sd-link-btn">
            View all requests <ArrowRight size={14} />
          </button>
        </div>

        {recentNeeds.length === 0 ? (
          <div className="sd-empty">
            <span className="sd-empty-icon">
              <Users size={22} />
            </span>
            <p>All current community needs are matched or fulfilled.</p>
          </div>
        ) : (
          <div className="sd-list">
            {recentNeeds.slice(0, 3).map((need) => {
              const requester = need.receiverId?.name || "Community Member";
              const urgencyColors: Record<string, string> = {
                critical: "var(--rejected)",
                high: "var(--pending)",
                medium: "var(--leaf)",
                low: "var(--muted)",
              };
              return (
                <div key={need._id} className="sd-row">
                  <div className="sd-row-main">
                    <span className="sd-row-avatar">
                      {requester.charAt(0).toUpperCase()}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p className="sd-row-title">{need.title}</p>
                      <p className="sd-row-sub">
                        {requester} • {need.quantity} {need.unit} needed • {need.location?.city || "Nearby"}
                      </p>
                    </div>
                  </div>
                  <div className="sd-row-side">
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: urgencyColors[need.urgency] || "var(--leaf)",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      {need.urgency}
                    </span>
                    <button
                      onClick={() => onViewNeed(need)}
                      className="sd-btn sd-btn-outline sd-btn-sm"
                    >
                      View Need
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
