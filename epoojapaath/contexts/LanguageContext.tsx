"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "hi";

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  toggle: () => {},
  t: (en) => en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "hi" || saved === "en") setLang(saved);
  }, []);

  function toggle() {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "hi" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  }

  function t(en: string, hi: string) {
    return lang === "hi" ? hi : en;
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
