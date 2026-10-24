import React, { useState, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { firebaseAuth, isFirebaseConfigured } from "../services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import "../styles/login.css";

/* Phone Icon component matching Login UserIcon */
const PhoneFieldIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailFieldIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const KeyFieldIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
    <path d="m21 2-9.6 9.6" />
    <circle cx="7.5" cy="15.5" r="5.5" />
  </svg>
);

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState<"en" | "hi">(() => {
    const saved = localStorage.getItem("sahara-language");
    return saved === "hi" ? "hi" : "en";
  });

  const [resetMethod, setResetMethod] = useState<"phone" | "email">("email");

  // Email Flow States
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  // Phone OTP Flow States (Step 1 = Enter Phone, Step 2 = Enter OTP, Step 3 = Set New Password)
  const [phoneStep, setPhoneStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const apiBaseUrl = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
  ).replace(/\/$/, "");

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    localStorage.setItem("sahara-language", next);
  };

  // Translations
  const t = {
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
      loginLink: "Login →",
      noAccount: "Don't have an account?",
      registerLink: "Register →",
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

  // ==========================================
  // METHOD 1: EMAIL-BASED RESET
  // ==========================================
  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailMessage("");
    setEmailError("");
    setEmailLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to process your request. Please try again."
        );
      }

      setEmailMessage(
        data.message ||
        "If an account exists with this email, you will receive a password reset link shortly."
      );
      setEmail("");
    } catch (err: unknown) {
      setEmailError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setEmailLoading(false);
    }
  };

  // ==========================================
  // METHOD 2: PHONE OTP-BASED RESET
  // ==========================================
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setPhoneMessage("");

    const cleanPhone = phone.trim();
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setPhoneLoading(true);

    try {
      const checkRes = await fetch(`${apiBaseUrl}/api/auth/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const checkData = await checkRes.json();
      if (!checkRes.ok) {
        throw new Error(
          checkData.message || "No registered active account found with this number."
        );
      }

      setUserName(checkData.name || "");

      if (isFirebaseConfigured && firebaseAuth) {
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            firebaseAuth,
            "recaptcha-container",
            {
              size: "invisible",
              callback: () => { },
            }
          );
        }

        const formattedPhone = `+91${cleanPhone}`;
        const confirmation = await signInWithPhoneNumber(
          firebaseAuth,
          formattedPhone,
          recaptchaVerifierRef.current
        );
        confirmationResultRef.current = confirmation;
        setPhoneMessage(`SMS OTP sent successfully to +91 ${cleanPhone}.`);
      } else {
        setPhoneMessage(
          `Account verified for ${checkData.name || "User"}! (Firebase test mode — Demo OTP: 123456)`
        );
      }

      setPhoneStep(2);
    } catch (err: unknown) {
      setPhoneError(
        err instanceof Error ? err.message : "Failed to send OTP. Please try again."
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setPhoneMessage("");

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      setPhoneError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setPhoneLoading(true);

    try {
      if (isFirebaseConfigured && confirmationResultRef.current) {
        await confirmationResultRef.current.confirm(cleanOtp);
      } else {
        if (cleanOtp !== "123456") {
          throw new Error("Invalid OTP code. Please enter the correct code (or 123456 in test mode).");
        }
      }

      setPhoneMessage("Mobile number verified successfully! Please enter your new password.");
      setPhoneStep(3);
    } catch (err: unknown) {
      setPhoneError(
        err instanceof Error ? err.message : "Incorrect or expired OTP. Please try again."
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleResetPasswordWithPhone = async (e: FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setPhoneMessage("");

    if (newPassword.length < 6) {
      setPhoneError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPhoneError("Passwords do not match. Please re-enter.");
      return;
    }

    setPhoneLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setPhoneMessage("Password reset successfully! Redirecting you to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: unknown) {
      setPhoneError(
        err instanceof Error ? err.message : "Failed to update password. Please try again."
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="login">
      {/* Invisible container for Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>

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

        {/* Right: Recovery Card */}
        <section className="lg-card">
          <div className="lg-card__head">
            <div>
              <h2 className="lg-card__title">{t.cardTitle}</h2>
              <p className="lg-card__subtitle">{t.cardSubtitle}</p>
            </div>
            <span className="lg-card__badge">{t.secureBadge}</span>
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

              {phoneMessage && (
                <div
                  style={{
                    margin: "0 0 14px",
                    padding: "10px 14px",
                    background: "#E8F5E9",
                    border: "1px solid #A5D6A7",
                    color: "#1B5E20",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                  role="status"
                >
                  ✓ {phoneMessage}
                </div>
              )}

              {phoneError && (
                <p className="lg-form__error" role="alert">
                  {phoneError}
                </p>
              )}

              {/* STEP 1: Enter Phone */}
              {phoneStep === 1 && (
                <form onSubmit={handleSendOtp} noValidate>
                  <div className="lg-field">
                    <label htmlFor="phone">{t.phoneLabel}</label>
                    <div className="lg-field__control">
                      <span className="lg-field__icon" aria-hidden="true">
                        <PhoneFieldIcon />
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder={t.phonePlaceholder}
                        required
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="lg-submit"
                    style={{ width: "100%" }}
                    disabled={phoneLoading}
                  >
                    {phoneLoading ? (
                      t.sendingOtp
                    ) : (
                      <>
                        {t.sendOtpBtn} <ArrowRightIcon size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: Enter OTP */}
              {phoneStep === 2 && (
                <form onSubmit={handleVerifyOtp} noValidate>
                  <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                      {userName ? `Account: ${userName}` : `+91 ${phone}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhoneStep(1)}
                      style={{
                        background: "none",
                        border: 0,
                        color: "var(--teal)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {t.changePhone}
                    </button>
                  </div>

                  <div className="lg-field">
                    <label htmlFor="otp">{t.otpLabel}</label>
                    <div className="lg-field__control">
                      <span className="lg-field__icon" aria-hidden="true">
                        <KeyFieldIcon />
                      </span>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder={t.otpPlaceholder}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="lg-submit"
                    style={{ width: "100%" }}
                    disabled={phoneLoading}
                  >
                    {phoneLoading ? (
                      t.verifyingOtp
                    ) : (
                      <>
                        {t.verifyOtpBtn} <ArrowRightIcon size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 3: Enter New Password */}
              {phoneStep === 3 && (
                <form onSubmit={handleResetPasswordWithPhone} noValidate>
                  <div className="lg-field">
                    <label htmlFor="newPassword">{t.newPwdLabel}</label>
                    <div className="lg-field__control">
                      <span className="lg-field__icon" aria-hidden="true">
                        <LockIcon size={18} />
                      </span>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t.newPwdPlaceholder}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="lg-field__toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="lg-field">
                    <label htmlFor="confirmPassword">{t.confirmPwdLabel}</label>
                    <div className="lg-field__control">
                      <span className="lg-field__icon" aria-hidden="true">
                        <LockIcon size={18} />
                      </span>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.confirmPwdPlaceholder}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="lg-submit"
                    style={{ width: "100%" }}
                    disabled={phoneLoading}
                  >
                    {phoneLoading ? (
                      t.updatingPwd
                    ) : (
                      <>
                        {t.updatePwdBtn} <ArrowRightIcon size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* METHOD 2: EMAIL-BASED RESET                               */}
          {/* ========================================================= */}
          {resetMethod === "email" && (
            <div className="lg-form" style={{ paddingBottom: "10px" }}>
              {emailMessage && (
                <div
                  style={{
                    margin: "0 0 14px",
                    padding: "10px 14px",
                    background: "#E8F5E9",
                    border: "1px solid #A5D6A7",
                    color: "#1B5E20",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                  role="status"
                >
                  ✓ {emailMessage}
                </div>
              )}

              {emailError && (
                <p className="lg-form__error" role="alert">
                  {emailError}
                </p>
              )}

              <form onSubmit={handleEmailSubmit} noValidate>
                <div className="lg-field">
                  <label htmlFor="email">{t.emailLabel}</label>
                  <div className="lg-field__control">
                    <span className="lg-field__icon" aria-hidden="true">
                      <MailFieldIcon />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "4px" }}>
                    {t.emailHelp}
                  </span>
                </div>

                <button
                  type="submit"
                  className="lg-submit"
                  style={{ width: "100%", marginTop: "10px" }}
                  disabled={emailLoading}
                >
                  {emailLoading ? (
                    t.sendingLink
                  ) : (
                    <>
                      {t.sendLinkBtn} <ArrowRightIcon size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Card Footer matching Login */}
          <div className="lg-card__foot">
            <p className="lg-card__register">
              {t.remember} <Link to="/login">{t.loginLink}</Link>
            </p>
            <p className="lg-card__register">
              {t.noAccount} <Link to="/register">{t.registerLink}</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
