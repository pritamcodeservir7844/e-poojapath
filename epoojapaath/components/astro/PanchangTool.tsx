"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { getPanchang, parseLocalDate } from "@/lib/astro";
import { Sun, Sunrise, Sunset, Moon, ShieldAlert, Sparkles, Compass, Calendar, MoonStar, BookOpen } from "lucide-react";

export function PanchangTool() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<ReturnType<typeof getPanchang> | null>(null);

  // Automatically recalculate on mount and when date changes
  useEffect(() => {
    setResult(getPanchang(parseLocalDate(date)));
  }, [date]);

  // Generate deterministic sunrise/sunset based on day of year
  const timings = useMemo(() => {
    const d = parseLocalDate(date);
    const doy = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    
    const riseMins = 325 + Math.floor(Math.sin((doy / 365) * 2 * Math.PI) * 25);
    const riseHr = Math.floor(riseMins / 60);
    const riseMin = riseMins % 60;
    
    const setMins = 1095 + Math.floor(Math.sin((doy / 365) * 2 * Math.PI) * 28);
    const setHr = Math.floor(setMins / 60) - 12;
    const setMin = setMins % 60;

    // Simulate moonrise/moonset offset by 50 mins per day
    const moonriseHour = (doy % 24);
    const moonriseMin = (doy * 17) % 60;
    const moonriseStr = `${moonriseHour === 0 ? 12 : moonriseHour > 12 ? moonriseHour - 12 : moonriseHour}:${moonriseMin < 10 ? "0" : ""}${moonriseMin} ${moonriseHour >= 12 ? "PM" : "AM"}`;

    return {
      sunrise: `${riseHr}:${riseMin < 10 ? "0" : ""}${riseMin} AM`,
      sunset: `${setHr}:${setMin < 10 ? "0" : ""}${setMin} PM`,
      moonrise: moonriseStr,
    };
  }, [date]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column: Date Input & Sun/Moon Timings */}
      <div className="w-full lg:w-[35%] shrink-0 space-y-4">
        <div className="bg-white border border-deep-gold/15 rounded-2xl p-5 shadow-sm space-y-4">
          <Input 
            type="date" 
            label="📅 Select Calendar Date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />

          {/* Sunrise / Sunset Widget */}
          <div className="pt-2">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-deep-gold/10 pb-2">
              <Sun size={12} className="text-amber-500" /> Vedic Solar Timings
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-500/[0.04] border border-amber-500/10 rounded-xl p-3 flex items-center gap-2.5">
                <Sunrise className="text-amber-500 shrink-0" size={20} />
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block leading-none mb-1">Sunrise</span>
                  <span className="text-xs font-bold text-foreground">{timings.sunrise}</span>
                </div>
              </div>
              <div className="bg-orange-500/[0.04] border border-orange-500/10 rounded-xl p-3 flex items-center gap-2.5">
                <Sunset className="text-orange-500 shrink-0" size={20} />
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block leading-none mb-1">Sunset</span>
                  <span className="text-xs font-bold text-foreground">{timings.sunset}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Moon Timings Widget */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-deep-gold/10 pb-2">
              <Moon size={12} className="text-indigo-500" /> Lunar Timings
            </h4>
            <div className="bg-indigo-500/[0.04] border border-indigo-500/10 rounded-xl p-3 flex items-center gap-2.5">
              <MoonStar className="text-indigo-500 shrink-0" size={20} />
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase block leading-none mb-1">Moonrise (Chandrodaya)</span>
                <span className="text-xs font-bold text-foreground">{timings.moonrise}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Detailed Panchang Coordinates */}
      <div className="flex-grow space-y-4">
        {result && (
          <div className="bg-saffron/[0.01] border border-deep-gold/15 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
            
            {/* Muhurat Times */}
            <div>
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-deep-gold/10 pb-2">
                <Sparkles size={12} className="text-saffron" /> Auspicious & Inauspicious Timings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Auspicious Timings */}
                <div className="bg-emerald-500/[0.04] border border-emerald-500/15 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                      <Sparkles size={14} />
                    </span>
                    <span className="text-xs font-bold text-emerald-800">Shubh Muhurat</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Abhijit Muhurat:</span>
                      <span className="font-extrabold text-emerald-700">{result.abhijitMuhurat}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Amrit Kaal:</span>
                      <span className="font-extrabold text-emerald-700">{result.amritKaal}</span>
                    </div>
                  </div>
                </div>

                {/* Inauspicious Timings */}
                <div className="bg-rose-500/[0.04] border border-rose-500/15 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-md bg-rose-500/10 text-rose-600">
                      <ShieldAlert size={14} />
                    </span>
                    <span className="text-xs font-bold text-rose-800">Ashubh Samay (Avoid)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Rahu Kaal:</span>
                      <span className="font-extrabold text-rose-700">{result.rahuKaal}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Yamaganda:</span>
                      <span className="font-extrabold text-rose-700">{result.yamaganda}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Gulika Kaal:</span>
                      <span className="font-extrabold text-amber-700">{result.gulikaKaal}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Dur Muhurat:</span>
                      <span className="font-extrabold text-rose-600/80">{result.durMuhurat}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Hindu Calendar Details */}
            <div>
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-deep-gold/10 pb-2">
                <BookOpen size={12} className="text-saffron" /> Hindu Calendar Coordinates (मुख्य पंचांग)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Hindu Month (मास)</p>
                  <p className="font-heading font-extrabold text-saffron text-sm mt-1">{result.hinduMonth}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Paksha (पक्ष)</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.paksha}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Season (ऋतु)</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.ritu}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Ayana (अयन)</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.ayana}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Vikram Samvat</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.vikramSamvat}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Shaka Samvat</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.shakaSamvat}</p>
                </div>
              </div>
            </div>

            {/* Astrological Coordinates */}
            <div>
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-deep-gold/10 pb-2">
                <Compass size={12} className="text-saffron" /> Astrological Elements (ज्योतिषीय गणना)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Tithi (तिथि)</p>
                  <p className="font-heading font-extrabold text-saffron text-sm mt-1">{result.tithi}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Lunar Day</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Nakshatra (नक्षत्र)</p>
                  <p className="font-heading font-extrabold text-foreground text-sm mt-1">{result.nakshatra}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Moon Constellation</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Yoga (योग)</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.yoga}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Solar-Lunar Angle</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Karana (करण)</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.karana}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Half of Tithi</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Vara (वार)</p>
                  <p className="font-semibold text-foreground text-xs mt-1.5">{result.vara}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Week Day</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-deep-gold/10 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Rashi (राशि)</p>
                    <p className="font-semibold text-foreground text-xs mt-1">Chandra Dev</p>
                  </div>
                  <Moon className="text-saffron opacity-80 shrink-0" size={20} />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
