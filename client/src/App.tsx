import React, { useState } from "react";
import {
  Heart,
  HeartHandshake,
  Shirt,
  Utensils,
  Pill,
  MapPin,
  ArrowRight,
  Search,
  Users,
  Gift,
  Truck,
  Leaf,
  ChevronRight,
  Languages,
} from "lucide-react";

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      how: "How it works",
      explore: "Explore",
      login: "Login",
      signup: "Sign Up",
    },

    hero: {
      badge: "Small donations. Big impact.",
      title1: "Give what you can.",
      title2: "Help someone",
      nearby: "nearby.",
      description:
        "Donate food, clothes and useful items to people in your community. A small act of kindness can create a big change.",
      donate: "Donate Now",
      find: "Find Donations",
    },

    stats: {
      donations: "Donations",
      people: "People Helped",
      communities: "Communities",
      successful: "Successful",
    },

    categories: {
      label: "Make a difference",
      title: "Donate by category",
      explore: "Explore all",

      food: {
        title: "Food",
        description:
          "Share home-cooked food, groceries and other usable food items.",
        button: "Donate Food",
      },

      clothes: {
        title: "Clothes",
        description:
          "Give clean, gently-used clothes a second home.",
        button: "Donate Clothes",
      },

      medicine: {
        title: "Medicines",
        description:
          "Medicine donation will be introduced with proper verification.",
        button: "Coming Soon",
        tag: "Future",
      },
    },

    location: {
      title: "Find donations near you",
      description:
        "Discover available donations from people in your community.",
      placeholder: "Enter your location",
      search: "Search",
    },

    how: {
      label: "Simple process",
      title: "How it works",
      description:
        "A simple way to turn things you no longer need into meaningful help for someone nearby.",

      step1: {
        title: "Post a Donation",
        description:
          "Add details, quantity and photos of the items you want to share.",
      },

      step2: {
        title: "Find a Match",
        description:
          "Connect with nearby people or organizations who need them.",
      },

      step3: {
        title: "Pickup or Delivery",
        description:
          "Coordinate a convenient handover with the recipient or volunteer.",
      },

      step4: {
        title: "Make an Impact",
        description:
          "Help someone in need and keep track of your contribution.",
      },
    },

    cta: {
      title: "Together, we can build kinder communities.",
      description:
        "Every donation counts, no matter how small. Start sharing and make a difference close to home.",
      button: "Join SAHARA",
    },

    footer: {
      tagline: "Give What You Can, Get What You Need.",
    },
  },

  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      how: "यह कैसे काम करता है",
      explore: "देखें",
      login: "लॉगिन",
      signup: "साइन अप",
    },

    hero: {
      badge: "छोटा दान। बड़ा बदलाव।",
      title1: "जो दे सकते हैं, दें।",
      title2: "किसी अपने",
      nearby: "की मदद करें।",
      description:
        "अपने समुदाय के ज़रूरतमंद लोगों को भोजन, कपड़े और उपयोगी सामान दान करें। आपकी छोटी सी मदद भी बड़ा बदलाव ला सकती है।",
      donate: "अभी दान करें",
      find: "दान खोजें",
    },

    stats: {
      donations: "दान",
      people: "लाभान्वित लोग",
      communities: "समुदाय",
      successful: "सफल वितरण",
    },

    categories: {
      label: "बदलाव की शुरुआत करें",
      title: "श्रेणी के अनुसार दान करें",
      explore: "सभी देखें",

      food: {
        title: "भोजन",
        description:
          "घर का बना भोजन, किराने का सामान और उपयोगी खाद्य सामग्री साझा करें।",
        button: "भोजन दान करें",
      },

      clothes: {
        title: "कपड़े",
        description:
          "साफ़ और अच्छी स्थिति वाले कपड़ों को किसी ज़रूरतमंद तक पहुँचाएँ।",
        button: "कपड़े दान करें",
      },

      medicine: {
        title: "दवाइयाँ",
        description:
          "दवाइयों का दान उचित सत्यापन के साथ भविष्य में शुरू किया जाएगा।",
        button: "जल्द आ रहा है",
        tag: "भविष्य में",
      },
    },

    location: {
      title: "अपने पास दान खोजें",
      description:
        "अपने समुदाय के लोगों द्वारा उपलब्ध कराए गए दान देखें।",
      placeholder: "अपना स्थान दर्ज करें",
      search: "खोजें",
    },

    how: {
      label: "सरल प्रक्रिया",
      title: "यह कैसे काम करता है",
      description:
        "ऐसी चीज़ों को, जिनकी अब आपको ज़रूरत नहीं है, किसी ज़रूरतमंद की मदद में बदलने का आसान तरीका।",

      step1: {
        title: "दान पोस्ट करें",
        description:
          "जिस सामान को आप साझा करना चाहते हैं उसकी जानकारी, मात्रा और तस्वीरें जोड़ें।",
      },

      step2: {
        title: "सही व्यक्ति खोजें",
        description:
          "अपने पास के ज़रूरतमंद लोगों या संगठनों से जुड़ें।",
      },

      step3: {
        title: "पिकअप या डिलीवरी",
        description:
          "प्राप्तकर्ता या स्वयंसेवक के साथ सुविधाजनक तरीके से सामान पहुँचाएँ।",
      },

      step4: {
        title: "बदलाव लाएँ",
        description:
          "किसी ज़रूरतमंद की मदद करें और अपने योगदान को ट्रैक करें।",
      },
    },

    cta: {
      title: "मिलकर हम एक बेहतर समुदाय बना सकते हैं।",
      description:
        "हर दान मायने रखता है, चाहे वह कितना भी छोटा क्यों न हो। आज से मदद की शुरुआत करें।",
      button: "SAHARA से जुड़ें",
    },

    footer: {
      tagline: "जो दे सकते हैं, दें। जो चाहिए, पाएँ।",
    },
  },
};

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "hi" : "en"));
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF8F3] text-[#26332F]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#E4E9E4]/80 bg-[#FAF8F3]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F5547] text-white shadow-sm">
              <HeartHandshake className="h-5 w-5" />
            </div>

            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight text-[#2F5547]">
                SAHARA
              </h1>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#71817A] sm:block">
                Community Care
              </p>
            </div>
          </a>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="nav-link active">
              {t.nav.home}
            </a>

            <a href="#about" className="nav-link">
              {t.nav.about}
            </a>

            <a href="#how-it-works" className="nav-link">
              {t.nav.how}
            </a>

            <a href="#donations" className="nav-link">
              {t.nav.explore}
            </a>
          </div>

          {/* Right Actions */}
         <div className="flex items-center gap-2">

  {/* Language */}
  <button
    onClick={toggleLanguage}
    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D8E0DA] bg-white px-2.5 text-xs font-semibold text-[#2F5547] transition hover:bg-[#F1F6F2] sm:h-10 sm:rounded-xl sm:px-3 sm:text-sm"
    title={
      language === "en"
        ? "हिंदी में बदलें"
        : "Switch to English"
    }
  >
    <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

    {language === "en" ? "हिंदी" : "English"}
  </button>

  {/* Login - desktop/tablet */}
  <button className="hidden rounded-xl border border-[#D8E0DA] px-4 py-2 text-sm font-medium text-[#2F5547] transition hover:bg-white sm:block">
    {t.nav.login}
  </button>

  {/* Sign Up - hide on very small screens */}
  <button className="hidden rounded-xl bg-[#2F5547] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#234438] sm:block">
    {t.nav.signup}
  </button>

  {/* Mobile menu button */}
  <button
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8E0DA] bg-white text-[#2F5547] sm:hidden"
    aria-label="Open menu"
  >
    <span className="text-lg leading-none">☰</span>
  </button>

</div>
        </nav>
      </header>

      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden">

          {/* Decorative Background */}
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#DCE9DF] opacity-60 blur-3xl" />

          <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#F5DDD2] opacity-50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-24">

            {/* Hero Content */}
            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D9E5DC] bg-[#EDF5EF] px-4 py-2 text-sm font-medium text-[#3E6B57]">
                <Heart className="h-4 w-4 fill-current" />
                {t.hero.badge}
              </div>

              <h2 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-[#26332F] sm:text-6xl lg:text-7xl">

                {t.hero.title1}

                <br />

                {t.hero.title2}{" "}

                <span className="italic text-[#4F7C68]">
                  {t.hero.nearby}
                </span>

              </h2>

              <p className="mt-7 max-w-lg text-lg leading-8 text-[#71817A]">
                {t.hero.description}
              </p>

              {/* Hero Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F7C68] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#4F7C68]/20 transition hover:-translate-y-0.5 hover:bg-[#3E6856]">
                  {t.hero.donate}

                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9AB3A4] bg-white px-7 py-3.5 font-semibold text-[#3E6856] transition hover:bg-[#F1F6F2]">
                  <Search className="h-4 w-4" />

                  {t.hero.find}
                </button>

              </div>

              {/* Impact Statistics */}
              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[#DDE4DE] pt-7 sm:grid-cols-4">

                <ImpactStat
                  icon={<Gift />}
                  value="1,240"
                  label={t.stats.donations}
                />

                <ImpactStat
                  icon={<Users />}
                  value="892"
                  label={t.stats.people}
                />

                <ImpactStat
                  icon={<HeartHandshake />}
                  value="15+"
                  label={t.stats.communities}
                />

                <ImpactStat
                  icon={<Heart />}
                  value="98%"
                  label={t.stats.successful}
                />

              </div>
            </div>

            {/* Hero Image */}
            <div className="relative mx-auto w-full max-w-xl">

              <div className="absolute -inset-4 rounded-[3rem] bg-[#DDE9DF] opacity-60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] border-[10px] border-white bg-[#DCE9DF] shadow-2xl">

                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85"
                  alt="People helping with donated items"
                  className="h-[500px] w-full object-cover"
                />

                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF5EF] text-[#4F7C68]">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>

                    <div>
                      <p className="font-heading text-base font-semibold text-[#2F5547]">
                        {language === "en"
                          ? "Kind people. Stronger communities."
                          : "दयालु लोग। मजबूत समुदाय।"}
                      </p>

                      <p className="mt-1 text-sm text-[#71817A]">
                        {language === "en"
                          ? "Every contribution makes a difference."
                          : "हर योगदान बदलाव लाता है।"}
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            DONATION CATEGORIES
        ===================================================== */}

        <section id="donations" className="bg-white py-20">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mb-10 flex items-end justify-between">

              <div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                  {t.categories.label}
                </p>

                <h2 className="font-heading text-3xl font-bold text-[#26332F] sm:text-4xl">
                  {t.categories.title}
                </h2>

              </div>

              <button className="hidden items-center gap-1 text-sm font-semibold text-[#4F7C68] sm:flex">
                {t.categories.explore}
                <ChevronRight className="h-4 w-4" />
              </button>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              <CategoryCard
                icon={<Utensils />}
                title={t.categories.food.title}
                description={t.categories.food.description}
                button={t.categories.food.button}
                className="food-card"
              />

              <CategoryCard
                icon={<Shirt />}
                title={t.categories.clothes.title}
                description={t.categories.clothes.description}
                button={t.categories.clothes.button}
                className="clothes-card"
              />

              <CategoryCard
                icon={<Pill />}
                title={t.categories.medicine.title}
                description={t.categories.medicine.description}
                button={t.categories.medicine.button}
                className="medicine-card"
                disabled
              />

            </div>

          </div>
        </section>

        {/* =====================================================
            LOCATION
        ===================================================== */}

        <section className="bg-[#F5F8F5] py-16">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="flex flex-col items-center justify-between gap-7 rounded-3xl border border-[#DDE6DF] bg-white p-7 shadow-sm md:flex-row md:p-10">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF5EF] text-[#4F7C68]">
                  <MapPin className="h-6 w-6" />
                </div>

                <div>

                  <h3 className="font-heading text-xl font-bold text-[#26332F]">
                    {t.location.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#71817A]">
                    {t.location.description}
                  </p>

                </div>

              </div>

              <div className="flex w-full max-w-md gap-2">

                <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#D8E1DA] bg-[#FAFCFA] px-4">

                  <MapPin className="h-4 w-4 text-[#71817A]" />

                  <input
                    type="text"
                    placeholder={t.location.placeholder}
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#9AA8A0]"
                  />

                </div>

                <button className="rounded-xl bg-[#4F7C68] px-5 font-semibold text-white transition hover:bg-[#3E6856]">
                  {t.location.search}
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section id="how-it-works" className="bg-white py-20">

          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mx-auto mb-14 max-w-2xl text-center">

              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
                {t.how.label}
              </p>

              <h2 className="font-heading text-3xl font-bold text-[#26332F] sm:text-4xl">
                {t.how.title}
              </h2>

              <p className="mt-4 text-[#71817A]">
                {t.how.description}
              </p>

            </div>

            <div className="grid gap-10 md:grid-cols-4">

              <Step
                number="01"
                icon={<Gift />}
                title={t.how.step1.title}
                description={t.how.step1.description}
              />

              <Step
                number="02"
                icon={<Users />}
                title={t.how.step2.title}
                description={t.how.step2.description}
              />

              <Step
                number="03"
                icon={<Truck />}
                title={t.how.step3.title}
                description={t.how.step3.description}
              />

              <Step
                number="04"
                icon={<Heart />}
                title={t.how.step4.title}
                description={t.how.step4.description}
              />

            </div>

          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section id="about" className="px-5 pb-20 lg:px-8">

          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#2F5547] px-7 py-14 text-center text-white sm:px-12">

            <Leaf className="mx-auto mb-5 h-8 w-8 text-[#B9D7C2]" />

            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              {t.cta.title}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[#C8D9CE]">
              {t.cta.description}
            </p>

            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#2F5547] transition hover:bg-[#F1F6F2]">
              {t.cta.button}
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-[#DDE4DE] bg-[#FAF8F3]">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-[#71817A] sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-[#4F7C68]" />

            <span className="font-semibold text-[#2F5547]">
              SAHARA
            </span>
          </div>

          <p>{t.footer.tagline}</p>

          <p>© 2026 SAHARA</p>

        </div>

      </footer>

    </div>
  );
}

/* =========================================================
   IMPACT STAT
========================================================= */

function ImpactStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <div className="text-[#4F7C68] [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>

      <div>

        <p className="font-heading text-lg font-bold text-[#26332F]">
          {value}
        </p>

        <p className="text-[11px] text-[#7B8981]">
          {label}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   CATEGORY CARD
========================================================= */

function CategoryCard({
  icon,
  title,
  description,
  button,
  className,
  disabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  button: string;
  className: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`category-card ${className} ${
        disabled ? "opacity-80" : ""
      }`}
    >

      <div className="flex items-start justify-between">

        <div className="category-icon">
          {icon}
        </div>

        {disabled && (
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#71817A]">
            Future
          </span>
        )}

      </div>

      <div className="mt-6">

        <h3 className="font-heading text-2xl font-bold text-[#26332F]">
          {title}
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#66756D]">
          {description}
        </p>

      </div>

      <button
        disabled={disabled}
        className={`mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          disabled
            ? "cursor-not-allowed bg-white/60 text-[#8B968F]"
            : "bg-white text-[#3E6856] shadow-sm hover:-translate-y-0.5"
        }`}
      >
        {button}

        {!disabled && (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>

    </div>
  );
}

/* =========================================================
   HOW IT WORKS STEP
========================================================= */

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF5EF] text-[#4F7C68] shadow-sm [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>

      <span className="text-xs font-bold tracking-widest text-[#9BAAA1]">
        {number}
      </span>

      <h3 className="mt-2 font-heading text-lg font-bold text-[#26332F]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#71817A]">
        {description}
      </p>

    </div>
  );
}