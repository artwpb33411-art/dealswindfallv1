import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

export async function publishToX(text: string, imageBase64: string) {
  // media upload uses v1.1
 const mediaId = await client.v1.uploadMedia(
  Buffer.from(imageBase64, "base64"),
  {
    mimeType: "image/png"
  }
);


  const tweet = await client.v2.tweet({
    text,
    media: { media_ids: [mediaId] },
  });

  return tweet;
}
