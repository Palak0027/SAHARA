
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
  Car,
  Truck,
  Bike,
} from "lucide-react";

import {
  ReceiverStats,
  ReceiverNeedItem,
  ReceiverSmartMatchItem,
} from "../../../services/api/receiverApi";
import { DonationItem } from "../../../services/api/donorApi";
import { ReceiverTab } from "../types";

interface OverviewTabProps {
  language: "en" | "hi";
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

const translations = {
  en: {
    community: "SAHARA Community Support Network",
    welcome: (name: string) => `Namaste, ${name}. Support is nearby.`,
    surplus: (count: number) =>
      `${count} surplus donation${count === 1 ? " is" : "s are"} currently ready from verified community donors.`,
    explore: "Explore available supplies or submit a custom resource requirement.",
    exploreButton: "Explore Available Supplies",
    raiseNeed: "Raise a Need Request",
    readyPickup: "supplies ready for pickup & distribution",
    available: "Available supplies",
    communityReady: "ready in your community",
    totalRequests: "My total requests",
    itemsRequested: (count: number) => `${count} items requested`,
    pending: "Pending / in-progress",
    pendingSub: (open: number, transit: number) =>
      `${open} open, ${transit} in transit`,
    fulfilled: "Fulfilled deliveries",
    delivered: "successfully delivered",
    smartMatching: "Smart Matching System",
    matchingTitle: (count: number) =>
      `Available Donations Matching Your Requests (${count})`,
    matchingDescription:
      "Verified community supplies that fulfill your open needs. Select your delivery or pickup preference to receive them.",
    directMatch: "Direct Match",
    match: "Match",
    availablePrefix: "Available:",
    needPrefix: "Your Need:",
    donor: "Donor:",
    communityDonor: "Community Donor",
    location: "Location:",
    nearbyCity: "Nearby City",
    acceptDeliver: "Accept & Deliver",
    requestsCategory: "Your Requests by Category",
    distribution: "Community Distribution",
    items: "items",
    availableNear: "Available Supplies Near You",
    suppliesDescription:
      "Surplus meals, rations, blankets, and essentials posted by donors",
    viewAll: (count: number) => `View all (${count})`,
    noSupplies:
      "No supplies are currently listed. You can raise a custom need request.",
    availableStatus: "Available",
    details: "Details",
    request: "Request",
    recentRequests: "My Recent Requests",
    trackRequests: "Track real-time progress on your community needs",
    viewAllRequests: "View all requests",
    noRequests: "You haven't submitted any resource requests yet.",
    neededIn: "Needed in",
    area: "Area",
    viewDetails: "View Details",
    general: "General",
    status: {
      open: "Open",
      pending: "Pending",
      in_progress: "In Progress",
      fulfilled: "Fulfilled",
      cancelled: "Cancelled",
      completed: "Completed",
      available: "Available",
      matched: "Matched",
    } as Record<string, string>,
  },
  hi: {
    community: "SAHARA सामुदायिक सहायता नेटवर्क",
    welcome: (name: string) => `नमस्ते, ${name}। सहायता आपके पास है।`,
    surplus: (count: number) =>
      `${count} अतिरिक्त दान सत्यापित सामुदायिक दाताओं द्वारा उपलब्ध ${count === 1 ? "है" : "हैं"}।`,
    explore: "उपलब्ध सामग्री देखें या अपनी ज़रूरत का अनुरोध भेजें।",
    exploreButton: "उपलब्ध सामग्री देखें",
    raiseNeed: "ज़रूरत का अनुरोध करें",
    readyPickup: "सामग्री पिकअप और वितरण के लिए तैयार",
    available: "उपलब्ध सामग्री",
    communityReady: "आपके समुदाय में उपलब्ध",
    totalRequests: "मेरे कुल अनुरोध",
    itemsRequested: (count: number) => `${count} वस्तुओं का अनुरोध`,
    pending: "लंबित / प्रक्रिया में",
    pendingSub: (open: number, transit: number) =>
      `${open} खुले, ${transit} रास्ते में`,
    fulfilled: "पूरी की गई डिलीवरी",
    delivered: "सफलतापूर्वक पहुँचाई गई",
    smartMatching: "स्मार्ट मिलान प्रणाली",
    matchingTitle: (count: number) =>
      `आपके अनुरोधों से मेल खाते दान (${count})`,
    matchingDescription:
      "आपकी ज़रूरतों को पूरा करने वाली सत्यापित सामग्री। प्राप्त करने के लिए पिकअप या डिलीवरी विकल्प चुनें।",
    directMatch: "सीधा मिलान",
    match: "मिलान",
    availablePrefix: "उपलब्ध:",
    needPrefix: "आपकी ज़रूरत:",
    donor: "दाता:",
    communityDonor: "सामुदायिक दाता",
    location: "स्थान:",
    nearbyCity: "नज़दीकी शहर",
    acceptDeliver: "स्वीकार करें और पहुँचाएँ",
    requestsCategory: "श्रेणी के अनुसार आपके अनुरोध",
    distribution: "सामुदायिक वितरण",
    items: "वस्तुएँ",
    availableNear: "आपके पास उपलब्ध सामग्री",
    suppliesDescription:
      "दाताओं द्वारा साझा किया गया अतिरिक्त भोजन, राशन, कंबल और ज़रूरी सामान",
    viewAll: (count: number) => `सभी देखें (${count})`,
    noSupplies:
      "अभी कोई सामग्री सूचीबद्ध नहीं है। आप अपनी ज़रूरत का अनुरोध भेज सकते हैं।",
    availableStatus: "उपलब्ध",
    details: "विवरण",
    request: "अनुरोध करें",
    recentRequests: "मेरे हाल के अनुरोध",
    trackRequests: "अपनी सामुदायिक ज़रूरतों की प्रगति देखें",
    viewAllRequests: "सभी अनुरोध देखें",
    noRequests: "आपने अभी तक किसी सामग्री का अनुरोध नहीं किया है।",
    neededIn: "ज़रूरत का स्थान",
    area: "क्षेत्र",
    viewDetails: "विवरण देखें",
    general: "सामान्य",
    status: {
      open: "खुला",
      pending: "लंबित",
      in_progress: "प्रक्रिया में",
      fulfilled: "पूरा हुआ",
      cancelled: "रद्द",
      completed: "पूर्ण",
      available: "उपलब्ध",
      matched: "मिलान हुआ",
    } as Record<string, string>,
  },
};

const OverviewTab: React.FC<OverviewTabProps> = ({
  language,
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
  const hi = language === "hi";
  const t = translations[language];
  const firstName = userName ? userName.split(" ")[0] : hi ? "प्राप्तकर्ता" : "Receiver";

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("food") || lower.includes("meal") || lower.includes("भोजन")) return Utensils;
    if (lower.includes("cloth") || lower.includes("blanket") || lower.includes("कपड़े")) return Shirt;
    if (lower.includes("book") || lower.includes("किताब")) return BookOpen;
    return Gift;
  };

