import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const brainDir = "C:\\Users\\UPL\\.gemini\\antigravity-ide\\brain\\5432e0ea-c9ea-4f04-b23a-1c638be1724f";
    
    // Copy logo
    const logoSrc = path.join(brainDir, "startup_india_logo_1779454318108.png");
    const logoDest = path.join(process.cwd(), "public", "startup_india_logo.png");
    if (fs.existsSync(logoSrc)) {
      fs.copyFileSync(logoSrc, logoDest);
    }
    
    // Copy clean certificate (media__1779452641439.png)
    const certSrc = path.join(brainDir, "media__1779452641439.png");
    const certDest = path.join(process.cwd(), "public", "startup_india_certificate.png");
    if (fs.existsSync(certSrc)) {
      fs.copyFileSync(certSrc, certDest);
    }
    
    return NextResponse.json({
      success: true,
      message: "Successfully copied logo and certificate to public folder!",
      logoExists: fs.existsSync(logoDest),
      certExists: fs.existsSync(certDest),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
