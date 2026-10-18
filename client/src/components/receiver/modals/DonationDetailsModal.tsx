
import React, { useEffect, useState } from "react";
import {
  X,
  MapPin,
  ShieldCheck,
  Heart,
  User,
} from "lucide-react";
import { DonationItem } from "../../../services/api/donorApi";

interface DonationDetailsModalProps {
  donation: DonationItem | null;
  onClose: () => void;
  onRequestDonation: (donation: DonationItem) => void;
}

export const DonationDetailsModal: React.FC<
  DonationDetailsModalProps
> = ({ donation, onClose, onRequestDonation }) => {
  const [language, setLanguage] = useState<"en" | "hi">(() => {
    try {
      return localStorage.getItem("sahara-language") === "hi"
        ? "hi"
        : "en";
    } catch {
      return "en";
    }
  });

  const hi = language === "hi";

  useEffect(() => {
    const syncLanguage = (event?: Event) => {
      const detail = (event as CustomEvent<string> | undefined)?.detail;

      try {
        const storedLanguage = localStorage.getItem("sahara-language");
        setLanguage(
          detail === "hi" ||
            (!detail && storedLanguage === "hi")
            ? "hi"
            : "en"
        );
      } catch {
        setLanguage(detail === "hi" ? "hi" : "en");
      }
    };

    window.addEventListener("sahara-language-change", syncLanguage);
    window.addEventListener("storage", syncLanguage);

    return () => {
      window.removeEventListener("sahara-language-change", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  if (!donation) return null;

  const categoryName =
    typeof donation.categoryId === "object"
      ? donation.categoryId?.name
      : hi
        ? "सामान्य"
        : "General";

  const donorName =
    typeof donation.donorId === "object"
      ? donation.donorId?.name
      : hi
        ? "सामुदायिक दाता"
        : "Community Donor";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return hi ? "उपलब्ध नहीं" : "N/A";

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleString(hi ? "hi-IN" : "en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; hi: string }> = {
      available: {
        en: "Available for Community",
        hi: "समुदाय के लिए उपलब्ध",
      },
      matched: {
        en: "Matched with Receiver",
        hi: "प्राप्तकर्ता से मिलान हुआ",
      },
      accepted: {
        en: "Accepted by Volunteer",
        hi: "स्वयंसेवक ने स्वीकार किया",
      },
      in_transit: {
        en: "In Transit",
        hi: "रास्ते में",
      },
      completed: {
        en: "Completed & Delivered",
        hi: "पूरा हुआ और डिलीवर किया गया",
      },
      cancelled: {
        en: "Cancelled",
        hi: "रद्द किया गया",
      },
    };

    return labels[status]?.[hi ? "hi" : "en"] ?? status;
  };

  const locationFallback = hi
    ? "स्वयंसेवक नियुक्त होने पर पता दिखाई देगा"
    : "Address visible upon volunteer assignment";

  const cityName =
    donation.location?.city ||
    (hi ? "स्थानीय समुदाय" : "Local Community");

  return (
    <div
      className="rd-modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="rd-modal rd-modal--wide"
        role="dialog"
        aria-modal="true"
        aria-label={donation.title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="rd-modal-head">
          <div>
            <span className={`rd-pill rd-pill--${donation.status}`}>
              {getStatusLabel(donation.status)}
            </span>

            <h3
              className="rd-modal-title"
              style={{ marginTop: "6px" }}
            >
              {donation.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={hi ? "डायलॉग बंद करें" : "Close dialog"}
            className="rd-modal-close"
          >
            <X size={19} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {donation.description && (
            <div
              style={{
                background: "var(--paper)",
                padding: "12px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "var(--ink)",
              }}
            >
              <strong>
                {hi ? "दाता का विवरण:" : "Donor Description:"}
              </strong>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "var(--muted)",
                  lineHeight: "1.5",
                }}
              >
                {donation.description}
              </p>
            </div>
          )}

          <div className="rd-info-grid">
            <div className="rd-field">
              <span className="rd-field-label">
                {hi ? "श्रेणी" : "Category"}
              </span>
              <p className="rd-field-value">{categoryName}</p>
            </div>

            <div className="rd-field">
              <span className="rd-field-label">
                {hi ? "उपलब्ध मात्रा" : "Quantity Available"}
              </span>
              <p className="rd-field-value">
                {donation.quantity} {donation.unit}
              </p>
            </div>
          </div>

          <div
            className="rd-field"
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <MapPin
              size={18}
              color="var(--forest)"
              style={{ marginTop: "3px", flexShrink: 0 }}
            />

            <div>
              <span className="rd-field-label">
                {hi
                  ? "पिकअप और डिलीवरी क्षेत्र"
                  : "Pickup & Delivery Area"}
              </span>

              <p
                className="rd-field-value"
                style={{ margin: "2px 0 0" }}
              >
                {donation.location?.address || locationFallback}
                {donation.location?.city
                  ? `, ${donation.location.city}`
                  : ""}
                {donation.location?.state
                  ? `, ${donation.location.state}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="rd-info-grid">
            <div className="rd-field">
              <span className="rd-field-label">
                {hi ? "उपलब्ध होने की तिथि" : "Available From"}
              </span>
              <p
                className="rd-field-value"
                style={{ fontSize: "13px" }}
              >
                {formatDate(donation.availableFrom)}
              </p>
            </div>

            <div className="rd-field">
              <span className="rd-field-label">
                {hi ? "अंतिम उपलब्ध तिथि" : "Available Until"}
              </span>
              <p
                className="rd-field-value"
                style={{ fontSize: "13px" }}
              >
                {formatDate(donation.availableUntil)}
              </p>
            </div>
          </div>

          {donation.foodDetails && (
            <div
              style={{
                border: "1px solid #d3e8e1",
                background: "#f2f9f6",
                padding: "12px 14px",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--forest)",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  marginBottom: "8px",
                }}
              >
                <ShieldCheck size={17} color="var(--green)" />
                {hi
                  ? "भोजन की ताज़गी और सुरक्षा सत्यापन"
                  : "Food Freshness & Safety Verification"}
              </div>

              <div className="rd-info-grid">
                <div>
                  <span className="rd-field-label">
                    {hi ? "आहार प्राथमिकता" : "Dietary Preference"}
                  </span>

                  <p className="rd-field-value">
                    {donation.foodDetails.isVeg
                      ? hi
                        ? "🌱 शुद्ध शाकाहारी"
                        : "🌱 Pure Veg"
                      : hi
                        ? "🍗 मांसाहारी"
                        : "🍗 Non-Veg"}
                  </p>
                </div>

                <div>
                  <span className="rd-field-label">
                    {hi
                      ? "उपयोग की अंतिम तिथि"
                      : "Safe to Consume Until"}
                  </span>

                  <p
                    className="rd-field-value"
                    style={{ color: "var(--pending)" }}
                  >
                    {formatDate(
                      donation.foodDetails.safeUntil || undefined
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div
            className="rd-two"
            style={{ marginTop: "4px" }}
          >
            <div className="rd-person">
              <span className="rd-person-icon">
                <User size={18} />
              </span>

              <div>
                <small>{hi ? "दाता" : "Donor"}</small>
                <strong>{donorName}</strong>
                <span>
                  {hi
                    ? "सत्यापित SAHARA दाता"
                    : "Verified Sahara Giver"}
                </span>
              </div>
            </div>

            <div className="rd-person">
              <span className="rd-person-icon">
                <MapPin size={18} />
              </span>

              <div>
                <small>{hi ? "स्थान केंद्र" : "Location Hub"}</small>
                <strong>{cityName}</strong>
                <span>
                  {hi ? "मिलान के लिए तैयार" : "Ready for matching"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rd-modal-actions"
          style={{
            justifyContent: "flex-end",
            marginTop: "14px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rd-btn rd-btn-outline"
          >
            {hi ? "बंद करें" : "Close"}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestDonation(donation);
            }}
            className="rd-btn rd-btn-primary"
          >
            <Heart size={16} />
            {hi ? "इस सामग्री का अनुरोध करें" : "Request this Supply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;
