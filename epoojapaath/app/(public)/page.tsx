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
import { getActiveAds } from "@/services/ad.service";
import { serialize } from "@/lib/utils";

export default async function HomePage() {
  const heroAds = serialize(await getActiveAds("hero").catch(() => [])) as any[];
  const sectionAds = serialize(await getActiveAds("between-sections").catch(() => [])) as any[];

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {heroAds.length > 0 && <AdBanner ads={heroAds} />}
        <MarqueeStrip />
        <MandalaDivider />
        <FeaturedTemples />
        <MandalaDivider />
        <PopularPujas />
        <MandalaDivider />
        <ChadawaSection />
        {sectionAds.length > 0 && <AdBanner ads={sectionAds} />}
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

