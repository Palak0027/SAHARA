import React, { useState } from "react";
import {
  HeartHandshake,
  ShieldCheck,
  Send,
  Mail,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const layoutContent = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      how: "How it works",
      explore: "Explore donations",
      contact: "Contact Us",
      login: "Login",
      signup: "Sign up",
    },
    footer: {
      tagline: "Give what you can, help someone nearby.",
      quickLinks: "Quick links",
      getInvolved: "Get involved",
      contact: "Contact",
      donate: "Donate",
      findDonations: "Find donations",
      join: "Join us",
      rights: "All rights reserved.",
      madeWith: "Made with care",
      location: "India",
    },
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      how: "कैसे काम करता है",
      explore: "दान देखें",
      contact: "संपर्क करें",
      login: "लॉगिन",
      signup: "साइन अप",
    },
    footer: {
      tagline: "अपनी क्षमता के अनुसार दें, पास के किसी व्यक्ति की मदद करें।",
      quickLinks: "त्वरित लिंक",
      getInvolved: "हमसे जुड़ें",
      contact: "संपर्क",
      donate: "दान करें",
      findDonations: "दान खोजें",
      join: "हमसे जुड़ें",
      rights: "सर्वाधिकार सुरक्षित।",
      madeWith: "प्यार और देखभाल से बनाया गया",
      location: "भारत",
    },
  },
};

const content = {
  en: {
    badge: "WE'RE HERE FOR YOU",
    title: "Let's talk.",
    subtitle: "Questions, feedback, or ideas? We'd love to hear from you.",
    privacy: "Your information stays private.",
    formTitle: "Send us a message",
    formSubtitle: "Fill in the details and our team can assist you.",
    name: "Full name",
    email: "Email address",
    subject: "What is this about?",
    message: "Your message",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "you@example.com",
    messagePlaceholder: "Tell us how we can help...",
    choose: "Select a topic",
    options: [
      "General enquiry",
      "Donation support",
      "Request assistance",
      "Volunteering",
      "Partnership",
      "Other",
    ],
    send: "Send message",
    sending: "Sending...",
    helpTitle: "How can we help?",
    helpText:
      "Whether you want to donate, need assistance, or want to collaborate, we're listening.",
    response: "We'd love to hear from you",
    responseText:
      "Every message is an opportunity to make our community stronger.",
    success: "Your message was sent successfully. Thank you for contacting SAHARA!",
    error: "Unable to send your message. Please try again.",
    required: "Please complete all fields before submitting.",
    invalidEmail: "Please enter a valid email address.",
    imageAlt: "Community members helping one another",
  },
  hi: {
    badge: "हम आपकी मदद के लिए यहाँ हैं",
    title: "आइए, बात करें।",
    subtitle: "कोई सवाल, सुझाव या विचार है? हमें आपसे सुनकर खुशी होगी।",
    privacy: "आपकी जानकारी निजी रखी जाएगी।",
    formTitle: "हमें संदेश भेजें",
    formSubtitle: "जानकारी भरें और हमारी टीम आपकी सहायता करेगी।",
    name: "पूरा नाम",
    email: "ईमेल पता",
    subject: "आप किस विषय में संपर्क कर रहे हैं?",
    message: "आपका संदेश",
    namePlaceholder: "अपना पूरा नाम लिखें",
    emailPlaceholder: "you@example.com",
    messagePlaceholder: "बताएँ कि हम आपकी कैसे मदद कर सकते हैं...",
    choose: "विषय चुनें",
    options: [
      "सामान्य पूछताछ",
      "दान संबंधी सहायता",
      "सहायता का अनुरोध",
      "स्वयंसेवा",
      "साझेदारी",
      "अन्य",
    ],
    send: "संदेश भेजें",
    sending: "भेजा जा रहा है...",
    helpTitle: "हम आपकी कैसे मदद करें?",
    helpText:
      "दान करना हो, सहायता चाहिए या साथ मिलकर काम करना हो, हम आपकी बात सुनने के लिए तैयार हैं।",
    response: "हमें आपसे सुनकर खुशी होगी",
    responseText:
      "हर संदेश हमारे समुदाय को और मजबूत बनाने का एक अवसर है।",
    success: "आपका संदेश सफलतापूर्वक भेज दिया गया। SAHARA से संपर्क करने के लिए धन्यवाद!",
    error: "संदेश नहीं भेजा जा सका। कृपया दोबारा प्रयास करें।",
    required: "कृपया भेजने से पहले सभी फ़ील्ड भरें।",
    invalidEmail: "कृपया सही ईमेल पता दर्ज करें।",
    imageAlt: "एक-दूसरे की मदद करते समुदाय के लोग",
  },
};

