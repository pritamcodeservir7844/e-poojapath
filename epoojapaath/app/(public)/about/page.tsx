import { PublicPage } from "@/components/shared/PublicPage";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import Link from "next/link";

const team = [
  { name: "Acharya Ramkrishna Das", role: "Founder & Spiritual Director", avatar: "🕉️" },
  { name: "Priya Mishra",           role: "Co-Founder & CEO",             avatar: "🌸" },
  { name: "Arjun Sharma",           role: "CTO & Lead Engineer",          avatar: "💻" },
  { name: "Sunita Devi",            role: "Head of Temple Relations",     avatar: "🛕" },
];

export default function AboutPage() {
  return (
    <PublicPage>
      <div className="pt-4">
        {/* Hero */}
        <section className="py-20 bg-dark text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#D4820A_0%,transparent_70%)]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <p className="font-sanskrit text-saffron mb-3 text-lg">हमारे बारे में</p>
            <h1 className="font-heading text-5xl md:text-6xl text-cream mb-6">Our Story</h1>
            <p className="text-cream/60 text-xl leading-relaxed">
              Born from a devotee&apos;s wish to connect with their ancestral temple in Varanasi —
              ePoojapaath bridges the gap between devotion and distance.
            </p>
          </div>
        </section>

        <MandalaDivider />

        {/* Mission & Vision */}
        <section className="section-padding max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-devotional">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="font-heading text-2xl text-foreground mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make divine worship accessible to every devotee — regardless of geography. We empower temples with technology and connect millions of believers with their chosen deities through authentic, verified puja bookings and offerings.
              </p>
            </div>
            <div className="card-devotional">
              <div className="text-4xl mb-4">🔭</div>
              <h2 className="font-heading text-2xl text-foreground mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where no devotee is too far from their deity. We envision India&apos;s spiritual infrastructure powered by technology — with every temple, pandit, and devotee connected through a single divine platform.
              </p>
            </div>
          </div>
        </section>

        <MandalaDivider />

        {/* Founding Story */}
        <section className="section-padding bg-gradient-to-b from-cream to-card-bg">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-sanskrit text-saffron mb-3">संस्थापन की कहानी</p>
            <h2 className="font-heading text-3xl text-foreground mb-6">The Founding Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In 2023, our founder Acharya Ramkrishna Das was living in Bangalore, unable to attend his family&apos;s annual puja at Kashi Vishwanath. He called the temple trust — but there was no way to book online, no live stream, no confirmation. Just uncertainty.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              That night, ePoojapaath was conceived — a platform where technology serves spirituality, not replaces it. Where a devotee in London can offer flowers to Mata Vaishno Devi, and a family in Chennai can participate in a Navgrah puja at Ujjain.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we serve 1,00,000+ devotees across 500+ temples with the same devotional intent — <em className="text-saffron font-medium">ॐ सर्वे भवन्तु सुखिनः</em>.
            </p>
          </div>
        </section>

        <MandalaDivider />

        {/* Stats */}
        <section className="py-16 bg-gradient-to-r from-saffron to-deep-gold">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { val: "500+",    label: "Temples"    },
                { val: "50+",     label: "Cities"     },
                { val: "1 Lakh+", label: "Devotees"   },
                { val: "10K+",    label: "Bookings"   },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="font-heading text-4xl text-white">{val}</div>
                  <div className="text-white/70 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MandalaDivider />

        {/* Team */}
        <section className="section-padding max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-sanskrit text-saffron mb-2">हमारी टीम</p>
            <h2 className="font-heading text-4xl text-foreground">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, avatar }) => (
              <div key={name} className="card-devotional text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-saffron/10 flex items-center justify-center text-4xl mb-3">
                  {avatar}
                </div>
                <h3 className="font-heading text-foreground text-base">{name}</h3>
                <p className="text-muted-foreground text-xs mt-1">{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-dark text-center">
          <h2 className="font-heading text-4xl text-cream mb-4">Partner With Us</h2>
          <p className="text-cream/60 mb-8 max-w-xl mx-auto">
            Are you a temple trustee, pandit, or spiritual organization? Join ePoojapaath and bring your temple to thousands of devotees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/temple/register" className="btn-saffron px-10 py-4 text-base">
              Register Your Temple
            </Link>
            <Link href="/contact" className="btn-outline-gold border-cream/30 text-cream hover:bg-cream hover:text-dark px-10 py-4 text-base">
              Contact Us
            </Link>
          </div>
          <p className="text-cream/30 text-sm mt-6">📞 +91 98765 43210 • 📧 support@epoojapaath.com</p>
        </section>
      </div>
    </PublicPage>
  );
}
