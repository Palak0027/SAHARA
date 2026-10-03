import React from "react";
import {
  ArrowRight,
  ChevronRight,
  Pill,
  Shirt,
  Utensils,
} from "lucide-react";

type DonationCategoriesProps = {
  t: {
    categories: {
      label: string;
      title: string;
      explore: string;
      food: {
        title: string;
        description: string;
        button: string;
      };
      clothes: {
        title: string;
        description: string;
        button: string;
      };
      medicine: {
        title: string;
        description: string;
        button: string;
        tag: string;
      };
    };
  };
};

export default function DonationCategories({
  t,
}: DonationCategoriesProps) {
  const categories = [
    {
      icon: <Utensils />,
      title: t.categories.food.title,
      description: t.categories.food.description,
      button: t.categories.food.button,
      className: "food-card",
      disabled: false,
    },
    {
      icon: <Shirt />,
      title: t.categories.clothes.title,
      description: t.categories.clothes.description,
      button: t.categories.clothes.button,
      className: "clothes-card",
      disabled: false,
    },
    {
      icon: <Pill />,
      title: t.categories.medicine.title,
      description: t.categories.medicine.description,
      button: t.categories.medicine.button,
      className: "medicine-card",
      disabled: true,
    },
  ];

  return (
    <section id="donations" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mb-10 flex items-end justify-between">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#4F7C68]">
              {t.categories.label}
            </p>

            <h2 className="font-heading text-3xl font-bold text-[#26332F] sm:text-4xl">
              {t.categories.title}
            </h2>
          </div>

          <button className="hidden items-center gap-1 text-sm font-semibold text-[#4F7C68] sm:flex">
            {t.categories.explore}
            <ChevronRight className="h-4 w-4" />
          </button>

        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">

          {categories.map((category) => (
            <div
              key={category.title}
              className={`category-card ${category.className} ${
                category.disabled ? "opacity-80" : ""
              }`}
            >
              <div className="flex items-start justify-between">

                <div className="category-icon">
                  {category.icon}
                </div>

                {category.disabled && (
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#71817A]">
                    {t.categories.medicine.tag}
                  </span>
                )}

              </div>

              <div className="mt-6">

                <h3 className="font-heading text-2xl font-bold text-[#26332F]">
                  {category.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#66756D]">
                  {category.description}
                </p>

              </div>

              <button
                disabled={category.disabled}
                className={`mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  category.disabled
                    ? "cursor-not-allowed bg-white/60 text-[#8B968F]"
                    : "bg-white text-[#3E6856] shadow-sm hover:-translate-y-0.5"
                }`}
              >
                {category.button}

                {!category.disabled && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}