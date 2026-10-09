import React from "react";
import { MapPin } from "lucide-react";

type LocationSectionProps = {
  t: {
    location: {
      title: string;
      description: string;
      placeholder: string;
      search: string;
    };
  };
};

export default function LocationSection({
  t,
}: LocationSectionProps) {
  return (
    <section className="bg-[#F5FAF7] py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#D5DFDC] bg-white p-5 md:flex-row md:p-7">

          {/* Text */}
          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E7F4E8] text-[#176C62]">
              <MapPin className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-[#17383D]">
                {t.location.title}
              </h3>

              <p className="mt-1 text-sm text-[#6D7D80]">
                {t.location.description}
              </p>
            </div>

          </div>

          {/* Search */}
          <div className="flex w-full max-w-md gap-2">

            <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#D5DFDC] bg-[#FBFDFC] px-4">

              <MapPin className="h-4 w-4 text-[#6D7D80]" />

              <input
                type="text"
                placeholder={t.location.placeholder}
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#9AA8A0]"
              />

            </div>

            <button className="rounded-xl bg-[#4F9F70] px-5 font-semibold text-white transition hover:bg-[#358A69]">
              {t.location.search}
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}