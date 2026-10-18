import React, { useEffect, useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { ReceiverNeedItem, receiverApi } from "../../../services/api/receiverApi";

interface EditNeedModalProps {
  need: ReceiverNeedItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditNeedModal: React.FC<EditNeedModalProps> = ({
  need,
  onClose,
  onSuccess,
}) => {
  if (!need) return null;

  const [title, setTitle] = useState(need.title);
  const [description, setDescription] = useState(need.description);
  const [quantity, setQuantity] = useState(String(need.quantity));
  const [unit, setUnit] = useState(need.unit);
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "critical">(need.urgency);
  const [requiredBy, setRequiredBy] = useState(
    need.requiredBy ? new Date(need.requiredBy).toISOString().slice(0, 10) : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">(() => { try { return localStorage.getItem("sahara-language") === "hi" ? "hi" : "en"; } catch { return "en"; } });
  const hi = language === "hi";
  useEffect(() => {
    const syncLanguage = (event?: Event) => { const detail = (event as CustomEvent<string> | undefined)?.detail; try { setLanguage(detail === "hi" || (!detail && localStorage.getItem("sahara-language") === "hi") ? "hi" : "en"); } catch { setLanguage(detail === "hi" ? "hi" : "en"); } };
    window.addEventListener("sahara-language-change", syncLanguage); window.addEventListener("storage", syncLanguage);
    return () => { window.removeEventListener("sahara-language-change", syncLanguage); window.removeEventListener("storage", syncLanguage); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setError((hi ? "कृपया 0 से अधिक सही मात्रा दर्ज करें।" : "Please provide a valid quantity greater than 0"));
      return;
    }

    try {
      setLoading(true);
      await receiverApi.updateNeed(need._id, {
        title: title.trim(),
        description: description.trim(),
        quantity: numQty,
        unit: unit.trim(),
        urgency,
        requiredBy: requiredBy ? new Date(requiredBy).toISOString() : need.requiredBy,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || (hi ? "अनुरोध अपडेट नहीं हो सका। कृपया दोबारा प्रयास करें।" : "Failed to update need request"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="rd-modal rd-modal--wide"
        style={{ maxWidth: "520px" }}
        role="dialog"
        aria-modal="true"
        aria-label={hi ? "अनुरोध संपादित करें" : "Edit Request"}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="rd-modal-head">
          <h3 className="rd-modal-title">{hi ? "ज़रूरत का अनुरोध संपादित करें" : "Edit Need Request"}</h3>
          <button onClick={onClose} aria-label={hi ? "डायलॉग बंद करें" : "Close dialog"} className="rd-modal-close">
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
            <label className="rd-label" htmlFor="edit-need-title">{hi ? "अनुरोध का शीर्षक" : "Request Title"}</label>
            <input
              id="edit-need-title"
              className="rd-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="rd-label" htmlFor="edit-need-qty">{hi ? "मात्रा" : "Quantity"}</label>
              <input
                id="edit-need-qty"
                type="number"
                min="1"
                step="any"
                className="rd-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="rd-label" htmlFor="edit-need-unit">{hi ? "इकाई" : "Unit"}</label>
              <input
                id="edit-need-unit"
                className="rd-input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={hi ? "जैसे भोजन, कंबल, किट" : "e.g. meals, blankets, kits"}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="rd-label" htmlFor="edit-need-urgency">{hi ? "प्राथमिकता" : "Urgency"}</label>
              <select
                id="edit-need-urgency"
                className="rd-input"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
              >
                <option value="low">{hi ? "कम प्राथमिकता" : "Low Urgency"}</option>
                <option value="medium">{hi ? "मध्यम प्राथमिकता" : "Medium Urgency"}</option>
                <option value="high">{hi ? "उच्च प्राथमिकता" : "High Urgency"}</option>
                <option value="critical">{hi ? "अत्यंत गंभीर" : "Critical Urgency"}</option>
              </select>
            </div>
            <div>
              <label className="rd-label" htmlFor="edit-need-date">{hi ? "आवश्यकता की अंतिम तिथि" : "Required By"}</label>
              <input
                id="edit-need-date"
                type="date"
                className="rd-input"
                value={requiredBy}
                onChange={(e) => setRequiredBy(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="rd-label" htmlFor="edit-need-desc">{hi ? "विवरण" : "Description"}</label>
            <textarea
              id="edit-need-desc"
              className="rd-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="rd-modal-actions" style={{ justifyContent: "flex-end", marginTop: "12px" }}>
            <button type="button" onClick={onClose} className="rd-btn rd-btn-outline" disabled={loading}>
              {hi ? "रद्द करें" : "Cancel"}
            </button>
            <button type="submit" className="rd-btn rd-btn-primary" disabled={loading}>
              {loading ? (hi ? "सेव हो रहा है..." : "Saving...") : <><Save size={16} /> {hi ? "बदलाव सेव करें" : "Save Changes"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNeedModal;
