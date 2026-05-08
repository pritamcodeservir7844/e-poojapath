import mongoose, { Schema, Document, models } from "mongoose";

export interface IChadawaDoc extends Document {
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  image: string;
  items: string[];
  deity: string;
  temple: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const ChadawaSchema = new Schema<IChadawaDoc>(
  {
    name:          { type: String, required: true },
    nameHi:        { type: String, required: true },
    description:   { type: String, required: true },
    descriptionHi: { type: String, required: true },
    price:         { type: Number, required: true },
    image:         { type: String, required: true },
    items:         [{ type: String }],
    deity:         { type: String, required: true },
    temple:        { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Chadawa || mongoose.model<IChadawaDoc>("Chadawa", ChadawaSchema);
