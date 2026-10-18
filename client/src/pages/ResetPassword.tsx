
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { http } from "../services/api/http";

type Language = "en" | "hi";

const translations = {
  en: {
    back: "← Back to login",
    title: "Create a new password",
    subtitle: "Choose a new password for your SAHARA account.",
    newPassword: "New password",
    newPasswordPlaceholder: "At least 6 characters",
    confirmPassword: "Confirm new password",
    confirmPlaceholder: "Re-enter your password",
    submit: "Reset password →",
    loading: "Updating password…",
    redirecting: "Redirecting you to login…",
    missingToken:
      "This reset link is missing its token. Request a new password reset email.",
    shortPassword: "Your password must contain at least 6 characters.",
    mismatch: "The passwords do not match.",
    success: "Password reset successfully.",
    failed:
      "Unable to reset your password. The link may have expired.",
    toggle: "हिन्दी",
    languageLabel: "Language",
  },
  hi: {
    back: "← लॉगिन पर वापस जाएँ",
    title: "नया पासवर्ड बनाएँ",
    subtitle: "अपने SAHARA अकाउंट के लिए नया पासवर्ड चुनें।",
    newPassword: "नया पासवर्ड",
    newPasswordPlaceholder: "कम से कम 6 अक्षर",
    confirmPassword: "नए पासवर्ड की पुष्टि करें",
    confirmPlaceholder: "अपना पासवर्ड दोबारा लिखें",
    submit: "पासवर्ड रीसेट करें →",
    loading: "पासवर्ड अपडेट हो रहा है…",
    redirecting: "आपको लॉगिन पेज पर भेजा जा रहा है…",
    missingToken:
      "इस रीसेट लिंक में टोकन नहीं है। पासवर्ड रीसेट करने के लिए नया ईमेल माँगें।",
    shortPassword: "पासवर्ड में कम से कम 6 अक्षर होने चाहिए।",
    mismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    success: "पासवर्ड सफलतापूर्वक रीसेट हो गया।",
    failed:
      "पासवर्ड रीसेट नहीं हो सका। संभव है कि लिंक की समय-सीमा समाप्त हो गई हो।",
    toggle: "English",
    languageLabel: "भाषा",
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const t = translations[language];

  const toggleLanguage = () => {
    const nextLanguage: Language = language === "en" ? "hi" : "en";
    setLanguage(nextLanguage);
    localStorage.setItem("sahara-language", nextLanguage);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError(t.missingToken);
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
      const response = await http.post<{
        success: boolean;
        message: string;
      }>("/api/auth/reset-password", {
        token,
        password,
      });

      setSuccess(t.success);

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.failed
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      lang={language === "hi" ? "hi" : "en"}
      className="min-h-screen bg-[#F7F8F5] flex items-center justify-center px-4 py-10"
    >
      <section className="w-full max-w-md rounded-2xl border border-[#DDE6DF] bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-[#2F5547] hover:underline"
          >
            {t.back}
          </Link>

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t.languageLabel}
            className="rounded-lg border border-[#DDE6DF] px-3 py-2 text-sm font-semibold text-[#2F5547] transition hover:bg-[#EAF2EC]"
          >
            {t.toggle}
          </button>
        </div>

        <div className="mt-7 mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2EC] text-2xl">
            🛡️
          </div>

          <h1 className="text-2xl font-bold text-[#26332F]">
            {t.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#71817A]">
            {t.subtitle}
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            {success}
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#26332F]"
              >
                {t.newPassword}
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.newPasswordPlaceholder}
                className="w-full rounded-xl border border-[#DDE6DF] px-4 py-3 text-[#26332F] outline-none transition focus:border-[#2F5547] focus:ring-2 focus:ring-[#2F5547]/15"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[#26332F]"
              >
                {t.confirmPassword}
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder={t.confirmPlaceholder}
                className="w-full rounded-xl border border-[#DDE6DF] px-4 py-3 text-[#26332F] outline-none transition focus:border-[#2F5547] focus:ring-2 focus:ring-[#2F5547]/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2F5547] px-4 py-3 font-semibold text-white transition hover:bg-[#244438] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t.loading : t.submit}
            </button>
          </form>
        )}

        {success && (
          <p className="mt-5 text-center text-sm text-[#71817A]">
            {t.redirecting}
          </p>
        )}
      </section>
    </main>
  );
}
