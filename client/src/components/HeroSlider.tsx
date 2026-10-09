import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

type HeroSliderProps = {
  language: "en" | "hi";
};

const images = [
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85",
    alt: "People helping with donated items",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=85",
    alt: "Community food donation",
  },
  {
    src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85",
    alt: "Clothes donation",
  },
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=85",
    alt: "Community volunteering",
  },
];

export default function HeroSlider({
  language,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="relative overflow-hidden rounded-3xl border border-[#D5DFDC] bg-white shadow-lg shadow-[#17383D]/10">

        {/* Image */}
        <img
          src={images[current].src}
          alt={images[current].alt}
          className="h-[280px] w-full object-cover transition-opacity duration-500 sm:h-[340px] lg:h-[390px]"
        />

        {/* Dark subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Previous */}
        <button
          onClick={previousSlide}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#07545A] shadow-sm transition-colors hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          onClick={nextSlide}
          aria-label="Next image"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#07545A] shadow-sm transition-colors hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom Message Card */}
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/60 bg-white/95 p-3 shadow-md backdrop-blur-sm sm:inset-x-4 sm:bottom-4 sm:p-4">
          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7F4E8] text-[#176C62]">
              <Heart className="h-4 w-4 fill-current" />
            </div>

            <div>
              <p className="font-heading text-sm font-semibold text-[#07545A]">
                {language === "en"
                  ? "Kind people. Stronger communities."
                  : "दयालु लोग। मजबूत समुदाय।"}
              </p>

              <p className="mt-1 text-xs text-[#6D7D80]">
                {language === "en"
                  ? "Every contribution makes a difference."
                  : "हर योगदान बदलाव लाता है।"}
              </p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                current === index
                  ? "w-6 bg-[#07545A]"
                  : "w-1.5 bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}