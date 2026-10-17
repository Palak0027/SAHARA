import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const apiBaseUrl = (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      ).replace(/\/$/, "");

      const response = await fetch(
        `${apiBaseUrl}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to process your request. Please try again."
        );
      }

      setMessage(
        data.message ||
          "If an account exists with this email, you will receive a password reset link shortly."
      );

      setEmail("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F6] text-[#26343A]">
      {/* Shared SAHARA Navbar */}
      <Navbar
        language={language}
        toggleLanguage={() =>
          setLanguage((current) => (current === "en" ? "hi" : "en"))
        }
        t={{ nav: navContent[language] }}
      />

      {/* Main Content */}
      <main className="mx-auto grid min-h-[calc(100vh-145px)] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
        {/* Left Branding Section */}
        <section className="mx-auto w-full max-w-xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#CDE6D3] bg-white px-4 py-2 text-sm font-semibold text-[#287B53] shadow-sm">
            <span>💚</span>
            A little help goes a long way
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#086474] sm:text-5xl lg:text-6xl">
            Reset your
            <br />
            SAHARA password.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#647780] sm:text-lg">
            Forgot your password? It happens. Follow a simple, secure
            process to regain access to your account and continue
            making a difference in your community.
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
              ["💚", "Support Communities"],
              ["🤝", "Help People"],
              ["🌱", "Build a Better Tomorrow"],
              ["✓", "Safe & Secure"],
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
              <div className="mb-8 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#29353B] sm:text-3xl">
                    Forgot Your Password?
                  </h2>

                  <p className="mt-2 leading-6 text-[#71818A]">
                    No worries! We'll help you get back into your
                    account.
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-[#B7DFBC] bg-[#EAF6EC] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#086474] sm:text-sm">
                  Reset
                </span>
              </div>

              {/* Information Panel */}
          

              {/* Success Message */}
              {message && (
                <div
                  role="status"
                  className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800"
                >
                  <span className="mr-2">✓</span>
                  {message}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Reset Request Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="mb-2 block text-sm font-semibold text-[#34434A]"
                  >
                    Email Address{" "}
                    <span className="text-red-500">*</span>
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
                    Make sure you use the email linked to your
                    account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#078C96] to-[#075A6A] px-5 py-4 font-bold text-white shadow-[0_12px_22px_rgba(7,105,119,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(7,105,119,0.28)] focus:outline-none focus:ring-4 focus:ring-[#078C96]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin" aria-hidden="true">
                        ◌
                      </span>
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link{" "}
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 border-t border-[#E1EAE5]" />

              {/* Card Footer */}
              <div className="space-y-3 text-center">
                <p className="text-sm text-[#71818A]">
                  <span aria-hidden="true">🔒</span>{" "}
                  Your information is kept safe and secure.
                </p>

                <p className="text-sm text-[#71818A]">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-[#078C96] transition hover:text-[#075A6A] hover:underline"
                  >
                    Login →
                  </Link>
                </p>

                <p className="text-sm text-[#71818A]">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-[#078C96] transition hover:text-[#075A6A] hover:underline"
                  >
                    Register →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCE8E1] bg-white/70 px-4 py-5 text-center text-xs text-[#71818A] sm:text-sm">
        © 2026 SAHARA &nbsp;•&nbsp; Give &nbsp;•&nbsp; Help &nbsp;•&nbsp;
        Build Communities &nbsp;•&nbsp; Together
      </footer>
    </div>
  );
}
