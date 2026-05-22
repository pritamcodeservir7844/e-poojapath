import mongoose from "mongoose";
import User from "@/models/User";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import Chadawa from "@/models/Chadawa";
import Blog from "@/models/Blog";
import Ad from "@/models/Ad";
import TempleMember from "@/models/TempleMember";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  // Ensure all Mongoose models are registered and not tree-shaken
  const _modelRefs = [User, Temple, Puja, Booking, Review, Chadawa, Blog, Ad, TempleMember];

  // 1. Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Fallback check: if mongoose is already connected but not cached locally
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }

  // 3. If there is no active connection or promise, initialize connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,                 // Limit pool size to prevent connection exhaustion in serverless
      serverSelectionTimeoutMS: 5000,  // Fast timeout (5s) to avoid serverless function hangs
      socketTimeoutMS: 45000,          // Close inactive sockets after 45s
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise on error so that subsequent invocations try to reconnect
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
