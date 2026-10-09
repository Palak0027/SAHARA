import React from "react";
import {
  HeartHandshake,
  Mail,
  MapPin,
} from "lucide-react";

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
    };
  };
};

export default function Footer({
  t,
}: FooterProps) {
  return (
    <footer className="border-t border-[#D5DFDC] bg-[#F5FAF7]">

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07545A] text-white">
                <HeartHandshake className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#07545A]">
                  SAHARA
                </h3>

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6D7D80]">
                  Community Care
                </p>
              </div>

            </div>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#6D7D80]">
              {t.footer.tagline}
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#17383D]">
              Quick Links
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm text-[#6D7D80]">
              <a href="#home" className="transition hover:text-[#07545A]">
                {t.nav.home}
              </a>

              <a href="#about" className="transition hover:text-[#07545A]">
                {t.nav.about}
              </a>

              <a
                href="#how-it-works"
                className="transition hover:text-[#07545A]"
              >
                {t.nav.how}
              </a>

              <a
                href="#donations"
                className="transition hover:text-[#07545A]"
              >
                {t.nav.explore}
              </a>
            </div>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#17383D]">
              Get Involved
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm text-[#6D7D80]">
              <a href="/register" className="transition hover:text-[#07545A]">
                Donate
              </a>

              <a href="#donations" className="transition hover:text-[#07545A]">
                Find Donations
              </a>

              <a href="/register" className="transition hover:text-[#07545A]">
                Join SAHARA
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#17383D]">
              Contact
            </h4>

            <div className="mt-4 space-y-4 text-sm text-[#6D7D80]">

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#176C62]" />
                <span>support@sahara.org</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#176C62]" />
                <span>Kanpur, Uttar Pradesh, India</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-3 border-t border-[#D5DFDC] pt-5 text-sm text-[#6D7D80] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 SAHARA. All rights reserved.
          </p>

          <p>
            Made with <span className="text-[#176C62]">♥</span> for stronger communities.
          </p>

        </div>

      </div>
    </footer>
  );
}