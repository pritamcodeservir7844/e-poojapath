import mongoose, { Schema, Document, models } from "mongoose";

export interface IBlogDoc extends Document {
  title: string;
  titleHi: string;
  slug: string;
  content: string;
  contentHi: string;
  excerpt: string;
  excerptHi: string;
  coverImage: string;
  author: mongoose.Types.ObjectId;
  temple?: mongoose.Types.ObjectId;
  category: "devotional" | "temple-story" | "festival" | "astrology" | "announcement";
  tags: string[];
  status: "draft" | "published" | "archived";
  isAdminFeatured: boolean;
  views: number;
  publishedAt?: Date;
  createdAt: Date;
}

const BlogSchema = new Schema<IBlogDoc>(
  {
    title:          { type: String, required: true },
    titleHi:        { type: String, required: true },
    slug:           { type: String, required: true, unique: true },
    content:        { type: String, required: true },
    contentHi:      { type: String, required: true },
    excerpt:        { type: String, required: true },
    excerptHi:      { type: String, required: true },
    coverImage:     { type: String, required: true },
    author:         { type: Schema.Types.ObjectId, ref: "User", required: true },
    temple:         { type: Schema.Types.ObjectId, ref: "Temple" },
    category:       { type: String, enum: ["devotional", "temple-story", "festival", "astrology", "announcement"], required: true },
    tags:           [{ type: String }],
    status:         { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    isAdminFeatured:{ type: Boolean, default: false },
    views:          { type: Number, default: 0 },
    publishedAt:    { type: Date },
  },
  { timestamps: true }
);

BlogSchema.index({ status: 1, publishedAt: -1 });

export default models.Blog || mongoose.model<IBlogDoc>("Blog", BlogSchema);
