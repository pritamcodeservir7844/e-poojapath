import mongoose, { Schema, Document, models } from "mongoose";

export interface IPujaDoc extends Document {
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  duration: string;
  image: string;
  benefits: string[];
  benefitsHi: string[];
  includes: string[];
  temple: mongoose.Types.ObjectId;
  isActive: boolean;
  totalBooked: number;
  createdAt: Date;
}

const PujaSchema = new Schema<IPujaDoc>(
  {
    name:          { type: String, required: true },
    nameHi:        { type: String, required: true },
    description:   { type: String, required: true },
    descriptionHi: { type: String, required: true },
    price:         { type: Number, required: true },
    duration:      { type: String, required: true },
    image:         { type: String, required: true },
    benefits:      [{ type: String }],
    benefitsHi:    [{ type: String }],
    includes:      [{ type: String }],
    temple:        { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    isActive:      { type: Boolean, default: true },
    totalBooked:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Puja || mongoose.model<IPujaDoc>("Puja", PujaSchema);
