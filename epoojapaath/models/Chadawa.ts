import mongoose, { Schema, Document, models } from "mongoose";

export interface IChadawaOfferingItem {
  name: string;
  nameHi: string;
  price: number;
  image: string;
  description?: string;
}

export interface IChadawaDoc extends Document {
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  image: string;
  items: string[];
  offeringItems: IChadawaOfferingItem[];
  deity: string;
  temple: mongoose.Types.ObjectId;
  isActive: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const OfferingItemSchema = new Schema<IChadawaOfferingItem>({
  name:        { type: String, required: true },
  nameHi:      { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String, required: true },
  description: { type: String },
}, { _id: false });

const ChadawaSchema = new Schema<IChadawaDoc>(
  {
    name:          { type: String, required: true },
    nameHi:        { type: String, required: true },
    description:   { type: String, required: true },
    descriptionHi: { type: String, required: true },
    price:         { type: Number, required: true },
    image:         { type: String, required: true },
    items:         [{ type: String }],
    offeringItems: [OfferingItemSchema],
    deity:         { type: String, required: true },
    temple:        { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    isActive:      { type: Boolean, default: true },
    status:        { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default models.Chadawa || mongoose.model<IChadawaDoc>("Chadawa", ChadawaSchema);
