export async function publishToInstagram(caption: string, imageUrl: string) {
  try {
    const IG_ID = process.env.INSTAGRAM_BUSINESS_ID!;
    const TOKEN = process.env.INSTAGRAM_LONG_LIVED_TOKEN!;

    // 1️⃣ Create media object (upload reference)
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

    if (!mediaRes.ok || !mediaJson.id) {
      console.error("IG MEDIA ERROR:", mediaJson);
      return { step: "media", error: mediaJson };
    }

    const creationId = mediaJson.id;

    // 2️⃣ Publish media object to feed
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

    if (!publishRes.ok) {
      console.error("IG PUBLISH ERROR:", publishJson);
      return { step: "publish", error: publishJson };
    }

    return publishJson; // { id: 'INSTAGRAM_POST_ID' }
  } catch (err) {
    console.error("INSTAGRAM ERROR:", err);
    return null;
  }
}
