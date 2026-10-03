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
    <div className="relative mx-auto w-full max-w-xl">

      {/* Soft glow */}
      <div className="absolute -inset-4 rounded-[3rem] bg-[#DDE9DF] opacity-60 blur-2xl" />

      {/* Main image container */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-[10px] border-white bg-[#DCE9DF] shadow-2xl">

        {/* Image */}
        <img
          src={images[current].src}
          alt={images[current].alt}
          className="h-[500px] w-full object-cover transition-opacity duration-500"
        />

        {/* Dark subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Previous */}
        <button
          onClick={previousSlide}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2F5547] shadow-lg backdrop-blur transition hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          onClick={nextSlide}
          aria-label="Next image"
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2F5547] shadow-lg backdrop-blur transition hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom Message Card */}
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF5EF] text-[#4F7C68]">
              <Heart className="h-5 w-5 fill-current" />
            </div>

            <div>
              <p className="font-heading text-base font-semibold text-[#2F5547]">
                {language === "en"
                  ? "Kind people. Stronger communities."
                  : "दयालु लोग। मजबूत समुदाय।"}
              </p>

              <p className="mt-1 text-sm text-[#71817A]">
                {language === "en"
                  ? "Every contribution makes a difference."
                  : "हर योगदान बदलाव लाता है।"}
              </p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                current === index
                  ? "w-6 bg-[#2F5547]"
                  : "w-1.5 bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}