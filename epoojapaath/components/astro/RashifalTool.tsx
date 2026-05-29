"use client";

import { useState, useEffect } from "react";
import { Sparkles, Heart, Briefcase, Activity, CalendarDays } from "lucide-react";
import { getRashifal } from "@/lib/astro";

const RASHIS = [
  { value: "aries",       label: "Mesh",      eng: "Aries",       symbol: "♈" },
  { value: "taurus",      label: "Vrishabh",   eng: "Taurus",      symbol: "♉" },
  { value: "gemini",      label: "Mithun",    eng: "Gemini",      symbol: "♊" },
  { value: "cancer",      label: "Kark",      eng: "Cancer",      symbol: "♋" },
  { value: "leo",         label: "Simha",     eng: "Leo",         symbol: "♌" },
  { value: "virgo",       label: "Kanya",     eng: "Virgo",       symbol: "♍" },
  { value: "libra",       label: "Tula",      eng: "Libra",       symbol: "♎" },
  { value: "scorpio",     label: "Vrishchik", eng: "Scorpio",     symbol: "♏" },
  { value: "sagittarius", label: "Dhanu",     eng: "Sagittarius", symbol: "♐" },
  { value: "capricorn",   label: "Makar",     eng: "Capricorn",   symbol: "♑" },
  { value: "aquarius",    label: "Kumbh",     eng: "Aquarius",    symbol: "♒" },
  { value: "pisces",      label: "Meen",      eng: "Pisces",      symbol: "♓" },
];

export function RashifalTool() {
  const [selectedRashi, setSelectedRashi] = useState<string>("aries");
  const [result, setResult] = useState<ReturnType<typeof getRashifal> | null>(null);

  // Automatically recalculate when selectedRashi changes
  useEffect(() => {
    setResult(getRashifal(selectedRashi));
  }, [selectedRashi]);

  // Generate deterministic life scores based on rashi and date
  const metrics = useEffect ? (() => {
    const today = new Date();
    // Sum ASCII values of rashi + date values
    const rashiSum = selectedRashi.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = today.getDate() + today.getMonth() + rashiSum;
    
    const health = ((seed * 7) % 31) + 65; // 65 to 95
    const career = ((seed * 13) % 31) + 65; // 65 to 95
    const relations = ((seed * 17) % 31) + 65; // 65 to 95
    
    return { health, career, relations };
  })() : { health: 80, career: 85, relations: 75 };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Rashi Selector Grid */}
      <div className="w-full lg:w-[45%] shrink-0">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span>✨</span> Select Zodiac Sign (Rashifal)
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
          {RASHIS.map((r) => {
            const isSelected = selectedRashi === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelectedRashi(r.value)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? "bg-saffron text-white border-saffron shadow-md scale-102"
                    : "bg-white text-muted-foreground border-deep-gold/15 hover:border-saffron/30 hover:text-foreground"
                }`}
              >
                <span className="text-xl md:text-2xl mb-1">{r.symbol}</span>
                <span className={`text-[11px] font-bold ${isSelected ? "text-white" : "text-foreground"}`}>{r.label}</span>
                <span className={`text-[9px] uppercase tracking-wider ${isSelected ? "text-white/80" : "text-muted-foreground/75"}`}>{r.eng}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Rashifal Reading Results */}
      <div className="flex-grow">
        {result && (
          <div className="h-full flex flex-col justify-between bg-saffron/[0.01] border border-deep-gold/15 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-deep-gold/10 mb-4">
              <div>
                <h3 className="font-heading text-lg text-foreground flex items-center gap-2 font-semibold">
                  <Sparkles size={16} className="text-saffron" />
                  Daily Reading for {RASHIS.find((r) => r.value === selectedRashi)?.label} ({RASHIS.find((r) => r.value === selectedRashi)?.eng})
                </h3>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 mt-0.5">
                  <CalendarDays size={10} />
                  Horoscope for Today
                </span>
              </div>
            </div>

            {/* Reading */}
            <div className="space-y-4 flex-grow">
              <p className="text-foreground leading-relaxed text-sm italic font-medium bg-saffron/5 p-4 rounded-xl border border-saffron/10">
                &ldquo;{result.reading}&rdquo;
              </p>

              {/* Progress Bars for Life Aspects */}
              <div className="space-y-3 py-2">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Astro Aspect Scores</h4>
                
                {/* Health */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Activity size={12} className="text-rose-500" />
                      Mind & Health
                    </span>
                    <span className="text-rose-600">{metrics.health}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.health}%` }} />
                  </div>
                </div>

                {/* Career */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase size={12} className="text-amber-500" />
                      Finance & Career
                    </span>
                    <span className="text-amber-600">{metrics.career}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.career}%` }} />
                  </div>
                </div>

                {/* Love */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart size={12} className="text-emerald-500" />
                      Family & Relations
                    </span>
                    <span className="text-emerald-600">{metrics.relations}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.relations}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-deep-gold/10 mt-4">
              <div className="bg-white rounded-xl p-2.5 text-center border border-deep-gold/10">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-0.5">Lucky Color</span>
                <span className="font-semibold text-saffron text-xs px-2 py-0.5 bg-saffron/5 rounded-full border border-saffron/10 inline-block mt-0.5">{result.luckyColor}</span>
              </div>
              <div className="bg-white rounded-xl p-2.5 text-center border border-deep-gold/10">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-0.5">Lucky Number</span>
                <span className="font-heading font-extrabold text-saffron text-sm bg-saffron/10 rounded-full w-6 h-6 flex items-center justify-center mx-auto mt-0.5 shadow-inner">{result.luckyNumber}</span>
              </div>
              <div className="bg-white rounded-xl p-2.5 text-center border border-deep-gold/10">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-0.5">Auspicious Time</span>
                <span className="font-semibold text-foreground text-[10px] block mt-1.5">{result.auspiciousTime}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
