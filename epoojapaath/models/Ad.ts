import mongoose, { Schema, Document, models } from "mongoose";

export interface IAdDoc extends Document {
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: "hero" | "sidebar" | "footer" | "between-sections";
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  clicks: number;
  impressions: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AdSchema = new Schema<IAdDoc>(
  {
    title:       { type: String, required: true },
    imageUrl:    { type: String, required: true },
    linkUrl:     { type: String, required: true },
    placement:   { type: String, enum: ["hero", "sidebar", "footer", "between-sections"], required: true },
    isActive:    { type: Boolean, default: true },
    startDate:   { type: Date, required: true },
    endDate:     { type: Date, required: true },
    clicks:      { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    createdBy:   { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Ad || mongoose.model<IAdDoc>("Ad", AdSchema);
