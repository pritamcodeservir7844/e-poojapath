import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const GuestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = GuestSchema.parse(body);

    await connectDB();

    const phone = data.phone.trim();
    // Clean phone number for consistency (remove spaces, dashes, parentheses, plus sign)
    const cleanPhone = phone.replace(/[\s\-()+]/g, "");
    const email = `guest_${cleanPhone}@epoojapaath.com`;

    const secret = process.env.NEXTAUTH_SECRET || "guest_secret_salt_123";
    const rawPassword = `guest_pwd_${cleanPhone}_${secret.substring(0, 8)}`;

    // Find if user already exists with this phone or email
    let user = await User.findOne({
      $or: [{ phone: cleanPhone }, { email: email }],
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(rawPassword, 12);
      user = await User.create({
        name: data.name.trim(),
        email: email,
        phone: cleanPhone,
        password: hashedPassword,
        role: "user",
        isBlocked: false,
      });
    } else {
      if (user.isBlocked) {
        return NextResponse.json(
          { success: false, error: "This mobile number is blocked." },
          { status: 400 }
        );
      }
      // Keep the user's name updated to whatever they typed in the guest form
      if (user.name !== data.name.trim()) {
        user.name = data.name.trim();
        await user.save();
      }
    }

    return NextResponse.json({
      success: true,
      email: email,
      password: rawPassword,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Guest login failed";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
