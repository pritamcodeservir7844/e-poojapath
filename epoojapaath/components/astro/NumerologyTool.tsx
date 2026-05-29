"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getNumerology } from "@/lib/astro";
import { Award, Compass, HelpCircle, Star } from "lucide-react";

export function NumerologyTool() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getNumerology> | null>(null);

  function calculate() {
    if (!name.trim()) return;
    setResult(getNumerology(name.trim()));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column: Form input */}
      <div className="w-full lg:w-[35%] shrink-0">
        <div className="bg-white border border-deep-gold/15 rounded-2xl p-5 shadow-sm space-y-4">
          <Input 
            label="🔢 Devotee Full Name" 
            placeholder="e.g. Ramesh Kumar Sharma" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Button onClick={calculate} disabled={!name.trim()} fullWidth>
            Calculate Numerology 🔮
          </Button>
          <div className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1 bg-muted/30 p-2.5 rounded-lg">
            <HelpCircle size={12} className="shrink-0 mt-0.5" />
            <span>Calculates your Life Path Number locally using Chaldean-Vedic numerological formulas.</span>
          </div>
        </div>
      </div>

      {/* Right Column: Numerological Results */}
      <div className="flex-grow">
        {result ? (
          <div className="bg-saffron/[0.01] border border-deep-gold/15 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center gap-6 animate-in fade-in">
            {/* Golden Mandala life path number */}
            <div className="shrink-0 text-center relative flex items-center justify-center w-36 h-36 border-4 border-double border-saffron rounded-full bg-saffron/5 shadow-inner">
              <div className="absolute inset-2 border border-dashed border-saffron/30 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="relative">
                <span className="font-heading font-extrabold text-saffron text-5xl md:text-6xl block leading-none">
                  {result.lifePathNumber}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">
                  Path Number
                </span>
              </div>
            </div>

            {/* Trait Descriptions */}
            <div className="flex-grow space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-deep-gold/10">
                <Award size={18} className="text-saffron" />
                <h3 className="font-heading text-base font-bold text-foreground">Vedic Number Personality</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed italic bg-saffron/5 p-4 rounded-xl border border-saffron/10">
                &ldquo;{result.traits}&rdquo;
              </p>
              
              {/* Lucky Numbers Grid */}
              <div className="pt-1 flex items-center gap-3">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Star size={12} className="text-saffron" /> Lucky Numbers:
                </span>
                <div className="flex gap-2">
                  {result.luckyNumbers.map((num, i) => (
                    <span 
                      key={i} 
                      className="font-heading font-extrabold text-saffron bg-saffron/15 rounded-full w-7 h-7 flex items-center justify-center shadow-sm text-xs border border-saffron/20"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-deep-gold/15 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-saffron/[0.01]">
            <span className="text-4xl mb-3">🔮</span>
            <h4 className="font-heading text-foreground font-semibold">Ready for Analysis</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">Enter your name on the left to reveal your Vedic Life Path Number and personality traits.</p>
          </div>
        )}
      </div>
    </div>
  );
}
