import mongoose, { Schema, Document, models } from "mongoose";

export interface ITempleRequestDoc extends Document {
  templeName: string;
  deity?: string;
  city: string;
  state: string;
  contactName: string;
  phone: string;
  email?: string;
  notes?: string;
  status: "pending" | "contacted" | "completed" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const TempleRequestSchema = new Schema<ITempleRequestDoc>(
  {
    templeName: { type: String, required: true, trim: true },
    deity: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "contacted", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.TempleRequest || mongoose.model<ITempleRequestDoc>("TempleRequest", TempleRequestSchema);
