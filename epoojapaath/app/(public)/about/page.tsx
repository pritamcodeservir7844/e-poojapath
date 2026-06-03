import { PublicPage } from "@/components/shared/PublicPage";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import Link from "next/link";

const team = [
  {
    name: "Rajesh Debnath",
    role: "Founder & CEO",
    avatar: "🕉️",
    description: "Rajesh Debnath is the founder of ePoojapaath, a platform dedicated to making authentic temple rituals and spiritual services accessible to devotees worldwide. Driven by a passion for preserving sacred traditions through technology, he envisions a future where every devotee can stay connected to their faith, regardless of location."
  },
  {
    name: "Bikash Majumder",
    role: "Co-Founder & COO",
    avatar: "🌸",
    description: "Bikash Majumder, Co-Founder of ePoojapaath, is passionate about making authentic spiritual services accessible to devotees everywhere. Through operational excellence, innovation, and a commitment to sacred traditions, he helps deliver trusted and meaningful devotional experiences."
  },
  {
    name: "D Kakali",
    role: "Head of Marketing & Temple Relations",
    avatar: "🛕",
    description: "D Kakali, Head of Marketing & Temple Relations at ePoojapaath, is dedicated to building strong partnerships with temples and connecting devotees with authentic spiritual experiences. Through her leadership in outreach, communications, and relationship management, she helps advance ePoojapaath's mission of bringing faith and tradition closer to every devotee."
  }
];

export default function AboutPage() {
  return (
    <PublicPage>
      <div className="pt-4">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-lotus-pink/15 via-lotus-purple/10 to-lotus-blue/15 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#EC9DD4_0%,transparent_70%)]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <p className="font-sanskrit text-saffron mb-3 text-lg">हमारे बारे में</p>
            <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-6">About Us</h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-3xl mx-auto">
              Every prayer carries a hope, every offering carries a blessing. ePoojapaath was created to help devotees connect with sacred temples and divine rituals from anywhere in the world. We bring faith closer, making every puja a meaningful spiritual experience.
            </p>
          </div>
        </section>

        <MandalaDivider />

        {/* Mission & Vision */}
        <section className="section-padding max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-devotional">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="font-heading text-2xl text-foreground mb-3">Mission Statement</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make authentic Hindu rituals, temple pujas, and spiritual services accessible to every devotee, regardless of location, by connecting them with trusted priests, sacred temples, and seamless digital experiences. We are committed to preserving traditions, fostering faith, and delivering divine blessings with transparency, devotion, and trust.
              </p>
            </div>
            <div className="card-devotional">
              <div className="text-4xl mb-4">🔭</div>
              <h2 className="font-heading text-2xl text-foreground mb-3">Vision Statement</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the world's most trusted digital platform for spiritual and religious services, connecting millions of devotees with sacred temples, authentic rituals, and timeless traditions while preserving India's rich spiritual heritage for future generations.
              </p>
            </div>
          </div>
        </section>

        <MandalaDivider />

        {/* Founding Story */}
        <section className="section-padding bg-gradient-to-b from-background to-card-bg px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="font-sanskrit text-saffron mb-3">संस्थापन की कहानी</p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground">Our Founding Story</h2>
            </div>
            
            <div className="prose prose-stone dark:prose-invert max-w-3xl mx-auto text-muted-foreground leading-relaxed space-y-6 text-center">
              <p>
                ePoojapaath was born from a simple realization: while faith has no boundaries, access to sacred temples and authentic rituals often does.
              </p>
              <p>
                Many devotees living away from their hometowns, traveling for work, or residing abroad longed to participate in temple pujas and seek divine blessings but found it difficult to do so. Traditional spiritual services were often fragmented, lacked transparency, and were not easily accessible.
              </p>
              <p>
                To bridge this gap, ePoojapaath was created with a vision to connect devotees directly with trusted temples and qualified priests through a seamless digital platform. By combining ancient traditions with modern technology, we make it possible for anyone, anywhere in the world, to participate in authentic pujas, receive prasadam, and stay connected to their spiritual roots.
              </p>
              <p>
                Today, ePoojapaath is more than a platform—it is a bridge between devotion and accessibility, helping thousands of devotees experience the power of faith, regardless of distance.
              </p>
            </div>

            {/* Bhagavad Gita Quote */}
            <div className="mt-12 py-8 px-8 rounded-2xl bg-saffron/5 border border-saffron/15 max-w-2xl mx-auto text-center shadow-sm">
              <p className="font-sanskrit text-saffron text-xl md:text-2xl mb-3 leading-relaxed">
                पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।
                <br />
                तदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥
              </p>
              <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">— Bhagavad Gita 9.26</p>
            </div>
          </div>
        </section>

        <MandalaDivider />

        {/* Team */}
        <section className="section-padding max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-sanskrit text-saffron mb-2">हमारी टीम</p>
            <h2 className="font-heading text-4xl text-foreground">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({ name, role, avatar, description }) => (
              <div key={name} className="card-devotional text-center p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center text-4xl mb-4">
                  {avatar}
                </div>
                <h3 className="font-heading text-foreground text-lg font-bold mb-1">{name}</h3>
                <p className="text-saffron text-sm font-medium mb-4">{role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <MandalaDivider />

        {/* CTA */}
        <section className="section-padding bg-gradient-to-br from-lotus-pink/15 via-lotus-purple/10 to-lotus-blue/15 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#94AAEE_0%,transparent_70%)]" />
          </div>
          <div className="relative z-10">
            <h2 className="font-heading text-4xl text-foreground mb-4">Partner With Us</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Are you a temple trustee, pandit, or spiritual organization? Contact us to register your temple and bring your temple to thousands of devotees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-saffron px-10 py-4 text-base">
                Contact Us
              </Link>
            </div>
            <p className="text-muted-foreground/60 text-sm mt-6">📞 +91 91650 57755 • 📧 support@epoojapaath.com</p>
          </div>
        </section>
      </div>
    </PublicPage>
  );
}
