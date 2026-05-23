"use client";

import { useLang } from "@/contexts/LanguageContext";

export function MarqueeStrip() {
  const { t } = useLang();

  const features = [
    { en: "Personalized Sankalp in Your Name", hi: "आपके नाम से व्यक्तिगत संकल्प" },
    { en: "Live Photos & Video Updates", hi: "लाइव तस्वीरें और वीडियो अपडेट" },
    { en: "Prasad Delivery Available", hi: "प्रसाद डिलीवरी की सुविधा" },
    { en: "Affordable Puja Packages", hi: "किफायती पूजा पैकेज" },
    { en: "Secure Online Payments", hi: "सुरक्षित ऑनलाइन भुगतान" },
    { en: "Quick Booking Process", hi: "त्वरित बुकिंग प्रक्रिया" },
    { en: "Dedicated Devotee Support", hi: "समर्पित भक्त सहायता" },
    { en: "Trusted Spiritual Experience", hi: "विश्वसनीय आध्यात्मिक अनुभव" }
  ];

  // Concatenate multiple copies of the list to ensure a seamless looping marquee
  const displayItems = [...features, ...features, ...features];

  return (
    <div className="bg-deep-gold overflow-hidden py-3 border-y border-saffron/40">
      <div className="flex whitespace-nowrap animate-marquee gap-8 text-white text-base font-semibold tracking-wide">
        {displayItems.map((f, i) => (
          <span key={i} className="inline-flex items-center gap-3 pr-4">
            <span className="text-emerald-300 font-bold shrink-0">✔</span>
            {t(f.en, f.hi)}
          </span>
        ))}
      </div>
    </div>
  );
}
