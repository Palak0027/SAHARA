import React, { useState, useEffect } from "react";
import {
  Utensils,
  Shirt,
  Gift,
  BookOpen,
  Plus,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  User,
  Heart,
  Users,
  Car,
  Truck,
  Bike,
  Handshake,
} from "lucide-react";
import {
  CategoryItem,
  donorApi,
} from "../../../services/api/donorApi";
import {
  CreateNeedPayload,
  receiverApi,
  OnBehalfOfData,
} from "../../../services/api/receiverApi";
import { RequestPrefillDonation } from "../types";

interface RaiseNeedTabProps {
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
  userReceiverType?: string;
  prefillDonation?: RequestPrefillDonation | null;
  onClearPrefill?: () => void;
}

export const RaiseNeedTab: React.FC<RaiseNeedTabProps> = ({
  categories,
  onCategoryCreated,
  onSuccess,
  onCancel,
  userLocation,
  userReceiverType,
  prefillDonation,
  onClearPrefill,
}) => {
  // Category state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("items");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "critical">("medium");

  // Date default to 3 days from now
  const getFutureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const [requiredBy, setRequiredBy] = useState(getFutureDate(3));

  // Location
  const [address, setAddress] = useState(userLocation?.address || "");
  const [city, setCity] = useState(userLocation?.city || "");
  const [state, setState] = useState(userLocation?.state || "");
  const [pincode, setPincode] = useState(userLocation?.pincode || "");

  // Receiver type & Beneficiary
  const [receiverType, setReceiverType] = useState<string>(userReceiverType || "individual");
  const [isOnBehalf, setIsOnBehalf] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryAge, setBeneficiaryAge] = useState("");
  const [relationship, setRelationship] = useState("");

  // Delivery logistics preference
  const [deliveryPreference, setDeliveryPreference] = useState<"any" | "receiver_pickup" | "donor_dropoff" | "volunteer_delivery">("any");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (prefillDonation) {
      setTitle(`Request for: ${prefillDonation.title}`);
      setQuantity(String(prefillDonation.quantity || ""));
      setUnit(prefillDonation.unit || "items");
      setDescription(`Requesting supply from community listing: "${prefillDonation.title}". ${prefillDonation.description || ""}`);

      if (prefillDonation.categoryId) {
        setSelectedCategoryId(prefillDonation.categoryId);
      }
    } else if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0]._id);
    }
  }, [categories, prefillDonation]);

  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("food") || lower.includes("meal")) return Utensils;
    if (lower.includes("cloth") || lower.includes("blanket")) return Shirt;
    if (lower.includes("book")) return BookOpen;
    return Gift;
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
      setFormError(err?.message || "Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedCategoryId) {
      setFormError("Please select a resource category");
      return;
    }

    if (!title.trim()) {
      setFormError("Please enter a title for your request");
      return;
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setFormError("Please specify a valid quantity greater than 0");
      return;
    }

    if (!address.trim()) {
      setFormError("Please provide a delivery address");
      return;
    }

    if (!city.trim()) {
      setFormError("Please provide a city for delivery");
      return;
    }

    const reqDate = new Date(requiredBy);
    if (isNaN(reqDate.getTime())) {
      setFormError("Please provide a valid required by date");
      return;
    }

    let onBehalfPayload: OnBehalfOfData = { isOnBehalf: false };
    if (isOnBehalf) {
      if (!beneficiaryName.trim()) {
        setFormError("Please provide the beneficiary's name");
        return;
      }
      onBehalfPayload = {
        isOnBehalf: true,
        beneficiaryName: beneficiaryName.trim(),
        beneficiaryAge: beneficiaryAge ? parseInt(beneficiaryAge, 10) : null,
        relationship: relationship.trim(),
      };
    }

    const payload: CreateNeedPayload = {
      title: title.trim(),
      categoryId: selectedCategoryId,
      quantity: numQty,
      unit: unit.trim(),
      urgency,
      requiredBy: reqDate.toISOString(),
      description: description.trim(),
      location: {
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
      receiverType,
      deliveryPreference,
      onBehalfOf: onBehalfPayload,
    };

    try {
      setSubmitting(true);
      await receiverApi.createNeed(payload);
      if (onClearPrefill) onClearPrefill();
      onSuccess();
    } catch (err: any) {
      setFormError(err?.message || "Failed to submit request. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const SelectedIcon = selectedCategory ? getCategoryIcon(selectedCategory.name) : Gift;

  return (
    <section className="rd-narrow">
      <div className="rd-section-head">
        <div>
          <h2 className="rd-section-title">Raise a Community Need</h2>
          <p className="rd-section-sub">
            Specify resources required for yourself, your family, or community relief shelter
          </p>
        </div>
      </div>

      {prefillDonation && (
        <div style={{ background: "#e8f4fc", border: "1px solid #b8daf2", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#1c658c", fontWeight: 700, textTransform: "uppercase" }}>Requesting Listed Supply</span>
            <p style={{ margin: "2px 0 0", fontWeight: 600, fontSize: "14px" }}>{prefillDonation.title}</p>
          </div>
          {onClearPrefill && (
            <button onClick={onClearPrefill} className="rd-link-btn" style={{ fontSize: "13px" }}>
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

      <form onSubmit={handleSubmit} className="rd-card rd-form">
        {/* Resource Category Dropdown (Clean, Scalable UI) */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label className="rd-label" htmlFor="need-cat" style={{ marginBottom: 0 }}>
              Resource Category *
            </label>
            <button
              type="button"
              onClick={() => setIsAddingNewCategory((v) => !v)}
              className="rd-link-btn"
              style={{ fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Plus size={14} />
              {isAddingNewCategory ? "Cancel Custom Category" : "+ Add New Category"}
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <select
              id="need-cat"
              className="rd-input"
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
              <SelectedIcon size={16} color="var(--forest)" style={{ flexShrink: 0 }} />
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
              className="rd-custom-type"
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
                  <label className="rd-label" htmlFor="new-need-cat-name" style={{ fontSize: "13px" }}>
                    Category Name *
                  </label>
                  <input
                    id="new-need-cat-name"
                    className="rd-input"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Blankets, Stationery, Medicines"
                    maxLength={30}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="rd-label" htmlFor="new-need-cat-desc" style={{ fontSize: "13px" }}>
                    Description (Optional)
                  </label>
                  <input
                    id="new-need-cat-desc"
                    className="rd-input"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder="Short description of items under this category"
                    maxLength={80}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="rd-btn rd-btn-primary rd-btn-sm"
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
                    className="rd-btn rd-btn-outline rd-btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Request Title */}
        <div>
          <label className="rd-label" htmlFor="need-title">Request Title *</label>
          <input
            id="need-title"
            className="rd-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Urgent Ration Kits for 40 Families / 30 Warm Blankets for Children"
            required
          />
        </div>

        {/* Quantity & Unit */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label className="rd-label" htmlFor="need-qty">Quantity Needed *</label>
            <input
              id="need-qty"
              type="number"
              min="1"
              step="any"
              className="rd-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50"
              required
            />
          </div>
          <div>
            <label className="rd-label" htmlFor="need-unit">Unit of Measure *</label>
            <input
              id="need-unit"
              className="rd-input"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. meals, blankets, kits, kg"
              required
            />
          </div>
        </div>

        {/* Urgency & Required By Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label className="rd-label" htmlFor="need-urgency">Urgency Level *</label>
            <select
              id="need-urgency"
              className="rd-input"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
            >
              <option value="low">Low Urgency (Within a week)</option>
              <option value="medium">Medium Urgency (In 3-4 days)</option>
              <option value="high">High Urgency (Next 24-48 hours)</option>
              <option value="critical">Critical (Immediate Relief Needed)</option>
            </select>
          </div>
          <div>
            <label className="rd-label" htmlFor="need-date">Required By Date *</label>
            <input
              id="need-date"
              type="date"
              className="rd-input"
              value={requiredBy}
              onChange={(e) => setRequiredBy(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="rd-label" htmlFor="need-desc">Detailed Description / Context *</label>
          <textarea
            id="need-desc"
            className="rd-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain why these supplies are needed, who will receive them, and any specific packing preferences..."
            required
          />
        </div>

        {/* Delivery Destination */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <MapPin size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Delivery Destination</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label className="rd-label" htmlFor="need-addr">Street Address / Community Landmark *</label>
              <input
                id="need-addr"
                className="rd-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Community Center, Sector 12"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label className="rd-label" htmlFor="need-city">City *</label>
                <input
                  id="need-city"
                  className="rd-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kanpur"
                  required
                />
              </div>
              <div>
                <label className="rd-label" htmlFor="need-state">State</label>
                <input
                  id="need-state"
                  className="rd-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Uttar Pradesh"
                />
              </div>
              <div>
                <label className="rd-label" htmlFor="need-pincode">Pincode</label>
                <input
                  id="need-pincode"
                  className="rd-input"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 208001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Receiver Type & On-Behalf Beneficiary */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignItems: "center" }}>
            <div>
              <label className="rd-label" htmlFor="need-rectype">Beneficiary Category</label>
              <select
                id="need-rectype"
                className="rd-input"
                value={receiverType}
                onChange={(e) => setReceiverType(e.target.value)}
              >
                <option value="individual">Individual Beneficiary</option>
                <option value="family">Underprivileged Family</option>
                <option value="community">Neighborhood / Slum Community</option>
                <option value="organization">Registered NGO / Shelter Home</option>
              </select>
            </div>

            <div style={{ paddingTop: "20px" }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isOnBehalf}
                  onChange={(e) => setIsOnBehalf(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--forest)" }}
                />
                Raising on behalf of someone else
              </label>
            </div>
          </div>

          {isOnBehalf && (
            <div style={{ background: "var(--paper)", padding: "14px", borderRadius: "10px", marginTop: "12px", border: "1px solid var(--line)" }}>
              <strong style={{ fontSize: "13.5px", color: "var(--forest)", display: "block", marginBottom: "8px" }}>
                Beneficiary Details
              </strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="rd-label" htmlFor="ben-name" style={{ fontSize: "12.5px" }}>Beneficiary Name *</label>
                  <input
                    id="ben-name"
                    className="rd-input"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="e.g. Sunita Devi"
                    required={isOnBehalf}
                  />
                </div>
                <div>
                  <label className="rd-label" htmlFor="ben-age" style={{ fontSize: "12.5px" }}>Age</label>
                  <input
                    id="ben-age"
                    type="number"
                    className="rd-input"
                    value={beneficiaryAge}
                    onChange={(e) => setBeneficiaryAge(e.target.value)}
                    placeholder="e.g. 62"
                  />
                </div>
                <div>
                  <label className="rd-label" htmlFor="ben-rel" style={{ fontSize: "12.5px" }}>Relationship</label>
                  <input
                    id="ben-rel"
                    className="rd-input"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Neighbor, Elder, Student"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery & Logistics Preference */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Car size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Logistics & Receiving Mode</h3>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "var(--muted)" }}>
            How would you like to receive the supplies once matched?
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {[
              {
                id: "any",
                label: "Flexible / Any",
                sub: "Volunteer, pickup, or donor drop-off",
                icon: Handshake,
              },
              {
                id: "receiver_pickup",
                label: "I Can Self-Pickup",
                sub: "I/we can travel to donor address",
                icon: Car,
              },
              {
                id: "donor_dropoff",
                label: "Request Donor Drop-off",
                sub: "Need donor to deliver to destination",
                icon: Truck,
              },
              {
                id: "volunteer_delivery",
                label: "Volunteer Courier Needed",
                sub: "Cannot travel; volunteer needed",
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
                      name="receiverDeliveryPref"
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
        <div className="rd-form-actions" style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={submitting}
            className="rd-btn rd-btn-primary"
            style={{ minWidth: "160px" }}
          >
            {submitting ? "Submitting..." : <><Plus size={16} /> Submit Need Request</>}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rd-btn rd-btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default RaiseNeedTab;
