"use client";

import { useState } from "react";
import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { RashifalTool } from "@/components/astro/RashifalTool";
import { PanchangTool } from "@/components/astro/PanchangTool";
import { NumerologyTool } from "@/components/astro/NumerologyTool";
import { MuhuratTool } from "@/components/astro/MuhuratTool";

const tools = [
  { id: "rashifal",   icon: "♈", title: "Daily Rashifal",       subtitle: "Zodiac Horoscope",    component: <RashifalTool /> },
  { id: "panchang",   icon: "📅", title: "Daily Panchang",       subtitle: "Vedic Calendar",       component: <PanchangTool /> },
  { id: "muhurat",    icon: "⏰", title: "Muhurat Finder",       subtitle: "Auspicious Timings",  component: <MuhuratTool /> },
  { id: "numerology", icon: "🔢", title: "Name Numerology",      subtitle: "Vedic Path Analysis",  component: <NumerologyTool /> },
];

export default function AstroPage() {
  const [activeTab, setActiveTab] = useState("rashifal");

  const activeTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <PublicPage>
      <PageHero
        sanskrit="ज्योतिष शास्त्र"
        title="Sacred Astrology Tools"
        subtitle="Free Vedic astrology calculators and daily tools. Computed locally using traditional planetary formulas."
      />
      <MandalaDivider />
      
      <section className="section-padding max-w-7xl mx-auto px-4">
        {/* Tab Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tools.map(({ id, icon, title, subtitle }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                  isActive
                    ? "bg-saffron text-white border-saffron shadow-lg scale-102"
                    : "bg-white text-muted-foreground border-deep-gold/15 hover:border-saffron/30 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300">{icon}</span>
                  <div>
                    <h3 className={`font-heading text-sm md:text-base font-bold leading-none ${isActive ? "text-white" : "text-foreground"}`}>{title}</h3>
                    <p className={`text-[10px] md:text-xs leading-tight mt-1.5 ${isActive ? "text-white/80" : "text-muted-foreground"}`}>{subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tool Details Container */}
        <div className="card-devotional p-6 md:p-8">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-deep-gold/15">
            <span className="text-4xl">{activeTool.icon}</span>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold leading-none">{activeTool.title}</h2>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">{activeTool.subtitle}</p>
            </div>
          </div>
          
          {/* Active Component */}
          <div className="mt-4">
            {activeTool.component}
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
