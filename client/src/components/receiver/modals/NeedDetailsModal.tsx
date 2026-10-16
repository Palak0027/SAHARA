import React from "react";
import { X, Calendar, MapPin, User, AlertCircle, Edit2 } from "lucide-react";
import { ReceiverNeedItem } from "../../../services/api/receiverApi";

interface NeedDetailsModalProps {
  need: ReceiverNeedItem | null;
  onClose: () => void;
  onEdit?: (need: ReceiverNeedItem) => void;
  onCancelNeed?: (needId: string) => void;
}

export const NeedDetailsModal: React.FC<NeedDetailsModalProps> = ({
  need,
  onClose,
  onEdit,
  onCancelNeed,
}) => {
  if (!need) return null;

  const categoryName = typeof need.categoryId === "object" ? need.categoryId?.name : "General";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", { dateStyle: "medium" });
  };

  const urgencyPills: Record<string, { bg: string; color: string; border: string }> = {
    critical: { bg: "#fbe8e8", color: "#b33a3a", border: "#f5c2c2" },
    high: { bg: "#fdf1d6", color: "#b7791f", border: "#fce0a6" },
    medium: { bg: "#e6f4f2", color: "#0e7c86", border: "#c2e6e2" },
    low: { bg: "#edf5f2", color: "#58706f", border: "#d3e3de" },
  };

  const urgencyStyle = urgencyPills[need.urgency] || urgencyPills.medium;
  const canEdit = need.status === "open";
  const canCancel = ["open", "matched"].includes(need.status);

  return (
    <div className="rd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="rd-modal rd-modal--wide"
        role="dialog"
        aria-modal="true"
        aria-label={need.title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="rd-modal-head">
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
            <span className={`rd-pill rd-pill--${need.status}`}>
              {need.status}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="rd-modal-close">
            <X size={19} />
          </button>
        </div>

        <h3 className="rd-modal-title" style={{ marginTop: "2px" }}>
          {need.title}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {need.description && (
            <div style={{ background: "var(--paper)", padding: "12px 14px", borderRadius: "8px", fontSize: "14px" }}>
              <strong>Requirement Details:</strong>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", lineHeight: "1.5" }}>{need.description}</p>
            </div>
          )}

          <div className="rd-info-grid">
            <div className="rd-field">
              <span className="rd-field-label">Quantity Needed</span>
              <p className="rd-field-value">{need.quantity} {need.unit}</p>
            </div>
            <div className="rd-field">
              <span className="rd-field-label">Category</span>
              <p className="rd-field-value">{categoryName}</p>
            </div>
          </div>

          <div className="rd-field" style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <MapPin size={18} color="var(--forest)" style={{ marginTop: "3px", flexShrink: 0 }} />
            <div>
              <span className="rd-field-label">Delivery Destination</span>
              <p className="rd-field-value" style={{ margin: "2px 0 0" }}>
                {need.location?.address}
                {need.location?.city ? `, ${need.location.city}` : ""}
                {need.location?.state ? `, ${need.location.state}` : ""}
                {need.location?.pincode ? ` - ${need.location.pincode}` : ""}
              </p>
            </div>
          </div>

          <div className="rd-info-grid">
            <div className="rd-field">
              <span className="rd-field-label">Required By Date</span>
              <p className="rd-field-value" style={{ color: "var(--pending)" }}>{formatDate(need.requiredBy)}</p>
            </div>
            <div className="rd-field">
              <span className="rd-field-label">Beneficiary Type</span>
              <p className="rd-field-value" style={{ textTransform: "capitalize" }}>{need.receiverType || "Individual"}</p>
            </div>
          </div>

          {need.onBehalfOf?.isOnBehalf && (
            <div style={{ background: "#fdf8ee", padding: "10px 14px", borderRadius: "8px", border: "1px solid #f6e3c0", fontSize: "13px" }}>
              <strong>Beneficiary on whose behalf this request was raised:</strong>
              <p style={{ margin: "4px 0 0", color: "var(--ink)" }}>
                {need.onBehalfOf.beneficiaryName}
                {need.onBehalfOf.beneficiaryAge ? ` (Age: ${need.onBehalfOf.beneficiaryAge})` : ""}
                {need.onBehalfOf.relationship ? ` • Relationship: ${need.onBehalfOf.relationship}` : ""}
              </p>
            </div>
          )}

          <div style={{ fontSize: "12px", color: "var(--faint)", display: "flex", justifyContent: "space-between" }}>
            <span>Created on: {formatDate(need.createdAt)}</span>
            <span>Request ID: {need._id.slice(-8)}</span>
          </div>
        </div>

        <div className="rd-modal-actions" style={{ justifyContent: "flex-end", marginTop: "12px" }}>
          {canCancel && onCancelNeed && (
            <button
              onClick={() => onCancelNeed(need._id)}
              className="rd-btn rd-btn-danger rd-btn-sm"
            >
              Cancel Request
            </button>
          )}

          {canEdit && onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(need);
              }}
              className="rd-btn rd-btn-outline rd-btn-sm"
            >
              <Edit2 size={14} /> Edit Request
            </button>
          )}

          <button onClick={onClose} className="rd-btn rd-btn-primary rd-btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedDetailsModal;
