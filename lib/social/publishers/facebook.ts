export async function publishToFacebook(caption: string, base64Image: string) {
  try {
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID!;
    const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN!;

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption,
          access_token: PAGE_TOKEN,
          // Base64 upload (FB accepts this format)
          source: `data:image/png;base64,${base64Image}`,
        }),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      console.error("FACEBOOK ERROR:", json);
      return { error: json };
    }

    return json;
  } catch (err) {
    console.error("Facebook publish error:", err);
    return null;
  }
}
