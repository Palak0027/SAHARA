
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Heart,
  HeartHandshake,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  ClipboardCheck,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

type Language = "en" | "hi";

type StepTranslation = {
  title: string;
  description: string;
};

type HowTranslation = {
  label: string;
  title: string;
  description: string;
  step1: StepTranslation;
  step2: StepTranslation;
  step3: StepTranslation;
  step4: StepTranslation;
};

type PageTranslations = {
  how: HowTranslation;
  nav?: Record<string, string>;
  footer?: Record<string, string>;
};

type HowItWorksProps = {
  t?: PageTranslations;
};

const COPY = {
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
    label: "A SIMPLE WAY TO MAKE A DIFFERENCE",
    title: "Small acts. Meaningful impact.",
    description:
      "SAHARA makes it easier to share useful essentials with people who need them. Here is how our community comes together.",
    stepsTitle: "Four steps. One caring community.",
    stepsDescription:
      "From sharing an item to coordinating a handover, every step is designed to make giving more accessible.",
    step1: {
      title: "Share what you can",
      description:
        "List useful food, clothes, medicines or other essentials with accurate details and quantity.",
    },
    step2: {
      title: "Discover nearby help",
      description:
        "Explore available donations and find items that match your needs and location.",
    },
    step3: {
      title: "Connect and coordinate",
      description:
        "Use the platform's available request and communication process to coordinate with the other person.",
    },
    step4: {
      title: "Complete the handover",
      description:
        "Agree on a suitable collection or delivery arrangement and make sure the items are appropriate.",
    },
    donorLabel: "FOR DONORS",
    donorTitle: "Have something to give?",
    donorDescription:
      "Turn useful things you no longer need into something valuable for another person.",
    donorPoints: [
      "Create an accurate donation listing.",
      "Mention quantity, condition and relevant details.",
      "Keep food and other time-sensitive items safe.",
    ],
    receiverLabel: "FOR RECEIVERS",
    receiverTitle: "Looking for essentials?",
    receiverDescription:
      "Explore available items and find donations that may suit your needs.",
    receiverPoints: [
      "Search donations by category and location.",
      "Review listing details before making a request.",
      "Coordinate a suitable and safe handover.",
    ],
    safetyLabel: "A LITTLE CARE GOES A LONG WAY",
    safetyTitle: "Keep every donation thoughtful and safe.",
    safetyDescription:
      "Accurate listings and responsible coordination help build a community people can trust.",
    safetyPoints: [
      "Share accurate information and current availability.",
      "Never offer expired, damaged or unsafe items.",
      "Protect personal information and meet in an appropriate place.",
    ],
    exploreCta: "Explore donations",
    donateCta: "Start donating",
    finalLabel: "BE PART OF THE CHANGE",
    finalTitle: "Someone nearby may need what you can share.",
    finalDescription:
      "Discover available donations or take the first step towards helping someone in your community.",
    getStarted: "Get started",
    learnMore: "Explore available items",
    homepage: "Back to home",
    availability: "Availability depends on current listings.",
    sectionLabel: "HOW IT WORKS",
    sectionTitle: "Giving made simple",
    sectionDescription:
      "A straightforward way to share essentials and connect with your community.",
    share: "Share",
    connect: "Connect",
    shareDesc: "Useful essentials",
    connectDesc: "People nearby",
    kindness: "Small acts of kindness",
    kindnessDesc: "Make useful things matter to someone else.",
    community: "COMMUNITY FIRST",
    trust: "Give thoughtfully. Connect responsibly.",
    heroTag: "Everyday essentials. Real community impact.",
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
      tagline: "साझा करने और सहयोग के माध्यम से समुदायों को जोड़ना।",
    },
    label: "बदलाव लाने का एक आसान तरीका",
    title: "छोटी मदद, बड़ा बदलाव।",
    description:
      "SAHARA उपयोगी चीज़ों को ज़रूरतमंद लोगों तक पहुँचाने में मदद करता है। जानिए हमारा समुदाय कैसे साथ आता है।",
    stepsTitle: "चार कदम, एक सहयोगी समुदाय।",
    stepsDescription:
      "दान साझा करने से लेकर उसे सौंपने तक, हर कदम मदद को आसान बनाने के लिए है।",
    step1: {
      title: "जो दे सकते हैं, साझा करें",
      description:
        "भोजन, कपड़े, दवाइयाँ या अन्य उपयोगी चीज़ों की सही जानकारी और मात्रा के साथ सूची बनाएँ।",
    },
    step2: {
      title: "आस-पास उपलब्ध मदद खोजें",
      description:
        "उपलब्ध दान देखें और अपनी ज़रूरत तथा स्थान के अनुसार चीज़ें खोजें।",
    },
    step3: {
      title: "संपर्क करें और समन्वय बनाएँ",
      description:
        "प्लेटफ़ॉर्म पर उपलब्ध अनुरोध और संपर्क प्रक्रिया के माध्यम से दूसरे व्यक्ति से समन्वय करें।",
    },
    step4: {
      title: "दान सौंपें",
      description:
        "संग्रह या डिलीवरी की उचित व्यवस्था तय करें और सुनिश्चित करें कि वस्तुएँ उपयोगी हों।",
    },
    donorLabel: "दान देने वालों के लिए",
    donorTitle: "क्या आपके पास कुछ साझा करने के लिए है?",
    donorDescription:
      "आपकी अतिरिक्त उपयोगी चीज़ें किसी दूसरे व्यक्ति के काम आ सकती हैं।",
    donorPoints: [
      "दान की सही जानकारी के साथ सूची बनाएँ।",
      "मात्रा, स्थिति और ज़रूरी विवरण बताएँ।",
      "भोजन और समय-संवेदनशील वस्तुओं की सुरक्षा का ध्यान रखें।",
    ],
    receiverLabel: "दान प्राप्त करने वालों के लिए",
    receiverTitle: "क्या आपको ज़रूरी चीज़ें चाहिए?",
    receiverDescription:
      "उपलब्ध दान देखें और अपनी ज़रूरत के अनुसार वस्तुएँ खोजें।",
    receiverPoints: [
      "श्रेणी और स्थान के अनुसार दान खोजें।",
      "अनुरोध करने से पहले पूरी जानकारी पढ़ें।",
      "सुरक्षित तरीके से वस्तु प्राप्त करने का समन्वय करें।",
    ],
    safetyLabel: "थोड़ी सावधानी बहुत मायने रखती है",
    safetyTitle: "हर दान को सुरक्षित और उपयोगी बनाएँ।",
    safetyDescription:
      "सही जानकारी और ज़िम्मेदार समन्वय एक भरोसेमंद समुदाय बनाने में मदद करते हैं।",
    safetyPoints: [
      "सही जानकारी और वर्तमान उपलब्धता साझा करें।",
      "समाप्त हो चुकी या असुरक्षित वस्तुएँ दान न करें।",
      "निजी जानकारी सुरक्षित रखें और उचित स्थान पर मिलें।",
    ],
    exploreCta: "दान देखें",
    donateCta: "दान शुरू करें",
    finalLabel: "बदलाव का हिस्सा बनें",
    finalTitle: "आपकी साझा की गई चीज़ किसी की ज़रूरत पूरी कर सकती है।",
    finalDescription:
      "उपलब्ध दान देखें या अपने समुदाय में किसी की मदद करने की शुरुआत करें।",
    getStarted: "शुरू करें",
    learnMore: "उपलब्ध वस्तुएँ देखें",
    homepage: "होम पर जाएँ",
    availability: "उपलब्धता वर्तमान सूची पर निर्भर करती है।",
    sectionLabel: "कैसे काम करता है",
    sectionTitle: "दान करना हुआ आसान",
    sectionDescription:
      "उपयोगी चीज़ें साझा करने और समुदाय से जुड़ने का आसान तरीका।",
    share: "साझा करें",
    connect: "जुड़ें",
    shareDesc: "उपयोगी वस्तुएँ",
    connectDesc: "आस-पास के लोग",
    kindness: "छोटी मदद, बड़ा बदलाव",
    kindnessDesc: "उपयोगी चीज़ों से किसी के जीवन में बदलाव लाएँ।",
    community: "समुदाय सबसे पहले",
    trust: "सोच-समझकर दान करें। ज़िम्मेदारी से जुड़ें।",
    heroTag: "रोज़मर्रा की ज़रूरतें। समुदाय पर वास्तविक प्रभाव।",
  },
};

