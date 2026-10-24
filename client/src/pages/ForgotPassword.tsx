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
      welcomeTitle: "Reset your SAHARA password.",
      welcomeText: "Enter your registered email address and we will send you a secure link to reset your password.",
      quote: "A little help goes a long way. Recover your account safely.",
      features: [
        "Email Reset Link",
        "15-Minute Expiry",
        "100% Free Recovery",
        "End-to-End Secure",
      ],
      cardTitle: "Password Recovery",
      cardSubtitle: "Enter your registered email to receive a recovery link",
      secureBadge: "SECURE",
      tabPhone: "Phone OTP",
      tabEmail: "Gmail / Email",
      step1: "1. Enter Phone",
      step2: "2. Verify OTP",
      step3: "3. New Password",
      phoneLabel: "Registered Mobile Number",
      phonePlaceholder: "Enter 10-digit mobile number",
      sendOtpBtn: "Send OTP via SMS",
      sendingOtp: "Sending OTP...",
      otpLabel: "6-Digit SMS OTP Code",
      otpPlaceholder: "Enter 6-digit OTP code",
      verifyOtpBtn: "Verify Code & Proceed",
      verifyingOtp: "Verifying Code...",
      changePhone: "← Change number",
      newPwdLabel: "New Password",
      newPwdPlaceholder: "At least 6 characters",
      confirmPwdLabel: "Confirm New Password",
      confirmPwdPlaceholder: "Re-enter new password",
      updatePwdBtn: "Update Password & Login",
      updatingPwd: "Updating Password...",
      emailLabel: "Registered Email Address",
      emailPlaceholder: "Enter your registered email",
      emailHelp: "We will send a 15-minute password reset link to this email.",
      sendLinkBtn: "Send Reset Link",
      sendingLink: "Sending Link...",
      secureNote: "Your information is kept safe and encrypted.",
      remember: "Remember your password?",
      login: "Login",
      noAccount: "Don't have an account?",
      register: "Register",
      requestError: "Unable to process your request. Please try again.",
      fallbackMessage: "If an account exists with this email, you will receive a password reset link shortly.",
      fallbackError: "Something went wrong. Please try again.",
    },
    hi: {
      welcomeTitle: "अपना सहारा पासवर्ड रीसेट करें।",
      welcomeText: "अपना पंजीकृत ईमेल दर्ज करें और हम पासवर्ड रीसेट करने के लिए एक सुरक्षित लिंक भेजेंगे।",
      quote: "सच्ची खुशी दूसरों की सेवा करने में है। अपना खाता सुरक्षित रूप से पुनर्प्राप्त करें।",
      features: [
        "ईमेल रीसेट लिंक",
        "15-मिनट की वैधता",
        "100% मुफ़्त रिकवरी",
        "सुरक्षित और एन्क्रिप्टेड",
      ],
      cardTitle: "खाता रिकवरी",
      cardSubtitle: "रीसेट लिंक प्राप्त करने के लिए अपना पंजीकृत ईमेल दर्ज करें",
      secureBadge: "सुरक्षित",
      tabPhone: "फोन OTP (टेस्ट)",
      tabEmail: "जीमेल / ईमेल",
      step1: "1. मोबाइल नंबर",
      step2: "2. OTP सत्यापन",
      step3: "3. नया पासवर्ड",
      phoneLabel: "पंजीकृत मोबाइल नंबर",
      phonePlaceholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
      sendOtpBtn: "SMS द्वारा OTP भेजें",
      sendingOtp: "OTP भेजा जा रहा है...",
      otpLabel: "6 अंकों का SMS OTP कोड",
      otpPlaceholder: "6 अंकों का OTP दर्ज करें",
      verifyOtpBtn: "OTP सत्यापित करें",
      verifyingOtp: "सत्यापन जारी है...",
      changePhone: "← नंबर बदलें",
      newPwdLabel: "नया पासवर्ड",
      newPwdPlaceholder: "कम से कम 6 अक्षर",
      confirmPwdLabel: "नए पासवर्ड की पुष्टि करें",
      confirmPwdPlaceholder: "नया पासवर्ड दोबारा दर्ज करें",
      updatePwdBtn: "पासवर्ड बदलें और लॉगिन करें",
      updatingPwd: "पासवर्ड बदला जा रहा है...",
      emailLabel: "पंजीकृत ईमेल पता",
      emailPlaceholder: "अपना पंजीकृत ईमेल दर्ज करें",
      emailHelp: "हम इस ईमेल पर 15 मिनट का पासवर्ड रीसेट लिंक भेजेंगे।",
      sendLinkBtn: "रीसेट लिंक भेजें",
      sendingLink: "लिंक भेजा जा रहा है...",
      secureNote: "आपकी जानकारी 256-बिट एन्क्रिप्शन से सुरक्षित है।",
      remember: "पासवर्ड याद आ गया?",
      loginLink: "लॉगिन करें →",
      noAccount: "खाता नहीं है?",
      registerLink: "रजिस्टर करें →",
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

          {/* Recovery Form - Email Reset */}

          {/* ========================================================= */}
          {/* METHOD 1: PHONE NUMBER (SMS OTP) RESET                   */}
          {/* ========================================================= */}
          {resetMethod === "phone" && (
            <div className="lg-form" style={{ paddingBottom: "10px" }}>
              {/* Step indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0 14px",
                  borderBottom: "1px solid var(--border)",
                  marginBottom: "16px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                <span style={{ color: phoneStep >= 1 ? "var(--teal-dark)" : "inherit", fontWeight: phoneStep === 1 ? 700 : 500 }}>
                  {t.step1}
                </span>
                <span>→</span>
                <span style={{ color: phoneStep >= 2 ? "var(--teal-dark)" : "inherit", fontWeight: phoneStep === 2 ? 700 : 500 }}>
                  {t.step2}
                </span>
                <span>→</span>
                <span style={{ color: phoneStep >= 3 ? "var(--teal-dark)" : "inherit", fontWeight: phoneStep === 3 ? 700 : 500 }}>
                  {t.step3}
                </span>
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
