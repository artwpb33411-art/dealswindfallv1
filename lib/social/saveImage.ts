import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Clean URL
function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url.replace("http://", "https://"));
    return u.toString();
  } catch {
    return "";
  }
}

export async function saveImageToSupabase(imageUrl: string): Promise<string | null> {
  try {
    const safeUrl = sanitizeUrl(imageUrl);
    if (!safeUrl) {
      console.error("Invalid image URL:", imageUrl);
      return null;
    }

    console.log("Downloading:", safeUrl);

    const response = await fetch(safeUrl);

    if (!response.ok) {
      console.error("Failed to download image:", response.status, safeUrl);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      console.error("Downloaded file is not an image:", contentType);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Max 10 MB safety
    if (buffer.length > 10 * 1024 * 1024) {
      console.error("Image too large (>10MB):", safeUrl);
      return null;
    }

    const ext = contentType.split("/")[1] || "png";
    const filename = `products/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("social-temp")
      .upload(filename, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload ERROR:", error);
      return null;
    }

    const publicUrl =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/social-temp/${data?.path}`;

    console.log("Uploaded:", publicUrl);
    return publicUrl;
  } catch (e) {
    console.error("saveImageToSupabase FAILED:", e);
    return null;
  }
}
