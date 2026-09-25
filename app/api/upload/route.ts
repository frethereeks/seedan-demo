import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadMedia } from "@/lib/cloudinary";
import { can } from "@/lib/roles";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !can(session.role, "posts_create")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const resourceType = file.type.startsWith("video") ? "video" : "image";
  const maxBytes = resourceType === "video" ? 40 * 1024 * 1024 : 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `File too large for the demo (max ${Math.round(maxBytes / (1024 * 1024))}MB).` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadMedia(buffer, file.name, resourceType);

  return NextResponse.json({ url: result.url, provider: result.provider, resourceType });
}
