"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getPanchang } from "@/lib/astro";

export function PanchangTool() {
  const [date,   setDate]   = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<ReturnType<typeof getPanchang> | null>(null);

  function calculate() {
    setResult(getPanchang(new Date(date)));
  }

  const fields = result ? [
    { label: "Tithi",          value: result.tithi          },
    { label: "Vara (Day)",     value: result.vara           },
    { label: "Nakshatra",      value: result.nakshatra      },
    { label: "Yoga",           value: result.yoga           },
    { label: "Karana",         value: result.karana         },
    { label: "Rahu Kaal",      value: result.rahuKaal       },
    { label: "Abhijit Muhurat",value: result.abhijitMuhurat },
  ] : [];

  return (
    <div className="space-y-4">
      <Input type="date" label="Select Date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Button onClick={calculate} fullWidth>Calculate Panchang 📅</Button>
      {result && (
        <div className="bg-cream rounded-xl p-4 border border-deep-gold/20 grid grid-cols-2 gap-3 animate-in fade-in">
          {fields.map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg p-2.5 border border-deep-gold/10">
              <p className="text-xs text-muted">{label}</p>
              <p className="font-medium text-dark text-sm mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
