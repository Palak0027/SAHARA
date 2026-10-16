import React from "react";
import { X, MapPin, Calendar, ShieldCheck, Heart, User } from "lucide-react";
import { DonationItem } from "../../../services/api/donorApi";

interface DonationDetailsModalProps {
  donation: DonationItem | null;
  onClose: () => void;
  onRequestDonation: (donation: DonationItem) => void;
}

export const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({
  donation,
  onClose,
  onRequestDonation,
}) => {
  if (!donation) return null;

  const categoryName = typeof donation.categoryId === "object" ? donation.categoryId.name : "General";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  const donorName = typeof donation.donorId === "object" ? donation.donorId?.name : "Community Donor";

  return (
    <div className="rd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="rd-modal rd-modal--wide"
        role="dialog"
        aria-modal="true"
        aria-label={donation.title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="rd-modal-head">
          <div>
            <span className={`rd-pill rd-pill--${donation.status}`}>
              {donation.status === "available" ? "Available for Community" : donation.status}
            </span>
            <h3 className="rd-modal-title" style={{ marginTop: "6px" }}>
              {donation.title}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="rd-modal-close">
            <X size={19} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {donation.description && (
            <div style={{ background: "var(--paper)", padding: "12px 14px", borderRadius: "8px", fontSize: "14px", color: "var(--ink)" }}>
              <strong>Donor Description:</strong>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", lineHeight: "1.5" }}>{donation.description}</p>
            </div>
          )}

          <div className="rd-info-grid">
            <div className="rd-field">
              <span className="rd-field-label">Category</span>
              <p className="rd-field-value">{categoryName}</p>
            </div>
            <div className="rd-field">
              <span className="rd-field-label">Quantity Available</span>
              <p className="rd-field-value">{donation.quantity} {donation.unit}</p>
            </div>
          </div>

          <div className="rd-field" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <MapPin size={18} color="var(--forest)" style={{ marginTop: "3px", flexShrink: 0 }} />
            <div>
              <span className="rd-field-label">Pickup & Delivery Area</span>
              <p className="rd-field-value" style={{ margin: "2px 0 0" }}>
                {donation.location?.address || "Address visible upon volunteer assignment"}
                {donation.location?.city ? `, ${donation.location.city}` : ""}
                {donation.location?.state ? `, ${donation.location.state}` : ""}
              </p>
            </div>
          </div>

          <div className="rd-info-grid">
            <div className="rd-field">
              <span className="rd-field-label">Available From</span>
              <p className="rd-field-value" style={{ fontSize: "13px" }}>{formatDate(donation.availableFrom)}</p>
            </div>
            <div className="rd-field">
              <span className="rd-field-label">Available Until</span>
              <p className="rd-field-value" style={{ fontSize: "13px" }}>{formatDate(donation.availableUntil)}</p>
            </div>
          </div>

          {donation.foodDetails && (
            <div style={{ border: "1px solid #d3e8e1", background: "#f2f9f6", padding: "12px 14px", borderRadius: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--forest)", fontWeight: 600, fontSize: "13.5px", marginBottom: "8px" }}>
                <ShieldCheck size={17} color="var(--green)" />
                Food Freshness & Safety Verification
              </div>
              <div className="rd-info-grid">
                <div>
                  <span className="rd-field-label">Dietary Preference</span>
                  <p className="rd-field-value">{donation.foodDetails.isVeg ? "🌱 Pure Veg" : "🍗 Non-Veg"}</p>
                </div>
                <div>
                  <span className="rd-field-label">Safe to Consume Until</span>
                  <p className="rd-field-value" style={{ color: "var(--pending)" }}>
                    {formatDate(donation.foodDetails.safeUntil || undefined)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rd-two" style={{ marginTop: "4px" }}>
            <div className="rd-person">
              <span className="rd-person-icon"><User size={18} /></span>
              <div>
                <small>Donor</small>
                <strong>{donorName}</strong>
                <span>Verified Sahara Giver</span>
              </div>
            </div>
            <div className="rd-person">
              <span className="rd-person-icon"><MapPin size={18} /></span>
              <div>
                <small>Location Hub</small>
                <strong>{donation.location?.city || "Local Community"}</strong>
                <span>Ready for matching</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rd-modal-actions" style={{ justifyContent: "flex-end", marginTop: "14px" }}>
          <button onClick={onClose} className="rd-btn rd-btn-outline">
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onRequestDonation(donation);
            }}
            className="rd-btn rd-btn-primary"
          >
            <Heart size={16} /> Request this Supply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;
