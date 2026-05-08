"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getNumerology } from "@/lib/astro";

export function NumerologyTool() {
  const [name,   setName]   = useState("");
  const [result, setResult] = useState<ReturnType<typeof getNumerology> | null>(null);

  function calculate() {
    if (!name.trim()) return;
    setResult(getNumerology(name.trim()));
  }

  return (
    <div className="space-y-4">
      <Input label="Enter Full Name" placeholder="e.g. Ramesh Kumar Sharma" value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={calculate} disabled={!name.trim()} fullWidth>Calculate Numerology 🔢</Button>
      {result && (
        <div className="bg-cream rounded-xl p-4 border border-deep-gold/20 space-y-3 animate-in fade-in">
          <div className="text-center">
            <p className="font-heading text-5xl text-saffron">{result.lifePathNumber}</p>
            <p className="text-sm text-muted">Life Path Number</p>
          </div>
          <p className="text-sm text-dark">{result.traits}</p>
          <p className="text-xs text-muted">Lucky Numbers: <span className="text-saffron font-medium">{result.luckyNumbers.join(", ")}</span></p>
        </div>
      )}
    </div>
  );
}
