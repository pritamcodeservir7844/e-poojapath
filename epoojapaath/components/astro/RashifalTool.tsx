"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { getRashifal } from "@/lib/astro";

const RASHIS = [
  { value: "aries",       label: "Mesh (Aries) ♈"       },
  { value: "taurus",      label: "Vrishabh (Taurus) ♉"   },
  { value: "gemini",      label: "Mithun (Gemini) ♊"     },
  { value: "cancer",      label: "Kark (Cancer) ♋"       },
  { value: "leo",         label: "Simha (Leo) ♌"         },
  { value: "virgo",       label: "Kanya (Virgo) ♍"       },
  { value: "libra",       label: "Tula (Libra) ♎"        },
  { value: "scorpio",     label: "Vrishchik (Scorpio) ♏" },
  { value: "sagittarius", label: "Dhanu (Sagittarius) ♐" },
  { value: "capricorn",   label: "Makar (Capricorn) ♑"   },
  { value: "aquarius",    label: "Kumbh (Aquarius) ♒"    },
  { value: "pisces",      label: "Meen (Pisces) ♓"       },
];

export function RashifalTool() {
  const [rashi,  setRashi]  = useState("");
  const [result, setResult] = useState<ReturnType<typeof getRashifal> | null>(null);

  function calculate() {
    if (!rashi) return;
    setResult(getRashifal(rashi));
  }

  return (
    <div className="space-y-4">
      <Select
        options={RASHIS}
        placeholder="Select your Rashi"
        value={rashi}
        onChange={(e) => setRashi(e.target.value)}
      />
      <Button onClick={calculate} disabled={!rashi} fullWidth>Get Today&apos;s Rashifal 🔮</Button>
      {result && (
        <div className="bg-cream rounded-xl p-4 border border-deep-gold/20 space-y-2 animate-in fade-in">
          <p className="text-dark leading-relaxed text-sm">{result.reading}</p>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center"><p className="text-xs text-muted">Lucky Color</p><p className="font-medium text-saffron text-sm">{result.luckyColor}</p></div>
            <div className="text-center"><p className="text-xs text-muted">Lucky Number</p><p className="font-medium text-saffron text-sm">{result.luckyNumber}</p></div>
            <div className="text-center"><p className="text-xs text-muted">Auspicious Time</p><p className="font-medium text-saffron text-sm">{result.auspiciousTime}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
