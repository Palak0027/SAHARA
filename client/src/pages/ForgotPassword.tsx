import { useState, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { firebaseAuth, isFirebaseConfigured } from "../services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [resetMethod, setResetMethod] = useState<"email" | "phone">("phone");

  // Email Flow States
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  // Phone OTP Flow States
  // Step 1 = Enter Phone, Step 2 = Enter OTP, Step 3 = Set New Password
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

  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "hi" : "en"));

  const pageContent = {
    en: {
      tagline: "A little help goes a long way",
      title: "Reset your SAHARA password.",
      remember: "Remember your password?",
      login: "Login →",
      noAccount: "Don't have an account?",
      register: "Register →",
    },
    hi: {
      tagline: "छोटी मदद बड़ा बदलाव ला सकती है",
      title: "अपना सहारा पासवर्ड रीसेट करें।",
      remember: "पासवर्ड याद है?",
      login: "लॉगिन →",
      noAccount: "खाता नहीं है?",
      register: "रजिस्टर →",
    },
  };
  const content = pageContent[language];

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
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setEmailLoading(false);
    }
  };

  // ==========================================
  // METHOD 2: PHONE OTP-BASED RESET
  // ==========================================

  // Step 1: Check phone in DB & Send OTP
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
      // 1. Verify that user exists in SAHARA database first
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

      // 2. Send SMS OTP via Firebase if configured
      if (isFirebaseConfigured && firebaseAuth) {
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            firebaseAuth,
            "recaptcha-container",
            {
              size: "invisible",
              callback: () => {
                // reCAPTCHA solved
              },
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
        // Fallback / Development mode message
        setPhoneMessage(
          `Account verified for ${checkData.name || "User"}! (Firebase credentials not yet in client/.env — Test OTP: 123456)`
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

  // Step 2: Verify OTP code
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
        // Demo OTP verification fallback
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

  // Step 3: Update New Password
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
    <div className="min-h-screen bg-[#F4F9F6] text-[#26343A]">
      {/* Invisible container for Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Shared SAHARA Navbar */}
      <Navbar
        language={language}
        toggleLanguage={toggleLanguage}
        t={{ nav: navContent[language] }}
      />

      {/* Main Content */}
      <main className="mx-auto grid min-h-[calc(100vh-145px)] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
        {/* Left Branding Section */}
        <section className="mx-auto w-full max-w-xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#CDE6D3] bg-white px-4 py-2 text-sm font-semibold text-[#287B53] shadow-sm">
            <span>💚</span>
            {content.tagline}
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#086474] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#647780] sm:text-lg">
            Forgot your password? Choose your preferred recovery method: Instant SMS OTP on your phone or a secure reset link to your email.
          </p>

          {/* Donation Illustration */}
          <div className="relative mx-auto my-9 flex h-64 max-w-sm items-center justify-center sm:h-72">
            <div className="absolute h-56 w-56 rounded-full border-2 border-dashed border-[#9CD5D6] sm:h-64 sm:w-64" />
            <div className="absolute h-48 w-48 rounded-full bg-[#DFF1E4] sm:h-56 sm:w-56" />

            <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full border-[5px] border-[#4C9A42] bg-white shadow-[0_18px_40px_rgba(8,100,116,0.15)] sm:h-48 sm:w-48">
              <span className="text-6xl sm:text-7xl">🤲</span>
              <span className="mt-1 text-2xl font-black tracking-tight text-[#086474]">
                SAHARA
              </span>
              <span className="mt-1 text-center text-[10px] font-semibold leading-4 text-[#287B53] sm:text-xs">
                Give What You Can,
                <br />
                Get What You Need
              </span>
            </div>

            <span className="absolute left-5 top-12 flex h-12 w-12 items-center justify-center rounded-full border border-[#DCE8E1] bg-white text-2xl shadow-md sm:left-8">
              📦
            </span>
            <span className="absolute right-5 top-16 flex h-12 w-12 items-center justify-center rounded-full border border-[#DCE8E1] bg-white text-2xl shadow-md sm:right-8">
              👕
            </span>
            <span className="absolute bottom-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-[#DCE8E1] bg-white text-2xl shadow-md">
              🍲
            </span>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["📱", "Instant Phone OTP"],
              ["✉️", "Email Link Option"],
              ["🌱", "100% Free Recovery"],
              ["🛡️", "Safe & Secure"],
            ].map(([icon, title]) => (
              <div
                key={title}
                className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-[#DCE8E1] bg-white/85 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5EA] text-xl">
                  {icon}
                </span>
                <span className="text-sm font-semibold text-[#26343A] sm:text-base">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Forgot Password Card */}
        <section className="mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-[28px] border border-[#DCE8E1] bg-white shadow-[0_24px_65px_rgba(8,100,116,0.12)]">
            {/* Gradient Top Border */}
            <div className="h-1.5 bg-gradient-to-r from-[#4CAF50] via-[#168F91] to-[#086474]" />

            <div className="p-6 sm:p-9 lg:p-10">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#29353B] sm:text-3xl">
                    Password Recovery
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#71818A]">
                    Choose how you want to reset your password
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-[#B7DFBC] bg-[#EAF6EC] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#086474]">
                  Secure
                </span>
              </div>

              {/* Recovery Method Tabs */}
              <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#EEF5F1] p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setResetMethod("phone");
                    setPhoneError("");
                    setPhoneMessage("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${resetMethod === "phone"
                      ? "bg-white text-[#086474] shadow-sm"
                      : "text-[#62777E] hover:text-[#26343A]"
                    }`}
                >
                  <span>📱</span>
                  Phone OTP (Free)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetMethod("email");
                    setEmailError("");
                    setEmailMessage("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${resetMethod === "email"
                      ? "bg-white text-[#086474] shadow-sm"
                      : "text-[#62777E] hover:text-[#26343A]"
                    }`}
                >
                  <span>✉️</span>
                  Gmail / Email
                </button>
              </div>

              {/* ========================================== */}
              {/* TAB 1: PHONE NUMBER (SMS OTP) RESET       */}
              {/* ========================================== */}
              {resetMethod === "phone" && (
                <div>
                  {phoneMessage && (
                    <div
                      role="status"
                      className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800"
                    >
                      <span className="mr-2">✓</span>
                      {phoneMessage}
                    </div>
                  )}

                  {phoneError && (
                    <div
                      role="alert"
                      className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                    >
                      {phoneError}
                    </div>
                  )}

                  {/* Step Progress indicator */}
                  <div className="mb-6 flex items-center justify-between border-b border-[#E8EFEA] pb-4 text-xs font-semibold text-[#71818A]">
                    <span className={phoneStep >= 1 ? "text-[#086474] font-bold" : ""}>
                      1. Enter Phone
                    </span>
                    <span>→</span>
                    <span className={phoneStep >= 2 ? "text-[#086474] font-bold" : ""}>
                      2. Verify OTP
                    </span>
                    <span>→</span>
                    <span className={phoneStep >= 3 ? "text-[#086474] font-bold" : ""}>
                      3. New Password
                    </span>
                  </div>

                  {/* STEP 1: Enter Phone */}
                  {phoneStep === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                      <div>
                        <label
                          htmlFor="reset-phone"
                          className="mb-2 block text-sm font-semibold text-[#34434A]"
                        >
                          Registered Mobile Number <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center rounded-2xl border border-[#D9E5E9] bg-[#E9F1FD] px-4 transition focus-within:border-[#0B8790] focus-within:ring-4 focus-within:ring-[#0B8790]/10">
                          <span className="mr-2 text-sm font-bold text-[#4B636E]">
                            +91
                          </span>
                          <input
                            id="reset-phone"
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 10-digit mobile number"
                            required
                            className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#26343A] outline-none placeholder:text-[#8A9AA5] sm:text-base"
                          />
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#71818A]">
                          We will check your registered account and send a 6-digit OTP.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={phoneLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#078C96] to-[#075A6A] px-5 py-4 font-bold text-white shadow-[0_12px_22px_rgba(7,105,119,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(7,105,119,0.28)] focus:outline-none focus:ring-4 focus:ring-[#078C96]/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {phoneLoading ? "Verifying & Sending OTP..." : "Send Free SMS OTP →"}
                      </button>
                    </form>
                  )}

                  {/* STEP 2: Enter OTP */}
                  {phoneStep === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label
                            htmlFor="reset-otp"
                            className="text-sm font-semibold text-[#34434A]"
                          >
                            Enter 6-Digit OTP <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setPhoneStep(1);
                              setPhoneError("");
                              setPhoneMessage("");
                            }}
                            className="text-xs font-semibold text-[#078C96] hover:underline"
                          >
                            Change Number
                          </button>
                        </div>

                        <div className="flex items-center rounded-2xl border border-[#D9E5E9] bg-[#E9F1FD] px-4 transition focus-within:border-[#0B8790] focus-within:ring-4 focus-within:ring-[#0B8790]/10">
                          <span className="mr-3 text-lg" aria-hidden="true">
                            🔑
                          </span>
                          <input
                            id="reset-otp"
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 6-digit code"
                            required
                            autoFocus
                            className="min-w-0 flex-1 bg-transparent py-4 text-center tracking-[0.3em] text-lg font-bold text-[#26343A] outline-none placeholder:tracking-normal placeholder:text-sm placeholder:text-[#8A9AA5]"
                          />
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#71818A]">
                          OTP was sent to mobile: <strong>+91 {phone}</strong> {userName && `(${userName})`}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={phoneLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#078C96] to-[#075A6A] px-5 py-4 font-bold text-white shadow-[0_12px_22px_rgba(7,105,119,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(7,105,119,0.28)] focus:outline-none focus:ring-4 focus:ring-[#078C96]/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {phoneLoading ? "Verifying OTP..." : "Verify OTP Code →"}
                      </button>
                    </form>
                  )}

                  {/* STEP 3: Enter New Password */}
                  {phoneStep === 3 && (
                    <form onSubmit={handleResetPasswordWithPhone} className="space-y-5">
                      <div>
                        <label
                          htmlFor="new-pwd"
                          className="mb-2 block text-sm font-semibold text-[#34434A]"
                        >
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center rounded-2xl border border-[#D9E5E9] bg-[#E9F1FD] px-4 transition focus-within:border-[#0B8790] focus-within:ring-4 focus-within:ring-[#0B8790]/10">
                          <span className="mr-3 text-lg" aria-hidden="true">
                            🔒
                          </span>
                          <input
                            id="new-pwd"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                            minLength={6}
                            className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#26343A] outline-none placeholder:text-[#8A9AA5] sm:text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs font-semibold text-[#078C96] hover:underline"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="confirm-pwd"
                          className="mb-2 block text-sm font-semibold text-[#34434A]"
                        >
                          Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center rounded-2xl border border-[#D9E5E9] bg-[#E9F1FD] px-4 transition focus-within:border-[#0B8790] focus-within:ring-4 focus-within:ring-[#0B8790]/10">
                          <span className="mr-3 text-lg" aria-hidden="true">
                            🔒
                          </span>
                          <input
                            id="confirm-pwd"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your new password"
                            required
                            minLength={6}
                            className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#26343A] outline-none placeholder:text-[#8A9AA5] sm:text-base"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={phoneLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#287B53] to-[#1E6040] px-5 py-4 font-bold text-white shadow-[0_12px_22px_rgba(40,123,83,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(40,123,83,0.28)] focus:outline-none focus:ring-4 focus:ring-[#287B53]/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {phoneLoading ? "Updating Password..." : "Update Password & Login →"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB 2: EMAIL-BASED RESET                   */}
              {/* ========================================== */}
              {resetMethod === "email" && (
                <div>
                  {emailMessage && (
                    <div
                      role="status"
                      className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800"
                    >
                      <span className="mr-2">✓</span>
                      {emailMessage}
                    </div>
                  )}

                  {emailError && (
                    <div
                      role="alert"
                      className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                    >
                      {emailError}
                    </div>
                  )}

                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="mb-2 block text-sm font-semibold text-[#34434A]"
                      >
                        Registered Email Address <span className="text-red-500">*</span>
                      </label>

                      <div className="flex items-center gap-3 rounded-2xl border border-[#D9E5E9] bg-[#E9F1FD] px-4 transition focus-within:border-[#0B8790] focus-within:ring-4 focus-within:ring-[#0B8790]/10">
                        <span className="text-lg" aria-hidden="true">
                          ✉️
                        </span>

                        <input
                          id="reset-email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your registered email"
                          autoComplete="email"
                          required
                          className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#26343A] outline-none placeholder:text-[#8A9AA5] sm:text-base"
                        />
                      </div>

                      <p className="mt-2 text-xs leading-5 text-[#71818A]">
                        We will send a 15-minute password reset link to this email.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#078C96] to-[#075A6A] px-5 py-4 font-bold text-white shadow-[0_12px_22px_rgba(7,105,119,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(7,105,119,0.28)] focus:outline-none focus:ring-4 focus:ring-[#078C96]/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {emailLoading ? "Sending Reset Link..." : "Send Reset Link →"}
                    </button>
                  </form>
                </div>
              )}

              <div className="my-7 border-t border-[#E1EAE5]" />

              {/* Card Footer */}
              <div className="space-y-3 text-center">
                <p className="text-sm text-[#71818A]">
                  <span aria-hidden="true">🔒</span> Your information is kept safe and encrypted.
                </p>

                <p className="text-sm text-[#71818A]">
                  {content.remember}{" "}
                  <Link
                    to="/login"
                    className="font-bold text-[#078C96] transition hover:text-[#075A6A] hover:underline"
                  >
                    {content.login}
                  </Link>
                </p>

                <p className="text-sm text-[#71818A]">
                  {content.noAccount}{" "}
                  <Link
                    to="/register"
                    className="font-bold text-[#078C96] transition hover:text-[#075A6A] hover:underline"
                  >
                    {content.register}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCE8E1] bg-white/70 px-4 py-5 text-center text-xs text-[#71818A] sm:text-sm">
        © 2026 SAHARA &nbsp;•&nbsp; Give &nbsp;•&nbsp; Help &nbsp;•&nbsp; Build Communities &nbsp;•&nbsp; Together
      </footer>
    </div>
  );
}
