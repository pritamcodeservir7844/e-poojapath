"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select, Input } from "@/components/ui/Input";
import { getMuhurats, parseLocalDate } from "@/lib/astro";
import { Clock, HelpCircle, Flame, CalendarRange } from "lucide-react";

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
    setResults(getMuhurats(event, parseLocalDate(fromDate), toDate ? parseLocalDate(toDate) : undefined));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column: Form Inputs */}
      <div className="w-full lg:w-[35%] shrink-0">
        <div className="bg-white border border-deep-gold/15 rounded-2xl p-5 shadow-sm space-y-4">
          <Select 
            options={EVENT_TYPES} 
            placeholder="Select Event Type" 
            value={event} 
            onChange={(e) => setEvent(e.target.value)} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <Input 
              type="date" 
              label="From Date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
            />
            <Input 
              type="date" 
              label="To Date (optional)" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
            />
          </div>
          <Button onClick={calculate} disabled={!event || !fromDate} fullWidth>
            Find Auspicious Muhurats ⏰
          </Button>
          <div className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1 bg-muted/30 p-2.5 rounded-lg">
            <HelpCircle size={12} className="shrink-0 mt-0.5" />
            <span>Computes Amrit and Siddha muhurat timings based on auspicious tithi alignments.</span>
          </div>
        </div>
      </div>

      {/* Right Column: Listing results */}
      <div className="flex-grow">
        {results ? (
          <div className="bg-saffron/[0.01] border border-deep-gold/15 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-deep-gold/10">
              <CalendarRange size={18} className="text-saffron" />
              <h3 className="font-heading text-base font-bold text-foreground">Auspicious Dates Found</h3>
            </div>
            
            {results.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">😢</p>
                <p className="text-muted-foreground text-sm font-medium">No auspicious dates found in this range.</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Try expanding your dates or checking a different event type.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-deep-gold/10 hover:border-saffron/30 hover:shadow-sm transition-all group">
                    <div className="p-2.5 rounded-xl bg-saffron/10 text-saffron group-hover:bg-saffron group-hover:text-white transition-all shadow-inner relative flex items-center justify-center shrink-0">
                      <Flame size={18} className="animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm group-hover:text-saffron transition-colors">
                        {m.date}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Clock size={10} />
                        <span>{m.time}</span>
                        <span className="text-muted-foreground/35">•</span>
                        <span className="text-saffron font-bold">{m.tithi}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-deep-gold/15 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-saffron/[0.01]">
            <span className="text-4xl mb-3">⏰</span>
            <h4 className="font-heading text-foreground font-semibold">Ready for Calculation</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">Select your event type and the date range on the left to compute holy timings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
