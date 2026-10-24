
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  HeartHandshake,
  HandHeart,
  ShieldCheck,
  Users,
  Leaf,
  Gift,
  CheckCircle2,
  Sparkles,
  Globe2,
  MapPin,
  Recycle,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";

type Language = "en" | "hi";

const CONTENT = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      how: "How it works",
      explore: "Explore donations",
      login: "Login",
      signup: "Sign up",
      contact: "Contact Us",
    },
    footer: {
      tagline:
        "Connecting caring communities through sharing, support and everyday acts of kindness.",
    },
    eyebrow: "GET TO KNOW SAHARA",
    title: "A little kindness can go a long way.",
    description:
      "SAHARA connects people who want to donate useful things with people who need them. We make it easier to share food, clothes and everyday essentials with your community.",
    primary: "Explore donations",
    secondary: "How it works",
    community: "Built around community",
    communityText:
      "We believe useful things should reach people who can benefit from them.",
    missionLabel: "OUR MISSION",
    missionTitle: "Make giving easier and more meaningful.",
    missionText:
      "Our mission is to help people share useful essentials with others nearby. By making donations easier to discover, SAHARA encourages thoughtful giving and stronger community connections.",
    visionLabel: "OUR VISION",
    visionTitle: "A community where useful things find a purpose.",
    visionText:
      "We envision communities where people can offer what they can, find help when they need it, and give everyday essentials a second chance to make a difference.",
    valuesLabel: "WHAT GUIDES US",
    valuesTitle: "Our values, at the heart of SAHARA.",
    valuesText:
      "The principles behind every connection, every shared item and every act of support.",
    values: [
      {
        title: "Compassion",
        text: "We believe that small acts of kindness can make everyday life better for someone else.",
      },
      {
        title: "Community",
        text: "We bring donors and receivers closer by helping people discover useful donations nearby.",
      },
      {
        title: "Responsible giving",
        text: "We encourage accurate listings, appropriate items and thoughtful coordination.",
      },
      {
        title: "Accessibility",
        text: "We aim to make discovering and sharing useful essentials straightforward for everyone.",
      },
    ],
    storyLabel: "WHY SAHARA MATTERS",
    storyTitle: "Good things deserve a second chance.",
    storyText:
      "Many useful items can still help someone even when their original owner no longer needs them. SAHARA creates a way for people to share those essentials with others in their community.",
    storyText2:
      "From food and clothing to everyday necessities, the idea is simple: make sharing easier, help people connect, and encourage a culture of care.",
    points: [
      "Give useful items a new purpose.",
      "Help people discover donations in their community.",
      "Make thoughtful sharing easier to coordinate.",
    ],
    ctaLabel: "BE PART OF THE CHANGE",
    ctaTitle: "What you share could mean a lot to someone.",
    ctaText:
      "Join SAHARA and help build a community where useful things reach people who need them.",
    join: "Join SAHARA",
    browse: "Browse donations",
     
 
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      how: "कैसे काम करता है",
      explore: "दान देखें",
      login: "लॉगिन",
      signup: "साइन अप",
      contact: "संपर्क करें",
    },
    footer: {
      tagline: "साझा करने, सहयोग और रोज़मर्रा की दयालुता से समुदायों को जोड़ना।",
    },
    eyebrow: "SAHARA को जानें",
    title: "छोटी-सी दयालुता बड़ा बदलाव ला सकती है।",
    description:
      "SAHARA उपयोगी चीज़ें दान करने वाले लोगों को उनकी ज़रूरत वाले लोगों से जोड़ता है। हम भोजन, कपड़े और रोज़मर्रा की ज़रूरी चीज़ें समुदाय के साथ साझा करना आसान बनाते हैं।",
    primary: "दान देखें",
    secondary: "कैसे काम करता है",
    community: "समुदाय पर आधारित",
    communityText:
      "हम मानते हैं कि उपयोगी चीज़ें उन लोगों तक पहुँचनी चाहिए जिन्हें उनसे लाभ हो सकता है।",
    missionLabel: "हमारा उद्देश्य",
    missionTitle: "दान को आसान और सार्थक बनाना।",
    missionText:
      "हमारा उद्देश्य लोगों को अपने आसपास दूसरों के साथ उपयोगी चीज़ें साझा करने में मदद करना है। SAHARA दान खोजना आसान बनाकर सहयोग और सामुदायिक जुड़ाव को बढ़ावा देता है।",
    visionLabel: "हमारी सोच",
    visionTitle: "ऐसा समुदाय जहाँ हर उपयोगी चीज़ का उद्देश्य हो।",
    visionText:
      "हम ऐसे समुदाय की कल्पना करते हैं जहाँ लोग अपनी क्षमता के अनुसार मदद कर सकें, ज़रूरत पड़ने पर सहायता पा सकें और रोज़मर्रा की वस्तुओं को नया उपयोग दे सकें।",
    valuesLabel: "हमारे मार्गदर्शक सिद्धांत",
    valuesTitle: "SAHARA के केंद्र में हमारे मूल्य।",
    valuesText:
      "हर जुड़ाव, साझा की गई वस्तु और सहयोग के पीछे यही सिद्धांत हैं।",
    values: [
      {
        title: "करुणा",
        text: "हम मानते हैं कि छोटी-सी मदद भी किसी के रोज़मर्रा के जीवन को बेहतर बना सकती है।",
      },
      {
        title: "समुदाय",
        text: "हम आसपास उपलब्ध उपयोगी दान खोजने में मदद करके दान देने और लेने वालों को जोड़ते हैं।",
      },
      {
        title: "ज़िम्मेदार दान",
        text: "हम सही जानकारी, उपयुक्त वस्तुओं और सोच-समझकर समन्वय करने को बढ़ावा देते हैं।",
      },
      {
        title: "सुलभता",
        text: "हम उपयोगी वस्तुओं को खोजना और साझा करना सभी के लिए आसान बनाना चाहते हैं।",
      },
    ],
    storyLabel: "SAHARA क्यों ज़रूरी है",
    storyTitle: "अच्छी चीज़ों को दूसरा अवसर मिलना चाहिए।",
    storyText:
      "कई उपयोगी वस्तुएँ अपने पुराने मालिक के काम न आने पर भी किसी दूसरे के काम आ सकती हैं। SAHARA लोगों को ऐसी चीज़ें अपने समुदाय के साथ साझा करने का तरीका देता है।",
    storyText2:
      "भोजन और कपड़ों से लेकर रोज़मर्रा की ज़रूरतों तक, विचार सरल है: साझा करना आसान बनाएँ, लोगों को जोड़ें और सहयोग की भावना बढ़ाएँ।",
    points: [
      "उपयोगी वस्तुओं को नया उद्देश्य दें।",
      "लोगों को अपने समुदाय में उपलब्ध दान खोजने में मदद करें।",
      "सोच-समझकर साझा करने की प्रक्रिया आसान बनाएँ।",
    ],
    ctaLabel: "बदलाव का हिस्सा बनें",
    ctaTitle: "आपकी साझा की गई चीज़ किसी के लिए बहुत मायने रख सकती है।",
    ctaText:
      "SAHARA से जुड़ें और ऐसा समुदाय बनाने में मदद करें जहाँ उपयोगी चीज़ें ज़रूरतमंद लोगों तक पहुँचें।",
    join: "SAHARA से जुड़ें",
    browse: "दान देखें",
    back: "होम पर जाएँ",
    note: "मिलकर की गई छोटी मदद भी बड़ा बदलाव ला सकती है।",
  },
};

