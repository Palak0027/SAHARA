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
    <footer className="border-t border-[#DDE4DE] bg-[#FAF8F3]">

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F5547] text-white">
                <HeartHandshake className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#2F5547]">
                  SAHARA
                </h3>

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#71817A]">
                  Community Care
                </p>
              </div>

            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[#71817A]">
              {t.footer.tagline}
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#26332F]">
              Quick Links
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm text-[#71817A]">
              <a href="#" className="transition hover:text-[#2F5547]">
                {t.nav.home}
              </a>

              <a href="#about" className="transition hover:text-[#2F5547]">
                {t.nav.about}
              </a>

              <a
                href="#how-it-works"
                className="transition hover:text-[#2F5547]"
              >
                {t.nav.how}
              </a>

              <a
                href="#donations"
                className="transition hover:text-[#2F5547]"
              >
                {t.nav.explore}
              </a>
            </div>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#26332F]">
              Get Involved
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm text-[#71817A]">
              <a href="#" className="transition hover:text-[#2F5547]">
                Donate
              </a>

              <a href="#donations" className="transition hover:text-[#2F5547]">
                Find Donations
              </a>

              <a href="#" className="transition hover:text-[#2F5547]">
                Join SAHARA
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#26332F]">
              Contact
            </h4>

            <div className="mt-4 space-y-4 text-sm text-[#71817A]">

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#4F7C68]" />
                <span>support@sahara.org</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4F7C68]" />
                <span>Kanpur, Uttar Pradesh, India</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#DDE4DE] pt-6 text-sm text-[#71817A] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 SAHARA. All rights reserved.
          </p>

          <p>
            Made with <span className="text-[#4F7C68]">♥</span> for stronger communities.
          </p>

        </div>

      </div>
    </footer>
  );
}