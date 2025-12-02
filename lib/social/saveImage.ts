import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,   // Important: must be SERVICE ROLE
  { auth: { persistSession: false } }
);

export async function saveImageToSupabase(imageUrl: string): Promise<string | null> {
  try {
    console.log("Downloading:", imageUrl);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error("Failed to download image:", response.status);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const filename = `products/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("social-temp")
      .upload(filename, buffer, {
        contentType: `image/${ext}`,
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
