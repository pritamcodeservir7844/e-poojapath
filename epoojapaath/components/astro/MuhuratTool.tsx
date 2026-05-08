"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select, Input } from "@/components/ui/Input";
import { getMuhurats } from "@/lib/astro";

const EVENT_TYPES = [
  { value: "marriage",        label: "Marriage" },
  { value: "griha-pravesh",   label: "Griha Pravesh" },
  { value: "naming-ceremony", label: "Naming Ceremony" },
  { value: "business",        label: "Business Start" },
  { value: "travel",          label: "Travel" },
];

export function MuhuratTool() {
  const [event,    setEvent]    = useState("");
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate,   setToDate]   = useState("");
  const [results,  setResults]  = useState<ReturnType<typeof getMuhurats> | null>(null);

  function calculate() {
    if (!event || !fromDate) return;
    setResults(getMuhurats(event, new Date(fromDate), toDate ? new Date(toDate) : undefined));
  }

  return (
    <div className="space-y-4">
      <Select options={EVENT_TYPES} placeholder="Select event type" value={event} onChange={(e) => setEvent(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Input type="date" label="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <Input type="date" label="To Date (optional)" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>
      <Button onClick={calculate} disabled={!event || !fromDate} fullWidth>Find Muhurats ⏰</Button>
      {results && (
        <div className="bg-cream rounded-xl p-4 border border-deep-gold/20 space-y-2 animate-in fade-in">
          {results.length === 0 ? (
            <p className="text-muted text-sm text-center">No auspicious muhurats found in this range.</p>
          ) : (
            results.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-deep-gold/10">
                <span className="text-lg">🪔</span>
                <div>
                  <p className="font-medium text-dark text-sm">{m.date}</p>
                  <p className="text-xs text-muted">{m.time} • {m.tithi}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
