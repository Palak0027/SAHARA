
import React, { useEffect, useState } from "react";
import {
  X,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { DonationItem } from "../../../services/api/donorApi";

interface DonationDetailsModalProps {
  donation: DonationItem | null;
  onClose: () => void;
  onEdit?: (donation: DonationItem) => void;
  onCancelDonation?: (donationId: string) => void;
}

export const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({
  donation,
  onClose,
  onEdit,
  onCancelDonation,
}) => {
  const [language, setLanguage] = useState<"en" | "hi">(() => {
    try {
      return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en";
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
          detail === "hi" || (!detail && storedLanguage === "hi")
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
      ? donation.categoryId.name
      : "General";

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
    if (!hi) {
      switch (status) {
        case "available":
          return "Available for Pickup";
        case "matched":
          return "Matched with Receiver";
        case "accepted":
          return "Accepted by Volunteer";
        case "in_transit":
          return "In Transit (Out for Delivery)";
        case "completed":
          return "Completed & Delivered";
        case "cancelled":
          return "Cancelled";
        default:
          return status;
      }
    }

    switch (status) {
      case "available":
        return "पिकअप के लिए उपलब्ध";
      case "matched":
        return "प्राप्तकर्ता से मिलान हुआ";
      case "accepted":
        return "स्वयंसेवक ने स्वीकार किया";
      case "in_transit":
        return "डिलीवरी के लिए रास्ते में";
      case "completed":
        return "पूरा हुआ और डिलीवर किया गया";
      case "cancelled":
        return "रद्द किया गया";
      default:
        return status;
    }
  };

  const canEdit = donation.status === "available";
  const canCancel = ["available", "matched"].includes(donation.status);

  return (
    <div className="sd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="sd-modal"
        style={{ maxWidth: "560px" }}
        role="dialog"
        aria-modal="true"
        aria-label={donation.title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sd-modal-head">
          <div>
            <span className={`sd-pill sd-pill--${donation.status}`}>
              {getStatusLabel(donation.status)}
            </span>

            <h3 className="sd-modal-title" style={{ marginTop: "6px" }}>
              {donation.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={hi ? "डायलॉग बंद करें" : "Close dialog"}
            className="sd-modal-close"
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
                {hi ? "विवरण:" : "Description:"}
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

          <div className="sd-info-grid">
            <div className="sd-field">
              <span className="sd-field-label">
                {hi ? "श्रेणी" : "Category"}
              </span>
              <p className="sd-field-value">{categoryName}</p>
            </div>

            <div className="sd-field">
              <span className="sd-field-label">
                {hi ? "मात्रा और इकाई" : "Quantity & Unit"}
              </span>
              <p className="sd-field-value">
                {donation.quantity} {donation.unit}
              </p>
            </div>
          </div>

          <div
            className="sd-field"
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
              <span className="sd-field-label">
                {hi ? "पिकअप का स्थान" : "Pickup Location"}
              </span>

              <p
                className="sd-field-value"
                style={{ margin: "2px 0 0" }}
              >
                {donation.location?.address ||
                  (hi ? "सड़क का पता उपलब्ध नहीं" : "No street address")}

                {donation.location?.city
                  ? `, ${donation.location.city}`
                  : ""}

                {donation.location?.state
                  ? `, ${donation.location.state}`
                  : ""}

                {donation.location?.pincode
                  ? ` - ${donation.location.pincode}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="sd-info-grid">
            <div className="sd-field">
              <span className="sd-field-label">
                {hi ? "उपलब्धता शुरू होने का समय" : "Available From"}
              </span>

              <p
                className="sd-field-value"
                style={{ fontSize: "13px" }}
              >
                {formatDate(donation.availableFrom)}
              </p>
            </div>

            <div className="sd-field">
              <span className="sd-field-label">
                {hi ? "उपलब्धता समाप्त होने का समय" : "Available Until"}
              </span>

              <p
                className="sd-field-value"
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
                  ? "खाद्य सुरक्षा संबंधी विवरण"
                  : "Food Safety Compliance Details"}
              </div>

              <div className="sd-info-grid">
                <div>
                  <span className="sd-field-label">
                    {hi ? "भोजन का प्रकार" : "Dietary Type"}
                  </span>

                  <p className="sd-field-value">
                    {hi
                      ? donation.foodDetails.isVeg
                        ? "शाकाहारी"
                        : "मांसाहारी"
                      : donation.foodDetails.isVeg
                        ? "Vegetarian"
                        : "Non-Vegetarian"}
                  </p>
                </div>

                <div>
                  <span className="sd-field-label">
                    {hi ? "सुरक्षित उपयोग की अंतिम तिथि" : "Safe Until"}
                  </span>

                  <p
                    className="sd-field-value"
                    style={{ color: "var(--pending)" }}
                  >
                    {formatDate(
                      donation.foodDetails.safeUntil || undefined
                    )}
                  </p>
                </div>
              </div>

              {donation.foodDetails.preparedOn && (
                <div style={{ marginTop: "8px" }}>
                  <span className="sd-field-label">
                    {hi ? "तैयार करने की तिथि" : "Prepared On"}
                  </span>

                  <p className="sd-field-value">
                    {formatDate(donation.foodDetails.preparedOn)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div
            style={{
              fontSize: "12px",
              color: "var(--faint)",
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span>
              {hi ? "पोस्ट किया गया:" : "Posted:"}{" "}
              {formatDate(donation.createdAt)}
            </span>

            <span>
              {hi ? "आईडी:" : "ID:"} {donation._id.slice(-8)}
            </span>
          </div>
        </div>

        <div
          className="sd-modal-actions"
          style={{
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          {canCancel && onCancelDonation && (
            <button
              type="button"
              onClick={() => onCancelDonation(donation._id)}
              className="sd-btn sd-btn-danger sd-btn-sm"
              title={hi ? "यह दान रद्द करें" : "Cancel this donation"}
            >
              {hi ? "दान रद्द करें" : "Cancel Donation"}
            </button>
          )}

          {canEdit && onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(donation);
              }}
              className="sd-btn sd-btn-outline sd-btn-sm"
            >
              {hi ? "विवरण संपादित करें" : "Edit Details"}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="sd-btn sd-btn-primary sd-btn-sm"
          >
            {hi ? "बंद करें" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;
