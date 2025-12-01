import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function uploadTempImage(buffer: Buffer, name: string) {
  const filePath = `temp/${name}.png`;

  const { data, error } = await supabaseAdmin.storage
    .from("social-temp")
    .upload(filePath, buffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Image upload error:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("social-temp").getPublicUrl(filePath);

  return { filePath, publicUrl };
}

export async function deleteTempImage(path: string) {
  await supabaseAdmin.storage.from("social-temp").remove([path]);
}
