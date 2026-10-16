import React, { useState, useEffect } from "react";
import {
  Utensils,
  Shirt,
  Gift,
  BookOpen,
  Plus,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Car,
  Truck,
  Bike,
  Handshake,
} from "lucide-react";
import {
  CategoryItem,
  CreateDonationPayload,
  donorApi,
} from "../../../services/api/donorApi";
import { NeedPrefillData } from "../types";

interface PostDonationTabProps {
  categories: CategoryItem[];
  onCategoryCreated: (newCategory: CategoryItem) => void;
  onSuccess: () => void;
  onCancel: () => void;
  userLocation?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  needPrefill?: NeedPrefillData | null;
  onClearPrefill?: () => void;
}

export const PostDonationTab: React.FC<PostDonationTabProps> = ({
  categories,
  onCategoryCreated,
  onSuccess,
  onCancel,
  userLocation,
  needPrefill,
  onClearPrefill,
}) => {
  // Helpers to get ISO datetime strings for default values
  const getNowIsoLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const getFutureIsoLocal = (hours: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  // Form State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("items");

  // Location
  const [address, setAddress] = useState(userLocation?.address || "");
  const [city, setCity] = useState(userLocation?.city || "");
  const [state, setState] = useState(userLocation?.state || "");
  const [pincode, setPincode] = useState(userLocation?.pincode || "");

  // Timing
  const [availableFrom, setAvailableFrom] = useState(getNowIsoLocal());
  const [availableUntil, setAvailableUntil] = useState(getFutureIsoLocal(48));

  // Food details
  const [isVeg, setIsVeg] = useState(true);
  const [preparedOn, setPreparedOn] = useState(getNowIsoLocal());
  const [safeUntil, setSafeUntil] = useState(getFutureIsoLocal(24));

  // Delivery logistics preference
  const [deliveryPreference, setDeliveryPreference] = useState<"any" | "receiver_pickup" | "donor_dropoff" | "volunteer_delivery">("any");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Set default category or prefill
  useEffect(() => {
    if (needPrefill) {
      setTitle(`Donation for: ${needPrefill.title}`);
      setQuantity(String(needPrefill.quantity || ""));
      setUnit(needPrefill.unit || "items");
      setDescription(`Contributing towards community request: "${needPrefill.title}". ${needPrefill.description || ""}`);

      if (needPrefill.categoryId) {
        setSelectedCategoryId(needPrefill.categoryId);
      }
    } else if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0]._id);
    }
  }, [categories, needPrefill]);

  // Determine if current category is food
  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);
  const isFoodCategory = Boolean(
    selectedCategory?.name?.toLowerCase().includes("food") ||
    selectedCategory?.name?.toLowerCase().includes("meal")
  );

  // Quick unit choices based on category
  const getUnitOptions = () => {
    if (isFoodCategory) return ["meals", "kg", "packets", "boxes", "portions"];
    if (selectedCategory?.name?.toLowerCase().includes("cloth")) return ["pieces", "pairs", "boxes", "bags", "sets"];
    if (selectedCategory?.name?.toLowerCase().includes("book")) return ["books", "sets", "bundles", "boxes"];
    return ["items", "packets", "boxes", "units", "kg"];
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setCreatingCategory(true);
      const res = await donorApi.createCategory(newCategoryName.trim(), newCategoryDesc.trim());
      if (res.success && res.category) {
        onCategoryCreated(res.category);
        setSelectedCategoryId(res.category._id);
        setIsAddingNewCategory(false);
        setNewCategoryName("");
        setNewCategoryDesc("");
      }
    } catch (err: any) {
      setFormError(err?.message || "Failed to create new category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedCategoryId) {
      setFormError("Please select a donation category");
      return;
    }

    if (!title.trim()) {
      setFormError("Please enter a donation title");
      return;
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setFormError("Please enter a valid quantity greater than 0");
      return;
    }

    if (!unit.trim()) {
      setFormError("Please enter or select a unit of measurement");
      return;
    }

    if (!address.trim()) {
      setFormError("Please provide a pickup street address");
      return;
    }

    if (!city.trim()) {
      setFormError("Please provide a pickup city");
      return;
    }

    const fromDate = new Date(availableFrom);
    const untilDate = new Date(availableUntil);

    if (isNaN(fromDate.getTime()) || isNaN(untilDate.getTime())) {
      setFormError("Please provide valid availability dates");
      return;
    }

    if (untilDate <= fromDate) {
      setFormError("Available until date must be after available from date");
      return;
    }

    let foodPayload = null;
    if (isFoodCategory) {
      const prepDate = preparedOn ? new Date(preparedOn) : null;
      const safeDate = safeUntil ? new Date(safeUntil) : null;

      if (!safeDate || isNaN(safeDate.getTime())) {
        setFormError("Please specify a safe consumption deadline for food items");
        return;
      }

      if (safeDate <= new Date()) {
        setFormError("Safe until date/time must be in the future. Expired food cannot be distributed.");
        return;
      }

      if (prepDate && safeDate <= prepDate) {
        setFormError("Safe until date/time must be after the prepared on date/time");
        return;
      }

      foodPayload = {
        isVeg,
        preparedOn: prepDate ? prepDate.toISOString() : null,
        safeUntil: safeDate.toISOString(),
      };
    }

    const payload: CreateDonationPayload = {
      title: title.trim(),
      categoryId: selectedCategoryId,
      quantity: numQty,
      unit: unit.trim(),
      description: description.trim(),
      location: {
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
      availableFrom: fromDate.toISOString(),
      availableUntil: untilDate.toISOString(),
      deliveryPreference,
      foodDetails: foodPayload,
    };

    try {
      setSubmitting(true);
      await donorApi.createDonation(payload);
      if (onClearPrefill) onClearPrefill();
      onSuccess();
    } catch (err: any) {
      setFormError(err?.message || "Failed to post donation. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("food") || lower.includes("meal")) return Utensils;
    if (lower.includes("cloth") || lower.includes("blanket")) return Shirt;
    if (lower.includes("book")) return BookOpen;
    return Gift;
  };

  return (
    <section className="sd-narrow">
      <div className="sd-section-head">
        <div>
          <h2 className="sd-section-title">Post a Donation</h2>
          <p className="sd-section-sub">
            Share surplus resources, hot meals, or winter clothes directly with community receivers
          </p>
        </div>
      </div>

      {needPrefill && (
        <div style={{ background: "#e8f4fc", border: "1px solid #b8daf2", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#1c658c", fontWeight: 700, textTransform: "uppercase" }}>Fulfilling Community Request</span>
            <p style={{ margin: "2px 0 0", fontWeight: 600, fontSize: "14px" }}>{needPrefill.title}</p>
          </div>
          {onClearPrefill && (
            <button onClick={onClearPrefill} className="sd-link-btn" style={{ fontSize: "13px" }}>
              Clear
            </button>
          )}
        </div>
      )}

      {formError && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fbe8e8", color: "#b33a3a", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "14px", border: "1px solid #f5c2c2" }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="sd-card sd-form">
        {/* Category Dropdown */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label className="sd-label" htmlFor="don-category" style={{ marginBottom: 0 }}>
              Select Resource Category *
            </label>
            <button
              type="button"
              onClick={() => setIsAddingNewCategory((v) => !v)}
              className="sd-link-btn"
              style={{ fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Plus size={14} />
              {isAddingNewCategory ? "Cancel Custom Category" : "+ Add New Category"}
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <select
              id="don-category"
              className="sd-input"
              value={selectedCategoryId}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setIsAddingNewCategory(true);
                } else {
                  setSelectedCategoryId(e.target.value);
                  setIsAddingNewCategory(false);
                }
              }}
              required
            >
              <option value="" disabled>-- Select a Resource Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} {cat.description ? `— (${cat.description})` : ""}
                </option>
              ))}
              <option value="__new__">+ Add New Category...</option>
            </select>
          </div>

          {/* Selected Category Info Preview */}
          {selectedCategory && !isAddingNewCategory && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "8px",
                padding: "8px 12px",
                background: "var(--paper)",
                borderRadius: "8px",
                fontSize: "13px",
                border: "1px solid var(--line)",
              }}
            >
              {(() => {
                const SelectedIcon = getCategoryIcon(selectedCategory.name);
                return <SelectedIcon size={16} color="var(--forest)" style={{ flexShrink: 0 }} />;
              })()}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
                <strong style={{ color: "var(--forest)" }}>{selectedCategory.name}</strong>
                {selectedCategory.description && (
                  <span style={{ color: "var(--muted)", fontSize: "12.5px" }}>
                    • {selectedCategory.description}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Inline Add New Category Box */}
          {isAddingNewCategory && (
            <div
              className="sd-custom-type"
              style={{
                background: "var(--paper)",
                padding: "16px",
                borderRadius: "10px",
                marginTop: "12px",
                border: "1px dashed var(--leaf)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Plus size={16} color="var(--forest)" />
                <strong style={{ fontSize: "13.5px", color: "var(--forest)" }}>Add a New Category</strong>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label className="sd-label" htmlFor="new-cat-name" style={{ fontSize: "13px" }}>
                    Category Name *
                  </label>
                  <input
                    id="new-cat-name"
                    className="sd-input"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Blankets, Stationery, Medicines"
                    maxLength={30}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="sd-label" htmlFor="new-cat-desc" style={{ fontSize: "13px" }}>
                    Description (Optional)
                  </label>
                  <input
                    id="new-cat-desc"
                    className="sd-input"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder="Short description of what items fall under this category"
                    maxLength={80}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="sd-btn sd-btn-primary sd-btn-sm"
                  >
                    {creatingCategory ? "Saving..." : "Create & Select Category"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setNewCategoryName("");
                      setNewCategoryDesc("");
                    }}
                    className="sd-btn sd-btn-outline sd-btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <p className="sd-hint">This category will be permanently saved in the database for all future donations and community needs.</p>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="sd-label" htmlFor="don-title">Donation Title *</label>
          <input
            id="don-title"
            className="sd-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 50 Fresh Packed Vegetarian Meals / 20 Woolen Sweaters"
            required
          />
        </div>

        {/* Quantity & Unit */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label className="sd-label" htmlFor="don-qty">Quantity *</label>
            <input
              id="don-qty"
              type="number"
              min="1"
              step="any"
              className="sd-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 25"
              required
            />
          </div>
          <div>
            <label className="sd-label" htmlFor="don-unit">Unit of Measure *</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="don-unit"
                className="sd-input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. kg, meals, items"
                required
              />
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
              {getUnitOptions().map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  style={{
                    fontSize: "11.5px",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    background: unit === u ? "var(--forest)" : "var(--paper)",
                    color: unit === u ? "#fff" : "var(--muted)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="sd-label" htmlFor="don-desc">Description / Instructions</label>
          <textarea
            id="don-desc"
            className="sd-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what items are included, packaging details, and any handling instructions..."
          />
        </div>

        {/* Pickup Location */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <MapPin size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Pickup Location</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label className="sd-label" htmlFor="don-addr">Street Address / Landmark *</label>
              <input
                id="don-addr"
                className="sd-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 302, Sunrise Apartments, Green Park Ext."
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label className="sd-label" htmlFor="don-city">City *</label>
                <input
                  id="don-city"
                  className="sd-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                  required
                />
              </div>
              <div>
                <label className="sd-label" htmlFor="don-state">State</label>
                <input
                  id="don-state"
                  className="sd-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Delhi"
                />
              </div>
              <div>
                <label className="sd-label" htmlFor="don-pincode">Pincode</label>
                <input
                  id="don-pincode"
                  className="sd-input"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 110016"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Availability Window */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Calendar size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Availability Window</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="sd-label" htmlFor="don-from">Available From *</label>
              <input
                id="don-from"
                type="datetime-local"
                className="sd-input"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sd-label" htmlFor="don-until">Available Until *</label>
              <input
                id="don-until"
                type="datetime-local"
                className="sd-input"
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Food Safety & Dietary Section (If Food Category) */}
        {isFoodCategory && (
          <div style={{ border: "1px solid #bce1d6", background: "#f2f9f6", padding: "16px", borderRadius: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--forest)", marginBottom: "12px" }}>
              <ShieldCheck size={20} color="var(--green)" />
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>Food Safety & Hygiene Compliance</h4>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted)" }}>
                  SAHARA enforces zero-waste and safe consumption guidelines.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="sd-label">Dietary Preference</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setIsVeg(true)}
                    className={`sd-btn ${isVeg ? "sd-btn-primary" : "sd-btn-outline"} sd-btn-sm`}
                  >
                    🌱 Pure Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVeg(false)}
                    className={`sd-btn ${!isVeg ? "sd-btn-primary" : "sd-btn-outline"} sd-btn-sm`}
                  >
                    🍗 Non-Vegetarian
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="sd-label" htmlFor="food-prep">Prepared / Packed On</label>
                  <input
                    id="food-prep"
                    type="datetime-local"
                    className="sd-input"
                    value={preparedOn}
                    onChange={(e) => setPreparedOn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="sd-label" htmlFor="food-safe">Safe Until (Consumption Deadline) *</label>
                  <input
                    id="food-safe"
                    type="datetime-local"
                    className="sd-input"
                    value={safeUntil}
                    onChange={(e) => setSafeUntil(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery & Logistics Preference */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Car size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Delivery & Logistics Preference</h3>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "var(--muted)" }}>
            How would you like the supplies to reach the receiver?
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {[
              {
                id: "any",
                label: "Flexible / Either",
                sub: "Volunteer, pickup, or drop-off",
                icon: Handshake,
              },
              {
                id: "receiver_pickup",
                label: "Receiver Pick-up Only",
                sub: "Receiver collects from your address",
                icon: Car,
              },
              {
                id: "donor_dropoff",
                label: "I Can Drop Off",
                sub: "I will deliver to receiver's location",
                icon: Truck,
              },
              {
                id: "volunteer_delivery",
                label: "Volunteer Needed",
                sub: "Cannot travel; courier required",
                icon: Bike,
              },
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = deliveryPreference === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setDeliveryPreference(opt.id as any)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: isSelected ? "2px solid var(--forest)" : "1px solid var(--line)",
                    background: isSelected ? "rgba(11, 85, 99, 0.05)" : "var(--paper)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "13.5px", color: isSelected ? "var(--forest)" : "var(--ink)" }}>
                      <Icon size={16} color={isSelected ? "var(--forest)" : "var(--muted)"} />
                      <span>{opt.label}</span>
                    </div>
                    <input
                      type="radio"
                      name="deliveryPref"
                      checked={isSelected}
                      onChange={() => setDeliveryPreference(opt.id as any)}
                      style={{ cursor: "pointer", accentColor: "var(--forest)" }}
                    />
                  </div>
                  <span style={{ fontSize: "11.5px", color: "var(--muted)", paddingLeft: "22px" }}>
                    {opt.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Actions */}
        <div className="sd-form-actions" style={{ marginTop: "10px" }}>
          <button
            type="submit"
            disabled={submitting}
            className="sd-btn sd-btn-primary"
            style={{ minWidth: "160px" }}
          >
            {submitting ? "Publishing..." : <><Plus size={16} /> Publish Donation</>}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="sd-btn sd-btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default PostDonationTab;
