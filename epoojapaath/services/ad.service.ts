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

export async function getActiveAds(placement: "hero" | "sidebar" | "footer" | "between-sections") {
  await connectDB();
  const now = new Date();
  return Ad.find({
    placement,
    isActive: true,
    startDate: { $lte: now },
    endDate:   { $gte: now },
  }).sort({ createdAt: -1 }).lean();
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
  const ad = await Ad.findById(id);
  if (ad && ad.imageUrl) {
    await deleteCloudinaryImage(ad.imageUrl);
  }
  return Ad.findByIdAndDelete(id);
}

async function deleteCloudinaryImage(url: string) {
  if (!url || !url.includes("res.cloudinary.com")) return;
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("Cloudinary env variables not set, skipping image deletion.");
      return;
    }

    const parts = url.split("/upload/");
    if (parts.length < 2) return;
    
    const pathWithVersion = parts[1];
    const pathParts = pathWithVersion.split("/");
    if (pathParts[0].startsWith("v") && !isNaN(Number(pathParts[0].substring(1)))) {
      pathParts.shift();
    }
    
    const fullPath = pathParts.join("/");
    const lastDotIndex = fullPath.lastIndexOf(".");
    const publicId = lastDotIndex === -1 ? fullPath : fullPath.substring(0, lastDotIndex);

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
    const toSign       = paramsToSign + apiSecret;

    const crypto = await import("crypto");
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    const formData = new URLSearchParams();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });
    const result = await res.json();
    console.log("Cloudinary image delete result:", result);
  } catch (err) {
    console.error("Failed to delete image from Cloudinary:", err);
  }
}

export async function trackAdImpression(id: string) {
  await connectDB();
  return Ad.findByIdAndUpdate(id, { $inc: { impressions: 1 } });
}

export async function trackAdClick(id: string) {
  await connectDB();
  return Ad.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
}
