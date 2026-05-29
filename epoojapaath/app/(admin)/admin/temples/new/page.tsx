"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { devToast } from "@/lib/toast";

const STEPS = ["Basic Info", "Location", "Contact", "Submit"];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh",
];

const DEITIES = [
  "Lord Shiva","Lord Vishnu","Lord Krishna","Lord Rama","Goddess Durga","Goddess Lakshmi",
  "Goddess Saraswati","Lord Ganesha","Lord Hanuman","Lord Murugan","Lord Ayyappa","Other",
];

type FormData = {
  name: string; deity: string; shortDescription: string; description: string;
  timings: string; established: string; tags: string;
  address: string; city: string; state: string; pincode: string; googleMapsUrl: string;
  contactPhone: string; contactEmail: string; website: string; instagramUrl: string;
  coverImage: string;
  images: string[];
};

const INITIAL: FormData = {
  name: "", deity: "", shortDescription: "", description: "", timings: "",
  established: "", tags: "", address: "", city: "", state: "", pincode: "",
  googleMapsUrl: "", contactPhone: "", contactEmail: "", website: "", instagramUrl: "", coverImage: "",
  images: [],
};

export default function AdminNewTemplePage() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit() {
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        location: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
        images: form.images || [],
      };

      // Admin route — auto approved, no approval needed
      const res  = await fetch("/api/admin/temples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        devToast.blessing("Temple successfully add ho gaya! 🛕 Auto-approved.");
        router.push(`/admin/temples/${data.data._id}?new=1&tab=Pujas`);
      } else {
        devToast.error(data.error || "Temple create nahi hua");
      }
    } catch {
      devToast.error("Network error — dobara try karein");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground transition">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-xl text-foreground">Naya Temple Add Karo</h1>
          <p className="text-xs text-muted-foreground">Admin se add karne par temple automatically approved ho jayega</p>
        </div>
        <span className="text-xs bg-green-500/10 text-green-600 px-3 py-1 rounded-full font-medium border border-green-500/20">
          ✓ Auto-Approved
        </span>
      </div>

      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? "bg-green-500 text-white" : i === step ? "bg-saffron text-white" : "bg-background text-muted-foreground border border-deep-gold/20"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-deep-gold/20" />}
            </div>
          ))}
        </div>

        <Card>
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl text-foreground">Basic Information</h2>
              <Input label="Temple Name"             required value={form.name}             onChange={set("name")}             placeholder="e.g. Shri Kashi Vishwanath Mandir" />
              <Select label="Presiding Deity"        required value={form.deity}            onChange={set("deity") as any}     options={DEITIES.map(d => ({ value: d, label: d }))} placeholder="Select deity" />
              <Input label="Short Description"       required value={form.shortDescription} onChange={set("shortDescription")} placeholder="One line about the temple" />
              <RichTextEditor
                label="Full Description"
                required
                value={form.description}
                onChange={html => setForm(f => ({ ...f, description: html }))}
                placeholder="History, significance, and details..."
              />
              <Input label="Timings"                 required value={form.timings}          onChange={set("timings")}          placeholder="e.g. 6:00 AM – 9:00 PM" />
              <Input label="Year Established"                 value={form.established}       onChange={set("established")}      placeholder="e.g. 1890 or Ancient" />
              <Input label="Tags (comma separated)"           value={form.tags}             onChange={set("tags")}             placeholder="shiva, varanasi, ancient" />
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl text-foreground">Location Details</h2>
              <Textarea label="Address"  required value={form.address}   onChange={set("address")} rows={2} placeholder="Full street address" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City"    required value={form.city}    onChange={set("city")}    placeholder="City name" />
                <Input label="Pincode" required value={form.pincode} onChange={set("pincode")} placeholder="6-digit pincode" />
              </div>
              <Select label="State"    required value={form.state}   onChange={set("state") as any} options={INDIAN_STATES.map(s => ({ value: s, label: s }))} placeholder="Select state" />
              <Input label="Google Maps URL (optional)" value={form.googleMapsUrl} onChange={set("googleMapsUrl")} placeholder="https://maps.google.com/..." />
            </div>
          )}

          {/* Step 2: Contact & Media */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl text-foreground">Contact & Media</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Contact Phone (Optional)" value={form.contactPhone} onChange={set("contactPhone")} placeholder="+91 98765 43210" />
                <Input label="Contact Email (Optional)" value={form.contactEmail} onChange={set("contactEmail")} placeholder="temple@example.com" type="email" />
                <Input label="Website Link (Optional)" value={form.website} onChange={set("website")} placeholder="https://example.com" />
                <Input label="Instagram Profile Link (Optional)" value={form.instagramUrl} onChange={set("instagramUrl")} placeholder="https://instagram.com/profile" />
              </div>
              <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-heading text-base text-foreground border-b border-border pb-3">🖼️ Images</h2>
                <ImageUpload
                  label="Cover Image"
                  required
                  value={form.coverImage}
                  onChange={url => setForm(f => ({ ...f, coverImage: url }))}
                  folder="temples"
                  previewHeight="h-52"
                />

                <div className="space-y-3 pt-3 border-t border-border">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Gallery Images (Devotees ko slider me show karne ke liye)
                  </label>
                  
                  {form.images && form.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {form.images.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border group h-24">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition opacity-0 group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <ImageUpload
                    value=""
                    onChange={url => {
                      if (url) {
                        setForm(f => ({ ...f, images: [...(f.images || []), url] }));
                      }
                    }}
                    folder="temples"
                    previewHeight="h-24"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground">Nayi images add karne ke liye upar box me click ya drag-drop karein. Ek se zyada images add kar sakte hain.</p>
                </div>
              </section>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl text-foreground">Review & Submit</h2>
              <div className="bg-background rounded-xl p-4 border border-deep-gold/20 space-y-2 text-sm">
                {[
                  ["Name",    form.name],
                  ["Deity",   form.deity],
                  ["City",    `${form.city}, ${form.state}`],
                  ["Phone",   form.contactPhone],
                  ["Email",   form.contactEmail],
                  ["Timings", form.timings],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="font-medium text-foreground w-20 shrink-0">{k}:</span>
                    <span className="text-muted-foreground">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <span className="text-green-600 text-lg">✅</span>
                <p className="text-xs text-green-700 font-medium">
                  Admin se add hone par temple automatically <strong>Approved</strong> ho jayega — koi approval wait nahi!
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>← Back</Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button fullWidth onClick={() => setStep(step + 1)}>Next →</Button>
            ) : (
              <Button fullWidth loading={loading} onClick={handleSubmit}>
                🛕 Temple Add Karo (Auto-Approved)
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
