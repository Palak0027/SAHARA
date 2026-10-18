
import React, { useEffect, useState } from "react";
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
  const [language, setLanguage] = useState<"en" | "hi">(() => {
    try {
      return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hi = language === "hi";

  useEffect(() => {
    const syncLanguage = (event?: Event) => {
      const detail = (event as CustomEvent<string> | undefined)?.detail;

      try {
        setLanguage(
          detail === "hi" ||
            (!detail && localStorage.getItem("sahara-language") === "hi")
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

  useEffect(() => {
    if (!donation) return;

    setTitle(donation.title);
    setDescription(donation.description || "");
    setQuantity(String(donation.quantity));
    setUnit(donation.unit);
    setAvailableUntil(
      donation.availableUntil
        ? new Date(donation.availableUntil).toISOString().slice(0, 16)
        : ""
    );
    setError(null);
  }, [donation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donation) return;

    setError(null);

    const numQty = parseFloat(quantity);

    if (isNaN(numQty) || numQty <= 0) {
      setError(
        hi
          ? "कृपया 0 से अधिक सही मात्रा दर्ज करें।"
          : "Please provide a valid quantity greater than 0"
      );
      return;
    }

    try {
      setLoading(true);

      await donorApi.updateDonation(donation._id, {
        title: title.trim(),
        description: description.trim(),
        quantity: numQty,
        unit: unit.trim(),
        availableUntil: availableUntil
          ? new Date(availableUntil).toISOString()
          : donation.availableUntil,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.message ||
          (hi
            ? "दान अपडेट नहीं हो सका। कृपया दोबारा प्रयास करें।"
            : "Failed to update donation")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!donation) return null;

  return (
    <div className="sd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="sd-modal"
        style={{ maxWidth: "520px" }}
        role="dialog"
        aria-modal="true"
        aria-label={hi ? "दान संपादित करें" : "Edit Donation"}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sd-modal-head">
          <h3 className="sd-modal-title">
            {hi ? "दान संपादित करें" : "Edit Donation"}
          </h3>

          <button
            onClick={onClose}
            aria-label={hi ? "डायलॉग बंद करें" : "Close dialog"}
            className="sd-modal-close"
          >
            <X size={19} />
          </button>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              background: "#fbe8e8",
              color: "#b33a3a",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13.5px",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div>
            <label className="sd-label" htmlFor="edit-title">
              {hi ? "दान का शीर्षक" : "Donation Title"}
            </label>
            <input
              id="edit-title"
              className="sd-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label className="sd-label" htmlFor="edit-qty">
                {hi ? "मात्रा" : "Quantity"}
              </label>
              <input
                id="edit-qty"
                type="number"
                min="0.01"
                step="any"
                className="sd-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="sd-label" htmlFor="edit-unit">
                {hi ? "इकाई" : "Unit"}
              </label>
              <input
                id="edit-unit"
                className="sd-input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={hi ? "जैसे किलो, वस्तुएँ, भोजन" : "e.g. kg, items, meals"}
                required
              />
            </div>
          </div>

          <div>
            <label className="sd-label" htmlFor="edit-desc">
              {hi ? "विवरण" : "Description"}
            </label>
            <textarea
              id="edit-desc"
              className="sd-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="sd-label" htmlFor="edit-until">
              {hi ? "उपलब्धता की अंतिम तिथि" : "Available Until"}
            </label>
            <input
              id="edit-until"
              type="datetime-local"
              className="sd-input"
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
              required
            />
          </div>

          <div
            className="sd-modal-actions"
            style={{ justifyContent: "flex-end", marginTop: "12px" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="sd-btn sd-btn-outline"
              disabled={loading}
            >
              {hi ? "रद्द करें" : "Cancel"}
            </button>

            <button
              type="submit"
              className="sd-btn sd-btn-primary"
              disabled={loading}
            >
              {loading ? (
                hi ? "सेव हो रहा है..." : "Saving..."
              ) : (
                <>
                  <Save size={16} />
                  {hi ? "बदलाव सेव करें" : "Save Changes"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationModal;
