import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

const ContactSchema = z.object({
  name:    z.string().min(2),
  email:   z.union([z.string().email(), z.literal("")]).optional(),
  phone:   z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ContactSchema.parse(body);

    // 1. Connect to Database and Save
    await connectDB();
    const newContact = await Contact.create({
      name: parsedData.name,
      email: parsedData.email || undefined,
      phone: parsedData.phone,
      subject: parsedData.subject,
      message: parsedData.message,
    });

    console.log("Contact saved to DB:", newContact._id);

    // 2. Attempt to Send Email Notification via Nodemailer
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || "support@epoojapaath.com";
    const supportEmail = process.env.SUPPORT_EMAIL || "support@epoojapaath.com";

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort) || 587,
          secure: Number(smtpPort) === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"ePoojapaath Contact" <${smtpFrom}>`,
          to: supportEmail,
          subject: `New Enquiry: ${parsedData.subject}`,
          text: `You have received a new contact enquiry:\n\nName: ${parsedData.name}\nEmail: ${parsedData.email || "N/A"}\nPhone: ${parsedData.phone}\nSubject: ${parsedData.subject}\nMessage: ${parsedData.message}\n\nSubmitted on: ${new Date().toLocaleString()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #D4820A; border-bottom: 2px solid #F5C842; padding-bottom: 10px;">New Website Enquiry</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 8px;">${parsedData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Email:</td>
                  <td style="padding: 8px;">${parsedData.email || "<em>N/A</em>"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px;">${parsedData.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px;">${parsedData.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
                  <td style="padding: 8px; white-space: pre-wrap;">${parsedData.message}</td>
                </tr>
              </table>
              <div style="margin-top: 25px; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px; text-align: center;">
                This email was generated automatically by ePoojapaath website.
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email notification sent successfully to", supportEmail);
      } catch (emailErr) {
        console.error("Nodemailer failed to send email:", emailErr);
        // Do not fail the request if only the email sending failed, as it is already saved to DB
      }
    } else {
      console.log("Nodemailer SMTP not configured in env variables. Skipping email notification.");
    }

    return NextResponse.json({ success: true, message: "Message received. We'll respond within 24 hours. 🙏" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
