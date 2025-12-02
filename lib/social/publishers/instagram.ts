export async function publishToInstagram(caption: string, imageBase64: string) {
  try {
    const IG_ID = process.env.INSTAGRAM_BUSINESS_ID!;
    const TOKEN = process.env.INSTAGRAM_LONG_LIVED_TOKEN!;

    // Upload base64 PNG to Facebook Graph as IG media
    const buffer = Buffer.from(imageBase64, "base64");

    // Step 1 – upload image to Facebook Graph
    const uploadRes = await fetch(
      `https://graph.facebook.com/v19.0/${IG_ID}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          access_token: TOKEN,
          caption,
          image_base64: imageBase64
        }),
      }
    );

    const uploadJson = await uploadRes.json();
    if (!uploadJson.id) {
      console.error("IG UPLOAD ERROR:", uploadJson);
      return uploadJson;
    }

    // Step 2 – publish it
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${IG_ID}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          access_token: TOKEN,
          creation_id: uploadJson.id,
        }),
      }
    );

    const publishJson = await publishRes.json();
    return publishJson;
  } catch (err) {
    console.error("INSTAGRAM ERROR:", err);
    return null;
  }
}
