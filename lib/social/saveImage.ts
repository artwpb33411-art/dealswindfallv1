import { supabaseAdmin } from "@/lib/supabaseAdmin";
import path from "path";
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
    const filePath = `products/${filename}`;

    const { data, error } = await supabaseAdmin.storage
      .from("social-temp")
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.log("Supabase upload error:", error);
      return null;
    }

    // Get public URL
    const publicUrl = supabaseAdmin.storage
      .from("social-temp")
      .getPublicUrl(filePath).data.publicUrl;

    return publicUrl;
  } catch (err) {
    console.log("saveImageToSupabase error:", err);
    return null;
  }
}
