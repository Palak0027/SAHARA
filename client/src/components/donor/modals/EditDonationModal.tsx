import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { DonationItem, donorApi } from "../../../services/api/donorApi";

interface EditDonationModalProps {
  donation: DonationItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditDonationModal: React.FC<EditDonationModalProps> = ({
  donation,
  onClose,
  onSuccess,
}) => {
  if (!donation) return null;

  const [title, setTitle] = useState(donation.title);
  const [description, setDescription] = useState(donation.description);
  const [quantity, setQuantity] = useState(String(donation.quantity));
  const [unit, setUnit] = useState(donation.unit);
  const [availableUntil, setAvailableUntil] = useState(
    donation.availableUntil ? new Date(donation.availableUntil).toISOString().slice(0, 16) : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setError("Please provide a valid quantity greater than 0");
      return;
    }

    try {
      setLoading(true);
      await donorApi.updateDonation(donation._id, {
        title: title.trim(),
        description: description.trim(),
        quantity: numQty,
        unit: unit.trim(),
        availableUntil: availableUntil ? new Date(availableUntil).toISOString() : donation.availableUntil,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to update donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="sd-modal"
        style={{ maxWidth: "520px" }}
        role="dialog"
        aria-modal="true"
        aria-label="Edit Donation"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sd-modal-head">
          <h3 className="sd-modal-title">Edit Donation</h3>
          <button onClick={onClose} aria-label="Close dialog" className="sd-modal-close">
            <X size={19} />
          </button>
        </div>

        {error && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "#fbe8e8", color: "#b33a3a", padding: "10px 14px", borderRadius: "8px", fontSize: "13.5px" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="sd-label" htmlFor="edit-title">Donation Title</label>
            <input
              id="edit-title"
              className="sd-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="sd-label" htmlFor="edit-qty">Quantity</label>
              <input
                id="edit-qty"
                type="number"
                min="1"
                step="any"
                className="sd-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sd-label" htmlFor="edit-unit">Unit</label>
              <input
                id="edit-unit"
                className="sd-input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. kg, items, meals"
                required
              />
            </div>
          </div>

          <div>
            <label className="sd-label" htmlFor="edit-desc">Description</label>
            <textarea
              id="edit-desc"
              className="sd-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="sd-label" htmlFor="edit-until">Available Until</label>
            <input
              id="edit-until"
              type="datetime-local"
              className="sd-input"
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
              required
            />
          </div>

          <div className="sd-modal-actions" style={{ justifyContent: "flex-end", marginTop: "12px" }}>
            <button type="button" onClick={onClose} className="sd-btn sd-btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="sd-btn sd-btn-primary" disabled={loading}>
              {loading ? "Saving..." : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationModal;
