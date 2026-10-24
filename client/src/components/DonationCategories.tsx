import React from "react";
import {
  ArrowRight,
  ChevronRight,
  Pill,
  Shirt,
  Utensils,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const categories = [
    {
      icon: <Utensils />,
      title: t.categories.food.title,
      description: t.categories.food.description,
      button: t.categories.food.button,
      className: "food-card",
      disabled: false,
      // Category name as stored in the database (used for ?category=)
      param: "Food",
    },
    {
      icon: <Shirt />,
      title: t.categories.clothes.title,
      description: t.categories.clothes.description,
      button: t.categories.clothes.button,
      className: "clothes-card",
      disabled: false,
      param: "Clothes",
    },
    {
      icon: <Pill />,
      title: t.categories.medicine.title,
      description: t.categories.medicine.description,
      button: t.categories.medicine.button,
      className: "medicine-card",
      disabled: true,
      param: "",
    },
  ];

  // Card click -> Explore Donations page with this category already selected
  const openCategory = (param: string) => {
    navigate(`/donations?category=${encodeURIComponent(param)}`);
  };

  return (
    <section id="donations" className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mb-7 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#176C62]">
              {t.categories.label}
            </p>

            <h2 className="font-heading text-2xl font-bold tracking-tight text-[#17383D] sm:text-3xl">
              {t.categories.title}
            </h2>
          </div>

          <Link
            to="/donations"
            className="flex items-center gap-1 text-sm font-semibold text-[#176C62] no-underline hover:underline"
          >
            {t.categories.explore}
            <ChevronRight className="h-4 w-4" />
          </Link>

        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-3">

          {categories.map((category) => (
            <div
              key={category.title}
              className={`category-card group ${category.className} ${
                category.disabled ? "opacity-80" : "cursor-pointer"
              }`}
              {...(!category.disabled && {
                role: "link",
                tabIndex: 0,
                onClick: () => openCategory(category.param),
                onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
                  // ignore keys pressed on the inner button/link
                  if (event.target !== event.currentTarget) return;

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openCategory(category.param);
                  }
                },
              })}
            >
              <div className="flex items-start justify-between">

                <div className="category-icon transition-transform duration-300 group-hover:-translate-y-1">
                  {category.icon}
                </div>

                {category.disabled && (
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#6D7D80]">
                    {t.categories.medicine.tag}
                  </span>
                )}

              </div>

              <div className="mt-4">

                <h3 className="font-heading text-xl font-bold text-[#17383D]">
                  {category.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#6D7D80]">
                  {category.description}
                </p>

              </div>

              {category.disabled ? (
              <button
                type="button"
                disabled
                className="mt-5 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-white/60 px-4 py-2 text-sm font-semibold text-[#8B968F]"
              >
                {category.button}
              </button>
              ) : (
              <Link
                to="/login"
                onClick={(event) => event.stopPropagation()}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#176C62] shadow-sm transition-colors hover:bg-[#F5FAF7]"
              >
                {category.button}
                <ArrowRight className="h-4 w-4" />
              </Link>
              )}

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}