
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
  language?: "en" | "hi";
}

export const RequestsTab: React.FC<RequestsTabProps> = ({
  needs,
  loading,
  onViewNeed,
  onFulfillNeed,
  onRefresh,
  language = "en",
}) => {
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const isHindi = language === "hi";

  const t = {
    heading: isHindi ? "समुदाय की आवश्यकताएँ" : "Community Requests",
    subtitle: isHindi
      ? "समुदाय के सदस्यों, आश्रय गृहों और NGOs द्वारा की गई ज़रूरी संसाधन संबंधी माँगों को देखें और पूरा करें"
      : "Review and fulfill urgent resource requests raised by community members, shelters & NGOs",
    all: isHindi ? "सभी" : "All",
    critical: isHindi ? "अत्यंत गंभीर" : "Critical",
    high: isHindi ? "उच्च" : "High",
    medium: isHindi ? "मध्यम" : "Medium",
    low: isHindi ? "कम" : "Low",
    allUrgencies: isHindi ? "सभी प्राथमिकताएँ" : "All Urgencies",
    urgency: isHindi ? "प्राथमिकता" : "Urgency",
    searchPlaceholder: isHindi
      ? "आवश्यकता, अनुरोधकर्ता या शहर से खोजें..."
      : "Search by need, requester, city...",
    noMatching: isHindi
      ? "से मेल खाने वाला कोई सामुदायिक अनुरोध नहीं मिला:"
      : "No community requests found matching",
    noRequests: isHindi
      ? "इस फ़िल्टर के अंतर्गत कोई सामुदायिक अनुरोध नहीं मिला।"
      : "No community requests found under this filter.",
    communityMember: isHindi ? "समुदाय का सदस्य" : "Community Member",
    general: isHindi ? "सामान्य" : "General",
    quantity: isHindi ? "मात्रा" : "Quantity",
    requester: isHindi ? "अनुरोधकर्ता" : "Requester",
    neededBy: isHindi ? "आवश्यकता की तारीख" : "Needed by",
    details: isHindi ? "विवरण" : "Details",
    fulfill: isHindi ? "आवश्यकता पूरी करें" : "Fulfill Need",
    loading: isHindi ? "अनुरोध लोड हो रहे हैं..." : "Loading requests...",
    loadError: isHindi
      ? "अनुरोध लोड नहीं किए जा सके। कृपया पुनः प्रयास करें।"
      : "Unable to load requests. Please try again.",
  };

  const urgencyLabels: Record<string, string> = {
    critical: t.critical,
    high: t.high,
    medium: t.medium,
    low: t.low,
  };

  const urgencyPills: Record<
    string,
    { bg: string; color: string; border: string }
  > = {
    critical: {
      bg: "#fbe8e8",
      color: "#b33a3a",
      border: "#f5c2c2",
    },
    high: {
      bg: "#fdf1d6",
      color: "#b7791f",
      border: "#fce0a6",
    },
    medium: {
      bg: "#e6f4f2",
      color: "#0e7c86",
      border: "#c2e6e2",
    },
    low: {
      bg: "#edf5f2",
      color: "#58706f",
      border: "#d3e3de",
    },
  };

  const filteredNeeds = needs.filter((need) => {
    if (
      urgencyFilter !== "All" &&
      need.urgency !== urgencyFilter.toLowerCase()
    ) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = need.title.toLowerCase().includes(q);
      const matchCity = need.location?.city?.toLowerCase().includes(q);
      const requester = need.receiverId?.name?.toLowerCase().includes(q);
      const catName =
        typeof need.categoryId === "object"
          ? need.categoryId?.name?.toLowerCase()
          : "";

      return (
        matchTitle ||
        matchCity ||
        requester ||
        catName?.includes(q)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <section>
        <div className="sd-section-head">
          <div>
            <h2 className="sd-section-title">{t.heading}</h2>
            <p className="sd-section-sub">{t.subtitle}</p>
          </div>
        </div>

        <div className="sd-empty">
          <span className="sd-empty-icon">
            <Users size={22} />
          </span>
          <p>{t.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="sd-section-head">
        <div>
          <h2 className="sd-section-title">{t.heading}</h2>
          <p className="sd-section-sub">{t.subtitle}</p>
        </div>
      </div>

      {/* Filter Chips & Search */}
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
              { id: "All", label: t.allUrgencies },
              { id: "Critical", label: t.critical },
              { id: "High", label: t.high },
              { id: "Medium", label: t.medium },
              { id: "Low", label: t.low },
            ] as const
          ).map((u) => (
            <button
              key={u.id}
              onClick={() => setUrgencyFilter(u.id)}
              className={`sd-chip ${
                urgencyFilter === u.id ? "is-active" : ""
              }`}
            >
              {u.label}
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

      {/* Requests List */}
      {filteredNeeds.length === 0 ? (
        <div className="sd-empty">
          <span className="sd-empty-icon">
            <Users size={22} />
          </span>

          <p>
            {searchQuery
              ? `${t.noMatching} "${searchQuery}".`
              : t.noRequests}
          </p>
        </div>
      ) : (
        <div className="sd-list">
          {filteredNeeds.map((need) => {
            const requester =
              need.receiverId?.name || t.communityMember;

            const orgName = need.receiverId?.organization?.orgName;

            const categoryName =
              typeof need.categoryId === "object"
                ? need.categoryId?.name
                : t.general;

            const style =
              urgencyPills[need.urgency] || urgencyPills.medium;

            return (
              <div
                key={need._id}
                className="sd-row"
                style={{ padding: "16px 20px" }}
              >
                <div
                  className="sd-row-main"
                  style={{ gap: "14px", flex: "1 1 500px" }}
                >
                  <span className="sd-row-avatar">
                    {requester.charAt(0).toUpperCase()}
                  </span>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
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
                        {urgencyLabels[need.urgency] || need.urgency}
                      </span>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          fontWeight: 600,
                        }}
                      >
                        {categoryName}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        margin: "4px 0 2px",
                      }}
                    >
                      {need.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        margin: "0 0 6px",
                      }}
                    >
                      {need.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "14px",
                        fontSize: "12.5px",
                        color: "var(--muted)",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--forest)",
                        }}
                      >
                        {t.quantity}: {need.quantity} {need.unit}
                      </span>

                      <span>
                        {t.requester}: {requester}
                        {orgName ? ` (${orgName})` : ""}
                      </span>

                      {need.location?.city && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <MapPin size={13} />
                          {need.location.city}
                        </span>
                      )}

                      {need.requiredBy && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "var(--pending)",
                          }}
                        >
                          <Calendar size={13} />
                          {t.neededBy}:{" "}
                          {new Date(need.requiredBy).toLocaleDateString(
                            isHindi ? "hi-IN" : "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="sd-row-side"
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => onViewNeed(need)}
                    className="sd-btn sd-btn-outline sd-btn-sm"
                  >
                    <Eye size={14} /> {t.details}
                  </button>

                  <button
                    onClick={() => onFulfillNeed(need)}
                    className="sd-btn sd-btn-primary sd-btn-sm"
                  >
                    <Heart size={14} /> {t.fulfill}
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
