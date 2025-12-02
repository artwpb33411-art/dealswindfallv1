import { NextResponse } from "next/server";

import { pickDealFromLastHour } from "@/lib/social/dealSelector";
import { buildCaption } from "@/lib/social/captionBuilder";
import { saveImageToSupabase } from "@/lib/social/saveImage";
import { generateFlyer } from "@/lib/social/flyerGenerator";

import { publishToX } from "@/lib/social/publishers/x";
import { publishToTelegram } from "@/lib/social/publishers/telegram";
import { publishToFacebook } from "@/lib/social/publishers/facebook";
import { publishToInstagram } from "@/lib/social/publishers/instagram";

export async function POST() {
  try {
    console.log("### HOURLY POST STARTED ###");

    // 1. Pick deal
    const deal = await pickDealFromLastHour();
    if (!deal) {
      console.log("No deal found in last hour.");
      return NextResponse.json({ error: "No deal found" }, { status: 404 });
    }

    // 2. Caption
    const caption = buildCaption(deal);

    // 3. Store image to Supabase
    console.log("Downloading & storing:", deal.image_link);

    let storedUrl: string | null = null;

    if (deal.image_link) {
      storedUrl = await saveImageToSupabase(deal.image_link);
    } else {
      console.warn("⚠ No image_link for this deal.");
    }

    if (storedUrl) {
      console.log("Stored Supabase URL:", storedUrl);
      deal.image_link = storedUrl; // override with supabase safe URL
    }

    // 4. Generate flyer using updated image link
    console.log("Generating flyer...");
    const flyer = await generateFlyer(deal);
    const flyerBase64 = flyer.toString("base64");

    // Publish results
    let xResult = null;
    let telegramResult = null;
    let facebookResult = null;
    let instagramResult = null;

    // 5. X
    // 5. X
try {
  xResult = await publishToX(caption.text, flyerBase64);
  console.log("Posted to X:", xResult?.data?.id);
} catch (err) {
  console.error("X ERROR:", err);
}

    // 6. Telegram
    try {
      telegramResult = await publishToTelegram(caption.text, flyerBase64);
      console.log("Posted to Telegram.");
    } catch (err) {
      console.error("TELEGRAM ERROR:", err);
    }

    // 7. Facebook
    try {
      facebookResult = await publishToFacebook(caption.text, flyerBase64);
      console.log("Posted to Facebook.");
    } catch (err) {
      console.error("FACEBOOK ERROR:", err);
    }

    // 8. Instagram
    try {
      instagramResult = await publishToInstagram(caption.text, flyerBase64);
      console.log("Posted to Instagram.");
    } catch (err) {
      console.error("INSTAGRAM ERROR:", err);
    }

    console.log("### POST COMPLETE ###");

    return NextResponse.json({
      success: true,
      data: {
        xResult,
        telegramResult,
        facebookResult,
        instagramResult,
        usedImage: deal.image_link
      },
    });
  } catch (err) {
    console.error("Hourly social post error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
