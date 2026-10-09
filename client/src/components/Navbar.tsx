import React, { useState } from "react";
import { Languages, Leaf, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
  const { pathname } = useLocation();
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
    { label: nav.home, to: "/" },
    { label: nav.about, to: "/#about" },
    { label: nav.how, to: "/#how-it-works" },
    { label: nav.explore, to: "/#donations" },
  ];

  return (
    <header className="site-navbar sticky top-0 z-50 border-b border-[#D5DFDC] bg-[#F5FAF7]/95 shadow-[0_2px_10px_rgba(18,62,69,0.04)] backdrop-blur-lg">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link to="/" className="flex w-fit items-center gap-2.5" aria-label="SAHARA home">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F4E8] text-[#176C62]">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-heading text-lg font-bold leading-5 tracking-tight text-[#07545A]">
              SAHARA
            </span>
            <span className="hidden text-[10px] leading-4 text-[#6D7D80] lg:block">
              Give what you can, help someone nearby.
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {sections.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link${index === 0 && pathname === "/" ? " active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D5DFDC] bg-white px-2.5 text-xs font-semibold text-[#07545A] transition-colors hover:bg-[#E7F4E8]"
            title={language === "en" ? "हिंदी में बदलें" : "Switch to English"}
          >
            <Languages className="h-3.5 w-3.5" />
            {language === "en" ? "हिंदी" : "English"}
          </button>

          <Link
            to="/login"
            className="hidden h-9 items-center rounded-lg border border-[#D5DFDC] bg-white px-3 text-sm font-semibold text-[#07545A] transition-colors hover:bg-[#E7F4E8] sm:inline-flex"
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5DFDC] bg-white text-[#07545A] transition-colors hover:bg-[#E7F4E8] md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <span aria-hidden="true">☰</span>}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-[#D5DFDC] bg-[#F5FAF7] px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {sections.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#07545A] transition-colors hover:bg-[#E7F4E8]"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 border-t border-[#D5DFDC] pt-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#D5DFDC] bg-white px-3 text-sm font-semibold text-[#07545A] transition-colors hover:bg-[#E7F4E8]"
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
