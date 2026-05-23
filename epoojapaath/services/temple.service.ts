import { connectDB } from "@/lib/db";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Chadawa from "@/models/Chadawa";
import User from "@/models/User";
import { slugify } from "@/lib/utils";

export async function getApprovedTemples(query: { city?: string; deity?: string; featured?: boolean } = {}) {
  await connectDB();
  const filter: Record<string, unknown> = { status: "approved" };
  if (query.city) filter["location.city"] = new RegExp(query.city, "i");
  if (query.deity) filter.deity = new RegExp(query.deity, "i");
  if (query.featured) filter.featured = true;
  return Temple.find(filter).populate("owner", "name email").sort({ featured: -1, createdAt: -1 }).lean();
}

export async function getFeaturedTemples() {
  await connectDB();
  return Temple.find({ status: "approved", featured: true }).limit(6).lean();
}

export async function getTempleBySlug(slug: string) {
  await connectDB();
  return Temple.findOne({ slug, status: "approved" }).populate("owner", "name email avatar").lean();
}

export async function getTempleById(id: string) {
  await connectDB();
  return Temple.findById(id).populate("owner", "name email avatar").lean();
}

export async function createTemple(data: Record<string, unknown>, ownerId: string) {
  await connectDB();
  const slug = slugify(data.name as string);
  const exists = await Temple.findOne({ slug });
  const finalSlug = exists ? `${slug}-${Date.now()}` : slug;
  return Temple.create({ ...data, slug: finalSlug, owner: ownerId, status: "pending" });
}

export async function updateTemple(id: string, data: Record<string, unknown>) {
  await connectDB();
  return Temple.findByIdAndUpdate(id, data, { new: true });
}

export async function getOwnerTemples(ownerId: string) {
  await connectDB();
  return Temple.find({ owner: ownerId }).sort({ createdAt: -1 }).lean();
}

export async function getAllTemplesAdmin() {
  await connectDB();
  return Temple.find().populate("owner", "name email").sort({ createdAt: -1 }).lean();
}

export async function updateTempleStatus(id: string, status: "approved" | "rejected" | "pending") {
  await connectDB();
  // Cascade: jab temple approved ho tabhi puja/chadawa active rahein,
  // rejected ya pending hone par automatically inactive ho jaate hain
  const isActive = status === "approved";
  await Promise.all([
    Puja.updateMany({ temple: id }, { isActive }),
    Chadawa.updateMany({ temple: id }, { isActive }),
  ]);
  return Temple.findByIdAndUpdate(id, { status }, { new: true });
}
