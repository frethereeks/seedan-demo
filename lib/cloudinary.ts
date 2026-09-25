import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const hasCloudinary =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const cloudinaryConfigured = hasCloudinary;

/**
 * Uploads a file buffer and returns a public URL.
 *
 * When real Cloudinary credentials are set (see .env.example), the file
 * goes to Cloudinary and comes back as a CDN URL — exactly what the SEEDAN
 * proposal describes. Until then, it's saved under /public/uploads so the
 * editor and blog still work end-to-end for the demo.
 */
export async function uploadMedia(
  buffer: Buffer,
  filename: string,
  resourceType: "image" | "video" = "image"
): Promise<{ url: string; provider: "cloudinary" | "local" }> {
  if (hasCloudinary) {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "seedan-demo", resource_type: resourceType },
        (err, res) => (err || !res ? reject(err) : resolve(res as { secure_url: string }))
      );
      stream.end(buffer);
    });
    return { url: result.secure_url, provider: "cloudinary" };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const safeExt = path.extname(filename) || (resourceType === "video" ? ".mp4" : ".jpg");
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${safeExt}`;
  await writeFile(path.join(uploadsDir, name), buffer);
  return { url: `/uploads/${name}`, provider: "local" };
}
