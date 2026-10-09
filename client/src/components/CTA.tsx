import React from "react";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

type CTAProps = {
  t: {
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };
};

export default function CTA({ t }: CTAProps) {
  return (
    <section id="about" className="bg-[#F5FAF7] px-5 pb-14 pt-2 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#07545A] px-6 py-10 text-center text-white sm:px-10 sm:py-12">

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full border border-white/10" />

        <Leaf className="relative mx-auto mb-5 h-8 w-8 text-[#B9D7C2]" />

        <h2 className="relative font-heading text-2xl font-bold sm:text-3xl">
          {t.cta.title}
        </h2>

        <p className="relative mx-auto mt-4 max-w-xl leading-7 text-[#C8D9CE]">
          {t.cta.description}
        </p>

        <Link to="/register" className="relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#07545A] transition-colors hover:bg-[#E7F4E8]">
          {t.cta.button}
          <ArrowRight className="h-4 w-4" />
        </Link>

      </div>
    </section>
  );
}