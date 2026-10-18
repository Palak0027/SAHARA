
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
  Car,
  Truck,
  Bike,
} from "lucide-react";
import {
  DonorStats,
  CategoryDistribution,
  DonationItem,
  CommunityNeed,
  SmartMatchItem,
} from "../../../services/api/donorApi";
import { DonorTab } from "../types";

interface OverviewTabProps {
  language: "en" | "hi";
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

const translations = {
  en: {
    community: "SAHARA Verified Giver Community",
    welcome: (name: string) => `Namaste, ${name}. Your giving is touching lives.`,
    heroText:
      "Every meal, cloth, and necessity you share creates immediate relief for local families and shelter homes. Thank you for making a difference.",
    postDonation: "Post New Donation",
    browseNeeds: "Browse Community Needs",
    peopleSupported: "people supported through your contributions",
    totalDonations: "Total donations",
    itemsGiven: (n: number) => `${n} items given`,
    livesReached: "Estimated lives reached",
    communityImpact: "direct community impact",
    completedDeliveries: "Completed deliveries",
    currentlyActive: (n: number) => `${n} currently active`,
    waitingNeeds: "Needs waiting for help",
    inCommunity: "in your community",
    smartMatching: "Smart Logistics Matching Active",
    matchesTitle: (n: number) => `High-Compatibility Community Matches (${n})`,
    matchesText:
      "These verified community needs match the supplies you have posted. Pick a delivery scenario to fulfill them.",
    liveRecommendations: "Live Recommendations",
    match: "Match",
    urgency: "urgency",
    your: "Your",
    requested: "Requested",
    receiver: "Receiver:",
    localCommunity: "Local Community",
    destination: "Destination:",
    nearby: "Nearby",
    matchDeliver: "Match & Deliver",
    givingByCategory: "Your Giving by Category",
    liveDistribution: "Live Distribution",
    items: "items",
    recentDonations: "Recent Donations",
    recentDonationsText: "Your latest shared donations and status updates",
    viewAll: (n: number) => `View all (${n})`,
    noDonations: "You haven't posted any donations yet.",
    firstDonation: "Post Your First Donation",
    general: "General",
    noDescription: "No description provided.",
    details: "Details",
    communityRequests: "Community Requests",
    requestsText: "Direct needs raised by verified local families & NGO shelters",
    viewAllRequests: "View all requests",
    allMatched: "All current community needs are matched or fulfilled.",
    member: "Community Member",
    needed: "needed",
    viewNeed: "View Need",
    nearbyCity: "Nearby",
    status: {
      available: "Available",
      matched: "Matched",
      in_transit: "In Transit",
      completed: "Completed",
      cancelled: "Cancelled",
    } as Record<string, string>,
    urgencyLabels: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
    } as Record<string, string>,
  },
  hi: {
    community: "SAHARA सत्यापित दाता समुदाय",
    welcome: (name: string) => `नमस्ते, ${name}। आपका दान लोगों के जीवन में बदलाव ला रहा है।`,
    heroText:
      "आपके द्वारा साझा किया गया भोजन, कपड़े और ज़रूरी सामान स्थानीय परिवारों और आश्रय गृहों को तुरंत राहत देता है। सहयोग के लिए धन्यवाद।",
    postDonation: "नया दान दें",
    browseNeeds: "समुदाय की ज़रूरतें देखें",
    peopleSupported: "लोगों को आपके योगदान से सहायता मिली",
    totalDonations: "कुल दान",
    itemsGiven: (n: number) => `${n} वस्तुएँ दान की गईं`,
    livesReached: "अनुमानित लाभार्थी",
    communityImpact: "समुदाय पर सीधा प्रभाव",
    completedDeliveries: "पूरी की गई डिलीवरी",
    currentlyActive: (n: number) => `${n} अभी सक्रिय`,
    waitingNeeds: "सहायता की प्रतीक्षा में",
    inCommunity: "आपके समुदाय में",
    smartMatching: "स्मार्ट लॉजिस्टिक्स मिलान सक्रिय",
    matchesTitle: (n: number) => `समुदाय की उपयुक्त ज़रूरतें (${n})`,
    matchesText:
      "ये सत्यापित सामुदायिक ज़रूरतें आपके साझा किए गए सामान से मेल खाती हैं। उन्हें पूरा करने के लिए डिलीवरी का विकल्प चुनें।",
    liveRecommendations: "ताज़ा सुझाव",
    match: "मिलान",
    urgency: "प्राथमिकता",
    your: "आपका दान",
    requested: "अनुरोधित",
    receiver: "प्राप्तकर्ता:",
    localCommunity: "स्थानीय समुदाय",
    destination: "गंतव्य:",
    nearby: "नज़दीकी क्षेत्र",
    matchDeliver: "मिलान करें और पहुँचाएँ",
    givingByCategory: "श्रेणी के अनुसार आपका दान",
    liveDistribution: "वर्तमान वितरण",
    items: "वस्तुएँ",
    recentDonations: "हाल के दान",
    recentDonationsText: "आपके हाल के दान और उनकी स्थिति",
    viewAll: (n: number) => `सभी देखें (${n})`,
    noDonations: "आपने अभी तक कोई दान साझा नहीं किया है।",
    firstDonation: "अपना पहला दान दें",
    general: "सामान्य",
    noDescription: "कोई विवरण उपलब्ध नहीं है।",
    details: "विवरण",
    communityRequests: "समुदाय के अनुरोध",
    requestsText: "स्थानीय परिवारों और NGO आश्रय गृहों की सत्यापित ज़रूरतें",
    viewAllRequests: "सभी अनुरोध देखें",
    allMatched: "समुदाय की सभी मौजूदा ज़रूरतों का मिलान हो चुका है या वे पूरी हो गई हैं।",
    member: "समुदाय का सदस्य",
    needed: "की ज़रूरत",
    viewNeed: "ज़रूरत देखें",
    nearbyCity: "नज़दीकी क्षेत्र",
    status: {
      available: "उपलब्ध",
      matched: "मिलान हुआ",
      in_transit: "रास्ते में",
      completed: "पूरा हुआ",
      cancelled: "रद्द",
    } as Record<string, string>,
    urgencyLabels: {
      critical: "अत्यावश्यक",
      high: "उच्च",
      medium: "मध्यम",
      low: "कम",
    } as Record<string, string>,
  },
};

