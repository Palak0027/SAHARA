import React, { useState } from "react";
import { HeartHandshake, Languages, X } from "lucide-react";

type NavbarProps = {
  language: "en" | "hi";
  toggleLanguage: () => void;
  t: {
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

export default function Navbar({
  language,
  toggleLanguage,
  t,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E9E4]/80 bg-[#FAF8F3]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F5547] text-white shadow-sm">
            <HeartHandshake className="h-5 w-5" />
          </div>

          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-[#2F5547]">
              SAHARA
            </h1>

            <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#71817A] sm:block">
              Community Care
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="nav-link active">
            {t.nav.home}
          </a>

          <a href="#about" className="nav-link">
            {t.nav.about}
          </a>

          <a href="#how-it-works" className="nav-link">
            {t.nav.how}
          </a>

          <a href="#donations" className="nav-link">
            {t.nav.explore}
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {/* Language */}
          <button
            onClick={toggleLanguage}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D8E0DA] bg-white px-2.5 text-xs font-semibold text-[#2F5547] transition hover:bg-[#F1F6F2] sm:h-10 sm:rounded-xl sm:px-3 sm:text-sm"
            title={
              language === "en"
                ? "हिंदी में बदलें"
                : "Switch to English"
            }
          >
            <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {language === "en" ? "हिंदी" : "English"}
          </button>

          {/* Login */}
          <button className="hidden rounded-xl border border-[#D8E0DA] px-4 py-2 text-sm font-medium text-[#2F5547] transition hover:bg-white sm:block">
            {t.nav.login}
          </button>

          {/* Sign Up */}
          <button className="hidden rounded-xl bg-[#2F5547] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#234438] sm:block">
            {t.nav.signup}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8E0DA] bg-white text-[#2F5547] md:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <span className="text-lg leading-none">☰</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#E4E9E4] bg-[#FAF8F3] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="nav-link"
            >
              {t.nav.home}
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="nav-link"
            >
              {t.nav.about}
            </a>

            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="nav-link"
            >
              {t.nav.how}
            </a>

            <a
              href="#donations"
              onClick={() => setMenuOpen(false)}
              className="nav-link"
            >
              {t.nav.explore}
            </a>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 rounded-xl border border-[#D8E0DA] px-4 py-2 text-sm font-medium text-[#2F5547]">
                {t.nav.login}
              </button>

              <button className="flex-1 rounded-xl bg-[#2F5547] px-4 py-2 text-sm font-semibold text-white">
                {t.nav.signup}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}