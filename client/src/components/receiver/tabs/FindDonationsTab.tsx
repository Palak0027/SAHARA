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

type Language = "en" | "hi";

interface FindDonationsTabProps {
  donations: DonationItem[];
  loading: boolean;
  onViewDonation: (donation: DonationItem) => void;
  onRequestDonation: (donation: DonationItem) => void;
  onRefresh: () => void;
  language?: Language;
}

const copy = {
  en: {
    title: "Available Supplies",
    subtitle: "Search and claim verified supplies and prepared food posted by donors in your area",
    all: "All",
    search: "Search by title, location, category...",
    noMatch: (query: string) => `No available donations found matching \"${query}\".`,
    noFilter: "No available donations found under this filter.",
    available: "Available",
    freshSupplies: "Fresh supplies available for collection.",
    availableUntil: "Available until:",
    safeUntil: "Safe until:",
    details: "Details",
    request: "Request Supply",
  },
  hi: {
    title: "उपलब्ध सामग्री",
    subtitle: "अपने क्षेत्र में दानदाताओं द्वारा दी गई सत्यापित सामग्री और तैयार भोजन खोजें और प्राप्त करने का अनुरोध करें",
    all: "सभी",
    search: "शीर्षक, स्थान या श्रेणी से खोजें...",
    noMatch: (query: string) => `\"${query}\" से मेल मिलता कोई उपलब्ध दान नहीं मिला।`,
    noFilter: "इस फ़िल्टर में कोई उपलब्ध दान नहीं मिला।",
    available: "उपलब्ध",
    freshSupplies: "सामग्री प्राप्त करने के लिए उपलब्ध है।",
    availableUntil: "उपलब्धता की अंतिम तिथि:",
    safeUntil: "सुरक्षित उपयोग की अंतिम तिथि:",
    details: "विवरण",
    request: "सामग्री का अनुरोध करें",
  },
};

export const FindDonationsTab: React.FC<FindDonationsTabProps> = ({
  donations,
  loading,
  onViewDonation,
  onRequestDonation,
  onRefresh,
  language = "en",
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const t = copy[language];

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("food") || lower.includes("meal")) return Utensils;
    if (lower.includes("cloth") || lower.includes("blanket")) return Shirt;
    if (lower.includes("book")) return BookOpen;
    return Gift;
  };

  // Keep the original category names from the API; only the All filter is translated.
  const categoriesList = ["All", ...Array.from(new Set(donations.map((d) =>
    typeof d.categoryId === "object" ? d.categoryId?.name : "General"
  )))];

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

  // These props are retained for compatibility with the existing dashboard API.
  void loading;
  void onRefresh;

  return (
    <section>
      <div className="rd-section-head">
        <div>
          <h2 className="rd-section-title">{t.title}</h2>
          <p className="rd-section-sub">{t.subtitle}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
        <div className="rd-chips" style={{ marginBottom: 0 }}>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rd-chip ${categoryFilter === cat ? "is-active" : ""}`}
            >
              {cat === "All" ? t.all : cat}
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
            placeholder={t.search}
            aria-label={t.search}
          />
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="rd-empty">
          <span className="rd-empty-icon"><Search size={22} /></span>
          <p>{search ? t.noMatch(search) : t.noFilter}</p>
        </div>
      ) : (
        <div className="rd-grid">
          {filteredDonations.map((d) => {
            const catName = typeof d.categoryId === "object" ? d.categoryId?.name : "General";
            const Icon = getCategoryIcon(catName);

            return (
              <article key={d._id} className="rd-donation">
                <div className="rd-donation-top">
                  <span className="rd-type-icon"><Icon size={19} /></span>
                  <span className="rd-pill rd-pill--available">{t.available}</span>
                </div>

                <h3 className="rd-donation-title">{d.title}</h3>
                <p className="rd-donation-meta">{catName} • {d.quantity} {d.unit}</p>
                <p className="rd-donation-desc">{d.description || t.freshSupplies}</p>

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
                        {t.availableUntil}{" "}
                        {new Date(d.availableUntil).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {d.foodDetails?.safeUntil && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--forest)", fontWeight: 600 }}>
                      <ShieldCheck size={14} color="var(--green)" />
                      <span>
                        {t.safeUntil}{" "}
                        {new Date(d.foodDetails.safeUntil).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rd-card-actions" style={{ marginTop: "16px" }}>
                  <button onClick={() => onViewDonation(d)} className="rd-btn rd-btn-outline rd-btn-sm">
                    <Eye size={14} /> {t.details}
                  </button>
                  <button onClick={() => onRequestDonation(d)} className="rd-btn rd-btn-primary rd-btn-sm">
                    <Heart size={14} /> {t.request}
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
