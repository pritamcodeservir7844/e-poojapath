import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { RashifalTool } from "@/components/astro/RashifalTool";
import { PanchangTool } from "@/components/astro/PanchangTool";
import { NumerologyTool } from "@/components/astro/NumerologyTool";
import { MuhuratTool } from "@/components/astro/MuhuratTool";

const tools = [
  { id: "rashifal",   icon: "♈", title: "Rashifal",       subtitle: "Daily Zodiac Horoscope",     component: <RashifalTool /> },
  { id: "panchang",   icon: "📅", title: "Panchang",       subtitle: "Daily Hindu Calendar",        component: <PanchangTool /> },
  { id: "numerology", icon: "🔢", title: "Name Numerology", subtitle: "Vedic Number Analysis",     component: <NumerologyTool /> },
  { id: "muhurat",    icon: "⏰", title: "Muhurat Finder", subtitle: "Auspicious Time Calculator",  component: <MuhuratTool /> },
];

export default function AstroPage() {
  return (
    <PublicPage>
      <PageHero
        sanskrit="ज्योतिष शास्त्र"
        title="Sacred Astrology Tools"
        subtitle="Free Vedic astrology tools — no external API, all calculated locally using traditional formulas."
      />
      <MandalaDivider />
      <section className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map(({ id, icon, title, subtitle, component }) => (
            <div key={id} className="card-devotional">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h2 className="font-heading text-2xl text-dark">{title}</h2>
                  <p className="text-muted text-sm">{subtitle}</p>
                </div>
              </div>
              {component}
            </div>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
