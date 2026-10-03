import React, { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DonationCategories from "./components/DonationCategories";
import LocationSection from "./components/LocationSection";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import DonatorDashboard from "./pages/DonatorDashboard";

export default function App() {
  return <DonatorDashboard />;
}
/**
 
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

export default function App() {
  const [language, setLanguage] =
    useState<"en" | "hi">("en");

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((current) =>
      current === "en" ? "hi" : "en"
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF8F3] text-[#26332F]">

      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={t}
      />

      <main>
        <Hero
          language={language}
          t={t}
        />

        <DonationCategories t={t} />

        <LocationSection t={t} />

        <HowItWorks t={t} />

        <CTA t={t} />
      </main>

      <Footer t={t} />

    </div>
  );
}

* 
 */