"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Eye } from "lucide-react";

interface TempleImageSliderProps {
  images: string[];
  children?: React.ReactNode;
}

export function TempleImageSlider({ images, children }: TempleImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = images.length;
  const galleryImages = images.slice(1); // Exclude the cover image from the right gallery grid

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;

    if (!isHovered && !showLightbox) {
      timerRef.current = setInterval(nextSlide, 5000); // 5 seconds interval
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, isHovered, showLightbox, totalSlides, nextSlide]);

  if (totalSlides === 0) {
    return (
      <div className="relative h-[270px] md:h-[370px] lg:h-[420px] w-full bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No images available</span>
        {children}
      </div>
    );
  }

  // Determine split grid layout based on image count
  const hasGallery = totalSlides > 1;

  return (
    <div className="w-full bg-dark/95 border-b border-border/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 lg:py-6">
        <div className={`grid grid-cols-1 ${hasGallery ? "lg:grid-cols-3" : "grid-cols-1"} gap-4 h-[270px] md:h-[370px] lg:h-[420px]`}>

          {/* LEFT SIDE: Active Image Slider */}
          <div
            className={`relative h-full ${hasGallery ? "lg:col-span-2" : "col-span-1"} rounded-2xl overflow-hidden group/slider`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Slides Container */}
            <div className="absolute inset-0 w-full h-full">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? "opacity-100 z-0 animate-fade-in" : "opacity-0 -z-10"
                    }`}
                >
                  <Image
                    src={img || "/placeholder-temple.jpg"}
                    alt={`Temple Slide ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>

            {/* Dark Gradient Overlay for active text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/15 to-transparent z-10 pointer-events-none" />

            {/* Content Children Overlay (Deity, Name, Rating, Button) */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-end">
              {children}
            </div>

            {/* Navigation Arrows on edges of slider */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-dark/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-dark/60 transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-dark/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-dark/60 transition-all opacity-0 group-hover/slider:opacity-100 focus:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Bottom Indicator Dots (Only inside the active slider) */}
            {totalSlides > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex
                        ? "bg-saffron w-6"
                        : "bg-white/40 hover:bg-white/70"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Interactive Gallery Grid */}
          {hasGallery && (
            <div className="hidden lg:block h-full">
              {/* Dynamic grid based on number of gallery images */}
              {galleryImages.length === 1 && (
                <div className="h-full">
                  <div
                    onClick={() => selectSlide(1)}
                    className={`relative h-full w-full rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${currentIndex === 1 ? "border-saffron scale-[0.99] shadow-lg shadow-saffron/20" : "border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]"
                      }`}
                  >
                    <Image src={galleryImages[0]} alt="Gallery 1" fill className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                </div>
              )}

              {galleryImages.length === 2 && (
                <div className="grid grid-rows-2 gap-3 h-full">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSlide(idx + 1)}
                      className={`relative h-full w-full rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${currentIndex === idx + 1 ? "border-saffron scale-[0.99] shadow-lg shadow-saffron/20" : "border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]"
                        }`}
                    >
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              )}

              {galleryImages.length === 3 && (
                <div className="grid grid-rows-3 gap-3 h-full">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSlide(idx + 1)}
                      className={`relative h-full w-full rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${currentIndex === idx + 1 ? "border-saffron scale-[0.99] shadow-lg shadow-saffron/20" : "border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]"
                        }`}
                    >
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              )}

              {galleryImages.length >= 4 && (
                <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                  {galleryImages.slice(0, 3).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSlide(idx + 1)}
                      className={`relative h-full w-full rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${currentIndex === idx + 1 ? "border-saffron scale-[0.99] shadow-lg shadow-saffron/20" : "border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]"
                        }`}
                    >
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                  ))}

                  {/* Fourth thumbnail handles "+More" overlay if images exceed 5 total */}
                  <div
                    onClick={() => {
                      if (galleryImages.length > 4) {
                        openLightbox(4);
                      } else {
                        selectSlide(4);
                      }
                    }}
                    className={`relative h-full w-full rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${currentIndex === 4 ? "border-saffron scale-[0.99] shadow-lg shadow-saffron/20" : "border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]"
                      }`}
                  >
                    <Image src={galleryImages[3]} alt="Gallery 4" fill className="object-cover transition duration-500 group-hover:scale-105" />
                    {galleryImages.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white transition duration-300 group-hover:bg-black/50">
                        <span className="font-heading text-xl font-bold">+{galleryImages.length - 3}</span>
                        <span className="text-xs text-white/80 font-medium flex items-center gap-1 mt-0.5">
                          <Eye size={12} /> View All
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-105"
            aria-label="Close Lightbox"
          >
            <X size={26} />
          </button>

          {/* Main Lightbox View */}
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center select-none">
            <div className="relative w-full h-full">
              <Image
                src={images[lightboxIndex]}
                alt={`Temple Lightbox ${lightboxIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 md:left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
                  aria-label="Previous Lightbox Image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 md:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
                  aria-label="Next Lightbox Image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-6 flex gap-2.5 overflow-x-auto max-w-full pb-2 px-4 scrollbar-thin scrollbar-thumb-white/20">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`relative w-20 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${idx === lightboxIndex ? "border-saffron scale-105 shadow-md shadow-saffron/35" : "border-transparent opacity-50 hover:opacity-85"
                  }`}
              >
                <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