const OverviewTab: React.FC<OverviewTabProps> = ({
  language,
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
  const hi = language === "hi";
  const t = translations[language];
  const firstName = userName ? userName.split(" ")[0] : hi ? "दाता" : "Donor";

  const getCategoryIcon = (category: string) => {
    const name = category.toLowerCase();
    if (name.includes("food") || name.includes("meal") || name.includes("भोजन")) return Utensils;
    if (name.includes("cloth") || name.includes("blanket") || name.includes("कपड़े")) return Shirt;
    if (name.includes("book") || name.includes("किताब")) return BookOpen;
    return Gift;
  };

  const getStatusBadge = (status: string) => (
    <span className={`sd-pill sd-pill--${status}`}>
      {t.status[status] ?? status}
    </span>
  );

  const statCards = [
    {
      label: t.totalDonations,
      value: stats.totalDonations,
      icon: <Package size={19} />,
      tone: "",
      sub: t.itemsGiven(stats.totalItemsDonated),
    },
    {
      label: t.livesReached,
      value: stats.estimatedPeopleImpacted || Math.round(stats.totalItemsDonated * 1.5),
      icon: <Users size={19} />,
      tone: "sd-stat--people",
      sub: t.communityImpact,
    },
    {
      label: t.completedDeliveries,
      value: stats.completedCount,
      icon: <CheckCircle2 size={19} />,
      tone: "sd-stat--done",
      sub: t.currentlyActive(stats.availableCount),
    },
    {
      label: t.waitingNeeds,
      value: recentNeeds.length,
      icon: <Clock size={19} />,
      tone: "sd-stat--pending",
      sub: t.inCommunity,
    },
  ];

  return (
    <>
      <section className="sd-hero">
        <div className="sd-hero-copy">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.16)",
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

          <h1 className="sd-hero-title">{t.welcome(firstName)}</h1>
          <p className="sd-hero-text">{t.heroText}</p>

          <div className="sd-hero-actions">
            <button
              type="button"
              onClick={() => onNavigateTab("Post Donation")}
              className="sd-btn sd-btn-ghost"
            >
              <Plus size={16} /> {t.postDonation}
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("Requests")}
              className="sd-btn sd-btn-ghost"
            >
              <Heart size={16} /> {t.browseNeeds}
            </button>
          </div>
        </div>

        <div className="sd-hero-stat">
          <span className="sd-hero-num">
            {stats.estimatedPeopleImpacted || Math.round(stats.totalItemsDonated * 1.5)}
          </span>
          <span className="sd-hero-label">{t.peopleSupported}</span>
        </div>
      </section>

      <section className="sd-stats">
        {statCards.map((card) => (
          <div key={card.label} className={`sd-stat ${card.tone}`}>
            <div className="sd-stat-icon">{card.icon}</div>
            <p className="sd-stat-value">{loading ? "..." : card.value}</p>
            <p className="sd-stat-label">{card.label}</p>
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
          className="sd-card"
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
                  background: "rgba(11,85,99,0.1)",
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
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                {t.matchesTitle(smartMatches.length)}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                {t.matchesText}
              </p>
            </div>
            <span style={{ fontSize: "12px", color: "var(--leaf)", fontWeight: 600 }}>
              {t.liveRecommendations}
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
                          background: "linear-gradient(135deg,#0b5563,#15798c)",
                          color: "#fff",
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
                        <LogIcon size={13} /> {match.logistics.label}
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
                        {t.urgencyLabels[match.need.urgency] ?? match.need.urgency}{" "}
                        {t.urgency}
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
                      <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                        {t.your} "{match.donation.title}" ({match.donation.quantity} {match.donation.unit})
                      </span>
                      <ArrowRight size={14} color="var(--muted)" />
                      <span style={{ fontWeight: 600, color: "var(--forest)" }}>
                        {t.requested}: "{match.need.title}" ({match.need.quantity} {match.need.unit})
                      </span>
                    </div>

                    <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--muted)" }}>
                      {t.receiver}{" "}
                      <strong>
                        {match.need.receiverName || match.need.organization || t.localCommunity}
                      </strong>{" "}
                      • {t.destination} {match.need.location?.city || t.nearby} •{" "}
                      {match.logistics.description}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectMatch?.(match)}
                      className="sd-btn sd-btn-primary sd-btn-sm"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <Sparkles size={14} /> {t.matchDeliver}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {categoryDistribution.length > 0 && (
        <section className="sd-card" style={{ padding: "18px 20px" }}>
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
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{t.givingByCategory}</h3>
            </div>
            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>{t.liveDistribution}</span>
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
        <div className="sd-section-head">
          <div>
            <h2 className="sd-section-title">{t.recentDonations}</h2>
            <p className="sd-section-sub">{t.recentDonationsText}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("My Donations")}
            className="sd-link-btn"
          >
            {t.viewAll(stats.totalDonations)} <ArrowRight size={14} />
          </button>
        </div>

        {recentDonations.length === 0 ? (
          <div className="sd-empty">
            <span className="sd-empty-icon"><Heart size={22} /></span>
            <p>{t.noDonations}</p>
            <button
              type="button"
              onClick={() => onNavigateTab("Post Donation")}
              className="sd-btn sd-btn-primary sd-btn-sm"
            >
              <Plus size={15} /> {t.firstDonation}
            </button>
          </div>
        ) : (
          <div className="sd-grid">
            {recentDonations.slice(0, 3).map((donation) => {
              const category =
                typeof donation.categoryId === "object"
                  ? donation.categoryId?.name
                  : t.general;
              const Icon = getCategoryIcon(category);

              return (
                <article key={donation._id} className="sd-donation">
                  <div className="sd-donation-top">
                    <span className="sd-type-icon"><Icon size={19} /></span>
                    {getStatusBadge(donation.status)}
                  </div>
                  <h3 className="sd-donation-title">{donation.title}</h3>
                  <p className="sd-donation-meta">
                    {category} • {donation.quantity} {donation.unit}
                  </p>
                  <p className="sd-donation-desc">
                    {donation.description || t.noDescription}
                  </p>
                  {donation.location?.city && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: "var(--muted)",
                        marginTop: "6px",
                      }}
                    >
                      <MapPin size={13} /> {donation.location.city}
                    </div>
                  )}
                  <div className="sd-donation-foot">
                    <span>
                      {new Date(donation.createdAt).toLocaleDateString(
                        hi ? "hi-IN" : "en-IN",
                        { day: "numeric", month: "short" }
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => onViewDonation(donation)}
                      className="sd-link-btn"
                    >
                      <Eye size={15} /> {t.details}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="sd-section-head">
          <div>
            <h2 className="sd-section-title">{t.communityRequests}</h2>
            <p className="sd-section-sub">{t.requestsText}</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("Requests")}
            className="sd-link-btn"
          >
            {t.viewAllRequests} <ArrowRight size={14} />
          </button>
        </div>

        {recentNeeds.length === 0 ? (
          <div className="sd-empty">
            <span className="sd-empty-icon"><Users size={22} /></span>
            <p>{t.allMatched}</p>
          </div>
        ) : (
          <div className="sd-list">
            {recentNeeds.slice(0, 3).map((need) => {
              const requester = need.receiverId?.name || t.member;
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
                        {requester} • {need.quantity} {need.unit} {t.needed} •{" "}
                        {need.location?.city || t.nearbyCity}
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
                      {t.urgencyLabels[need.urgency] ?? need.urgency}
                    </span>
                    <button
                      type="button"
                      onClick={() => onViewNeed(need)}
                      className="sd-btn sd-btn-outline sd-btn-sm"
                    >
                      {t.viewNeed}
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
