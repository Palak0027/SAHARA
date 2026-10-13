import React, { useEffect, useState } from "react";
import { Languages, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "./image/sahara-logo.jpeg";


type NavbarProps = {
  language: "en" | "hi";
  toggleLanguage: () => void;
  t?: {
    nav: {
      home: string;
      about: string;
      how: string;
      explore: string;
      login: string;
      signup: string;
    };
  };
};

export default function Navbar({ language, toggleLanguage, t }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash, key } = useLocation();

  const nav = t?.nav ?? (language === "en"
    ? {
        home: "Home",
        about: "About",
        how: "How it works",
        explore: "Explore donations",
        login: "Login",
        signup: "Register",
      }
    : {
        home: "होम",
        about: "हमारे बारे में",
        how: "कैसे काम करता है",
        explore: "दान देखें",
        login: "लॉगिन",
        signup: "रजिस्टर",
      });

  const sections = [
    { label: nav.home, to: "/", hash: "" },
    { label: nav.about, to: "/#about", hash: "#about" },
    { label: nav.how, to: "/#how-it-works", hash: "#how-it-works" },
    { label: nav.explore, to: "/#donations", hash: "#donations" },
  ];


  useEffect(() => {
    if (pathname !== "/") return;

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = hash.slice(1);

    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [pathname, hash, key]);

  const isActive = (itemHash: string) => pathname === "/" && hash === itemHash;

  return (
    <header className="site-navbar sticky top-0 z-50 border-b border-[#DCE6E1] bg-[#F7FAF8]/95 shadow-[0_2px_10px_rgba(6,90,107,0.05)] backdrop-blur-lg">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Logo + brand: click goes to home */}
        <Link
          to="/"
          className="flex w-fit items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087F8C]"
          aria-label="SAHARA home"
        >
          <img
            src={logoImg}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full bg-white object-contain ring-1 ring-[#DCE6E1]"
          />
          <div>
            <span className="block font-heading text-lg font-bold leading-5 tracking-tight text-[#065A6B]">
              SAHARA
            </span>
            <span className="hidden text-[11px] leading-4 text-[#5F6F76] lg:block">
              Give what you can, help someone nearby.
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {sections.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link${isActive(item.hash) ? " active" : ""}`}
              aria-current={isActive(item.hash) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE6E1] bg-white px-2.5 text-xs font-semibold text-[#065A6B] transition-colors hover:bg-[#E8F5E9]"
            title={language === "en" ? "हिंदी में बदलें" : "Switch to English"}
          >
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            {language === "en" ? "हिंदी" : "English"}
          </button>

          <Link
            to="/login"
            className="hidden h-9 items-center rounded-lg border border-[#DCE6E1] bg-white px-3 text-sm font-semibold text-[#065A6B] transition-colors hover:bg-[#E8F5E9] sm:inline-flex"
          >
            {nav.login}
          </Link>

          <Link
            to="/register"
            className="home-action hidden h-9 items-center rounded-lg px-3 text-sm font-semibold transition-colors sm:inline-flex"
          >
            {nav.signup}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE6E1] bg-white text-[#065A6B] transition-colors hover:bg-[#E8F5E9] md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <span aria-hidden="true">☰</span>}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[#DCE6E1] bg-[#F7FAF8] px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {sections.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium text-[#065A6B] transition-colors hover:bg-[#E8F5E9]${
                  isActive(item.hash) ? " bg-[#E8F5E9]" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 border-t border-[#DCE6E1] pt-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#DCE6E1] bg-white px-3 text-sm font-semibold text-[#065A6B] transition-colors hover:bg-[#E8F5E9]"
              >
                {nav.login}
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="home-action flex h-10 flex-1 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors"
              >
                {nav.signup}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}