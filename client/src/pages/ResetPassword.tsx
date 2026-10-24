import React, { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  EyeIcon,
  EyeOffIcon,
} from "../components/Icons/Icons";
import { http } from "../services/api/http";
import "../styles/login.css";

type Language = "en" | "hi";

const translations = {
  en: {
    welcomeTitle: "Safe & direct aid",
    welcomeText:
      "SAHARA links surplus food, clothes, and supplies to local communities in verified need.",
    quote: "Every reset protects a community helper",
    features: [
      "256-Bit SSL Security",
      "Instant Password Update",
      "Direct Verified Access",
      "Community Care Always",
    ],
    cardTitle: "Create New Password",
    cardSubtitle: "Enter a strong, fresh password for your SAHARA account.",
    secureBadge: "SECURE",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "At least 6 characters",
    confirmPasswordLabel: "Confirm New Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    submitBtn: "Update Password",
    loadingBtn: "Updating password…",
    redirecting: "Password reset successfully! Redirecting you to login…",
    missingTokenTitle: "Invalid or Missing Reset Link",
    missingTokenDesc:
      "This password reset link is invalid or has expired. Please request a new link.",
    requestNewLink: "Request a New Reset Link",
    shortPassword: "Password must be at least 6 characters long.",
    mismatch: "Passwords do not match. Please re-enter.",
    success: "Your password has been reset successfully!",
    failed: "Unable to reset your password. The link may have expired or is invalid.",
    remember: "Remember your password?",
    loginLink: "Back to login",
    secureNote: "Protected with end-to-end industry encryption",
  },
  hi: {
    welcomeTitle: "सुरक्षित और सीधा सहयोग",
    welcomeText:
      "सहारा अतिरिक्त भोजन और वस्त्र जरूरतमंद समुदायों तक पहुँचाने का सेतु है।",
    quote: "सुरक्षित अकाउंट, सुरक्षित सेवा",
    features: [
      "256-बिट एसएसएल सुरक्षा",
      "तुरंत पासवर्ड अपडेट",
      "सत्यापित अकाउंट एक्सेस",
      "समुदाय सेवा सदैव",
    ],
    cardTitle: "नया पासवर्ड बनाएँ",
    cardSubtitle: "अपने सहारा अकाउंट के लिए एक नया मजबूत पासवर्ड दर्ज करें।",
    secureBadge: "सुरक्षित",
    newPasswordLabel: "नया पासवर्ड",
    newPasswordPlaceholder: "कम से कम 6 अक्षर",
    confirmPasswordLabel: "नए पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "अपना पासवर्ड दोबारा लिखें",
    submitBtn: "पासवर्ड अपडेट करें",
    loadingBtn: "पासवर्ड अपडेट हो रहा है…",
    redirecting: "पासवर्ड सफलतापूर्वक रीसेट हो गया! आपको लॉगिन पेज पर भेजा जा रहा है…",
    missingTokenTitle: "अमान्य या पुराना रीसेट लिंक",
    missingTokenDesc:
      "यह पासवर्ड रीसेट लिंक अमान्य है या इसकी समय-सीमा समाप्त हो गई है। कृपया नया लिंक माँगें।",
    requestNewLink: "नया पासवर्ड रीसेट लिंक माँगें",
    shortPassword: "पासवर्ड में कम से कम 6 अक्षर होने चाहिए।",
    mismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    success: "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है!",
    failed: "पासवर्ड रीसेट नहीं हो सका। संभव है कि लिंक समाप्त हो गया हो।",
    remember: "पासवर्ड याद आ गया?",
    loginLink: "लॉगिन पर वापस जाएँ",
    secureNote: "एंड-टू-एंड सुरक्षा एन्क्रिप्शन द्वारा सुरक्षित",
  },
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("sahara-language");
    return saved === "hi" ? "hi" : "en";
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const t = translations[language];

  const toggleLanguage = () => {
    const nextLanguage: Language = language === "en" ? "hi" : "en";
    setLanguage(nextLanguage);
    localStorage.setItem("sahara-language", nextLanguage);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError(t.missingTokenDesc);
      return;
    }

    if (password.length < 6) {
      setError(t.shortPassword);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.mismatch);
      return;
    }

    setLoading(true);

    try {
      await http.post<{
        success: boolean;
        message: string;
      }>("/api/auth/reset-password", {
        token,
        password,
      });

      setSuccess(t.redirecting);

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <Navbar language={language} toggleLanguage={toggleLanguage} />

      <main className="login__main">
        {/* Left: welcome + photo + features */}
        <section className="lg-intro">
          <h2 className="lg-intro__title">{t.welcomeTitle}</h2>
          <p className="lg-intro__text">{t.welcomeText}</p>

          <div className="lg-photo">
            <span className="lg-photo__frame" aria-hidden="true" />
            <img
              className="lg-photo__img"
              src={volunteersImg}
              alt="Volunteers packing donated goods together"
            />
            <span className="lg-photo__shade" aria-hidden="true" />
            <span className="lg-photo__badge" aria-hidden="true">
              <HandHeartIcon size={24} />
            </span>
            <span className="lg-photo__tags" aria-hidden="true">
              <GiftIcon size={16} />
              <HeartIcon size={16} />
              <UsersIcon size={16} />
            </span>
            <p className="lg-photo__caption">“{t.quote}”</p>
          </div>

          <ul className="lg-intro__features">
            <li>
              <span className="lg-intro__icon">
                <ShieldCheckIcon size={18} />
              </span>
              <span>{t.features[0]}</span>
            </li>
            <li>
              <span className="lg-intro__icon">
                <HandHeartIcon size={18} />
              </span>
              <span>{t.features[1]}</span>
            </li>
            <li>
              <span className="lg-intro__icon">
                <SproutIcon size={18} />
              </span>
              <span>{t.features[2]}</span>
            </li>
            <li>
              <span className="lg-intro__icon">
                <LockIcon size={18} />
              </span>
              <span>{t.features[3]}</span>
            </li>
          </ul>
        </section>

        {/* Right: Reset Password Card */}
        <section className="lg-card">
          <div className="lg-card__head">
            <div>
              <h2 className="lg-card__title">{t.cardTitle}</h2>
              <p className="lg-card__subtitle">{t.cardSubtitle}</p>
            </div>
            <span className="lg-card__badge">{t.secureBadge}</span>
          </div>

          <div className="lg-form" style={{ paddingBottom: "10px" }}>
            {/* Missing Token Warning */}
            {!token && (
              <div
                style={{
                  margin: "0 0 16px",
                  padding: "14px 16px",
                  background: "#FFF4E5",
                  border: "1px solid #FFCC80",
                  color: "#B76E00",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  lineHeight: "1.5",
                }}
                role="alert"
              >
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                  ⚠️ {t.missingTokenTitle}
                </div>
                <div>{t.missingTokenDesc}</div>
                <div style={{ marginTop: "12px" }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      background: "#2F5547",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {t.requestNewLink} →
                  </Link>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div
                style={{
                  margin: "0 0 16px",
                  padding: "12px 16px",
                  background: "#E8F5E9",
                  border: "1px solid #A5D6A7",
                  color: "#1B5E20",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                role="status"
              >
                <span>✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <p className="lg-form__error" role="alert">
                {error}
              </p>
            )}

            {/* Form */}
            {Boolean(token) && !success && (
              <form onSubmit={handleSubmit} noValidate>
                {/* New Password */}
                <div className="lg-field">
                  <label htmlFor="password">{t.newPasswordLabel}</label>
                  <div className="lg-field__control">
                    <span className="lg-field__icon" aria-hidden="true">
                      <LockIcon size={18} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.newPasswordPlaceholder}
                    />
                    <button
                      type="button"
                      className="lg-field__toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label="Toggle new password visibility"
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="lg-field">
                  <label htmlFor="confirmPassword">{t.confirmPasswordLabel}</label>
                  <div className="lg-field__control">
                    <span className="lg-field__icon" aria-hidden="true">
                      <LockIcon size={18} />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
                    />
                    <button
                      type="button"
                      className="lg-field__toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="lg-submit"
                  style={{ width: "100%", marginTop: "12px" }}
                  disabled={loading}
                >
                  {loading ? (
                    t.loadingBtn
                  ) : (
                    <>
                      {t.submitBtn} <ArrowRightIcon size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Card Footer matching Login and ForgotPassword */}
          <div className="lg-card__foot">
            <p className="lg-card__secure">
              <LockIcon size={14} /> {t.secureNote}
            </p>
            <p className="lg-card__register">
              {t.remember} <Link to="/login">{t.loginLink}</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
