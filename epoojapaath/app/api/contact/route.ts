import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  subject: z.string(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    ContactSchema.parse(body);
    // In production: send email via nodemailer to support@epoojapaath.com
    // For now, log and return success
    console.log("Contact form:", body);
    return NextResponse.json({ success: true, message: "Message received. We'll respond within 24 hours. 🙏" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
