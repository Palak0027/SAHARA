import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  BookOpen,
  CalendarDays,
  Eye,
  Heart,
  MapPin,
  Package,
  PackageSearch,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ExploreDonations.css";

 

type Language = "en" | "hi";

type Category =
  | {
      _id?: string;
      name?: string;
    }
  | string;

type Donation = {
  _id: string;
  title: string;
  description?: string;
  quantity: number;
  unit: string;
  status: string;
  images?: string[];
  categoryId?: Category;
  location?: {
    city?: string;
    state?: string;
    pincode?: string;
  };
  availableFrom?: string;
  availableUntil?: string;
  foodDetails?: {
    safeUntil?: string | null;
    isVeg?: boolean;
  };
  createdAt?: string;
};

type ApiResponse = {
  success?: boolean;
  donations?: Donation[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  message?: string;
};

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const TEXT = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      how: "How It Works",
      explore: "Explore Donations",
      login: "Login",
      signup: "Register",
      contact: "Contact Us",
    },
    footer: {
      tagline:
        "Connecting caring communities through sharing, support and everyday acts of kindness.",
      quickLinks: "Quick Links",
      getInvolved: "Get Involved",
      contact: "Contact",
      donate: "Donate",
      findDonations: "Find Donations",
      join: "Join SAHARA",
      rights: "All rights reserved.",
      madeWith: "Made with ♥ for stronger communities.",
      location: "Kanpur, Uttar Pradesh, India",
    },
    eyebrow: "THE SAHARA MARKETPLACE",
    title: "Find donations near you",
    subtitle:
      "Explore useful essentials shared by people in your community.",
    search: "Search donations",
    searchPlaceholder: "Try rice, clothes, groceries...",
    category: "Category",
    allCategories: "All categories",
    other: "Other",
    endingSoon: "Ending soon",
    veg: "Vegetarian",
    statusAvailable: "Available",
    detailsBtn: "Details",
    requestSupply: "Request Supply",
    safeUntil: "Safe until",
    locationTitle: "Location",
    availableFrom: "Available from",
    postedOn: "Posted on",
    foodType: "Food type",
    fullDescription: "Description",
    close: "Close",
    nonVeg: "Non-vegetarian",
    city: "City",
    cityPlaceholder: "Enter a city",
    sort: "Sort by",
    newest: "Newest first",
    expiry: "Availability ending soon",
    apply: "Apply filters",
    clear: "Clear filters",
    results: "available donations",
    view: "View details",
    quantity: "Quantity",
    availableUntil: "Available until",
    location: "Location not specified",
    errorTitle: "We couldn't load donations",
    retry: "Try again",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    details: "No description provided.",
    emptyTitle: "No donations found",
    emptyText:
      "Try another search or clear your filters to see available donations.",
    loading: "Loading available donations...",
    donateCta: "Want to share something?",
    donateCtaText:
      "List useful items for someone who needs them.",
    startDonating: "Start donating",
    apiError: "Could not fetch donations. Please try again.",
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      how: "कैसे काम करता है",
      explore: "दान देखें",
      login: "लॉगिन",
      signup: "रजिस्टर",
      contact: "संपर्क करें",
    },
    footer: {
      tagline:
        "साझा करने, सहयोग और रोज़मर्रा की दयालुता से समुदायों को जोड़ना।",
      quickLinks: "त्वरित लिंक",
      getInvolved: "जुड़ें",
      contact: "संपर्क",
      donate: "दान करें",
      findDonations: "दान खोजें",
      join: "SAHARA से जुड़ें",
      rights: "सर्वाधिकार सुरक्षित।",
      madeWith: "मज़बूत समुदायों के लिए ♥ के साथ बनाया गया।",
      location: "कानपुर, उत्तर प्रदेश, भारत",
    },
    eyebrow: "SAHARA दान बाज़ार",
    title: "अपने आस-पास दान खोजें",
    subtitle:
      "अपने समुदाय के लोगों द्वारा उपलब्ध कराई गई ज़रूरी चीज़ें देखें।",
    search: "दान खोजें",
    searchPlaceholder: "जैसे चावल, कपड़े, राशन...",
    category: "श्रेणी",
    allCategories: "सभी श्रेणियाँ",
    other: "अन्य",
    endingSoon: "जल्द समाप्त",
    veg: "शाकाहारी",
    statusAvailable: "उपलब्ध",
    detailsBtn: "विवरण",
    requestSupply: "आपूर्ति माँगें",
    safeUntil: "सुरक्षित रहने तक",
    locationTitle: "स्थान",
    availableFrom: "उपलब्धता शुरू",
    postedOn: "पोस्ट की गई",
    foodType: "भोजन का प्रकार",
    fullDescription: "विवरण",
    close: "बंद करें",
    nonVeg: "मांसाहारी",
    city: "शहर",
    cityPlaceholder: "शहर दर्ज करें",
    sort: "क्रमबद्ध करें",
    newest: "नए पहले",
    expiry: "जल्दी समाप्त होने वाली उपलब्धता",
    apply: "फ़िल्टर लागू करें",
    clear: "फ़िल्टर हटाएँ",
    results: "उपलब्ध दान",
    view: "विवरण देखें",
    quantity: "मात्रा",
    availableUntil: "उपलब्धता समाप्त",
    location: "स्थान उपलब्ध नहीं",
    errorTitle: "दान लोड नहीं हो सके",
    retry: "फिर से कोशिश करें",
    previous: "पिछला",
    next: "अगला",
    page: "पेज",
    of: "में से",
    details: "विवरण उपलब्ध नहीं है।",
    emptyTitle: "कोई दान नहीं मिला",
    emptyText:
      "दूसरी खोज करें या फ़िल्टर हटाकर उपलब्ध दान देखें।",
    loading: "उपलब्ध दान लोड हो रहे हैं...",
    donateCta: "क्या आप कुछ साझा करना चाहते हैं?",
    donateCtaText:
      "ज़रूरतमंद लोगों के लिए उपयोगी चीज़ें सूचीबद्ध करें।",
    startDonating: "दान शुरू करें",
    apiError: "दान प्राप्त नहीं हो सके। कृपया फिर से कोशिश करें।",
  },
};

