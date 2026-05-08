import mongoose, { Schema, Document, models } from "mongoose";

export interface IReviewDoc extends Document {
  user: mongoose.Types.ObjectId;
  temple: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReviewDoc>(
  {
    user:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    temple:  { type: Schema.Types.ObjectId, ref: "Temple", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Review || mongoose.model<IReviewDoc>("Review", ReviewSchema);