  const getStatusLabel = (status: string) =>
    t.status[status.toLowerCase()] ?? status;

  const statCards = [
    {
      label: t.available,
      value: availableDonations.length,
      icon: <Search size={19} />,
      tone: "",
      sub: t.communityReady,
    },
    {
      label: t.totalRequests,
      value: stats.totalNeeds,
      icon: <Package size={19} />,
      tone: "rd-stat--people",
      sub: t.itemsRequested(stats.totalItemsRequested),
    },
    {
      label: t.pending,
      value: stats.openCount + stats.inProgressCount,
      icon: <Clock size={19} />,
      tone: "rd-stat--pending",
      sub: t.pendingSub(stats.openCount, stats.inProgressCount),
    },
    {
      label: t.fulfilled,
      value: stats.fulfilledCount,
      icon: <CheckCircle2 size={19} />,
      tone: "rd-stat--done",
      sub: t.delivered,
    },
  ];

  return (
    <>
      <section className="rd-hero">
        <div className="rd-hero-copy">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.16)",
              padding: "4px 12px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            <Sparkles size={13} />
            {t.community}
          </div>

          <h1 className="rd-hero-title">{t.welcome(firstName)}</h1>

          <p className="rd-hero-text">
            {availableDonations.length > 0
              ? t.surplus(availableDonations.length)
              : t.explore}
          </p>

