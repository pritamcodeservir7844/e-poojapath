import mongoose, { Schema, Document, models } from "mongoose";

export interface IPaymentDoc extends Document {
  user: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  orderId: string;
  paymentId?: string;
  amount: number;
  paymentMethod?: string;
  status: "pending" | "success" | "failed" | "refunded" | "cancelled";
  errorMessage?: string;
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    paymentMethod: { type: String },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    errorMessage: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete models.Payment;
}

export default models.Payment || mongoose.model<IPaymentDoc>("Payment", PaymentSchema);
