import mongoose, { Schema, Document, models } from "mongoose";

export interface ITempleDoc extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  deity: string;
  location: { address: string; city: string; state: string; pincode: string; lat?: number; lng?: number };
  images: string[];
  coverImage: string;
  timings: string;
  established?: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  owner: mongoose.Types.ObjectId;
  totalBookings: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  contactPhone: string;
  contactEmail: string;
  website?: string;
  googleMapsUrl?: string;
  createdAt: Date;
}

const TempleSchema = new Schema<ITempleDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    deity: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    images: [{ type: String }],
    coverImage: { type: String, required: true },
    timings: { type: String, required: true },
    established: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    featured: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalBookings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    contactPhone: { type: String },
    contactEmail: { type: String },
    website: { type: String },
    instagramUrl: { type: String },
    googleMapsUrl: { type: String },
  },
  { timestamps: true }
);

TempleSchema.index({ status: 1, featured: 1 });
TempleSchema.index({ "location.city": 1 });

export default models.Temple || mongoose.model<ITempleDoc>("Temple", TempleSchema);
