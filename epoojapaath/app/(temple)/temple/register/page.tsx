"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/shared/DashboardShell";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { devToast } from "@/lib/toast";

const STEPS = ["Basic Info", "Location", "Contact", "Submit"];

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh"];

const DEITIES = ["Lord Shiva","Lord Vishnu","Lord Krishna","Lord Rama","Goddess Durga","Goddess Lakshmi","Goddess Saraswati","Lord Ganesha","Lord Hanuman","Lord Murugan","Lord Ayyappa","Other"];

type FormData = {
  name: string; deity: string; shortDescription: string; description: string;
  timings: string; established: string; tags: string;
  address: string; city: string; state: string; pincode: string; googleMapsUrl: string;
  contactPhone: string; contactEmail: string; website: string;
  coverImage: string;
};

const INITIAL: FormData = { name: "", deity: "", shortDescription: "", description: "", timings: "", established: "", tags: "", address: "", city: "", state: "", pincode: "", googleMapsUrl: "", contactPhone: "", contactEmail: "", website: "", coverImage: "" };

export default function TempleRegisterPage() {
  const [step,    setStep]    = useState(0);
  const [form,    setForm]    = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit() {
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        location: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
      };
      const res  = await fetch("/api/temples", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        devToast.blessing("Temple registered! 🛕 Awaiting admin approval.");
        router.push("/temple/dashboard");
      } else devToast.error(data.error);
    } catch { devToast.error("Registration failed"); }
    finally { setLoading(false); }
  }

  return (
    <DashboardShell title="Register Temple" subtitle="Add your temple to ePoojapaath — reach thousands of devotees.">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= step ? "bg-saffron text-white" : "bg-background text-muted-foreground border border-deep-gold/20"}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-sm ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-deep-gold/20" />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        <Card>
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl text-foreground">Basic Information</h2>
              <Input label="Temple Name"        required value={form.name}             onChange={set("name")}             placeholder="e.g. Shri Kashi Vishwanath Mandir" />
              <Select label="Presiding Deity"   required value={form.deity}            onChange={set("deity") as (e: React.ChangeEvent<HTMLSelectElement>) => void} options={DEITIES.map((d) => ({ value: d, label: d }))} placeholder="Select deity" />
              <Input label="Short Description"  required value={form.shortDescription} onChange={set("shortDescription")} placeholder="One line about your temple" />
              <Textarea label="Full Description" required value={form.description}      onChange={set("description")}      rows={4} placeholder="History, significance, and details" />
              <Input label="Timings"            required value={form.timings}          onChange={set("timings")}          placeholder="e.g. 6:00 AM – 9:00 PM" />
              <Input label="Year Established"           value={form.established}       onChange={set("established")}      placeholder="e.g. 1890 or Ancient" />
              <Input label="Tags (comma separated)"     value={form.tags}             onChange={set("tags")}             placeholder="shiva, varanasi, ancient" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl text-foreground">Location Details</h2>
              <Textarea label="Address"   required value={form.address}   onChange={set("address")} rows={2} placeholder="Full street address" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City"    required value={form.city}    onChange={set("city")}    placeholder="City name" />
                <Input label="Pincode" required value={form.pincode} onChange={set("pincode")} placeholder="6-digit pincode" />
              </div>
              <Select label="State" required value={form.state} onChange={set("state") as (e: React.ChangeEvent<HTMLSelectElement>) => void} options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} placeholder="Select state" />
              <Input label="Google Maps URL (optional)" value={form.googleMapsUrl} onChange={set("googleMapsUrl")} placeholder="https://maps.google.com/..." />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl text-foreground">Contact & Media</h2>
              <Input label="Contact Phone" required value={form.contactPhone} onChange={set("contactPhone")} placeholder="+91 98765 43210" />
              <Input label="Contact Email" required value={form.contactEmail} onChange={set("contactEmail")} placeholder="temple@example.com" type="email" />
              <Input label="Website (optional)"       value={form.website}      onChange={set("website")}      placeholder="https://yourtemple.org" />
              <Input label="Cover Image URL"  required value={form.coverImage}  onChange={set("coverImage")}   placeholder="https://... (Cloudinary URL)" />
            </div>
          )}

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
                  <div key={k} className="flex gap-3"><span className="font-medium text-foreground w-20 shrink-0">{k}:</span><span className="text-muted-foreground">{v}</span></div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Your temple will be reviewed by our team within 24–48 hours. You&apos;ll be notified once approved. 🙏</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>← Back</Button>}
            {step < STEPS.length - 1 ? (
              <Button fullWidth onClick={() => setStep(step + 1)}>Next →</Button>
            ) : (
              <Button fullWidth loading={loading} onClick={handleSubmit}>Submit Temple 🛕</Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
