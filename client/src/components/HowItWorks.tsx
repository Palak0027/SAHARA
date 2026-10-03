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
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
            {t.how.label}
          </p>

          <h2 className="font-heading text-3xl font-bold text-[#26332F] sm:text-4xl">
            {t.how.title}
          </h2>

          <p className="mt-4 text-[#71817A]">
            {t.how.description}
          </p>

        </div>

        {/* Steps */}
        <div className="grid gap-10 md:grid-cols-4">

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative text-center"
            >

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF5EF] text-[#4F7C68] shadow-sm [&>svg]:h-6 [&>svg]:w-6">
                {step.icon}
              </div>

              <span className="text-xs font-bold tracking-widest text-[#9BAAA1]">
                {step.number}
              </span>

              <h3 className="mt-2 font-heading text-lg font-bold text-[#26332F]">
                {step.title}
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#71817A]">
                {step.description}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}