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
import { VoiceFormAssistant } from "../../common/VoiceFormAssistant";
import { type ParsedDonationOrNeed } from "../../../services/voiceNlpParser";

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
  language?: "en" | "hi";
}

export const PostDonationTab: React.FC<PostDonationTabProps> = ({
  categories,
  onCategoryCreated,
  onSuccess,
  onCancel,
  userLocation,
  needPrefill,
  onClearPrefill,
  language = "en",
}) => {
  const isHindi = language === "hi";
  const tr = (en: string, hi: string) => (isHindi ? hi : en);
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

  const handleApplyVoice = (parsed: ParsedDonationOrNeed) => {
    if (parsed.title) setTitle(parsed.title);
    if (parsed.description) setDescription(parsed.description);
    if (parsed.quantity) setQuantity(String(parsed.quantity));
    if (parsed.quantityUnit) setUnit(parsed.quantityUnit);
    if (parsed.city) setCity(parsed.city);
    if (parsed.address) setAddress(parsed.address);
    if (parsed.pincode) setPincode(parsed.pincode);

    if (parsed.categoryName && categories.length > 0) {
      const matched = categories.find((c) =>
        c.name.toLowerCase().includes(parsed.categoryName!.toLowerCase())
      );
      if (matched) {
        setSelectedCategoryId(matched._id);
      }
    }
  };

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
      setFormError(err?.message || tr("Failed to create new category", "नई श्रेणी नहीं बनाई जा सकी"));
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedCategoryId) {
      setFormError(tr("Please select a donation category", "कृपया दान की श्रेणी चुनें"));
      return;
    }

    if (!title.trim()) {
      setFormError(tr("Please enter a donation title", "कृपया दान का शीर्षक दर्ज करें"));
      return;
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setFormError(tr("Please enter a valid quantity greater than 0", "कृपया 0 से अधिक सही मात्रा दर्ज करें"));
      return;
    }

    if (!unit.trim()) {
      setFormError(tr("Please enter or select a unit of measurement", "कृपया माप की इकाई दर्ज करें या चुनें"));
      return;
    }

    if (!address.trim()) {
      setFormError(tr("Please provide a pickup street address", "कृपया पिकअप का सड़क पता दर्ज करें"));
      return;
    }

    if (!city.trim()) {
      setFormError(tr("Please provide a pickup city", "कृपया पिकअप का शहर दर्ज करें"));
      return;
    }

    const fromDate = new Date(availableFrom);
    const untilDate = new Date(availableUntil);

    if (isNaN(fromDate.getTime()) || isNaN(untilDate.getTime())) {
      setFormError(tr("Please provide valid availability dates", "कृपया उपलब्धता की सही तारीखें दर्ज करें"));
      return;
    }

    if (untilDate <= fromDate) {
      setFormError(tr("Available until date must be after available from date", "उपलब्धता की अंतिम तारीख, प्रारंभिक तारीख के बाद होनी चाहिए"));
      return;
    }

    let foodPayload = null;
    if (isFoodCategory) {
      const prepDate = preparedOn ? new Date(preparedOn) : null;
      const safeDate = safeUntil ? new Date(safeUntil) : null;

      if (!safeDate || isNaN(safeDate.getTime())) {
        setFormError(tr("Please specify a safe consumption deadline for food items", "कृपया खाद्य सामग्री के सुरक्षित उपभोग की अंतिम तारीख तय करें"));
        return;
      }

      if (safeDate <= new Date()) {
        setFormError(tr("Safe until date/time must be in the future. Expired food cannot be distributed.", "सुरक्षित उपभोग की तारीख भविष्य में होनी चाहिए। एक्सपायर भोजन वितरित नहीं किया जा सकता।"));
        return;
      }

      if (prepDate && safeDate <= prepDate) {
        setFormError(tr("Safe until date/time must be after the prepared on date/time", "सुरक्षित उपभोग की तारीख, तैयार करने की तारीख के बाद होनी चाहिए"));
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
      setFormError(err?.message || tr("Failed to post donation. Please check your inputs.", "दान प्रकाशित नहीं हो सका। कृपया दर्ज की गई जानकारी जाँचें।"));
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
          <h2 className="sd-section-title">{tr("Post a Donation", "दान दें")}</h2>
          <p className="sd-section-sub">
            {tr("Share surplus resources, hot meals, or winter clothes directly with community receivers", "अतिरिक्त सामान, गर्म भोजन या सर्दियों के कपड़े सीधे समुदाय के जरूरतमंद लोगों तक पहुँचाएँ")}
          </p>
        </div>
      </div>

      {needPrefill && (
        <div style={{ background: "#e8f4fc", border: "1px solid #b8daf2", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#1c658c", fontWeight: 700, textTransform: "uppercase" }}>{tr("Fulfilling Community Request", "समुदाय की आवश्यकता पूरी की जा रही है")}</span>
            <p style={{ margin: "2px 0 0", fontWeight: 600, fontSize: "14px" }}>{needPrefill.title}</p>
          </div>
          {onClearPrefill && (
            <button onClick={onClearPrefill} className="sd-link-btn" style={{ fontSize: "13px" }} >
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

      <form onSubmit={handleSubmit} className="sd-card sd-form">
        {/* AI Voice Assistant */}
        <VoiceFormAssistant
          context="donor"
          language={language}
          availableCategories={categories.map((c) => ({ id: c._id, name: c.name }))}
          onApply={handleApplyVoice}
        />

        {/* Category Dropdown */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label className="sd-label" htmlFor="don-category" style={{ marginBottom: 0 }}>
              {tr("Select Resource Category *", "संसाधन की श्रेणी चुनें *")}
            </label>
            <button
              type="button"
              onClick={() => setIsAddingNewCategory((v) => !v)}
              className="sd-link-btn"
              style={{ fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Plus size={14} />
              {isAddingNewCategory ? tr("Cancel Custom Category", "नई श्रेणी रद्द करें") : tr("+ Add New Category", "+ नई श्रेणी जोड़ें")}
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
              <option value="" disabled>{tr("-- Select a Resource Category --", "-- संसाधन की श्रेणी चुनें --")}</option>
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
                <strong style={{ fontSize: "13.5px", color: "var(--forest)" }}>{tr("Add a New Category", "नई श्रेणी जोड़ें")}</strong>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label className="sd-label" htmlFor="new-cat-name" style={{ fontSize: "13px" }}>
                    {tr("Category Name *", "श्रेणी का नाम *")}
                  </label>
                  <input
                    id="new-cat-name"
                    className="sd-input"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder={tr("e.g. Blankets, Stationery, Medicines", "जैसे कंबल, स्टेशनरी, दवाइयाँ")}
                    maxLength={30}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="sd-label" htmlFor="new-cat-desc" style={{ fontSize: "13px" }}>
                    {tr("Description (Optional)", "विवरण (वैकल्पिक)")}
                  </label>
                  <input
                    id="new-cat-desc"
                    className="sd-input"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder={tr("Short description of what items fall under this category", "इस श्रेणी में आने वाली वस्तुओं का संक्षिप्त विवरण")}
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
                    {creatingCategory ? tr("Saving...", "सहेजा जा रहा है...") : tr("Create & Select Category", "श्रेणी बनाएँ और चुनें")}
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
                    {tr("Cancel", "रद्द करें")}
                  </button>
                </div>
              </div>
              <p className="sd-hint">{tr("This category will be permanently saved in the database for all future donations and community needs.", "यह श्रेणी भविष्य के सभी दान और सामुदायिक आवश्यकताओं के लिए डेटाबेस में स्थायी रूप से सहेजी जाएगी।")}</p>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="sd-label" htmlFor="don-title">{tr("Donation Title *", "दान का शीर्षक *")}</label>
          <input
            id="don-title"
            className="sd-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={tr("e.g. 50 Fresh Packed Vegetarian Meals / 20 Woolen Sweaters", "जैसे 50 ताज़ा शाकाहारी भोजन पैकेट / 20 ऊनी स्वेटर")}
            required
          />
        </div>

        {/* Quantity & Unit */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label className="sd-label" htmlFor="don-qty">{tr("Quantity *", "मात्रा *")}</label>
            <input
              id="don-qty"
              type="number"
              min="1"
              step="any"
              className="sd-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={tr("e.g. 25", "जैसे 25")}
              required
            />
          </div>
          <div>
            <label className="sd-label" htmlFor="don-unit">{tr("Unit of Measure *", "माप की इकाई *")}</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="don-unit"
                className="sd-input"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={tr("e.g. kg, meals, items", "जैसे किलो, भोजन, वस्तुएँ")}
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
          <label className="sd-label" htmlFor="don-desc">{tr("Description / Instructions", "विवरण / निर्देश")}</label>
          <textarea
            id="don-desc"
            className="sd-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={tr("Describe what items are included, packaging details, and any handling instructions...", "शामिल वस्तुओं, पैकेजिंग और संभालने के निर्देशों का विवरण दें...")}
          />
        </div>

        {/* Pickup Location */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <MapPin size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{tr("Pickup Location", "पिकअप स्थान")}</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label className="sd-label" htmlFor="don-addr">{tr("Street Address / Landmark *", "सड़क का पता / नज़दीकी पहचान *")}</label>
              <input
                id="don-addr"
                className="sd-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={tr("e.g. Flat 302, Sunrise Apartments, Green Park Ext.", "जैसे फ्लैट 302, सनराइज़ अपार्टमेंट्स")}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label className="sd-label" htmlFor="don-city">{tr("City *", "शहर *")}</label>
                <input
                  id="don-city"
                  className="sd-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={tr("e.g. New Delhi", "जैसे नई दिल्ली")}
                  required
                />
              </div>
              <div>
                <label className="sd-label" htmlFor="don-state">{tr("State", "राज्य")}</label>
                <input
                  id="don-state"
                  className="sd-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder={tr("e.g. Delhi", "जैसे दिल्ली")}
                />
              </div>
              <div>
                <label className="sd-label" htmlFor="don-pincode">{tr("Pincode", "पिन कोड")}</label>
                <input
                  id="don-pincode"
                  className="sd-input"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder={tr("e.g. 110016", "जैसे 110016")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Availability Window */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Calendar size={18} color="var(--forest)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{tr("Availability Window", "उपलब्धता की अवधि")}</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="sd-label" htmlFor="don-from">{tr("Available From *", "उपलब्धता शुरू *")}</label>
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
              <label className="sd-label" htmlFor="don-until">{tr("Available Until *", "उपलब्धता समाप्त *")}</label>
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
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>{tr("Food Safety & Hygiene Compliance", "खाद्य सुरक्षा और स्वच्छता अनुपालन")}</h4>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted)" }}>
                  {tr("SAHARA enforces zero-waste and safe consumption guidelines.", "SAHARA शून्य-बर्बादी और सुरक्षित उपभोग के दिशानिर्देशों का पालन करता है।")}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="sd-label">{tr("Dietary Preference", "आहार संबंधी प्राथमिकता")}</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setIsVeg(true)}
                    className={`sd-btn ${isVeg ? "sd-btn-primary" : "sd-btn-outline"} sd-btn-sm`}
                  >
                    🌱 {tr("Pure Vegetarian", "शुद्ध शाकाहारी")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVeg(false)}
                    className={`sd-btn ${!isVeg ? "sd-btn-primary" : "sd-btn-outline"} sd-btn-sm`}
                  >
                    🍗 {tr("Non-Vegetarian", "मांसाहारी")}
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="sd-label" htmlFor="food-prep">{tr("Prepared / Packed On", "तैयार / पैक करने की तारीख")}</label>
                  <input
                    id="food-prep"
                    type="datetime-local"
                    className="sd-input"
                    value={preparedOn}
                    onChange={(e) => setPreparedOn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="sd-label" htmlFor="food-safe">{tr("Safe Until (Consumption Deadline) *", "सुरक्षित उपभोग की अंतिम समय-सीमा *")}</label>
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
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{tr("Delivery & Logistics Preference", "डिलीवरी और परिवहन की प्राथमिकता")}</h3>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "var(--muted)" }}>
            {tr("How would you like the supplies to reach the receiver?", "आप सामान प्राप्तकर्ता तक किस तरह पहुँचाना चाहेंगे?")}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {[
              {
                id: "any",
                label: tr("Flexible / Either", "लचीला / कोई भी विकल्प"),
                sub: tr("Volunteer, pickup, or drop-off", "स्वयंसेवक, पिकअप या स्वयं पहुँचाना"),
                icon: Handshake,
              },
              {
                id: "receiver_pickup",
                label: tr("Receiver Pick-up Only", "केवल प्राप्तकर्ता पिकअप करेगा"),
                sub: tr("Receiver collects from your address", "प्राप्तकर्ता आपके पते से सामान लेगा"),
                icon: Car,
              },
              {
                id: "donor_dropoff",
                label: tr("I Can Drop Off", "मैं सामान पहुँचा सकता/सकती हूँ"),
                sub: tr("I will deliver to receiver's location", "मैं प्राप्तकर्ता के स्थान पर सामान पहुँचाऊँगा/पहुँचाऊँगी"),
                icon: Truck,
              },
              {
                id: "volunteer_delivery",
                label: tr("Volunteer Needed", "स्वयंसेवक की आवश्यकता है"),
                sub: tr("Cannot travel; courier required", "मैं यात्रा नहीं कर सकता/सकती; डिलीवरी सहायता चाहिए"),
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
            {submitting ? tr("Publishing...", "प्रकाशित किया जा रहा है...") : <><Plus size={16} /> {tr("Publish Donation", "दान प्रकाशित करें")}</>}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="sd-btn sd-btn-outline"
          >
            {tr("Cancel", "रद्द करें")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PostDonationTab;
