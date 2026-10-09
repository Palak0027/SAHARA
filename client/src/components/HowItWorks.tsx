import React from "react";
import {
  Gift,
  Heart,
  Truck,
  Users,
} from "lucide-react";

type HowItWorksProps = {
  t: {
    how: {
      label: string;
      title: string;
      description: string;
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
      step4: {
        title: string;
        description: string;
      };
    };
  };
};

export default function HowItWorks({
  t,
}: HowItWorksProps) {
  const steps = [
    {
      number: "01",
      icon: <Gift />,
      title: t.how.step1.title,
      description: t.how.step1.description,
    },
    {
      number: "02",
      icon: <Users />,
      title: t.how.step2.title,
      description: t.how.step2.description,
    },
    {
      number: "03",
      icon: <Truck />,
      title: t.how.step3.title,
      description: t.how.step3.description,
    },
    {
      number: "04",
      icon: <Heart />,
      title: t.how.step4.title,
      description: t.how.step4.description,
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#F5FAF7] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-9 max-w-2xl text-center">

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#176C62]">
            {t.how.label}
          </p>

          <h2 className="font-heading text-2xl font-bold text-[#17383D] sm:text-3xl">
            {t.how.title}
          </h2>

          <p className="mt-4 text-[#6D7D80]">
            {t.how.description}
          </p>

        </div>

        {/* Steps */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-[#D5DFDC] bg-white px-4 py-5 text-center transition-colors hover:border-[#B5CFC4]"
            >

              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F4E8] text-[#176C62] [&>svg]:h-5 [&>svg]:w-5">
                {step.icon}
              </div>

              <span className="text-xs font-bold tracking-widest text-[#879496]">
                {step.number}
              </span>

              <h3 className="mt-2 font-heading text-lg font-bold text-[#17383D]">
                {step.title}
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6D7D80]">
                {step.description}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}