export default function AboutUs() {
  const [language, setLanguage] = useState<Language>(() =>
    localStorage.getItem("sahara-language") === "hi" ? "hi" : "en",
  );

  const c = CONTENT[language];

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

  const valueIcons = [Heart, Users, ShieldCheck, Globe2];

  return (
    <div className="min-h-screen bg-[#F7FAF7] ">
      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={{ nav: c.nav }}
      />

      <main className="overflow-hidden">
        {/* Hero */}
        <section className="relative border-b border-[#DCE6E1] bg-gradient-to-br from-[#EDF6EF] via-white to-[#E1F0E4]">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#D2EBDD]/50 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#B8DCC3]/35 blur-3xl" />

          <div className="relative mx-auto grid min-h-[590px] max-w-[1500px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-12 lg:py-16 xl:px-16">
            <div className="relative z-10 flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CFE4D4] bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#176C62] shadow-sm">
                <Sparkles className="h-4 w-4" />
                {c.eyebrow}
              </span>

              <h1 className="mt-6 max-w-2xl font-heading text-4xl font-bold leading-[1.12] tracking-tight text-[#17383D] sm:text-5xl xl:text-6xl">
                {c.title}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#63746C] sm:text-lg">
                {c.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link style={{ textDecoration: "none" }}
                  to="/donations"
                  className="inline-flex no-underline inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#07545A] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#07545A]/10 transition hover:-translate-y-0.5 hover:bg-[#06464B]"
                >
                  {c.primary}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link  style={{ textDecoration: "none" }}
                  to="/how-it-works"
                  className="inline-flex ... no-underline inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#C9DCD0] bg-white/90 px-6 py-3 text-sm font-bold text-[#176C62] transition hover:-translate-y-0.5 hover:bg-[#F0F7F1] "
                >
                  {c.secondary}
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-[#D8E5DA] pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDEEDD] text-[#176C62]">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#17383D]">
                    {c.community}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#728178]">
                    {c.communityText}
                  </p>
                </div>
              </div>
            </div>

            {/* Wide landscape feature card */}
            <div className="relative mx-auto w-full max-w-3xl lg:ml-auto lg:mr-0">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-[#C9E3D0]/50 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/90 bg-white/90 p-5 shadow-[0_24px_70px_rgba(23,56,61,0.12)] backdrop-blur sm:p-7 lg:p-8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7B9185]">
                      SAHARA
                    </p>
                    <h2 className="mt-2 font-heading text-xl font-bold text-[#17383D] sm:text-2xl">
                      {c.storyTitle}
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F4E9] text-[#176C62]">
                    <HandHeart className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex min-h-36 flex-col justify-between rounded-2xl bg-[#EAF4E9] p-4 sm:min-h-40 sm:p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#176C62]">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold text-[#17383D]">
                        {language === "en" ? "Share" : "साझा करें"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#63746C] sm:text-sm">
                        {language === "en"
                          ? "Useful essentials"
                          : "उपयोगी वस्तुएँ"}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-h-36 flex-col justify-between rounded-2xl bg-[#F8F0DD] p-4 sm:min-h-40 sm:p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-[#98763B]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold text-[#17383D]">
                        {language === "en" ? "Connect" : "जुड़ें"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#786B53] sm:text-sm">
                        {language === "en"
                          ? "People nearby"
                          : "आस-पास के लोग"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#E1EAE2] bg-white p-4 sm:p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4E9] text-[#176C62] sm:h-16 sm:w-16">
                    <HeartHandshake className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-bold text-[#17383D] sm:text-lg">
                      {language === "en"
                        ? "Everyday acts of kindness"
                        : "रोज़मर्रा की दयालुता"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#728178]">
                      {c.communityText}
                    </p>
                  </div>
                  <Heart className="hidden h-6 w-6 shrink-0 text-[#8AB99A] sm:block" />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F5F8F3] px-4 py-3">
                  <span className="flex items-center gap-2 text-xs font-medium text-[#526D62] sm:text-sm">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#24845E]" />
                    {language === "en"
                      ? "Give thoughtfully. Connect responsibly."
                      : "सोच-समझकर दान करें। ज़िम्मेदारी से जुड़ें।"}
                  </span>
                  <span className="text-xs font-bold tracking-wider text-[#9AB0A0]">
                    GIVE • SHARE • CARE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission and vision */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176C62]">
              OUR PURPOSE
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-[#17383D] sm:text-4xl">
              {language === "en"
                ? "Why we believe in sharing."
                : "हम साझा करने में विश्वास क्यों रखते हैं।"}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-[#D5E6D7] bg-gradient-to-br from-[#F0F7EF] to-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDEEDD] text-[#176C62]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#176C62]">
                {c.missionLabel}
              </p>
              <h3 className="mt-2 font-heading text-2xl font-bold text-[#17383D]">
                {c.missionTitle}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#63746C]">
                {c.missionText}
              </p>
            </article>

            <article className="rounded-3xl border border-[#E5E2CF] bg-gradient-to-br from-[#F9F6EA] to-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0E9CD] text-[#8A7136]">
                <Globe2 className="h-6 w-6" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#8A7136]">
                {c.visionLabel}
              </p>
              <h3 className="mt-2 font-heading text-2xl font-bold text-[#17383D]">
                {c.visionTitle}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#63746C]">
                {c.visionText}
              </p>
            </article>
          </div>
        </section>

        {/* Story */}
        <section className="border-y border-[#DCE6E1] bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176C62]">
                {c.storyLabel}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-[#17383D] sm:text-4xl">
                {c.storyTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#63746C]">
                {c.storyText}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#63746C]">
                {c.storyText2}
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#EAF4E9] via-[#F6F8F1] to-[#F8F0DD] p-5 sm:p-8">
              <div className="grid gap-3">
                {c.points.map((point, index) => {
                  const icons = [Recycle, MapPin, Heart];
                  const Icon = icons[index];

                  return (
                    <div
                      key={point}
                      className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7F4E8] text-[#176C62]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold leading-6 text-[#526D62]">
                        {point}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176C62]">
              {c.valuesLabel}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-[#17383D] sm:text-4xl">
              {c.valuesTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#728178] sm:text-base">
              {c.valuesText}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map((value, index) => {
              const Icon = valueIcons[index];

              return (
                <article
                  key={value.title}
                  className="group rounded-2xl border border-[#DCE6E1] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#B5CFC4] hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F4E8] text-[#176C62] transition group-hover:bg-[#07545A] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-[#17383D]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#728178]">
                    {value.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#064B50] via-[#07545A] to-[#176C62] px-6 py-10 text-white shadow-[0_18px_42px_rgba(7,84,90,0.15)] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[30px] border-white/5" />

            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#BFE2CE]">
                  {c.ctaLabel}
                </p>
                <h2 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                  {c.ctaTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#D4E6DE]">
                  {c.ctaText}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link style={{ textDecoration: "none" }}
                  to="/register"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#07545A] transition hover:bg-[#EDF5ED]"
                >
                  {c.join}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/donations"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  {c.browse}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#819087]">
             
             
          </div>
        </section>
      </main>

      <Footer t={{ nav: c.nav, footer: c.footer }} />
    </div>
  );
}
