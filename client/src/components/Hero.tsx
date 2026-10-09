import React from "react";
import {
  ArrowRight,
  Gift,
  Heart,
  HeartHandshake,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroSlider from "./HeroSlider";

type HeroProps = {
  language: "en" | "hi";
  t: {
    hero: {
      badge: string;
      title1: string;
      title2: string;
      nearby: string;
      description: string;
      donate: string;
      find: string;
    };
    stats: {
      donations: string;
      people: string;
      communities: string;
      successful: string;
    };
  };
};

export default function Hero({
  language,
  t,
}: HeroProps) {
  const stats = [
    {
      icon: <Gift />,
      value: "1,240",
      label: t.stats.donations,
    },
    {
      icon: <Users />,
      value: "892",
      label: t.stats.people,
    },
    {
      icon: <HeartHandshake />,
      value: "15+",
      label: t.stats.communities,
    },
    {
      icon: <Heart />,
      value: "98%",
      label: t.stats.successful,
    },
  ];

  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#F5FAF7]">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#E7F4E8] opacity-70 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#E7F4E8] opacity-60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-10 pt-8 sm:gap-10 sm:px-6 sm:pb-14 sm:pt-12 lg:grid-cols-2 lg:px-8 lg:pb-16 lg:pt-14">

        {/* LEFT SIDE */}
        <div className="max-w-xl">

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D5DFDC] bg-[#E7F4E8] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#176C62]">
            <Heart className="h-3.5 w-3.5 fill-current" />
            {t.hero.badge}
          </div>

          {/* Heading */}
          <h2 className="font-heading text-3xl font-bold leading-[1.1] tracking-tight text-[#17383D] sm:text-5xl lg:text-6xl">
            {t.hero.title1}

            <br />

            {t.hero.title2}{" "}

            <span className="italic text-[#176C62]">
              {t.hero.nearby}
            </span>
          </h2>

          {/* Description */}
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#6D7D80] sm:text-base sm:leading-7">
            {t.hero.description}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">

            <Link to="/register" className="home-action group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors">
              {t.hero.donate}

              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <a href="#donations" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#B5CFC4] bg-white px-5 py-2.5 text-sm font-semibold text-[#176C62] transition-colors hover:bg-[#E7F4E8]">
              <Search className="h-4 w-4" />
              {t.hero.find}
            </a>

          </div>

          {/* Statistics */}
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#D5DFDC] pt-5 sm:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2"
              >
                <div className="text-[#176C62] [&>svg]:h-4 [&>svg]:w-4">
                  {stat.icon}
                </div>

                <div>
                  <p className="font-heading text-base font-bold text-[#17383D]">
                    {stat.value}
                  </p>

                  <p className="text-[11px] text-[#6D7D80]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* RIGHT SIDE - SLIDER */}
        <HeroSlider language={language} />

      </div>
    </section>
  );
}