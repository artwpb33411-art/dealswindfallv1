export async function publishToInstagram(caption: string, imageUrl: string) {
  try {
    const IG_ID = process.env.INSTAGRAM_BUSINESS_ID!;
    const TOKEN = process.env.INSTAGRAM_LONG_LIVED_TOKEN!;

    // Step 1 — Create media object
    const mediaRes = await fetch(
      `https://graph.facebook.com/v19.0/${IG_ID}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: TOKEN,
        }),
      }
    );

    const mediaJson = await mediaRes.json();
    if (!mediaJson.id) {
      console.error("IG MEDIA ERROR:", mediaJson);
      return mediaJson;
    }

    const creationId = mediaJson.id;

    // Step 2 — Publish media
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${IG_ID}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: TOKEN,
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
