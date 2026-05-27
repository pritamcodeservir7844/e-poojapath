import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Temple from "@/models/Temple";
import Puja from "@/models/Puja";

export async function createBooking(data: Record<string, unknown>) {
  await connectDB();
  const booking = await Booking.create(data);
  await Temple.findByIdAndUpdate(data.temple, { $inc: { totalBookings: 1 } });
  if (data.serviceType === "puja") {
    await Puja.findByIdAndUpdate(data.service, { $inc: { totalBooked: 1 } });
  }
  return booking;
}

export async function getUserBookings(userId: string) {
  await connectDB();
  return Booking.find({ user: userId })
    .populate("temple", "name slug coverImage location")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getBookingById(id: string) {
  await connectDB();
  return Booking.findById(id)
    .populate("user", "name email phone")
    .populate("temple", "name slug coverImage contactPhone contactEmail location owner")
    .lean();
}

export async function getTempleBookings(templeId: string) {
  await connectDB();
  return Booking.find({ temple: templeId })
    .populate("user", "name email phone")
    .sort({ createdAt: -1 })
    .lean();
}

export async function updateBookingStatus(id: string, status: string) {
  await connectDB();
  return Booking.findByIdAndUpdate(id, { status }, { new: true });
}

export async function getAllBookingsAdmin(filters: { status?: string; serviceType?: string } = {}) {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters.status)      query.status = filters.status;
  if (filters.serviceType) query.serviceType = filters.serviceType;
  return Booking.find(query)
    .populate("user", "name email")
    .populate("temple", "name")
    .sort({ createdAt: -1 })
    .lean();
}