/* ---------- Helpers ---------- */

function getCategoryName(donation: Donation): string {
  if (
    donation.categoryId &&
    typeof donation.categoryId === "object"
  ) {
    return donation.categoryId.name || "";
  }

  return "";
}

function getCategoryId(donation: Donation): string {
  if (
    donation.categoryId &&
    typeof donation.categoryId === "object"
  ) {
    return donation.categoryId._id || "";
  }

  return "";
}

function getLocation(donation: Donation): string {
  return [
    donation.location?.city,
    donation.location?.state,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatDate(
  value: string | undefined,
  language: Language,
): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(
    language === "hi" ? "hi-IN" : "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function getDaysLeft(value?: string): number | null {
  if (!value) return null;

  const end = new Date(value).getTime();

  if (Number.isNaN(end)) return null;

  return Math.ceil((end - Date.now()) / 86_400_000);
}

function formatDateTime(
  value: string | null | undefined,
  language: Language,
): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(
    language === "hi" ? "hi-IN" : "en-IN",
    {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  ).format(date);
}

function getCategoryIcon(name: string): LucideIcon {
  const key = name.toLowerCase();

  if (key.includes("food") || key.includes("meal") || key.includes("grocer")) {
    return UtensilsCrossed;
  }
  if (key.includes("cloth")) return Shirt;
  if (key.includes("blanket") || key.includes("bed")) return BedDouble;
  if (key.includes("book") || key.includes("study")) return BookOpen;

  return Package;
}

/* ---------- Details modal ---------- */

type DetailsModalProps = {
  donation: Donation;
  language: Language;
  t: (typeof TEXT)["en"];
  onClose: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
  from: string;
};

function DonationDetailsModal({
  donation,
  language,
  t,
  onClose,
  closeRef,
  from,
}: DetailsModalProps) {
  const categoryName = getCategoryName(donation) || t.other;
  const CategoryIcon = getCategoryIcon(categoryName);
  const daysLeft = getDaysLeft(donation.availableUntil);
  const endingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const isVeg = donation.foodDetails?.isVeg;

  const fullLocation = [
    donation.location?.city,
    donation.location?.state,
    donation.location?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const rows: { label: string; value: string; wide?: boolean }[] = [
    { label: t.quantity, value: `${donation.quantity} ${donation.unit}` },
    { label: t.category, value: categoryName },
    { label: t.locationTitle, value: fullLocation || t.location, wide: true },
  ];

  const availableFrom = formatDateTime(donation.availableFrom, language);
  const availableUntil = formatDateTime(donation.availableUntil, language);
  const safeUntil = formatDateTime(donation.foodDetails?.safeUntil, language);
  const postedOn = formatDate(donation.createdAt, language);

  if (availableFrom) rows.push({ label: t.availableFrom, value: availableFrom });
  if (availableUntil) rows.push({ label: t.availableUntil, value: availableUntil });
  if (typeof isVeg === "boolean") {
    rows.push({ label: t.foodType, value: isVeg ? t.veg : t.nonVeg });
  }
  if (safeUntil) rows.push({ label: t.safeUntil, value: safeUntil });
  if (postedOn) rows.push({ label: t.postedOn, value: postedOn });

  return (
    <div className="ex-modal" onClick={onClose}>
      <div
        className="ex-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ex-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ex-modal__head">
          <span className="ex-card__icon" aria-hidden="true">
            <CategoryIcon size={20} />
          </span>

          <div className="ex-modal__headtext">
            <h2 id="ex-modal-title" className="ex-modal__title">
              {donation.title}
            </h2>

            <span className={`ex-pill${endingSoon ? " ex-pill--soon" : ""}`}>
              {endingSoon ? t.endingSoon : t.statusAvailable}
            </span>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="ex-modal__close"
            aria-label={t.close}
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="ex-modal__body">
          <h3 className="ex-modal__label">{t.fullDescription}</h3>
          <p className="ex-modal__desc">{donation.description || t.details}</p>

          <dl className="ex-modal__list">
            {rows.map((row) => (
              <div
                key={row.label}
                className={`ex-modal__row${row.wide ? " ex-modal__row--wide" : ""}`}
              >
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="ex-modal__foot">
          <button type="button" className="ex-btn ex-btn--outline" onClick={onClose}>
            {t.close}
          </button>

          <Link to="/login" state={{ from }} className="ex-btn ex-btn--primary">
            <Heart size={16} aria-hidden="true" />
            {t.requestSupply}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function ExploreDonations() {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguage] = useState<Language>(() => {
    return localStorage.getItem("sahara-language") === "hi"
      ? "hi"
      : "en";
  });

  const t = TEXT[language];

  // Always points at the latest texts, so fetching doesn't depend on `t`
  // (switching language must not re-fetch the list).
  const tRef = useRef(t);
  tRef.current = t;

  // Category name coming from a homepage link, e.g. /donations?category=Food.
  // Resolved once, then cleared, so "All categories" can still be chosen afterwards.
  const pendingCategoryRef = useRef(
    new URLSearchParams(location.search).get("category") || "",
  );

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState<"newest" | "expiry">("newest");

  const [page, setPage] = useState(1);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Every category seen so far, so the dropdown keeps all options
  // even after one category is selected.
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Details modal
  const [selected, setSelected] = useState<Donation | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openDetails = (
    donation: Donation,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    triggerRef.current = event.currentTarget;
    setSelected(donation);
  };

  const closeDetails = useCallback(() => {
    setSelected(null);
    triggerRef.current?.focus();
  }, []);

  // Esc closes the modal, the page behind it does not scroll while it is open.
  useEffect(() => {
    if (!selected) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDetails();
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected, closeDetails]);

  // Keep language changes made in the shared navbar in sync.
  useEffect(() => {
    const updateLanguage = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const saved = localStorage.getItem("sahara-language");

      const next =
        customEvent.detail === "hi" || saved === "hi"
          ? "hi"
          : "en";

      setLanguage(next);
    };

    window.addEventListener("sahara-language-change", updateLanguage);
    window.addEventListener("storage", updateLanguage);

    return () => {
      window.removeEventListener("sahara-language-change", updateLanguage);
      window.removeEventListener("storage", updateLanguage);
    };
  }, []);

  const toggleLanguage = () => {
    const next: Language = language === "en" ? "hi" : "en";

    localStorage.setItem("sahara-language", next);
    setLanguage(next);

    window.dispatchEvent(
      new CustomEvent("sahara-language-change", {
        detail: next,
      }),
    );
  };

  // Load the public donation feed.
  const fetchDonations = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        });

        if (category) {
          params.set("categoryId", category);
        }

        if (city.trim()) {
          params.set("city", city.trim());
        }

        const response = await fetch(
          `${API_BASE}/api/donations?${params.toString()}`,
          { signal },
        );

        const data = (await response
          .json()
          .catch(() => ({}))) as ApiResponse;

        if (!response.ok || data.success === false) {
          throw new Error(data.message || tRef.current.apiError);
        }

        setDonations(
          Array.isArray(data.donations) ? data.donations : [],
        );

        setTotal(Number(data.total || 0));

        setTotalPages(
          Math.max(1, Number(data.totalPages || 1)),
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : tRef.current.apiError,
        );

        setDonations([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [page, category, city],
  );

  useEffect(() => {
    const controller = new AbortController();

    void fetchDonations(controller.signal);

    return () => controller.abort();
  }, [fetchDonations]);

  // Go back to the top when the page changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Collect category choices from everything fetched so far.
  useEffect(() => {
    if (!donations.length) return;

    setCategoryMap((prev) => {
      let changed = false;
      const next = { ...prev };

      donations.forEach((donation) => {
        const id = getCategoryId(donation);
        const name = getCategoryName(donation);

        if (id && name && next[id] !== name) {
          next[id] = name;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [donations]);

  const categories = useMemo(
    () =>
      Object.entries(categoryMap).sort((a, b) =>
        a[1].localeCompare(b[1]),
      ),
    [categoryMap],
  );

  // Resolve ?category=<name> from the URL once its id is known.
  useEffect(() => {
    const wanted = pendingCategoryRef.current;
    if (!wanted) return;

    const match = categories.find(
      ([, name]) => name.toLowerCase() === wanted.toLowerCase(),
    );

    if (match) {
      pendingCategoryRef.current = "";
      setCategory(match[0]);
      setPage(1);
    }
  }, [categories]);

  const visibleDonations = useMemo(() => {
    const term = search.trim().toLowerCase();

    return donations
      .filter((donation) => {
        const searchableText = [
          donation.title,
          donation.description,
          getCategoryName(donation),
          getLocation(donation),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return !term || searchableText.includes(term);
      })
      .sort((a, b) => {
        if (sort === "expiry") {
          const dateA = a.availableUntil
            ? new Date(a.availableUntil).getTime()
            : Number.MAX_SAFE_INTEGER;

          const dateB = b.availableUntil
            ? new Date(b.availableUntil).getTime()
            : Number.MAX_SAFE_INTEGER;

          return dateA - dateB;
        }

        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });
  }, [donations, search, sort]);

  const selectCategory = (id: string) => {
    pendingCategoryRef.current = "";
    setCategory(id);
    setPage(1);
  };

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearch(searchInput.trim());
    setCity(cityInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    pendingCategoryRef.current = "";

    setSearchInput("");
    setSearch("");
    setCategory("");
    setCityInput("");
    setCity("");
    setSort("newest");
    setPage(1);

    navigate("/donations", { replace: true });
  };

  // When a text search is active only the loaded page is searched,
  // so show the number of matches instead of the server total.
  const resultCount = search.trim() ? visibleDonations.length : total;

  const navTranslations = { nav: t.nav };
  const footerTranslations = {
    nav: t.nav,
    footer: t.footer,
  };

  return (
    <div className="ex-page">
      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={navTranslations}
      />

      <main>
        {/* Marketplace header and filters */}
        <section className="ex-hero">
          <div className="ex-hero__blob" aria-hidden="true" />

          <div className="ex-container ex-hero__inner">
            <p className="ex-eyebrow">
              <span className="ex-eyebrow__dot" aria-hidden="true" />
              {t.eyebrow}
            </p>

            <h1 className="ex-title">{t.title}</h1>
            <p className="ex-subtitle">{t.subtitle}</p>

            <form className="ex-filters" onSubmit={applyFilters}>
              <label className="ex-field">
                <span className="ex-field__label">{t.search}</span>

                <span className="ex-field__row">
                  <Search className="ex-field__icon" aria-hidden="true" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder={t.searchPlaceholder}
                  />
                </span>
              </label>

              <label className="ex-field">
                <span className="ex-field__label">{t.city}</span>

                <span className="ex-field__row">
                  <MapPin className="ex-field__icon" aria-hidden="true" />
                  <input
                    value={cityInput}
                    onChange={(event) => setCityInput(event.target.value)}
                    placeholder={t.cityPlaceholder}
                  />
                </span>
              </label>

              <button type="submit" className="ex-btn ex-btn--primary ex-filters__submit">
                <SlidersHorizontal size={16} aria-hidden="true" />
                {t.apply}
              </button>
            </form>

            {/* Category chips */}
            {categories.length > 0 && (
              <div role="group" aria-label={t.category} className="ex-chips">
                {[["", t.allCategories], ...categories].map(([id, name]) => {
                  const active = category === id;

                  return (
                    <button
                      key={id || "all"}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectCategory(id)}
                      className={`ex-chip${active ? " is-active" : ""}`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="ex-toolbar">
              <p className="ex-count" aria-live="polite">
                <strong>
                  {resultCount.toLocaleString(
                    language === "hi" ? "hi-IN" : "en-IN",
                  )}
                </strong>{" "}
                {t.results}
              </p>

              <div className="ex-toolbar__right">
                <label htmlFor="donation-sort" className="ex-toolbar__label">
                  {t.sort}
                </label>

                <select
                  id="donation-sort"
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as "newest" | "expiry")
                  }
                  className="ex-select"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="expiry">{t.expiry}</option>
                </select>

                <button type="button" onClick={clearFilters} className="ex-clear">
                  <X size={16} aria-hidden="true" />
                  {t.clear}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Donation cards */}
        <section className="ex-container ex-results">
          {loading ? (
            <div
              role="status"
              aria-busy="true"
              aria-label={t.loading}
              className="ex-grid"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="ex-card ex-card--skeleton">
                  <div className="ex-sk ex-sk--icon" />
                  <div className="ex-sk ex-sk--line ex-sk--w80" />
                  <div className="ex-sk ex-sk--line ex-sk--w35" />
                  <div className="ex-sk ex-sk--line" />
                  <div className="ex-sk ex-sk--line ex-sk--w60" />
                  <div className="ex-sk ex-sk--btns" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="ex-state ex-state--error">
              <h2>{t.errorTitle}</h2>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => void fetchDonations()}
                className="ex-btn ex-btn--primary"
              >
                {t.retry}
              </button>
            </div>
          ) : visibleDonations.length === 0 ? (
            <div className="ex-state">
              <PackageSearch className="ex-state__icon" aria-hidden="true" />
              <h2>{t.emptyTitle}</h2>
              <p>{t.emptyText}</p>

              <button type="button" onClick={clearFilters} className="ex-btn ex-btn--outline">
                {t.clear}
              </button>
            </div>
          ) : (
            <>
              <div className="ex-grid">
                {visibleDonations.map((donation) => {
                  const place = getLocation(donation);
                  const categoryName = getCategoryName(donation) || t.other;
                  const CategoryIcon = getCategoryIcon(categoryName);
                  const daysLeft = getDaysLeft(donation.availableUntil);
                  const endingSoon =
                    daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
                  const isVeg = donation.foodDetails?.isVeg;
                  const safeUntil = formatDateTime(
                    donation.foodDetails?.safeUntil,
                    language,
                  );
                  const availableUntil = formatDateTime(
                    donation.availableUntil,
                    language,
                  );

                  return (
                    <article key={donation._id} className="ex-card">
                      <div className="ex-card__top">
                        <span className="ex-card__icon" aria-hidden="true">
                          <CategoryIcon size={20} />
                        </span>

                        <div className="ex-card__right">
                          {typeof isVeg === "boolean" && (
                            <span
                              title={isVeg ? t.veg : t.nonVeg}
                              aria-label={isVeg ? t.veg : t.nonVeg}
                              role="img"
                              className={`ex-veg ${isVeg ? "ex-veg--veg" : "ex-veg--nonveg"}`}
                            >
                              <span />
                            </span>
                          )}

                          <span className={`ex-pill${endingSoon ? " ex-pill--soon" : ""}`}>
                            {endingSoon ? t.endingSoon : t.statusAvailable}
                          </span>
                        </div>
                      </div>

                      <h2 className="ex-card__title">{donation.title}</h2>

                      <p className="ex-card__meta">
                        {categoryName} • {donation.quantity} {donation.unit}
                      </p>

                      <p className="ex-card__desc">
                        {donation.description || t.details}
                      </p>

                      <div className="ex-card__info">
                        <p className="ex-card__row">
                          <MapPin size={14} className="ex-ic ex-ic--teal" aria-hidden="true" />
                          <span>{place || t.location}</span>
                        </p>

                        {availableUntil && (
                          <p className="ex-card__row">
                            <CalendarDays size={14} className="ex-ic ex-ic--amber" aria-hidden="true" />
                            <span>
                              {t.availableUntil}: {availableUntil}
                            </span>
                          </p>
                        )}

                        {safeUntil && (
                          <p className="ex-card__row ex-card__row--safe">
                            <ShieldCheck size={14} className="ex-ic ex-ic--green" aria-hidden="true" />
                            <span>
                              {t.safeUntil}: {safeUntil}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="ex-card__actions">
                        <button
                          type="button"
                          onClick={(event) => openDetails(donation, event)}
                          className="ex-btn ex-btn--outline ex-btn--sm"
                        >
                          <Eye size={14} aria-hidden="true" />
                          {t.detailsBtn}
                        </button>

                        <Link
                          to="/login"
                          state={{ from: location.pathname + location.search }}
                          className="ex-btn ex-btn--primary ex-btn--sm"
                        >
                          <Heart size={14} aria-hidden="true" />
                          <span>{t.requestSupply}</span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination (only when there is more than one page) */}
              {totalPages > 1 && (
                <nav aria-label="Pagination" className="ex-pager">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="ex-btn ex-btn--outline"
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    {t.previous}
                  </button>

                  <span className="ex-pager__text">
                    {t.page} {page} {t.of} {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    className="ex-btn ex-btn--outline"
                  >
                    {t.next}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </section>

        {/* Donor call to action */}
        <section className="ex-container ex-cta-wrap">
          <div className="ex-cta">
            <div>
              <h2>{t.donateCta}</h2>
              <p>{t.donateCtaText}</p>
            </div>

            <Link to="/register" className="ex-cta__btn">
              {t.startDonating}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {selected && (
        <DonationDetailsModal
          donation={selected}
          language={language}
          t={t}
          onClose={closeDetails}
          closeRef={closeBtnRef}
          from={location.pathname + location.search}
        />
      )}

      <Footer t={footerTranslations} />
    </div>
  );
}