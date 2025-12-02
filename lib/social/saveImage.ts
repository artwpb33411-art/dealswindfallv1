import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from "crypto";

export async function saveImageToSupabase(imageUrl: string) {
  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      console.log("Image download failed:", res.status);
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    const filename = `${crypto.randomUUID()}.jpg`;
    const path = `products/${filename}`;

    const { error } = await supabaseAdmin.storage
      .from("social-temp")
      .upload(path, buffer, {
        contentType: "image/jpeg",
      });

    if (error) {
      console.log("Supabase upload error:", error);
      return null;
    }

    return supabaseAdmin.storage
      .from("social-temp")
      .getPublicUrl(path).data.publicUrl;

  } catch (err) {
    console.log("saveImage error:", err);
    return null;
  }
}
