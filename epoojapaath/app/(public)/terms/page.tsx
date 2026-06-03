"use client";

import { useState, useEffect } from "react";
import { PublicPage } from "@/components/shared/PublicPage";
import {
  BookOpen,
  UserCheck,
  UserPlus,
  Sparkles,
  CreditCard,
  RefreshCw,
  Gift,
  Truck,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Eye,
  ExternalLink,
  Pencil,
  Gavel,
  Mail,
  ArrowRight,
} from "lucide-react";

interface TOCItem {
  id: string;
  label: string;
  icon: any;
}

const SECTIONS: TOCItem[] = [
  { id: "about", label: "1. About ePoojapaath", icon: BookOpen },
  { id: "eligibility", label: "2. User Eligibility", icon: UserCheck },
  { id: "account", label: "3. Account Registration", icon: UserPlus },
  { id: "services", label: "4. Puja & Services", icon: Sparkles },
  { id: "payments", label: "5. Bookings & Payments", icon: CreditCard },
  { id: "cancellation", label: "6. Cancellations & Refunds", icon: RefreshCw },
  { id: "donations", label: "7. Donations", icon: Gift },
  { id: "deliveries", label: "8. Prasadam & Deliveries", icon: Truck },
  { id: "ip", label: "9. Intellectual Property", icon: ShieldAlert },
  { id: "prohibited", label: "10. Prohibited Activities", icon: AlertTriangle },
  { id: "liability", label: "11. Limitation of Liability", icon: Scale },
  { id: "privacy", label: "12. Privacy", icon: Eye },
  { id: "third-party", label: "13. Third-Party Services", icon: ExternalLink },
  { id: "modification", label: "14. Modification of Terms", icon: Pencil },
  { id: "jurisdiction", label: "15. Governing Law", icon: Gavel },
  { id: "contact", label: "16. Contact Information", icon: Mail },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>("about");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.offsetTop - 100;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <PublicPage>
      <div className="min-h-screen bg-background pt-16">
        {/* Decorative background shapes */}
        <div className="absolute top-20 left-0 right-0 h-[500px] bg-gradient-to-b from-saffron/5 via-transparent to-transparent pointer-events-none" />

        {/* Header Section */}
        <section className="py-20 text-center relative overflow-hidden border-b border-border bg-gradient-to-b from-card-bg/50 to-transparent">
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--saffron)_0%,transparent_70%)]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-saffron/10 border border-saffron/30 text-saffron text-xs font-semibold px-3 py-1.5 rounded-full">
              📜 Legal Documentation
            </span>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Please read these terms carefully before using our platform.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span>Effective Date: <strong>June 2026</strong></span>
              <span>•</span>
              <span>Version: <strong>2.0</strong></span>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-4 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto hidden lg:block">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                  Table of Contents
                </p>
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all text-left ${
                        isActive
                          ? "bg-saffron text-white shadow-md shadow-saffron/10"
                          : "text-muted-foreground hover:bg-border/50 hover:text-foreground"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-white" : "text-saffron"} />
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Terms Content */}
            <main className="lg:col-span-3 space-y-12">
              <div className="bg-card border border-border rounded-3xl p-6 md:p-10 space-y-10">
                
                {/* Introduction */}
                <div className="prose max-w-none">
                  <p className="text-lg text-foreground leading-relaxed">
                    Welcome to <strong>ePoojapaath</strong>. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ePoojapaath website, mobile applications, and related services (collectively, the &quot;Platform&quot;). By accessing or using our Platform, you agree to be bound by these Terms.
                  </p>
                </div>

                <hr className="border-border" />

                {/* 1. About */}
                <section id="about" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <BookOpen size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">1. About ePoojapaath</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    ePoojapaath is a platform that facilitates the booking of pujas, religious rituals, temple offerings, prasadam delivery, donations, and other spiritual services through associated temples, priests, and service providers.
                  </p>
                </section>

                {/* 2. Eligibility */}
                <section id="eligibility" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <UserCheck size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">2. User Eligibility</h2>
                  </div>
                  <div className="pl-12 space-y-3 text-sm md:text-base">
                    <p className="text-muted-foreground leading-relaxed">By using the Platform, you confirm that:</p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>You are at least 18 years of age or using the Platform under parental supervision.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>You have the legal capacity to enter into binding agreements.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>The information provided by you is accurate and complete.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 3. Account Registration */}
                <section id="account" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <UserPlus size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">3. Account Registration</h2>
                  </div>
                  <div className="pl-12 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>Users may be required to create an account for certain services. You agree to:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Provide accurate and complete information.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Maintain the confidentiality of your login credentials.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Accept responsibility for activities conducted through your account.</span>
                      </li>
                    </ul>
                    <p className="bg-border/20 border-l-2 border-border p-3 rounded-r-xl text-xs">
                      ePoojapaath reserves the right to suspend or terminate accounts that provide false information or misuse the Platform.
                    </p>
                  </div>
                </section>

                {/* 4. Services */}
                <section id="services" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Sparkles size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">4. Puja and Religious Services</h2>
                  </div>
                  <div className="pl-12 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-card-bg border border-border p-4 rounded-2xl">
                        <h4 className="font-bold text-foreground mb-1.5 text-xs uppercase tracking-wide">Facilitator Role</h4>
                        <p className="text-xs">ePoojapaath acts purely as a facilitator between devotees, temples, and priests.</p>
                      </div>
                      <div className="bg-card-bg border border-border p-4 rounded-2xl">
                        <h4 className="font-bold text-foreground mb-1.5 text-xs uppercase tracking-wide">Traditions</h4>
                        <p className="text-xs">Rituals are conducted according to the customs and procedures of the respective temple.</p>
                      </div>
                      <div className="bg-card-bg border border-border p-4 rounded-2xl">
                        <h4 className="font-bold text-foreground mb-1.5 text-xs uppercase tracking-wide">Faith & Belief</h4>
                        <p className="text-xs">Outcomes are matters of faith. We do not guarantee specific personal, medical, or life results.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5. Payments */}
                <section id="payments" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <CreditCard size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">5. Bookings and Payments</h2>
                  </div>
                  <div className="pl-12 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>All prices displayed are subject to change without prior notice.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Payment must be completed before confirmation of services.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Booking confirmations will be sent via email, SMS, or WhatsApp.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Users must provide accurate details for puja performance and prasad delivery.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 6. Cancellation */}
                <section id="cancellation" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <RefreshCw size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">6. Cancellation and Refund Policy</h2>
                  </div>
                  <div className="pl-12 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>Once a puja has been performed, no refund shall be issued. For other cancellations, eligibility depends on the stage of processing, temple policies, and procurement of ritual materials.</p>
                    <p className="bg-saffron/5 border border-saffron/20 p-4 rounded-2xl text-xs flex gap-3 items-start text-foreground">
                      <AlertTriangle className="text-saffron shrink-0 mt-0.5" size={16} />
                      <span><strong>Force Majeure:</strong> Services may be delayed, rescheduled, or cancelled due to circumstances beyond reasonable control, including natural disasters, temple closures, or government restrictions.</span>
                    </p>
                  </div>
                </section>

                {/* 7. Donations */}
                <section id="donations" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Gift size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">7. Donations</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    Donations made through the Platform are forwarded directly to the designated temple, trust, or religious institution. Once successfully transferred, donations are non-refundable unless otherwise required by law.
                  </p>
                </section>

                {/* 8. Prasadam */}
                <section id="deliveries" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Truck size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">8. Prasadam and Physical Deliveries</h2>
                  </div>
                  <div className="pl-12 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>Delivery timelines are estimates only. Delays caused by courier partners, weather conditions, or regional restrictions are beyond our control.</p>
                    <p className="text-xs text-muted-foreground italic">
                      Note: ePoojapaath shall not be responsible for failed deliveries caused by incorrect delivery addresses supplied by users.
                    </p>
                  </div>
                </section>

                {/* 9. IP */}
                <section id="ip" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <ShieldAlert size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">9. Intellectual Property</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    All content available on the Platform, including text, images, logos, designs, videos, software, and branding, is the property of ePoojapaath or its licensors and is protected by applicable intellectual property laws.
                  </p>
                </section>

                {/* 10. Prohibited */}
                <section id="prohibited" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <AlertTriangle size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">10. Prohibited Activities</h2>
                  </div>
                  <div className="pl-12 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>Users agree not to violate any applicable laws, misrepresent personal information, upload harmful software/code, or interfere with Platform operations.</p>
                  </div>
                </section>

                {/* 11. Liability */}
                <section id="liability" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Scale size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">11. Limitation of Liability</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    To the maximum extent permitted by law, ePoojapaath, its founders, employees, and partners shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid for the specific service.
                  </p>
                </section>

                {/* 12. Privacy */}
                <section id="privacy" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Eye size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">12. Privacy</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    Your use of the Platform is also governed by our Privacy Policy, which explains how personal information is collected, used, and protected.
                  </p>
                </section>

                {/* 13. Third-Party */}
                <section id="third-party" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <ExternalLink size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">13. Third-Party Services</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    The Platform integrates with third-party service providers (payment gateways, logistics partners). We are not responsible for their independent actions, policies, or practices.
                  </p>
                </section>

                {/* 14. Modification */}
                <section id="modification" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Pencil size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">14. Modification of Terms</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    ePoojapaath reserves the right to modify these Terms at any time. Updated Terms shall become effective upon publication on the Platform.
                  </p>
                </section>

                {/* 15. Jurisdiction */}
                <section id="jurisdiction" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Gavel size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">15. Governing Law and Jurisdiction</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Agartala, West Tripura, India.
                  </p>
                </section>

                {/* 16. Contact */}
                <section id="contact" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Mail size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">16. Contact Information</h2>
                  </div>
                  <div className="pl-12 space-y-4 text-sm md:text-base text-muted-foreground">
                    <p>For questions regarding these Terms, please contact us:</p>
                    <div className="bg-gradient-to-r from-saffron/10 to-deep-gold/5 border border-saffron/30 rounded-2xl p-6 text-foreground space-y-3 max-w-md shadow-sm">
                      <p className="font-bold text-lg text-saffron mb-1">ePoojapaath Support</p>
                      <div className="space-y-1 text-xs md:text-sm">
                        <p><span className="text-muted-foreground">Email:</span> <a href="mailto:support@epoojapaath.com" className="text-saffron hover:underline font-semibold">support@epoojapaath.com</a></p>
                        <p><span className="text-muted-foreground">Website:</span> <a href="https://www.epoojapaath.com" target="_blank" rel="noopener noreferrer" className="text-saffron hover:underline font-semibold">www.epoojapaath.com</a></p>
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-border" />

                <p className="text-center text-xs italic text-muted-foreground/60">
                  By accessing or using ePoojapaath, you acknowledge that you have read, understood, and agreed to these Terms of Service.
                </p>

              </div>
            </main>

          </div>
        </div>
      </div>
    </PublicPage>
  );
}
