import mongoose, { Schema, Document, models } from "mongoose";

export interface IContactDoc extends Document {
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContactDoc>(
  {
    name:    { type: String, required: true },
    email:   { type: String },
    phone:   { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Contact || mongoose.model<IContactDoc>("Contact", ContactSchema);
