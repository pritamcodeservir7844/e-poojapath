import mongoose, { Schema, Document, models } from "mongoose";

export interface ITempleMemberDoc extends Document {
  temple: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: "manager" | "pandit" | "staff";
  permissions: string[];
  invitedBy: mongoose.Types.ObjectId;
  status: "pending" | "active" | "revoked";
  createdAt: Date;
}

const TempleMemberSchema = new Schema<ITempleMemberDoc>(
  {
    temple:      { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    user:        { type: Schema.Types.ObjectId, ref: "User", required: true },
    role:        { type: String, enum: ["manager", "pandit", "staff"], required: true },
    permissions: [{ type: String, enum: ["manage_pujas", "manage_chadawa", "view_bookings", "update_bookings", "manage_blog"] }],
    invitedBy:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    status:      { type: String, enum: ["pending", "active", "revoked"], default: "pending" },
  },
  { timestamps: true }
);

export default models.TempleMember || mongoose.model<ITempleMemberDoc>("TempleMember", TempleMemberSchema);