const ContactUs: React.FC = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const t = content[language];
  const layoutT = layoutContent[language];

  const toggleLanguage = () => {
    setLanguage((previous) => (previous === "en" ? "hi" : "en"));
  };

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setStatus(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStatus(null);

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      setStatus({ type: "error", message: t.required });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: "error", message: t.invalidEmail });
      return;
    }

    try {
      setLoading(true);

      const baseUrl = (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      ).replace(/\/$/, "");

      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || t.error);
      }

      setStatus({
        type: "success",
        message: result?.message || t.success,
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : t.error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9f6]">
      {/* Existing SAHARA navigation */}
      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={layoutT}
      />

      <main
        lang={language}
        className="bg-[#f6f9f6] text-[#193d30]"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Hero and landscape image */}
          <section className="grid items-center gap-5 md:grid-cols-2 md:gap-8">
            <div className="py-2">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e3f2e6] px-3 py-1.5 text-xs font-bold tracking-wide text-[#24734c]">
                <HeartHandshake size={15} />
                {t.badge}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#193d30] sm:text-4xl">
                {t.title}
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#718477] sm:text-base">
                {t.subtitle}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#dce7de] bg-white px-3 py-2 text-sm text-[#466b54]">
                <ShieldCheck size={18} className="shrink-0" />
                <span>{t.privacy}</span>
              </div>
            </div>

            <div className="h-48 overflow-hidden rounded-2xl border border-[#dce7de] bg-[#e6efe7] sm:h-56 md:h-60">
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=85"
                alt={t.imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </section>

          {/* Help panel and contact form */}
          <section
            id="contact-form"
            className="mt-7 grid items-start gap-5 lg:mt-8 lg:grid-cols-[0.7fr_1.5fr]"
          >
            <aside className="rounded-2xl bg-[#174d39] p-5 text-white sm:p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <MessageCircle size={21} />
              </div>

              <h2 className="text-2xl font-bold">{t.helpTitle}</h2>

              <p className="mt-2 text-sm leading-6 text-[#e0eee4]">
                {t.helpText}
              </p>

              <div className="mt-5 border-t border-white/20 pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Mail size={17} />
                  {t.response}
                </div>
                <p className="mt-2 text-xs leading-5 text-[#d2e4d8]">
                  {t.responseText}
                </p>
              </div>
            </aside>

            <div className="rounded-2xl border border-[#dfe8e0] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-bold text-[#193d30]">
                {t.formTitle}
              </h2>
              <p className="mt-1 text-sm text-[#78887c]">
                {t.formSubtitle}
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-sm font-medium text-[#31513d]"
                    >
                      {t.name} *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder={t.namePlaceholder}
                      className="w-full rounded-lg border border-[#dce5dd] px-3 py-2.5 text-sm outline-none transition placeholder:text-[#a0aaa2] focus:border-[#4b9567] focus:ring-2 focus:ring-[#4b9567]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-sm font-medium text-[#31513d]"
                    >
                      {t.email} *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder={t.emailPlaceholder}
                      className="w-full rounded-lg border border-[#dce5dd] px-3 py-2.5 text-sm outline-none transition placeholder:text-[#a0aaa2] focus:border-[#4b9567] focus:ring-2 focus:ring-[#4b9567]/15"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1.5 block text-sm font-medium text-[#31513d]"
                  >
                    {t.subject} *
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={(event) =>
                      updateField("subject", event.target.value)
                    }
                    className="w-full rounded-lg border border-[#dce5dd] bg-white px-3 py-2.5 text-sm text-[#31513d] outline-none focus:border-[#4b9567] focus:ring-2 focus:ring-[#4b9567]/15"
                  >
                    <option value="">{t.choose}</option>
                    {content.en.options.map((option, index) => (
                      <option key={option} value={option}>
                        {t.options[index]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-sm font-medium text-[#31513d]"
                  >
                    {t.message} *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    minLength={5}
                    maxLength={3000}
                    rows={4}
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    placeholder={t.messagePlaceholder}
                    className="w-full resize-y rounded-lg border border-[#dce5dd] px-3 py-2.5 text-sm outline-none transition placeholder:text-[#a0aaa2] focus:border-[#4b9567] focus:ring-2 focus:ring-[#4b9567]/15"
                  />
                </div>

                {status && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                      status.type === "success"
                        ? "bg-[#eaf6ec] text-[#216a40]"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0"
                      />
                    ) : (
                      <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                      />
                    )}
                    <span>{status.message}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1c6848] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15543a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={16} />
                    {loading ? t.sending : t.send}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Existing SAHARA footer */}
      <Footer t={layoutT} />
    </div>
  );
};

export default ContactUs;
