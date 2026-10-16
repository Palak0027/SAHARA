import React from "react";
import { X, AlertTriangle, MapPin, Calendar, Heart, Building, User } from "lucide-react";
import { CommunityNeed } from "../../../services/api/donorApi";

interface NeedDetailsModalProps {
  need: CommunityNeed | null;
  onClose: () => void;
  onFulfill: (need: CommunityNeed) => void;
}

export const NeedDetailsModal: React.FC<NeedDetailsModalProps> = ({
  need,
  onClose,
  onFulfill,
}) => {
  if (!need) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", { dateStyle: "medium" });
  };

  const urgencyColors: Record<string, { bg: string; color: string; border: string }> = {
    critical: { bg: "#fbe8e8", color: "#b33a3a", border: "#f5c2c2" },
    high: { bg: "#fdf1d6", color: "#b7791f", border: "#fce0a6" },
    medium: { bg: "#e6f4f2", color: "#0e7c86", border: "#c2e6e2" },
    low: { bg: "#edf5f2", color: "#58706f", border: "#d3e3de" },
  };

  const urgencyStyle = urgencyColors[need.urgency] || urgencyColors.medium;
  const requesterName = need.receiverId?.name || "Community Member";
  const orgName = need.receiverId?.organization?.orgName;
  const categoryName = typeof need.categoryId === "object" ? need.categoryId?.name : "General";

  return (
    <div className="sd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="sd-modal"
        style={{ maxWidth: "540px" }}
        role="dialog"
        aria-modal="true"
        aria-label={need.title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sd-modal-head">
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span
              style={{
                background: urgencyStyle.bg,
                color: urgencyStyle.color,
                border: `1px solid ${urgencyStyle.border}`,
                padding: "3px 10px",
                borderRadius: "99px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {need.urgency} Urgency
            </span>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="sd-modal-close">
            <X size={19} />
          </button>
        </div>

        <h3 className="sd-modal-title" style={{ marginTop: "2px" }}>
          {need.title}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "var(--paper)", padding: "12px 14px", borderRadius: "8px", fontSize: "14px" }}>
            <strong>About this requirement:</strong>
            <p style={{ margin: "4px 0 0", color: "var(--muted)", lineHeight: "1.5" }}>{need.description}</p>
          </div>

          <div className="sd-info-grid">
            <div className="sd-field">
              <span className="sd-field-label">Quantity Needed</span>
              <p className="sd-field-value">{need.quantity} {need.unit}</p>
            </div>
            <div className="sd-field">
              <span className="sd-field-label">Category</span>
              <p className="sd-field-value">{categoryName}</p>
            </div>
          </div>

          <div className="sd-field" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <User size={18} color="var(--forest)" style={{ marginTop: "3px", flexShrink: 0 }} />
            <div>
              <span className="sd-field-label">Requester & Type</span>
              <p className="sd-field-value" style={{ margin: "2px 0 0" }}>
                {requesterName}
                {orgName ? ` (${orgName})` : need.receiverType ? ` (${need.receiverType})` : ""}
              </p>
            </div>
          </div>

          <div className="sd-field" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <MapPin size={18} color="var(--leaf)" style={{ marginTop: "3px", flexShrink: 0 }} />
            <div>
              <span className="sd-field-label">Delivery Destination</span>
              <p className="sd-field-value" style={{ margin: "2px 0 0" }}>
                {need.location?.address || "Location provided upon matching"}
                {need.location?.city ? `, ${need.location.city}` : ""}
                {need.location?.state ? `, ${need.location.state}` : ""}
              </p>
            </div>
          </div>

          <div className="sd-field" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Calendar size={18} color="var(--pending)" style={{ flexShrink: 0 }} />
            <div>
              <span className="sd-field-label">Required By Date</span>
              <p className="sd-field-value" style={{ margin: "2px 0 0", color: "var(--pending)" }}>
                {formatDate(need.requiredBy)}
              </p>
            </div>
          </div>

          {need.onBehalfOf?.isOnBehalf && need.onBehalfOf?.beneficiaryName && (
            <div style={{ fontSize: "13px", color: "var(--muted)", background: "#fdf8ee", padding: "10px 12px", borderRadius: "8px", border: "1px solid #f6e3c0" }}>
              Request is submitted on behalf of: <strong>{need.onBehalfOf.beneficiaryName}</strong>
            </div>
          )}
        </div>

        <div className="sd-modal-actions" style={{ justifyContent: "flex-end", marginTop: "12px" }}>
          <button type="button" onClick={onClose} className="sd-btn sd-btn-outline">
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onFulfill(need);
            }}
            className="sd-btn sd-btn-primary"
          >
            <Heart size={16} /> Donate for this Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedDetailsModal;
