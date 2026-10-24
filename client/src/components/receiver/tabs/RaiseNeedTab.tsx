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
import { VoiceFormAssistant } from "../../common/VoiceFormAssistant";
import { type ParsedDonationOrNeed } from "../../../services/voiceNlpParser";

interface RaiseNeedTabProps {
  language?: "en" | "hi";
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
  language = "en",
  categories,
  onCategoryCreated,
  onSuccess,
  onCancel,
  userLocation,
  userReceiverType,
  prefillDonation,
  onClearPrefill,
}) => {
  const tr = (en: string, hi: string) => language === "hi" ? hi : en;

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

  const handleApplyVoice = (parsed: ParsedDonationOrNeed) => {
    if (parsed.title) setTitle(parsed.title);
    if (parsed.description) setDescription(parsed.description);
    if (parsed.quantity) setQuantity(String(parsed.quantity));
    if (parsed.quantityUnit) setUnit(parsed.quantityUnit);
    if (parsed.urgency) setUrgency(parsed.urgency);
    if (parsed.city) setCity(parsed.city);
    if (parsed.address) setAddress(parsed.address);
    if (parsed.pincode) setPincode(parsed.pincode);

    if (parsed.categoryName && categories.length > 0) {
      const targetName = parsed.categoryName.toLowerCase();
      const matched = categories.find((c) =>
        c.name.toLowerCase() === targetName ||
        c.name.toLowerCase().includes(targetName) ||
        targetName.includes(c.name.toLowerCase())
      );
      if (matched) {
        setSelectedCategoryId(matched._id);
        setIsAddingNewCategory(false);
      } else {
        const otherCat = categories.find((c) => c.name.toLowerCase().includes("other"));
        if (otherCat) {
          setSelectedCategoryId(otherCat._id);
        }
        setNewCategoryName(parsed.categoryName);
      }
    }
  };

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
      setFormError(err?.message || tr("Failed to create category", "श्रेणी बनाने में विफल"));
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedCategoryId) {
      setFormError(tr("Please select a resource category", "कृपया संसाधन श्रेणी चुनें"));
      return;
    }

    if (!title.trim()) {
      setFormError(tr("Please enter a title for your request", "कृपया अनुरोध का शीर्षक दर्ज करें"));
      return;
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setFormError(tr("Please specify a valid quantity greater than 0", "कृपया 0 से अधिक सही मात्रा दर्ज करें"));
      return;
    }

    if (!address.trim()) {
      setFormError(tr("Please provide a delivery address", "कृपया डिलीवरी का पता दर्ज करें"));
      return;
    }

    if (!city.trim()) {
      setFormError(tr("Please provide a city for delivery", "कृपया डिलीवरी के लिए शहर दर्ज करें"));
      return;
    }

    const reqDate = new Date(requiredBy);
    if (isNaN(reqDate.getTime())) {
      setFormError(tr("Please provide a valid required by date", "कृपया आवश्यक तारीख सही दर्ज करें"));
      return;
    }

    let onBehalfPayload: OnBehalfOfData = { isOnBehalf: false };
    if (isOnBehalf) {
      if (!beneficiaryName.trim()) {
        setFormError(tr("Please provide the beneficiary's name", "कृपया लाभार्थी का नाम दर्ज करें"));
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
      setFormError(err?.message || tr("Failed to submit request. Please check your inputs.", "अनुरोध भेजने में विफल। कृपया अपनी जानकारी जाँचें।"));
    } finally {
      setSubmitting(false);
    }
  };

  const SelectedIcon = selectedCategory ? getCategoryIcon(selectedCategory.name) : Gift;

  return (
    <section className="rd-narrow">
      <div className="rd-section-head">
        <div>
          <h2 className="rd-section-title">{tr("Raise a Community Need", "समुदाय की आवश्यकता दर्ज करें")}</h2>
          <p className="rd-section-sub">
            {tr("Specify resources required for yourself, your family, or community relief shelter", "अपने, अपने परिवार या समुदाय के लिए आवश्यक संसाधनों का विवरण दें")}
          </p>
        </div>
      </div>

      {prefillDonation && (
        <div style={{ background: "#e8f4fc", border: "1px solid #b8daf2", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#1c658c", fontWeight: 700, textTransform: "uppercase" }}>{tr("Requesting Listed Supply", "सूचीबद्ध सामग्री के लिए अनुरोध")}</span>
            <p style={{ margin: "2px 0 0", fontWeight: 600, fontSize: "14px" }}>{prefillDonation.title}</p>
          </div>
          {onClearPrefill && (
            <button onClick={onClearPrefill} className="rd-link-btn" style={{ fontSize: "13px" }}>
              {tr("Clear", "हटाएँ")}
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
        {/* AI Voice Assistant */}
        <VoiceFormAssistant
          context="receiver"
          language={language}
          availableCategories={categories.map((c) => ({ id: c._id, name: c.name }))}
          onApply={handleApplyVoice}
        />

        {/* Resource Category Dropdown (Clean, Scalable UI) */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label className="rd-label" htmlFor="need-cat" style={{ marginBottom: 0 }}>
              {tr("Resource Category *", "संसाधन श्रेणी *")}
            </label>
            <button
              type="button"
              onClick={() => setIsAddingNewCategory((v) => !v)}
              className="rd-link-btn"
              style={{ fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Plus size={14} />
              {isAddingNewCategory ? tr("Cancel Custom Category", "कस्टम श्रेणी रद्द करें") : tr("+ Add New Category", "+ नई श्रेणी जोड़ें")}
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
              <option value="" disabled>{tr("-- Select a Resource Category --", "-- संसाधन श्रेणी चुनें --")}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} {cat.description ? `— (${cat.description})` : ""}
                </option>
              ))}
              <option value="__new__">{tr("+ Add New Category...", "+ नई श्रेणी जोड़ें...")}</option>
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
                <strong style={{ fontSize: "13.5px", color: "var(--forest)" }}>{tr("Add a New Category", "नई श्रेणी जोड़ें")}</strong>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label className="rd-label" htmlFor="new-need-cat-name" style={{ fontSize: "13px" }}>
                    {tr("Category Name *", "श्रेणी का नाम *")}
                  </label>
                  <input
                    id="new-need-cat-name"
                    className="rd-input"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder={tr("e.g. Blankets, Stationery, Medicines", "जैसे कंबल, स्टेशनरी, दवाइयाँ")}
                    maxLength={30}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="rd-label" htmlFor="new-need-cat-desc" style={{ fontSize: "13px" }}>
                    {tr("Description (Optional)", "विवरण (वैकल्पिक)")}
                  </label>
                  <input
                    id="new-need-cat-desc"
                    className="rd-input"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder={tr("Short description of items under this category", "इस श्रेणी की वस्तुओं का संक्षिप्त विवरण")}
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
                    {creatingCategory ? tr("Saving...", "सेव हो रहा है...") : tr("Create & Select Category", "श्रेणी बनाएँ और चुनें")}
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
                    {tr("Cancel", "रद्द करें")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Request Title */}
        <div>
          <label className="rd-label" htmlFor="need-title">{tr("Request Title *", "अनुरोध का शीर्षक *")}</label>
          <input
            id="need-title"
            className="rd-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={tr("e.g. Urgent Ration Kits for 40 Families / 30 Warm Blankets for Children", "जैसे 40 परिवारों के लिए राशन किट / बच्चों के लिए 30 गर्म कंबल")}
            required
          />
        </div>

        {/* Quantity & Unit */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label className="rd-label" htmlFor="need-qty">{tr("Quantity Needed *", "आवश्यक मात्रा *")}</label>
            <input
              id="need-qty"
              type="number"
              min="1"
              step="any"
              className="rd-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={tr("e.g. 50", "जैसे 50")}
              required
            />
          </div>
          <div>
            <label className="rd-label" htmlFor="need-unit">{tr("Unit of Measure *", "माप की इकाई *")}</label>
            <input
              id="need-unit"
              className="rd-input"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder={tr("e.g. meals, blankets, kits, kg", "जैसे भोजन, कंबल, किट, किलो")}
              required
            />
          </div>
        </div>

        {/* Urgency & Required By Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label className="rd-label" htmlFor="need-urgency">{tr("Urgency Level *", "तात्कालिकता का स्तर *")}</label>
            <select
              id="need-urgency"
              className="rd-input"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
            >
              <option value="low">{tr("Low Urgency (Within a week)", "कम (एक सप्ताह के भीतर)")}</option>
              <option value="medium">{tr("Medium Urgency (In 3-4 days)", "मध्यम (3–4 दिनों में)")}</option>
              <option value="high">{tr("High Urgency (Next 24-48 hours)", "उच्च (अगले 24–48 घंटों में)")}</option>
              <option value="critical">{tr("Critical (Immediate Relief Needed)", "अत्यंत गंभीर (तुरंत सहायता आवश्यक)")}</option>
            </select>
          </div>
          <div>
            <label className="rd-label" htmlFor="need-date">{tr("Required By Date *", "आवश्यकता की तारीख *")}</label>
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
          <label className="rd-label" htmlFor="need-desc">{tr("Detailed Description / Context *", "विस्तृत विवरण / संदर्भ *")}</label>
          <textarea
            id="need-desc"
            className="rd-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={tr("Explain why these supplies are needed, who will receive them, and any specific packing preferences...", "बताएँ कि सामग्री क्यों चाहिए, किसे मिलेगी और पैकिंग से जुड़ी कोई विशेष आवश्यकता...")}
            required
          />
        </div>

        {/* Delivery Destination */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <MapPin size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{tr("Delivery Destination", "डिलीवरी का स्थान")}</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label className="rd-label" htmlFor="need-addr">{tr("Street Address / Community Landmark *", "सड़क का पता / नज़दीकी पहचान-स्थल *")}</label>
              <input
                id="need-addr"
                className="rd-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={tr("e.g. Near Community Center, Sector 12", "जैसे सामुदायिक केंद्र के पास, सेक्टर 12")}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label className="rd-label" htmlFor="need-city">{tr("City *", "शहर *")}</label>
                <input
                  id="need-city"
                  className="rd-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={tr("e.g. Kanpur", "जैसे कानपुर")}
                  required
                />
              </div>
              <div>
                <label className="rd-label" htmlFor="need-state">{tr("State", "राज्य")}</label>
                <input
                  id="need-state"
                  className="rd-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder={tr("e.g. Uttar Pradesh", "जैसे उत्तर प्रदेश")}
                />
              </div>
              <div>
                <label className="rd-label" htmlFor="need-pincode">{tr("Pincode", "पिन कोड")}</label>
                <input
                  id="need-pincode"
                  className="rd-input"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder={tr("e.g. 208001", "जैसे 208001")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Receiver Type & On-Behalf Beneficiary */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignItems: "center" }}>
            <div>
              <label className="rd-label" htmlFor="need-rectype">{tr("Beneficiary Category", "लाभार्थी की श्रेणी")}</label>
              <select
                id="need-rectype"
                className="rd-input"
                value={receiverType}
                onChange={(e) => setReceiverType(e.target.value)}
              >
                <option value="individual">{tr("Individual Beneficiary", "व्यक्तिगत लाभार्थी")}</option>
                <option value="family">{tr("Underprivileged Family", "वंचित परिवार")}</option>
                <option value="community">{tr("Neighborhood / Slum Community", "आस-पड़ोस / झुग्गी समुदाय")}</option>
                <option value="organization">{tr("Registered NGO / Shelter Home", "पंजीकृत NGO / आश्रय गृह")}</option>
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
                {tr("Raising on behalf of someone else", "किसी अन्य व्यक्ति की ओर से अनुरोध कर रहे हैं")}
              </label>
            </div>
          </div>

          {isOnBehalf && (
            <div style={{ background: "var(--paper)", padding: "14px", borderRadius: "10px", marginTop: "12px", border: "1px solid var(--line)" }}>
              <strong style={{ fontSize: "13.5px", color: "var(--forest)", display: "block", marginBottom: "8px" }}>
                {tr("Beneficiary Details", "लाभार्थी का विवरण")}
              </strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="rd-label" htmlFor="ben-name" style={{ fontSize: "12.5px" }}>{tr("Beneficiary Name *", "लाभार्थी का नाम *")}</label>
                  <input
                    id="ben-name"
                    className="rd-input"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder={tr("e.g. Sunita Devi", "जैसे सुनीता देवी")}
                    required={isOnBehalf}
                  />
                </div>
                <div>
                  <label className="rd-label" htmlFor="ben-age" style={{ fontSize: "12.5px" }}>{tr("Age", "आयु")}</label>
                  <input
                    id="ben-age"
                    type="number"
                    className="rd-input"
                    value={beneficiaryAge}
                    onChange={(e) => setBeneficiaryAge(e.target.value)}
                    placeholder={tr("e.g. 62", "जैसे 62")}
                  />
                </div>
                <div>
                  <label className="rd-label" htmlFor="ben-rel" style={{ fontSize: "12.5px" }}>{tr("Relationship", "संबंध")}</label>
                  <input
                    id="ben-rel"
                    className="rd-input"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder={tr("e.g. Neighbor, Elder, Student", "जैसे पड़ोसी, बुज़ुर्ग, विद्यार्थी")}
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
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{tr("Logistics & Receiving Mode", "डिलीवरी और प्राप्त करने का तरीका")}</h3>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "var(--muted)" }}>
            {tr("How would you like to receive the supplies once matched?", "अनुरोध मैच होने पर आप सामग्री कैसे प्राप्त करना चाहेंगे?")}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {[
              {
                id: "any",
                label: tr("Flexible / Any", "कोई भी तरीका"),
                sub: tr("Volunteer, pickup, or donor drop-off", "स्वयंसेवक, पिकअप या दाता द्वारा डिलीवरी"),
                icon: Handshake,
              },
              {
                id: "receiver_pickup",
                label: tr("I Can Self-Pickup", "मैं स्वयं ले सकता/सकती हूँ"),
                sub: tr("I/we can travel to donor address", "मैं/हम दाता के पते पर जा सकते हैं"),
                icon: Car,
              },
              {
                id: "donor_dropoff",
                label: tr("Request Donor Drop-off", "दाता से डिलीवरी का अनुरोध"),
                sub: tr("Need donor to deliver to destination", "दाता से गंतव्य तक डिलीवरी चाहिए"),
                icon: Truck,
              },
              {
                id: "volunteer_delivery",
                label: tr("Volunteer Courier Needed", "स्वयंसेवक की डिलीवरी चाहिए"),
                sub: tr("Cannot travel; volunteer needed", "आ-जा नहीं सकते; स्वयंसेवक चाहिए"),
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
            {submitting ? tr("Submitting...", "अनुरोध भेजा जा रहा है...") : <><Plus size={16} /> {tr("Submit Need Request", "आवश्यकता का अनुरोध भेजें")}</>}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rd-btn rd-btn-outline"
          >
            {tr("Cancel", "रद्द करें")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default RaiseNeedTab;
