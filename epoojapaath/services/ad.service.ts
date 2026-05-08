import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";

export async function getActiveAd(placement: "hero" | "sidebar" | "footer" | "between-sections") {
  await connectDB();
  const now = new Date();
  return Ad.findOne({
    placement,
    isActive: true,
    startDate: { $lte: now },
    endDate:   { $gte: now },
  }).lean();
}

export async function getAllAds() {
  await connectDB();
  return Ad.find().populate("createdBy", "name email").sort({ createdAt: -1 }).lean();
}

export async function createAd(data: Record<string, unknown>, adminId: string) {
  await connectDB();
  return Ad.create({ ...data, createdBy: adminId });
}

export async function updateAd(id: string, data: Record<string, unknown>) {
  await connectDB();
  return Ad.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteAd(id: string) {
  await connectDB();
  return Ad.findByIdAndDelete(id);
}

export async function trackAdImpression(id: string) {
  await connectDB();
  return Ad.findByIdAndUpdate(id, { $inc: { impressions: 1 } });
}

export async function trackAdClick(id: string) {
  await connectDB();
  return Ad.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
}
