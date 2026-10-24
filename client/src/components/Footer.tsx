import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import logoImg from "./image/sahara-logo.jpeg"; // adjust if your logo lives elsewhere



type FooterProps = {
  t: {
    nav: {
      home: string;
      about: string;
      how: string;
      explore: string;
    };
    footer: {
      tagline: string;
      // Optional: add these to translations.ts (en + hi). English fallbacks are used until then.
      quickLinks?: string;
      getInvolved?: string;
      contact?: string;
      donate?: string;
      findDonations?: string;
      join?: string;
      rights?: string;
      madeWith?: string;
      location?: string;
    };
  };
};

const linkClass =
  "w-fit rounded text-[#5F6F76] transition-colors hover:text-[#065A6B] hover:underline " +
  "underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#087F8C]";

const headingClass = "text-base font-bold text-[#263238]";

export default function Footer({ t }: FooterProps) {
  const f = t.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#DCE6E1] bg-[#F7FAF8]">
      {/* Accent line, same as the form cards */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4CAF50] to-[#087F8C]"
      />

      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="SAHARA home"
              className="inline-flex items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087F8C]"
            >
              <img
                src={logoImg}
                alt="LogoImg"
                className="h-14 w-14 rounded-full bg-white object-contain shadow-sm ring-1 ring-[#DCE6E1]"
              />
              <span className="text-2xl font-bold tracking-tight text-[#065A6B]">
                SAHARA
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#5F6F76]">
              {f.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label={f.quickLinks ?? "Quick Links"}>
            <h3 className={headingClass}>{f.quickLinks ?? "Quick Links"}</h3>

            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <a href="/#home" className={linkClass}>{t.nav.home}</a>
              </li>
              <li>
                <a href="/#about" className={linkClass}>{t.nav.about}</a>
              </li>
              <li>
                <a href="/#how-it-works" className={linkClass}>{t.nav.how}</a>
              </li>
              <li>
                <a href="/#donations" className={linkClass}>{t.nav.explore}</a>
              </li>
            </ul>
          </nav>

          {/* Get Involved */}
          <nav aria-label={f.getInvolved ?? "Get Involved"}>
            <h3 className={headingClass}>{f.getInvolved ?? "Get Involved"}</h3>

            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <Link to="/register" className={linkClass}>
                  {f.donate ?? "Donate"}
                </Link>
              </li>
              <li>
                <a href="/#donations" className={linkClass}>
                  {f.findDonations ?? "Find Donations"}
                </a>
              </li>
              <li>
                <Link to="/register" className={linkClass}>
                  {f.join ?? "Join SAHARA"}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>{f.contact ?? "Contact"}</h3>

            <ul className="mt-4 space-y-4 text-sm text-[#5F6F76]">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#087F8C]" aria-hidden="true" />
                <a href="mailto:support@sahara.org" className={linkClass}>
                  sahara.community.contact@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#087F8C]" aria-hidden="true" />
                <span>{f.location ?? "Uttar Pradesh, India"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-[#DCE6E1] pt-5 text-sm text-[#5F6F76] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} SAHARA. {f.rights ?? "All rights reserved."}
          </p>

          <p>{f.madeWith ?? "Made with ♥ for (The Outliers)."}</p>
        </div>
      </div>
    </footer>
  );
}