          <div className="rd-hero-actions">
            <button
              type="button"
              onClick={() => onNavigateTab("Find Donations")}
              className="rd-btn rd-btn-ghost"
            >
              <Search size={16} /> {t.exploreButton}
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("Raise Need")}
              className="rd-btn rd-btn-ghost"
            >
              <PlusCircle size={16} /> {t.raiseNeed}
            </button>
          </div>
        </div>

        <div className="rd-hero-stat">
          <span className="rd-hero-num">{availableDonations.length}</span>
          <span className="rd-hero-label">{t.readyPickup}</span>
        </div>
      </section>

      <section className="rd-stats">
        {statCards.map((card) => (
          <div key={card.label} className={`rd-stat ${card.tone}`}>
            <div className="rd-stat-icon">{card.icon}</div>
            <p className="rd-stat-value">{loading ? "..." : card.value}</p>
            <p className="rd-stat-label">{card.label}</p>
            <span
              style={{
                fontSize: "11.5px",
                color: "var(--faint)",
                marginTop: "4px",
                display: "block",
              }}
            >
              {card.sub}
            </span>
          </div>
        ))}
      </section>

      {smartMatches.length > 0 && (
        <section
          className="rd-card"
          style={{
            padding: "20px 22px",
            background: "linear-gradient(180deg, #ffffff 0%, #f6fbf9 100%)",
            border: "1.5px solid #cce5df",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(11, 85, 99, 0.1)",
                  color: "var(--forest)",
                  padding: "3px 10px",
                  borderRadius: "99px",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                <Sparkles size={13} />
                {t.smartMatching}
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                {t.matchingTitle(smartMatches.length)}
              </h3>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "var(--muted)",
                }}
              >
                {t.matchingDescription}
              </p>
            </div>

            <span
              style={{
                fontSize: "12px",
                color: "var(--leaf)",
                fontWeight: 600,
              }}
            >
              {t.directMatch}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {smartMatches.slice(0, 4).map((match) => {
              const LogIcon =
                match.logistics.recommendedMode === "receiver_pickup"
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "6px",
                      }}
                    >
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
                        {match.score}% {t.match}
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

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        fontSize: "14px",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "var(--forest)" }}>
                        {t.availablePrefix} "{match.donation.title}" (
                        {match.donation.quantity} {match.donation.unit})
                      </span>

                      <ArrowRight size={14} color="var(--muted)" />

                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                        {t.needPrefix} "{match.need.title}" (
                        {match.need.quantity} {match.need.unit})
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "12.5px",
                        color: "var(--muted)",
                      }}
                    >
                      {t.donor}{" "}
                      <strong>
                        {match.donation.donorName || t.communityDonor}
                      </strong>{" "}
                      • {t.location} {match.donation.location?.city || t.nearbyCity} •{" "}
                      {match.logistics.description}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectMatch?.(match)}
                      className="rd-btn rd-btn-primary rd-btn-sm"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <Sparkles size={14} /> {t.acceptDeliver}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {categoryDistribution.length > 0 && (
        <section className="rd-card" style={{ padding: "18px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={18} color="var(--forest)" />
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
                {t.requestsCategory}
              </h3>
            </div>

            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
              {t.distribution}
            </span>
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
                  <span style={{ fontWeight: 600, fontSize: "13.5px" }}>
                    {cat.categoryName}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      background: "var(--card)",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      color: "var(--forest)",
                      fontWeight: 700,
                    }}
                  >
                    {cat.count} ({cat.totalQuantity} {t.items})
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="rd-section-head">
          <div>
            <h2 className="rd-section-title">{t.availableNear}</h2>
            <p className="rd-section-sub">{t.suppliesDescription}</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("Find Donations")}
            className="rd-link-btn"
          >
            {t.viewAll(availableDonations.length)} <ArrowRight size={14} />
          </button>
        </div>

        {availableDonations.length === 0 ? (
          <div className="rd-empty">
            <span className="rd-empty-icon">
              <Search size={22} />
            </span>
            <p>{t.noSupplies}</p>
            <button
              type="button"
              onClick={() => onNavigateTab("Raise Need")}
              className="rd-btn rd-btn-primary rd-btn-sm"
            >
              <PlusCircle size={15} /> {t.raiseNeed}
            </button>
          </div>
        ) : (
          <div className="rd-grid">
            {availableDonations.slice(0, 3).map((donation) => {
              const catName =
                typeof donation.categoryId === "object"
                  ? donation.categoryId?.name
                  : t.general;
              const Icon = getCategoryIcon(catName);

              return (
                <article key={donation._id} className="rd-donation">
                  <div className="rd-donation-top">
                    <span className="rd-type-icon">
                      <Icon size={19} />
                    </span>
                    <span className="rd-pill rd-pill--available">
                      {t.availableStatus}
                    </span>
                  </div>

                  <h3 className="rd-donation-title">{donation.title}</h3>

                  <p className="rd-donation-meta">
                    {catName} • {donation.quantity} {donation.unit}
                  </p>

                  <p className="rd-donation-desc">
                    {donation.description ||
                      (hi
                        ? "सामग्री संग्रह के लिए उपलब्ध है।"
                        : "Fresh supplies available for collection.")}
                  </p>

                  {donation.location?.city && (
                    <p className="rd-place">
                      <MapPin size={14} /> {donation.location.city}
                    </p>
                  )}

                  <div className="rd-card-actions" style={{ marginTop: "14px" }}>
                    <button
                      type="button"
                      onClick={() => onViewDonation(donation)}
                      className="rd-btn rd-btn-outline rd-btn-sm"
                    >
                      <Eye size={14} /> {t.details}
                    </button>

                    <button
                      type="button"
                      onClick={() => onRequestDonation(donation)}
                      className="rd-btn rd-btn-primary rd-btn-sm"
                    >
                      <Heart size={14} /> {t.request}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="rd-section-head">
          <div>
            <h2 className="rd-section-title">{t.recentRequests}</h2>
            <p className="rd-section-sub">{t.trackRequests}</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("My Requests")}
            className="rd-link-btn"
          >
            {t.viewAllRequests} <ArrowRight size={14} />
          </button>
        </div>

        {recentNeeds.length === 0 ? (
          <div className="rd-empty">
            <span className="rd-empty-icon">
              <Package size={22} />
            </span>
            <p>{t.noRequests}</p>
            <button
              type="button"
              onClick={() => onNavigateTab("Raise Need")}
              className="rd-btn rd-btn-primary rd-btn-sm"
            >
              <PlusCircle size={15} /> {t.raiseNeed}
            </button>
          </div>
        ) : (
          <div className="rd-list">
            {recentNeeds.slice(0, 3).map((need) => {
              const categoryName =
                typeof need.categoryId === "object"
                  ? need.categoryId?.name
                  : t.general;

              return (
                <div key={need._id} className="rd-row">
                  <div className="rd-row-main">
                    <span className="rd-row-avatar">
                      <Package size={18} />
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <p className="rd-row-title">{need.title}</p>
                      <p className="rd-row-sub">
                        {categoryName} • {need.quantity} {need.unit} •{" "}
                        {t.neededIn} {need.location?.city || t.area}
                      </p>
                    </div>
                  </div>

                  <div className="rd-row-side">
                    <span className={`rd-pill rd-pill--${need.status}`}>
                      {getStatusLabel(need.status)}
                    </span>

                    <button
                      type="button"
                      onClick={() => onViewNeed(need)}
                      className="rd-btn rd-btn-outline rd-btn-sm"
                    >
                      {t.viewDetails}
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
