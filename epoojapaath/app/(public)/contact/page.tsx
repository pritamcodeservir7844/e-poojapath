"use client";

import { useState } from "react";
import { PublicPage } from "@/components/shared/PublicPage";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { devToast } from "@/lib/toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const SUBJECT_OPTIONS = [
  { value: "Puja Booking Support",  label: "Puja Booking Support"  },
  { value: "Temple Registration",   label: "Temple Registration"   },
  { value: "Payment Issue",         label: "Payment Issue"         },
  { value: "General Inquiry",       label: "General Inquiry"       },
  { value: "Partnership",           label: "Partnership"           },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        devToast.blessing("Message sent! 🙏 We'll respond within 24 hours.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else devToast.error(data.error);
    } catch {
      devToast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicPage>
      <div className="pt-4">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-lotus-pink/15 via-lotus-purple/10 to-lotus-blue/15 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#EC9DD4_0%,transparent_70%)]" />
          </div>
          <div className="relative z-10">
            <p className="font-sanskrit text-saffron mb-3">सम्पर्क करें</p>
            <h1 className="font-heading text-5xl text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We&apos;re here to help you connect with the divine. Reach out for support, temple registration, or any queries.
            </p>
          </div>
        </section>

        <MandalaDivider />

        <section className="section-padding max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="card-devotional h-full">
                <h2 className="font-heading text-2xl text-foreground mb-6">Get in Touch</h2>
                <ul className="space-y-6">
                  {[
                    { icon: <MapPin size={18} />, label: "Address",  content: <p className="text-muted-foreground text-sm">Dhaleswar, Agartala<br />West Tripura, Pin – 799007</p> },
                    { icon: <Phone size={18} />,  label: "Phone / WhatsApp", content: <a href="https://wa.me/919165057755" target="_blank" rel="noopener noreferrer" className="text-saffron hover:underline">+91 91650 57755</a> },
                    { icon: <Mail size={18} />,   label: "Email",    content: <a href="mailto:support@epoojapaath.com" className="text-saffron hover:underline">support@epoojapaath.com</a> },
                    { icon: <Clock size={18} />,  label: "Hours",    content: <p className="text-muted-foreground text-sm">Monday – Saturday<br />10:00 AM – 6:00 PM</p> },
                  ].map(({ icon, label, content }) => (
                    <li key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0 text-saffron">
                        {icon}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{label}</p>
                        {content}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 h-48 bg-background rounded-xl border border-deep-gold/20 overflow-hidden relative">
                  <iframe 
                    src="https://maps.google.com/maps?q=Dhaleswar,%20Agartala,%20West%20Tripura,%20Pin%20799007&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ePoojapaath Location Map"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 card-devotional space-y-5">
              <h2 className="font-heading text-2xl text-foreground mb-2">Send a Message</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Name" required placeholder="Your full name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email (Optional)" type="email" placeholder="your@email.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Phone" required placeholder="+91 XXXXX XXXXX"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Select
                  label="Subject"
                  required
                  placeholder="Select subject"
                  options={SUBJECT_OPTIONS}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <Textarea label="Message" rows={5} required placeholder="How may we assist you?"
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

              <Button type="submit" loading={loading} fullWidth size="lg">
                {loading ? "Sending... 🙏" : "Send Message 🛕"}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </PublicPage>
  );
}
