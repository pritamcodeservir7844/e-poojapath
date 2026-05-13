"use client";

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

const steps = [
  {
    icon: "🛕", step: "01",
    en: { title: "Choose Your Temple",       desc: "Browse 500+ verified temples across India. Filter by deity, city, or puja type." },
    hi: { title: "मंदिर चुनें",               desc: "भारत के 500+ प्रमाणित मंदिर देखें। देवता, शहर या पूजा के प्रकार से फ़िल्टर करें।" },
  },
  {
    icon: "📿", step: "02",
    en: { title: "Select Puja or Chadawa",   desc: "Pick from curated rituals — Rudrabhishek, Satyanarayan, Navgrah, or custom offerings." },
    hi: { title: "पूजा या चढ़ावा चुनें",       desc: "रुद्राभिषेक, सत्यनारायण, नवग्रह या कस्टम अर्पण — अपनी पसंद की पूजा चुनें।" },
  },
  {
    icon: "🪔", step: "03",
    en: { title: "Book & Pay Securely",      desc: "Fill your Sankalp, choose date, and pay via Razorpay. 100% secure, instant confirmation." },
    hi: { title: "बुक करें और सुरक्षित भुगतान करें", desc: "संकल्प भरें, तारीख चुनें और Razorpay से भुगतान करें। 100% सुरक्षित, तुरंत पुष्टि।" },
  },
  {
    icon: "🌸", step: "04",
    en: { title: "Receive Blessings",        desc: "Puja performed by temple pandits. Get live stream link, prasad delivery & photo/video proof." },
    hi: { title: "आशीर्वाद प्राप्त करें",     desc: "मंदिर के पंडितों द्वारा पूजा। लाइव स्ट्रीम, प्रसाद डिलीवरी और वीडियो प्रमाण पाएं।" },
  },
];

export function HowItWorks() {
  const { t, lang } = useLang();
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Lotus-tinted bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #EC9DD4, transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #94AAEE, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-medium mb-2 font-sanskrit text-sm tracking-widest uppercase"
            style={{ background: "linear-gradient(135deg, #EC9DD4, #C4AAEE, #94AAEE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            यह कैसे काम करता है
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
            {t("How It Works", "यह कैसे काम करता है")}
          </h2>
          <div className="h-0.5 w-16 rounded-full mx-auto mb-4"
            style={{ background: "linear-gradient(90deg, #EC9DD4, #C4AAEE, #94AAEE)" }} />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(
              "From selection to blessings — our seamless process ensures your devotion reaches the divine.",
              "चयन से आशीर्वाद तक — हमारी सरल प्रक्रिया सुनिश्चित करती है कि आपकी भक्ति दिव्यता तक पहुँचे।"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon, en, hi, step }, i) => {
            const text = lang === "hi" ? hi : en;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative group"
              >
                <div
                  className="rounded-2xl p-6 h-full transition-all duration-300 bg-card-bg"
                  style={{ border: "1px solid rgba(196,170,238,0.25)", boxShadow: "0 4px 20px rgba(196,170,238,0.08)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(148,170,238,0.18)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(148,170,238,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(196,170,238,0.08)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(196,170,238,0.25)";
                  }}
                >
                  <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  <div className="font-heading text-5xl absolute top-4 right-4 leading-none opacity-10"
                    style={{ background: "linear-gradient(135deg, #EC9DD4, #94AAEE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {step}
                  </div>
                  <h3 className="font-heading text-foreground text-xl mb-3">{text.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{text.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-2xl z-10 opacity-40"
                    style={{ color: "#C4AAEE" }}>→</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
