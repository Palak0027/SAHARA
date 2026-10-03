import React from "react";
import {
  ArrowRight,
  Gift,
  Heart,
  HeartHandshake,
  Search,
  Users,
} from "lucide-react";
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
    <section className="relative overflow-hidden">

      {/* Decorative Background */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#DCE9DF] opacity-60 blur-3xl" />

      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#F5DDD2] opacity-50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-24">

        {/* LEFT SIDE */}
        <div className="max-w-xl">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D9E5DC] bg-[#EDF5EF] px-4 py-2 text-sm font-medium text-[#3E6B57]">
            <Heart className="h-4 w-4 fill-current" />
            {t.hero.badge}
          </div>

          {/* Heading */}
          <h2 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-[#26332F] sm:text-6xl lg:text-7xl">
            {t.hero.title1}

            <br />

            {t.hero.title2}{" "}

            <span className="italic text-[#4F7C68]">
              {t.hero.nearby}
            </span>
          </h2>

          {/* Description */}
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#71817A]">
            {t.hero.description}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F7C68] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#4F7C68]/20 transition hover:-translate-y-0.5 hover:bg-[#3E6856]">
              {t.hero.donate}

              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9AB3A4] bg-white px-7 py-3.5 font-semibold text-[#3E6856] transition hover:bg-[#F1F6F2]">
              <Search className="h-4 w-4" />
              {t.hero.find}
            </button>

          </div>

          {/* Statistics */}
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[#DDE4DE] pt-7 sm:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2"
              >
                <div className="text-[#4F7C68] [&>svg]:h-5 [&>svg]:w-5">
                  {stat.icon}
                </div>

                <div>
                  <p className="font-heading text-lg font-bold text-[#26332F]">
                    {stat.value}
                  </p>

                  <p className="text-[11px] text-[#7B8981]">
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