const ICONS = [Gift, Search, HeartHandshake, PackageCheck];

export default function HowItWorks({ t: externalT }: HowItWorksProps) {
  const location = useLocation();

  const isStandalone =
    location.pathname.replace(/\/+$/, "") === "/how-it-works";

  const [language, setLanguage] = useState<Language>(() =>
    localStorage.getItem("sahara-language") === "hi" ? "hi" : "en",
  );

  const copy = COPY[language];
  const how = externalT?.how;

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      const saved = localStorage.getItem("sahara-language");

      setLanguage(detail === "hi" || saved === "hi" ? "hi" : "en");
    };

    window.addEventListener("sahara-language-change", syncLanguage);
    window.addEventListener("storage", syncLanguage);

    return () => {
      window.removeEventListener("sahara-language-change", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  const toggleLanguage = () => {
    const next: Language = language === "en" ? "hi" : "en";

    localStorage.setItem("sahara-language", next);
    setLanguage(next);

    window.dispatchEvent(
      new CustomEvent("sahara-language-change", { detail: next }),
    );
  };

  const steps = [
    {
      number: "01",
      icon: ICONS[0],
      title: how?.step1.title || copy.step1.title,
      description: how?.step1.description || copy.step1.description,
    },
    {
      number: "02",
      icon: ICONS[1],
      title: how?.step2.title || copy.step2.title,
      description: how?.step2.description || copy.step2.description,
    },
    {
      number: "03",
      icon: ICONS[2],
      title: how?.step3.title || copy.step3.title,
      description: how?.step3.description || copy.step3.description,
    },
    {
      number: "04",
      icon: ICONS[3],
      title: how?.step4.title || copy.step4.title,
      description: how?.step4.description || copy.step4.description,
    },
  ];

  if (!isStandalone) {
    return (
      <section id="how-it-works" className="bg-[#F5FAF7] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#176C62]">
              {how?.label || copy.sectionLabel}
            </p>
            <h2 className="font-heading text-2xl font-bold text-[#17383D] sm:text-3xl">
              {how?.title || copy.sectionTitle}
            </h2>
            <p className="mt-4 text-[#6D7D80]">
              {how?.description || copy.sectionDescription}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="rounded-xl border border-[#D5DFDC] bg-white px-4 py-5 text-center transition hover:-translate-y-1 hover:border-[#B5CFC4] hover:shadow-md"
                >
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F4E8] text-[#176C62]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-[#879496]">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-bold text-[#17383D]">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6D7D80]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-7 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#176C62] hover:text-[#07545A]"
            >
              {copy.learnMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF7]">
      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={{ nav: copy.nav }}
      />

      <main className="overflow-hidden text-[#263238]">
        {/* HERO: taller content area, less empty space */}
        <section className="relative isolate border-b border-[#DCE6E1] bg-gradient-to-br from-[#EDF6EF] via-white to-[#E1F0E4]">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#D2EBDD]/50 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#B8DCC3]/35 blur-3xl" />

          <div className="relative mx-auto grid min-h-[640px] max-w-[1500px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-12 lg:py-16 xl:px-16">
            {/* Left column */}
            <div className="relative z-10 flex flex-col justify-center lg:py-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CFE4D4] bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#176C62] shadow-sm">
                <Heart className="h-4 w-4" />
                {copy.label}
              </span>

              <h1 className="mt-6 max-w-2xl font-heading text-4xl font-bold leading-[1.12] tracking-tight text-[#17383D] sm:text-5xl xl:text-6xl">
                {copy.title}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#63746C] sm:text-lg">
                {copy.description}
              </p>

              <p className="mt-4 flex items-start gap-2 text-sm font-medium leading-6 text-[#526D62]">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#24845E]" />
                {copy.heroTag}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/donations"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#07545A] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#07545A]/10 transition hover:-translate-y-0.5 hover:bg-[#06464B] hover:shadow-lg"
                >
                  {copy.exploreCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#C9DCD0] bg-white/90 px-6 py-3 text-sm font-bold text-[#176C62] transition hover:-translate-y-0.5 hover:bg-[#F0F7F1]"
                >
                  {copy.donateCta}
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 border-t border-[#D8E5DA] pt-5">
                <div>
                  <Gift className="h-5 w-5 text-[#176C62]" />
                  <p className="mt-2 text-sm font-bold text-[#17383D]">
                    {copy.share}
                  </p>
                  <p className="mt-1 text-xs text-[#728178]">
                    {copy.shareDesc}
                  </p>
                </div>
                <div>
                  <Users className="h-5 w-5 text-[#98763B]" />
                  <p className="mt-2 text-sm font-bold text-[#17383D]">
                    {copy.connect}
                  </p>
                  <p className="mt-1 text-xs text-[#728178]">
                    {copy.connectDesc}
                  </p>
                </div>
                <div>
                  <HeartHandshake className="h-5 w-5 text-[#176C62]" />
                  <p className="mt-2 text-sm font-bold text-[#17383D]">
                    {copy.kindness}
                  </p>
                  <p className="mt-1 text-xs text-[#728178]">
                    {copy.kindnessDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: wider landscape card */}
            <div className="relative mx-auto w-full max-w-3xl lg:ml-auto lg:mr-0">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-[#C9E3D0]/50 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/90 bg-white/90 p-5 shadow-[0_24px_70px_rgba(23,56,61,0.12)] backdrop-blur sm:p-7 lg:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B9185]">
                      SAHARA
                    </p>
                    <h2 className="mt-2 font-heading text-xl font-bold text-[#17383D] sm:text-2xl">
                      {copy.stepsTitle}
                    </h2>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F4E9] px-3 py-2 text-xs font-semibold text-[#176C62]">
                    <Sparkles className="h-3.5 w-3.5" />
                    {copy.community}
                  </span>
                </div>

                {/* Landscape tiles */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex min-h-36 flex-col justify-between rounded-2xl bg-[#EAF4E9] p-4 sm:min-h-40 sm:p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#176C62]">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold text-[#17383D] sm:text-xl">
                        {copy.share}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#63746C] sm:text-sm">
                        {copy.shareDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-h-36 flex-col justify-between rounded-2xl bg-[#F8F0DD] p-4 sm:min-h-40 sm:p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#98763B]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold text-[#17383D] sm:text-xl">
                        {copy.connect}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#786B53] sm:text-sm">
                        {copy.connectDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wide horizontal panel */}
                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#E1EAE2] bg-white p-4 sm:p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4E9] text-[#176C62] sm:h-16 sm:w-16">
                    <HeartHandshake className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-bold text-[#17383D] sm:text-lg">
                      {copy.kindness}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#728178]">
                      {copy.kindnessDesc}
                    </p>
                  </div>

                  <Heart className="hidden h-6 w-6 shrink-0 text-[#8AB99A] sm:block" />
                </div>

                {/* Wide bottom trust strip */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F5F8F3] px-4 py-3">
                  <span className="flex items-center gap-2 text-xs font-medium text-[#526D62] sm:text-sm">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#24845E]" />
                    {copy.trust}
                  </span>
                  <span className="text-xs font-bold tracking-wider text-[#9AB0A0]">
                    GIVE • SHARE • CARE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Four steps */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176C62]">
              {how?.label || copy.sectionLabel}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#17383D] sm:text-4xl">
              {how?.title || copy.stepsTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#728178] sm:text-base">
              {how?.description || copy.stepsDescription}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group rounded-2xl border border-[#DCE6E1] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#B5CFC4] hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F4E8] text-[#176C62] transition group-hover:bg-[#07545A] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-heading text-3xl font-bold text-[#E0E9E1]">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-[#17383D]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#728178]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Donor and receiver */}
        <section className="border-y border-[#DCE6E1] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176C62]">
                TWO WAYS TO MAKE A DIFFERENCE
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-[#17383D] sm:text-4xl">
                Find your place in the community.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-[#D5E6D7] bg-gradient-to-br from-[#F0F7EF] to-white p-6 sm:p-8">
                <Gift className="h-7 w-7 text-[#176C62]" />
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#176C62]">
                  {copy.donorLabel}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-bold text-[#17383D]">
                  {copy.donorTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#63746C]">
                  {copy.donorDescription}
                </p>

                <ul className="mt-6 space-y-3">
                  {copy.donorPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-6 text-[#526D62]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#24845E]" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#07545A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#06464B]"
                >
                  {copy.donateCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>

              <article className="rounded-3xl border border-[#E5E2CF] bg-gradient-to-br from-[#F9F6EA] to-white p-6 sm:p-8">
                <Search className="h-7 w-7 text-[#8A7136]" />
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#8A7136]">
                  {copy.receiverLabel}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-bold text-[#17383D]">
                  {copy.receiverTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#63746C]">
                  {copy.receiverDescription}
                </p>

                <ul className="mt-6 space-y-3">
                  {copy.receiverPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-6 text-[#526D62]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8A7136]" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/donations"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#D8D0AE] bg-white px-5 py-3 text-sm font-bold text-[#725D2F] transition hover:bg-[#F9F5E8]"
                >
                  {copy.exploreCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F4E8] text-[#176C62]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#176C62]">
                {copy.safetyLabel}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-[#17383D] sm:text-4xl">
                {copy.safetyTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#728178]">
                {copy.safetyDescription}
              </p>
            </div>

            <div className="rounded-3xl border border-[#DCE6E1] bg-white p-6 shadow-sm sm:p-8">
              <ul className="space-y-5">
                {copy.safetyPoints.map((point, index) => {
                  const SafetyIcon = [ClipboardCheck, ShieldCheck, MapPin][index];

                  return (
                    <li key={point} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4E9] text-[#176C62]">
                        <SafetyIcon className="h-5 w-5" />
                      </div>
                      <p className="pt-1 text-sm leading-7 text-[#526D62]">
                        {point}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#064B50] via-[#07545A] to-[#176C62] px-6 py-10 text-white shadow-[0_18px_42px_rgba(7,84,90,0.15)] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[30px] border-white/5" />

            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-[#BFE2CE]">
                  {copy.finalLabel}
                </p>
                <h2 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                  {copy.finalTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#D4E6DE]">
                  {copy.finalDescription}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  to="/donations"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#07545A] transition hover:bg-[#EDF5ED]"
                >
                  {copy.learnMore}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  {copy.getStarted}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#819087]">
            <Link to="/" className="hover:text-[#176C62]">
              ← {copy.homepage}
            </Link>
            <span>{copy.availability}</span>
          </div>
        </section>
      </main>

      <Footer t={{ nav: copy.nav, footer: copy.footer }} />
    </div>
  );
}
