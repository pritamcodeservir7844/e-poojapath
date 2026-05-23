import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const folder   = (formData.get("folder") as string) || "epoojapaath";

    if (!file)
      return NextResponse.json({ success: false, error: "Koi file nahi mili" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ success: false, error: "Image 5MB se chhoti honi chahiye" }, { status: 400 });

    if (!file.type.startsWith("image/"))
      return NextResponse.json({ success: false, error: "Sirf image files allowed hain" }, { status: 400 });

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey    = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    const timestamp = Math.round(Date.now() / 1000);

    // ── Signature: sorted params + secret (NO file/cloud_name/resource_type) ──
    // Only sign the params you actually send in the FormData
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const toSign       = paramsToSign + apiSecret;

    const encoded   = new TextEncoder().encode(toSign);
    const hashBuf   = await crypto.subtle.digest("SHA-1", encoded);
    const signature = Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    // ── Convert file → base64 data URI ──
    const arrayBuffer = await file.arrayBuffer();
    const base64      = Buffer.from(arrayBuffer).toString("base64");
    const dataUri     = `data:${file.type};base64,${base64}`;

    // ── Upload to Cloudinary ──
    const upload = new FormData();
    upload.append("file",      dataUri);
    upload.append("api_key",   apiKey);
    upload.append("timestamp", String(timestamp));
    upload.append("signature", signature);
    upload.append("folder",    folder);
    // Note: do NOT add transformation here — it would break the signature

    const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body:   upload,
    });

    const result = await res.json();

    if (result.error) {
      console.error("Cloudinary error:", result.error);
      return NextResponse.json({ success: false, error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({
      success:  true,
      url:      result.secure_url,
      publicId: result.public_id,
      width:    result.width,
      height:   result.height,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
