import { useState } from "react";

import CTA from "./components/CTA";
import DonationCategories from "./components/DonationCategories";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import LocationSection from "./components/LocationSection";
import Navbar from "./components/Navbar";

const homepageContent = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      how: "How it works",
      explore: "Explore donations",
      login: "Login",
      signup: "Sign up",
    },
    hero: {
      badge: "Small help can make a big difference",
      title1: "Share what you can.",
      title2: "Help someone",
      nearby: "nearby.",
      description:
        "SAHARA connects people who want to donate useful things with people who need them. Share food, clothes and everyday essentials with your community.",
      donate: "Start donating",
      find: "Find donations",
    },
    stats: {
      donations: "Donations shared",
      people: "People helped",
      communities: "Communities",
      successful: "Successful deliveries",
    },
    categories: {
      label: "Give what you can",
      title: "Explore donations",
      explore: "Explore all",
      food: {
        title: "Food",
        description: "Share fresh meals and essential groceries with people nearby.",
        button: "Donate food",
      },
      clothes: {
        title: "Clothes",
        description: "Give good-quality clothing a second life in your community.",
        button: "Donate clothes",
      },
      medicine: {
        title: "Medicine",
        description: "Help make essential medicines available to those who need them.",
        button: "Coming soon",
        tag: "Coming soon",
      },
    },
    how: {
      label: "Simple and meaningful",
      title: "How SAHARA works",
      description:
        "A few simple steps bring useful donations to the people who need them.",
      step1: {
        title: "Share a donation",
        description: "Tell the community what useful items you can give.",
      },
      step2: {
        title: "Connect nearby",
        description: "Find a person or family who can use your donation.",
      },
      step3: {
        title: "Arrange delivery",
        description: "Coordinate a convenient and safe way to hand it over.",
      },
      step4: {
        title: "Make an impact",
        description: "Help useful things reach someone in your community.",
      },
    },
    location: {
      title: "Find help in your community",
      description: "Explore donations and people near your location.",
      placeholder: "Enter your city or pincode",
      search: "Search",
    },
    cta: {
      title: "A little help goes a long way",
      description:
        "Join your community in sharing useful things with people who need them.",
      button: "Join SAHARA",
    },
    footer: {
      tagline:
        "Connecting caring communities through sharing, support and everyday acts of kindness.",
    },
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      how: "कैसे काम करता है",
      explore: "दान देखें",
      login: "लॉगिन",
      signup: "साइन अप",
    },
    hero: {
      badge: "छोटी मदद बड़ा बदलाव ला सकती है",
      title1: "जो दे सकते हैं, साझा करें।",
      title2: "पास के किसी",
      nearby: "ज़रूरतमंद की मदद करें।",
      description:
        "SAHARA उपयोगी चीजें दान करने वालों को उनकी जरूरत वाले लोगों से जोड़ता है। खाना, कपड़े और रोजमर्रा की जरूरी चीजें अपने समुदाय के साथ साझा करें।",
      donate: "दान शुरू करें",
      find: "दान खोजें",
    },
    stats: {
      donations: "साझा किए दान",
      people: "लोगों की मदद",
      communities: "समुदाय",
      successful: "सफल डिलीवरी",
    },
    categories: {
      label: "जो दे सकते हैं, दें",
      title: "दान की श्रेणियां",
      explore: "सभी देखें",
      food: {
        title: "खाना",
        description: "ताजा भोजन और जरूरी राशन आसपास के लोगों के साथ साझा करें।",
        button: "खाना दान करें",
      },
      clothes: {
        title: "कपड़े",
        description: "अच्छी स्थिति के कपड़ों को समुदाय में नया उपयोग दें।",
        button: "कपड़े दान करें",
      },
      medicine: {
        title: "दवाइयां",
        description: "जरूरतमंद लोगों तक जरूरी दवाइयां पहुंचाने में मदद करें।",
        button: "जल्द आ रहा है",
        tag: "जल्द आ रहा है",
      },
    },
    how: {
      label: "आसान और सार्थक",
      title: "SAHARA कैसे काम करता है",
      description: "कुछ आसान कदमों से आपका दान जरूरतमंद लोगों तक पहुंचता है।",
      step1: {
        title: "दान साझा करें",
        description: "बताएं कि आप समुदाय को कौन-सी उपयोगी चीजें दे सकते हैं।",
      },
      step2: {
        title: "पास के लोगों से जुड़ें",
        description: "ऐसे व्यक्ति या परिवार को खोजें जिन्हें आपके दान की जरूरत है।",
      },
      step3: {
        title: "डिलीवरी तय करें",
        description: "सामान पहुंचाने का सुविधाजनक और सुरक्षित तरीका तय करें।",
      },
      step4: {
        title: "बदलाव लाएं",
        description: "उपयोगी चीजों को अपने समुदाय के लोगों तक पहुंचाएं।",
      },
    },
    location: {
      title: "अपने समुदाय में मदद खोजें",
      description: "अपने आसपास के दान और लोगों को देखें।",
      placeholder: "शहर या पिनकोड दर्ज करें",
      search: "खोजें",
    },
    cta: {
      title: "छोटी मदद भी बहुत काम आती है",
      description:
        "जरूरतमंद लोगों के साथ उपयोगी चीजें साझा करने के लिए अपने समुदाय से जुड़ें।",
      button: "SAHARA से जुड़ें",
    },
    footer: {
      tagline:
        "साझा करने, सहयोग और रोजमर्रा की दयालुता से समुदायों को जोड़ना।",
    },
  },
};

export default function App() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const t = homepageContent[language];

  return (
    <>
      <Navbar
        language={language}
        toggleLanguage={() =>
          setLanguage((current) => (current === "en" ? "hi" : "en"))
        }
        t={t}
      />
      <main>
        <Hero language={language} t={t} />
        <DonationCategories t={t} />
        <HowItWorks t={t} />
        <LocationSection t={t} />
        <CTA t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
