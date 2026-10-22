import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import volunteersImg from "../components/image/volunteers.jpg";
import {
  GiftIcon,
  HandHeartIcon,
  HeartIcon,
  UsersIcon,
  SproutIcon,
  ShieldCheckIcon,
  LockIcon,
  ArrowRightIcon,
} from "../components/Icons/Icons";
import "../styles/ForgotPassword.css";

/* One icon per feature (same order as content.features) */
const FEATURE_ICONS = [HeartIcon, HandHeartIcon, SproutIcon, ShieldCheckIcon];

/* Small local icons used only on this page */
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

const MailIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} {...svgProps}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} {...svgProps}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const AlertIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const SpinnerIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} {...svgProps} className="fp-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function ForgotPassword() {
  const [language, setLanguage] = useState<"en" | "hi">(() => {
    const saved = localStorage.getItem("sahara-language");
    return saved === "hi" ? "hi" : "en";
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navContent = {
    en: {
      home: "Home",
      about: "About",
      how: "How it works",
      explore: "Explore donations",
      login: "Login",
      signup: "Sign up",
    },
    hi: {
      home: "होम",
      about: "हमारे बारे में",
      how: "कैसे काम करता है",
      explore: "दान देखें",
      login: "लॉगिन",
      signup: "साइन अप",
    },
  };

  const content = {
    en: {
       
    
      intro: "Forgot your password? It happens. Follow a simple, secure process to regain access to your account and continue making a difference in your community.",
      features: ["Support Communities", "Help People", "Build a Better Tomorrow", "Safe & Secure"],
      cardTitle: "Forgot Your Password?",
      cardSubtitle: "No worries! We'll help you get back into your account.",
      reset: "Reset",
      email: "Email Address",
      placeholder: "Enter your registered email",
      hint: "Make sure you use the email linked to your account.",
      sending: "Sending Reset Link...",
      send: "Send Reset Link",
      safe: "Your information is kept safe and secure.",
      remember: "Remember your password?",
      login: "Login",
      noAccount: "Don't have an account?",
      register: "Register",
      requestError: "Unable to process your request. Please try again.",
      fallbackMessage: "If an account exists with this email, you will receive a password reset link shortly.",
      fallbackError: "Something went wrong. Please try again.",
    },
    hi: {
     
      
      intro: "पासवर्ड भूल गए? कोई बात नहीं। अपने अकाउंट का दोबारा उपयोग करने और समुदाय की मदद जारी रखने के लिए इस आसान और सुरक्षित प्रक्रिया का पालन करें।",
      features: ["समुदायों का सहयोग करें", "लोगों की मदद करें", "बेहतर कल बनाएँ", "सुरक्षित और भरोसेमंद"],
      cardTitle: "पासवर्ड भूल गए?",
      cardSubtitle: "चिंता न करें! हम आपके अकाउंट तक दोबारा पहुँचने में मदद करेंगे।",
      reset: "रीसेट",
      email: "ईमेल पता",
      placeholder: "अपना पंजीकृत ईमेल दर्ज करें",
      hint: "अपने अकाउंट से जुड़े ईमेल पते का ही उपयोग करें।",
      sending: "रीसेट लिंक भेजा जा रहा है...",
      send: "रीसेट लिंक भेजें",
      safe: "आपकी जानकारी सुरक्षित रखी जाती है।",
      remember: "पासवर्ड याद है?",
      login: "लॉगिन करें",
      noAccount: "अकाउंट नहीं है?",
      register: "रजिस्टर करें",
      requestError: "आपका अनुरोध पूरा नहीं हो सका। कृपया दोबारा प्रयास करें।",
      fallbackMessage: "यदि इस ईमेल से अकाउंट जुड़ा है, तो आपको जल्द ही पासवर्ड रीसेट लिंक मिलेगा।",
      fallbackError: "कुछ गलत हो गया। कृपया दोबारा प्रयास करें।",
    },
  }[language];

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    localStorage.setItem("sahara-language", next);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const apiBaseUrl = (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      ).replace(/\/$/, "");

      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || content.requestError);
      }

      setMessage(data.message || content.fallbackMessage);
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : content.fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp">
      {/* Shared SAHARA Navbar */}
      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={{ nav: navContent[language] }}
      />

      <main className="fp__main">
        {/* Left: tagline + title + photo + features */}
        <section className="fp-intro">
           

           
          <p className="fp-intro__text">{content.intro}</p>

          <div className="fp-photo">
            <span className="fp-photo__frame" aria-hidden="true" />
            <img
              className="fp-photo__img"
              src={volunteersImg}
              alt="Volunteers packing donated food together"
            />
            <span className="fp-photo__badge" aria-hidden="true">
              <HandHeartIcon size={24} />
            </span>
            <span className="fp-photo__tags" aria-hidden="true">
              <GiftIcon size={16} />
              <HeartIcon size={16} />
              <UsersIcon size={16} />
            </span>
          </div>

          <ul className="fp-intro__features">
            {FEATURE_ICONS.map((Icon, index) => (
              <li key={index}>
                <span className="fp-intro__icon">
                  <Icon size={18} />
                </span>
                <span>{content.features[index]}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Right: forgot password card */}
        <section className="fp-card">
          <div className="fp-card__head">
            <div>
              <h2 className="fp-card__title">{content.cardTitle}</h2>
              <p className="fp-card__subtitle">{content.cardSubtitle}</p>
            </div>
            <span className="fp-card__badge">{content.reset}</span>
          </div>

          <form className="fp-form" onSubmit={handleSubmit}>
            {message && (
              <div role="status" className="fp-status fp-status--ok">
                <CheckIcon size={18} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div role="alert" className="fp-status fp-status--error">
                <AlertIcon size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="fp-field">
              <label htmlFor="reset-email">
                {content.email} <span className="fp-field__req">*</span>
              </label>

              <div className="fp-field__control">
                <span className="fp-field__icon" aria-hidden="true">
                  <MailIcon />
                </span>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content.placeholder}
                  autoComplete="email"
                  required
                />
              </div>

              <p className="fp-field__hint">{content.hint}</p>
            </div>

            <button type="submit" className="fp-submit" disabled={loading}>
              {loading ? (
                <>
                  <SpinnerIcon />
                  {content.sending}
                </>
              ) : (
                <>
                  {content.send} <ArrowRightIcon size={18} />
                </>
              )}
            </button>
          </form>

          <div className="fp-card__foot">
            <p className="fp-card__secure">
              <LockIcon size={14} /> {content.safe}
            </p>
            <p className="fp-card__link">
              {content.remember} <Link to="/login">{content.login}</Link>
            </p>
            <p className="fp-card__link">
              {content.noAccount} <Link to="/register">{content.register}</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
