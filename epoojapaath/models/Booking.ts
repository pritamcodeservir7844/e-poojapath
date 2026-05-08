import mongoose, { Schema, Document, models } from "mongoose";

export interface IBookingDoc extends Document {
  user: mongoose.Types.ObjectId;
  temple: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  serviceType: "puja" | "chadawa";
  serviceName: string;
  serviceNameHi: string;
  amount: number;
  devoteeName: string;
  gotra?: string;
  sankalp?: string;
  date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentId?: string;
  orderId?: string;
  paymentStatus: "pending" | "paid" | "failed";
  prasadDelivery: boolean;
  prasadAddress?: string;
  videoUrl?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBookingDoc>(
  {
    user:          { type: Schema.Types.ObjectId, ref: "User", required: true },
    temple:        { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    service:       { type: Schema.Types.ObjectId, required: true },
    serviceType:   { type: String, enum: ["puja", "chadawa"], required: true },
    serviceName:   { type: String, required: true },
    serviceNameHi: { type: String, required: true },
    amount:        { type: Number, required: true },
    devoteeName:   { type: String, required: true },
    gotra:         { type: String },
    sankalp:       { type: String },
    date:          { type: Date, required: true },
    status:        { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    paymentId:     { type: String },
    orderId:       { type: String },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    prasadDelivery: { type: Boolean, default: false },
    prasadAddress:  { type: String },
    videoUrl:       { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ temple: 1, date: -1 });

export default models.Booking || mongoose.model<IBookingDoc>("Booking", BookingSchema);
