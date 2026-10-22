
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  PackageSearch,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

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
    },
    eyebrow: "THE SAHARA MARKETPLACE",
    title: "Find donations near you",
    subtitle:
      "Explore useful essentials shared by people in your community.",
    search: "Search donations",
    searchPlaceholder: "Try rice, clothes, groceries...",
    category: "Category",
    allCategories: "All categories",
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
    },
    eyebrow: "SAHARA दान बाज़ार",
    title: "अपने आस-पास दान खोजें",
    subtitle:
      "अपने समुदाय के लोगों द्वारा उपलब्ध कराई गई ज़रूरी चीज़ें देखें।",
    search: "दान खोजें",
    searchPlaceholder: "जैसे चावल, कपड़े, राशन...",
    category: "श्रेणी",
    allCategories: "सभी श्रेणियाँ",
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

function getCategoryName(donation: Donation): string {
  if (
    donation.categoryId &&
    typeof donation.categoryId === "object"
  ) {
    return donation.categoryId.name || "Other";
  }

  return "Other";
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

export default function ExploreDonations() {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguage] = useState<Language>(() => {
    return localStorage.getItem("sahara-language") === "hi"
      ? "hi"
      : "en";
  });

  const t = TEXT[language];

  const initialCategory =
    new URLSearchParams(location.search).get("category") || "";

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    window.addEventListener(
      "sahara-language-change",
      updateLanguage,
    );

    window.addEventListener("storage", updateLanguage);

    return () => {
      window.removeEventListener(
        "sahara-language-change",
        updateLanguage,
      );
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
  // The backend's public endpoint returns available donations.
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
          throw new Error(data.message || t.apiError);
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
          err instanceof Error ? err.message : t.apiError,
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
    [page, category, city, t.apiError],
  );

  useEffect(() => {
    const controller = new AbortController();

    void fetchDonations(controller.signal);

    return () => controller.abort();
  }, [fetchDonations]);

  // Derive category choices from the fetched results.
  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();

    donations.forEach((donation) => {
      const id = getCategoryId(donation);
      const name = getCategoryName(donation);

      if (id && name !== "Other") {
        categoryMap.set(id, name);
      }
    });

    return Array.from(categoryMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  }, [donations]);

  // Homepage category links may pass a category name in the URL.
  // Resolve that name against the available category data.
  useEffect(() => {
    if (!initialCategory || !donations.length) return;

    const match = donations.find(
      (donation) =>
        getCategoryName(donation).toLowerCase() ===
        initialCategory.toLowerCase(),
    );

    if (match) {
      const id = getCategoryId(match);

      if (id && id !== category) {
        setCategory(id);
        setPage(1);
      }
    }
  }, [initialCategory, donations, category]);

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

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearch(searchInput.trim());
    setCity(cityInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setCityInput("");
    setCity("");
    setSort("newest");
    setPage(1);

    navigate("/donations", { replace: true });
  };

  const navTranslations = { nav: t.nav };
  const footerTranslations = {
    nav: t.nav,
    footer: t.footer,
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#263238]">
      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={navTranslations}
      />

      <main>
        {/* Marketplace header and filters */}
        <section className="border-b border-[#DCE6E1] bg-gradient-to-br from-[#F5FAF7] via-white to-[#E7F4E8]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176C62]">
              {t.eyebrow}
            </p>

            <h1 className="mt-3 max-w-3xl font-heading text-3xl font-bold tracking-tight text-[#17383D] sm:text-5xl">
              {t.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5F6F76] sm:text-base">
              {t.subtitle}
            </p>

            <form
              onSubmit={applyFilters}
              className="mt-7 grid gap-3 rounded-2xl border border-[#DCE6E1] bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,1.5fr)_minmax(150px,1fr)_minmax(150px,1fr)_auto] sm:p-4"
            >
              <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[#DCE6E1] px-3">
                <Search className="h-4 w-4 shrink-0 text-[#176C62]" />

                <span className="sr-only">{t.search}</span>

                <input
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                  placeholder={t.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#879496]"
                />
              </label>

              <label className="flex flex-col justify-center gap-1 rounded-xl border border-[#DCE6E1] px-3 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#6D7D80]">
                  {t.category}
                </span>

                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="">{t.allCategories}</option>

                  {categories.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col justify-center gap-1 rounded-xl border border-[#DCE6E1] px-3 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#6D7D80]">
                  {t.city}
                </span>

                <input
                  value={cityInput}
                  onChange={(event) =>
                    setCityInput(event.target.value)
                  }
                  placeholder={t.cityPlaceholder}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#879496]"
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#07545A] px-5 text-sm font-semibold text-white transition hover:bg-[#06464B]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t.apply}
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#5F6F76]">
                {total.toLocaleString(
                  language === "hi" ? "hi-IN" : "en-IN",
                )}{" "}
                {t.results}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <label
                  htmlFor="donation-sort"
                  className="text-[#6D7D80]"
                >
                  {t.sort}
                </label>

                <select
                  id="donation-sort"
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as "newest" | "expiry")
                  }
                  className="rounded-lg border border-[#DCE6E1] bg-white px-3 py-2 outline-none focus:border-[#087F8C]"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="expiry">{t.expiry}</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-2 font-semibold text-[#176C62] hover:bg-[#E7F4E8]"
                >
                  <X className="h-4 w-4" />
                  {t.clear}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Donation product cards */}
        <section className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8">
          {loading ? (
            <div
              aria-label={t.loading}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-[#DCE6E1] bg-white"
                >
                  <div className="h-48 bg-[#E7F4E8]" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-2/3 rounded bg-[#E7F4E8]" />
                    <div className="h-3 w-full rounded bg-[#F0F4F1]" />
                    <div className="h-10 rounded bg-[#F0F4F1]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
              <h2 className="text-xl font-bold text-[#17383D]">
                {t.errorTitle}
              </h2>

              <p className="mt-2 text-sm text-[#6D7D80]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void fetchDonations()}
                className="mt-5 rounded-lg bg-[#07545A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#06464B]"
              >
                {t.retry}
              </button>
            </div>
          ) : visibleDonations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#B5CFC4] bg-white px-6 py-14 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-[#176C62]" />

              <h2 className="mt-4 text-xl font-bold text-[#17383D]">
                {t.emptyTitle}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6D7D80]">
                {t.emptyText}
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg border border-[#B5CFC4] px-4 py-2 text-sm font-semibold text-[#176C62] hover:bg-[#E7F4E8]"
              >
                {t.clear}
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleDonations.map((donation) => {
                  const imageUrl = donation.images?.[0];
                  const place = getLocation(donation);

                  return (
                    <article
                      key={donation._id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#DCE6E1] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#B5CFC4] hover:shadow-lg"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#E7F4E8]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={donation.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <PackageSearch className="h-12 w-12 text-[#7DAF97]" />
                          </div>
                        )}

                        <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/95 px-3 py-1 text-xs font-semibold text-[#176C62]">
                          {getCategoryName(donation)}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h2 className="line-clamp-2 font-heading text-lg font-bold text-[#17383D]">
                          {donation.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#6D7D80]">
                          {donation.description || t.details}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EDF1EE] pt-3">
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wide text-[#879496]">
                              {t.quantity}
                            </p>

                            <p className="mt-0.5 truncate text-sm font-bold text-[#17383D]">
                              {donation.quantity} {donation.unit}
                            </p>
                          </div>

                          <div className="max-w-[55%] text-right">
                            <p className="flex items-center justify-end gap-1 text-[11px] uppercase tracking-wide text-[#879496]">
                              <MapPin className="h-3 w-3" />
                              {t.city}
                            </p>

                            <p className="mt-0.5 truncate text-sm font-semibold text-[#17383D]">
                              {place || t.location}
                            </p>
                          </div>
                        </div>

                        {donation.availableUntil && (
                          <p className="mt-3 text-xs text-[#6D7D80]">
                            {t.availableUntil}:{" "}
                            <span className="font-semibold text-[#17383D]">
                              {formatDate(
                                donation.availableUntil,
                                language,
                              )}
                            </span>
                          </p>
                        )}

                        <Link
                          to={`/donations/${donation._id}`}
                          className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#07545A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#06464B]"
                        >
                          {t.view}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DCE6E1] bg-white px-4 text-sm font-semibold text-[#176C62] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.previous}
                </button>

                <span className="text-sm text-[#6D7D80]">
                  {t.page} {page} {t.of} {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1),
                    )
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DCE6E1] bg-white px-4 text-sm font-semibold text-[#176C62] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t.next}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </section>

        {/* Donor call to action */}
        <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#07545A] p-6 text-white sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="font-heading text-xl font-bold sm:text-2xl">
                {t.donateCta}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#D4E6DE]">
                {t.donateCtaText}
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#07545A] hover:bg-[#E7F4E8]"
            >
              {t.startDonating}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer t={footerTranslations} />
    </div>
  );
}
