import React from "react";
import { ArrowRight, Leaf } from "lucide-react";

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
    <section id="about" className="px-5 pb-20 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#2F5547] px-7 py-14 text-center text-white sm:px-12">

        <Leaf className="mx-auto mb-5 h-8 w-8 text-[#B9D7C2]" />

        <h2 className="font-heading text-3xl font-bold sm:text-4xl">
          {t.cta.title}
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-[#C8D9CE]">
          {t.cta.description}
        </p>

        <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#2F5547] transition hover:bg-[#F1F6F2]">
          {t.cta.button}
          <ArrowRight className="h-4 w-4" />
        </button>

      </div>
    </section>
  );
}