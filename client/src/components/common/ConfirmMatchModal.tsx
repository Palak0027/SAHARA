import React, { useState } from "react";
import {
  X,
  Sparkles,
  MapPin,
  Car,
  Truck,
  Bike,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Package,
  Heart,
  Clock,
} from "lucide-react";
import { LogisticsMode, donorApi } from "../../services/api/donorApi";
import { receiverApi } from "../../services/api/receiverApi";

export interface ConfirmMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: {
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    category?: string;
    location?: { address?: string; city?: string };
    donorName?: string;
  };
  need: {
    _id: string;
    title: string;
    quantity: number;
    unit: string;
    category?: string;
    location?: { address?: string; city?: string };
    receiverName?: string;
    organization?: string;
    urgency?: string;
  };
  score?: number;
  initialMode?: LogisticsMode;
  onConfirmSuccess: (result: any) => void;
  currentRole: "donor" | "receiver" | "admin";
}

export const ConfirmMatchModal: React.FC<ConfirmMatchModalProps> = ({
  isOpen,
  onClose,
  donation,
  need,
  score,
  initialMode = "volunteer_delivery",
  onConfirmSuccess,
  currentRole,
}) => {
  const [selectedMode, setSelectedMode] = useState<LogisticsMode>(initialMode);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        donationId: donation._id,
        needId: need._id,
        fulfillmentMode: selectedMode,
        notes: notes.trim(),
      };

      const result = currentRole === "receiver"
        ? await receiverApi.confirmMatch(payload)
        : await donorApi.confirmMatch(payload);

      if (result.success) {
        onConfirmSuccess(result);
        onClose();
      } else {
        setError(result.message || "Failed to confirm match");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while confirming match");
    } finally {
      setSubmitting(false);
    }
  };

  const scenarios = [
    {
      id: "receiver_pickup" as LogisticsMode,
      title: "Receiver Self-Pickup",
      icon: Car,
      tag: "Direct Handover",
      accent: "#0b5563",
      summary: "Receiver collects supplies directly from Donor",
      description:
        "Receiver (or their NGO representative/shelter vehicle) will travel to the donor's address. No volunteer courier required.",
      recommendedWhen: "Receiver has a vehicle or lives close to donor.",
    },
    {
      id: "donor_dropoff" as LogisticsMode,
      title: "Donor Direct Drop-Off",
      icon: Truck,
      tag: "Direct Delivery",
      accent: "#2c8a4c",
      summary: "Donor drives & drops off at Receiver's destination",
      description:
        "Donor will transport and deliver supplies directly to the receiver's address. Direct handover without intermediary.",
      recommendedWhen: "Donor is mobile and willing to deliver on their way.",
    },
    {
      id: "volunteer_delivery" as LogisticsMode,
      title: "SAHARA Volunteer Delivery",
      icon: Bike,
      tag: "Community Courier",
      accent: "#d97706",
      summary: "A verified SAHARA Volunteer is dispatched",
      description:
        "Platform automatically posts a delivery task to local SAHARA volunteers. A nearby volunteer will pick up from donor and deliver to receiver.",
      recommendedWhen: "Neither donor nor receiver can travel.",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        padding: "16px",
        background: "rgba(6, 36, 44, 0.65)",
        backdropFilter: "blur(4px)",
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          borderTop: "5px solid #0b5563",
        }}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#e6f4f2", color: "#0b5563", padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
              <Sparkles size={13} />
              {score ? `${score}% Compatibility Match` : "Smart Match Logistics"}
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#162828", margin: 0 }}>
              Confirm Match & Delivery Mode
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5d7473" }}>
              Select who will handle the pickup and transport between Donor and Receiver.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: 0,
              padding: "6px",
              cursor: "pointer",
              color: "#5d7473",
              borderRadius: "8px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", background: "#fdf2f2", border: "1px solid #f9d2d2", color: "#991b1b", fontSize: "13px" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Side-by-Side Match Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "12px",
            alignItems: "center",
            background: "#f7fbf9",
            border: "1px solid #dbe6e4",
            borderRadius: "12px",
            padding: "14px 16px",
          }}
        >
          {/* Donation Box */}
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#0b5563" }}>
              Donor Contribution
            </span>
            <h4 style={{ margin: "3px 0 2px", fontSize: "14px", fontWeight: 700, color: "#162828", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {donation.title}
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#5d7473" }}>
              {donation.quantity} {donation.unit} • {donation.category || "General"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: "#5d7473", marginTop: "3px" }}>
              <MapPin size={12} color="#0b5563" />
              <span>{donation.location?.city || "Donor City"}</span>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", width: "32px", height: "32px", borderRadius: "50%", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", border: "1px solid #dbe6e4" }}>
            <ArrowRight size={16} color="#0b5563" />
          </div>

          {/* Need Box */}
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#2c8a4c" }}>
              Receiver Requirement
            </span>
            <h4 style={{ margin: "3px 0 2px", fontSize: "14px", fontWeight: 700, color: "#162828", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {need.title}
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#5d7473" }}>
              {need.quantity} {need.unit} • {need.receiverName || need.organization || "Beneficiary"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: "#5d7473", marginTop: "3px" }}>
              <MapPin size={12} color="#2c8a4c" />
              <span>{need.location?.city || "Receiver City"}</span>
            </div>
          </div>
        </div>

        {/* 3 Logistics Scenarios Selector */}
        <div>
          <label style={{ display: "block", fontSize: "13.5px", fontWeight: 700, color: "#162828", marginBottom: "8px" }}>
            Select Fulfillment Scenario:
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              const isSelected = selectedMode === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedMode(sc.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    border: isSelected ? `2px solid ${sc.accent}` : "1.5px solid #e1e9e7",
                    background: isSelected ? "#f6fcfb" : "#ffffff",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 4px 12px rgba(11, 85, 99, 0.08)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: isSelected ? sc.accent : "#edf4f2",
                      color: isSelected ? "#ffffff" : sc.accent,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14.5px", fontWeight: 700, color: "#162828" }}>
                          {sc.title}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: sc.accent, background: "#edf6f4", padding: "2px 8px", borderRadius: "99px" }}>
                          {sc.tag}
                        </span>
                      </div>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedMode(sc.id)}
                        style={{ cursor: "pointer", accentColor: sc.accent }}
                      />
                    </div>
                    <p style={{ margin: "4px 0 2px", fontSize: "13px", color: "#344847", lineHeight: "1.4" }}>
                      {sc.description}
                    </p>
                    <span style={{ fontSize: "11.5px", color: "#718987", fontStyle: "italic" }}>
                      💡 {sc.recommendedWhen}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Handover & Delivery Instructions */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#162828", marginBottom: "6px" }}>
            Specific Handover / Delivery Instructions (Optional):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Items are boxed at security gate; Available between 3 PM - 6 PM; Call before arrival..."
            rows={2}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #cfdcd9",
              fontSize: "13.5px",
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #cfdcd9",
              background: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#344847",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #0b5563, #15798c)",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(11, 85, 99, 0.25)",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <span>Confirming...</span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Confirm Match & Schedule Delivery
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMatchModal;
