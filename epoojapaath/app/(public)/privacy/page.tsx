"use client";

import { useState, useEffect } from "react";
import { PublicPage } from "@/components/shared/PublicPage";
import {
  Database,
  Cog,
  Share2,
  ShieldCheck,
  FileText,
  Lock,
  UserCheck,
  AlertOctagon,
  Users,
  Calendar,
  Mail,
  ArrowRight,
} from "lucide-react";

interface TOCItem {
  id: string;
  label: string;
  icon: any;
}

const SECTIONS: TOCItem[] = [
  { id: "collect", label: "1. Information We Collect", icon: Database },
  { id: "use", label: "2. How We Use Information", icon: Cog },
  { id: "sharing", label: "3. Information Sharing", icon: Share2 },
  { id: "payment-security", label: "4. Payment Security", icon: ShieldCheck },
  { id: "cookies", label: "5. Cookies", icon: FileText },
  { id: "protection", label: "6. Data Protection", icon: Lock },
  { id: "rights", label: "7. User Rights", icon: UserCheck },
  { id: "disclaimer", label: "8. Religious Disclaimer", icon: AlertOctagon },
  { id: "children", label: "9. Children's Privacy", icon: Users },
  { id: "changes", label: "10. Changes to Policy", icon: Calendar },
  { id: "contact", label: "11. Contact Us", icon: Mail },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>("collect");

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
              🔒 Privacy Protection
            </span>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Your trust is sacred to us. Learn how we handle and protect your personal data.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span>Last Updated: <strong>June 2026</strong></span>
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

            {/* Privacy Content */}
            <main className="lg:col-span-3 space-y-12">
              <div className="bg-card border border-border rounded-3xl p-6 md:p-10 space-y-10">
                
                {/* Introduction */}
                <div className="prose max-w-none">
                  <p className="text-lg text-foreground leading-relaxed">
                    Welcome to <strong>ePoojapaath</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how ePoojapaath collects, uses, stores, and protects your information when you use our website, mobile applications, and related services.
                  </p>
                </div>

                <hr className="border-border" />

                {/* 1. Information We Collect */}
                <section id="collect" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Database size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">1. Information We Collect</h2>
                  </div>
                  <div className="pl-12 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>We collect various types of information to serve your devotional and religious requirements:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-card-bg border border-border p-5 rounded-2xl space-y-2">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Personal Info</h4>
                        <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                          <li>Full Name</li>
                          <li>Email Address</li>
                          <li>Mobile Number</li>
                          <li>Postal Address</li>
                          <li>Gotra/Sankalp Details</li>
                        </ul>
                      </div>
                      
                      <div className="bg-card-bg border border-border p-5 rounded-2xl space-y-2">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Transactions</h4>
                        <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                          <li>Puja booking selections</li>
                          <li>Temple options</li>
                          <li>Donation details</li>
                          <li>Payment transaction references</li>
                        </ul>
                      </div>
                      
                      <div className="bg-card-bg border border-border p-5 rounded-2xl space-y-2">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Technical Data</h4>
                        <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                          <li>IP Address</li>
                          <li>Device Info & Browser</li>
                          <li>Cookies and session keys</li>
                          <li>Website preferences</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. How We Use */}
                <section id="use" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Cog size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">2. How We Use Your Information</h2>
                  </div>
                  <div className="pl-12 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p className="mb-2">We process your information to deliver sacred and authentic services:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Process puja bookings, coordination, and ritual scheduling.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Deliver physical prasadam, bhog, and spiritual boxes.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Send updates and confirmations via email, WhatsApp, or SMS.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Improve application performance and client dashboard navigation.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 3. Sharing */}
                <section id="sharing" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Share2 size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">3. Information Sharing</h2>
                  </div>
                  <div className="pl-12 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>We do not sell, rent, or trade your personal information. It is shared only with:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Authorized temples and priests to perform rituals under your name/gotra.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Payment gateway providers (e.g. Razorpay) to complete secure transactions.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 shrink-0" />
                        <span>Logistics partners for dispatching prasadam to your address.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 4. Payment Security */}
                <section id="payment-security" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">4. Payment Security</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    ePoojapaath does not collect, capture, or store your credit/debit card numbers, UPI PINs, CVVs, or internet banking credentials. All payments are securely processed by verified, standard payment gateways complying with international PCI-DSS guidelines.
                  </p>
                </section>

                {/* 5. Cookies */}
                <section id="cookies" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <FileText size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">5. Cookies</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    We use cookies to maintain user sessions, save language selections, and gather basic analytics to enhance UI responsiveness. You can disable cookies inside browser settings, though some customized features might not load.
                  </p>
                </section>

                {/* 6. Protection */}
                <section id="protection" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Lock size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">6. Data Protection</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    We adopt firewall configurations, encryption keys (SSL), and regular codebase reviews to prevent unauthorized data access or leaks. However, complete security for transfers over the public internet cannot be guaranteed.
                  </p>
                </section>

                {/* 7. Rights */}
                <section id="rights" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <UserCheck size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">7. User Rights</h2>
                  </div>
                  <div className="pl-12 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>You can request to view, edit, or delete the personal details stored with us. Contact us at the support email to submit data access or delete queries.</p>
                  </div>
                </section>

                {/* 8. Disclaimer */}
                <section id="disclaimer" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <AlertOctagon size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">8. Religious Services Disclaimer</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base bg-saffron/5 border border-saffron/20 p-4 rounded-2xl">
                    Puja outcomes, spiritual benefits, and religious experiences are matters of individual faith and belief. ePoojapaath does not guarantee any specific spiritual, financial, health, or life outcome from any ritual or service.
                  </p>
                </section>

                {/* 9. Children */}
                <section id="children" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Users size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">9. Children&apos;s Privacy</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    Our platform is designed for use by adults. Children under the age of 18 may only use ePoojapaath under parent or guardian supervision.
                  </p>
                </section>

                {/* 10. Changes */}
                <section id="changes" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Calendar size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">10. Changes to This Privacy Policy</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 text-sm md:text-base">
                    We may update this Privacy Policy periodically. Updated versions will be published on this page along with the revised effective date.
                  </p>
                </section>

                {/* 11. Contact */}
                <section id="contact" className="scroll-mt-28 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 flex items-center justify-center">
                      <Mail size={18} className="text-saffron" />
                    </div>
                    <h2 className="font-heading text-xl text-foreground m-0">11. Contact Us</h2>
                  </div>
                  <div className="pl-12 space-y-4 text-sm md:text-base text-muted-foreground">
                    <p>For privacy-related concerns, questions, or requests, please contact us:</p>
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
                  By using ePoojapaath, you agree to the collection and use of information as described in this Privacy Policy.
                </p>

              </div>
            </main>

          </div>
        </div>
      </div>
    </PublicPage>
  );
}
