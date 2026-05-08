"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { devToast } from "@/lib/toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
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
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-dark to-dark/90 text-center">
          <p className="font-sanskrit text-saffron mb-3">सम्पर्क करें</p>
          <h1 className="font-heading text-5xl text-cream mb-4">Contact Us</h1>
          <p className="text-cream/60 max-w-xl mx-auto">
            We&apos;re here to help you connect with the divine. Reach out for support, temple registration, or any queries.
          </p>
        </section>

        <MandalaDivider />

        <section className="section-padding max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="card-devotional h-full">
                <h2 className="font-heading text-2xl text-dark mb-6">Get in Touch</h2>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                      <MapPin className="text-saffron" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-dark">Address</p>
                      <p className="text-muted text-sm">12, Assi Ghat Road<br />Varanasi, Uttar Pradesh – 221005</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                      <Phone className="text-saffron" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-dark">Phone</p>
                      <a href="tel:+919876543210" className="text-saffron hover:underline">+91 98765 43210</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                      <Mail className="text-saffron" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-dark">Email</p>
                      <a href="mailto:support@epoojapaath.com" className="text-saffron hover:underline">
                        support@epoojapaath.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                      <Clock className="text-saffron" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-dark">Business Hours</p>
                      <p className="text-muted text-sm">Monday – Saturday<br />9:00 AM – 6:00 PM IST</p>
                    </div>
                  </li>
                </ul>

                {/* Map placeholder */}
                <div className="mt-6 h-40 bg-cream rounded-xl border border-deep-gold/20 flex items-center justify-center">
                  <div className="text-center text-muted">
                    <MapPin className="mx-auto mb-2 text-saffron" size={28} />
                    <p className="text-sm">Assi Ghat, Varanasi</p>
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                      className="text-saffron text-xs hover:underline">View on Google Maps →</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 card-devotional space-y-5">
              <h2 className="font-heading text-2xl text-dark mb-2">Send a Message</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Name *</label>
                  <input className="input-devotional w-full" placeholder="Your full name" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Email *</label>
                  <input type="email" className="input-devotional w-full" placeholder="your@email.com" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Phone (Optional)</label>
                  <input className="input-devotional w-full" placeholder="+91 XXXXX XXXXX"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Subject *</label>
                  <select className="input-devotional w-full" required
                    value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    <option value="">Select subject</option>
                    <option>Puja Booking Support</option>
                    <option>Temple Registration</option>
                    <option>Payment Issue</option>
                    <option>General Inquiry</option>
                    <option>Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Message *</label>
                <textarea rows={5} className="input-devotional w-full resize-none" placeholder="How may we assist you?" required
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>

              <button type="submit" disabled={loading} className="btn-saffron w-full py-3 text-base disabled:opacity-60">
                {loading ? "Sending... 🙏" : "Send Message 🛕"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
