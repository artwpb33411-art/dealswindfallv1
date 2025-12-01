export async function publishToFacebook(
  caption: string,
  base64Image: string
) {
  try {
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID!;
    const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN!;

    const buffer = Buffer.from(base64Image, "base64");

    const formData = new FormData();
    formData.append("access_token", PAGE_TOKEN);
    formData.append("caption", caption);
    formData.append(
      "source",
      new Blob([buffer], { type: "image/png" }),
      "image.png"
    );

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`,
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();

    if (!res.ok) {
      console.error("Facebook upload error:", json);
      return { error: json };
    }

    return json;
  } catch (err) {
    console.error("Facebook publish error:", err);
    return null;
  }
}
