import mongoose, { Schema, Document, models } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "user" | "temple_owner" | "admin";
  avatar?: string;
  gotra?: string;
  city?: string;
  language: "en" | "hi";
  isBlocked: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    phone:     { type: String },
    password:  { type: String, required: true, select: false },
    role:      { type: String, enum: ["user", "temple_owner", "admin"], default: "user" },
    avatar:    { type: String },
    gotra:     { type: String },
    city:      { type: String },
    language:  { type: String, enum: ["en", "hi"], default: "en" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.User || mongoose.model<IUserDoc>("User", UserSchema);
