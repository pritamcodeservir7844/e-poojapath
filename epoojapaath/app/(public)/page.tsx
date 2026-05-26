export const dynamic = "force-dynamic";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/home/Hero";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { FeaturedTemples } from "@/components/home/FeaturedTemples";
import { PopularPujas } from "@/components/home/PopularPujas";
import { ChadawaSection } from "@/components/home/ChadawaSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Stats } from "@/components/home/Stats";
import { DPIITRecognition } from "@/components/home/DPIITRecognition";
import { BlogPreview } from "@/components/home/BlogPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { TempleRegisterCTA } from "@/components/home/TempleRegisterCTA";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { AdBanner } from "@/components/ads/AdBanner";
import { AIChat } from "@/components/ai-chat/AIChat";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";
import { getActiveAd } from "@/services/ad.service";
import { serialize } from "@/lib/utils";

export default async function HomePage() {
  const heroAd = serialize(await getActiveAd("hero").catch(() => null)) as any;
  const sectionAd = serialize(await getActiveAd("between-sections").catch(() => null)) as any;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {heroAd && <AdBanner ad={heroAd} />}
        <MarqueeStrip />
        <MandalaDivider />
        <FeaturedTemples />
        <MandalaDivider />
        <PopularPujas />
        <MandalaDivider />
        <ChadawaSection />
        {sectionAd && <AdBanner ad={sectionAd} />}
        <MandalaDivider />
        <HowItWorks />
        <Stats />
        <MandalaDivider />
        <DPIITRecognition />
        <MandalaDivider />
        <BlogPreview />
        <MandalaDivider />
        <Testimonials />
        <TempleRegisterCTA />
      </main>
      <Footer />
      <AIChat />
      <WhatsAppWidget />
    </>
  );
}

