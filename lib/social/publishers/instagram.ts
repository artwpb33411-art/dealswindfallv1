import { saveImageToSupabase } from "../saveImage";

type InstagramUploadOptions = {
  caption: string;
  feedImage?: string;   // base64 string
  storyImage?: string;  // base64 string
};

export async function publishToInstagram({
  caption,
  feedImage,
  storyImage,
}: InstagramUploadOptions) {
  try {
    const IG_ID = process.env.INSTAGRAM_BUSINESS_ID!;
    const TOKEN = process.env.INSTAGRAM_LONG_LIVED_TOKEN!;

    let feedResult = null;
    let storyResult = null;

    // -----------------------------------------------------
    // 1️⃣ FEED POST (if provided)
    // -----------------------------------------------------
    if (feedImage) {
      console.log("📸 Uploading FEED image to Supabase...");

      const feedUrl = await saveImageToSupabase(
        `data:image/png;base64,${feedImage}`
      );

      if (!feedUrl) {
        console.error("❌ Failed to store feed image in Supabase");
      } else {
        console.log("📸 FEED IMAGE URL:", feedUrl);

        // Create media container
        const feedMediaRes = await fetch(
          `https://graph.facebook.com/v19.0/${IG_ID}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: feedUrl,
              caption,
              access_token: TOKEN,
            }),
          }
        );

        const feedMediaJson = await feedMediaRes.json();
        console.log("IG FEED MEDIA:", feedMediaJson);

        if (feedMediaJson?.id) {
          // Publish feed post
          const feedPublishRes = await fetch(
            `https://graph.facebook.com/v19.0/${IG_ID}/media_publish`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                creation_id: feedMediaJson.id,
                access_token: TOKEN,
              }),
            }
          );

          const feedPublishJson = await feedPublishRes.json();
          console.log("IG FEED PUBLISH:", feedPublishJson);

          feedResult = feedPublishJson;
        }
      }
    }

    // -----------------------------------------------------
    // 2️⃣ STORY POST (if provided)
    // -----------------------------------------------------
    if (storyImage) {
      console.log("📲 Uploading STORY image to Supabase...");

      const storyUrl = await saveImageToSupabase(
        `data:image/png;base64,${storyImage}`
      );

      if (!storyUrl) {
        console.error("❌ Failed to store story image in Supabase");
      } else {
        console.log("📲 STORY IMAGE URL:", storyUrl);

        const storyRes = await fetch(
          `https://graph.facebook.com/v19.0/${IG_ID}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: storyUrl,
              media_type: "STORIES",
              access_token: TOKEN,
            }),
          }
        );

        const storyJson = await storyRes.json();
        console.log("IG STORY RESULT:", storyJson);

        storyResult = storyJson; // No publish step needed!
      }
    }

    return { feedResult, storyResult };
  } catch (err) {
    console.error("INSTAGRAM ERROR:", err);
    return null;
  }
}
