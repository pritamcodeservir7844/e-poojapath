import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function createUser(data: { name: string; email: string; password: string; phone?: string }) {
  await connectDB();
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(data.password, 12);
  return User.create({ ...data, password: hashed });
}

export async function getUserById(id: string) {
  await connectDB();
  return User.findById(id).select("-password").lean();
}

export async function updateUser(id: string, data: Record<string, unknown>) {
  await connectDB();
  return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
}

export async function getAllUsersAdmin() {
  await connectDB();
  return User.find().select("-password").sort({ createdAt: -1 }).lean();
}

export async function toggleBlockUser(id: string) {
  await connectDB();
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  user.isBlocked = !user.isBlocked;
  return user.save();
}

export async function changeUserRole(id: string, role: "user" | "temple_owner" | "admin") {
  await connectDB();
  return User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
}
