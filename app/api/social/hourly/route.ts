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

    // 1. Pick a deal that was published in the last hour
    const deal = await pickDealFromLastHour();
    if (!deal) {
      console.log("No deal found in last hour");
      return NextResponse.json({ error: "No deal found" }, { status: 404 });
    }

    // 2. Caption text for social platforms
    const caption = buildCaption(deal);

    // 3. Download deal image → upload to Supabase → get safe URL
    // 3. Download deal image → upload to Supabase → get safe URL
console.log("Downloading & saving image:", deal.image_url);

let storedUrl: string | null = null;

if (deal.image_url) {
  storedUrl = await saveImageToSupabase(deal.image_url);
} else {
  console.warn("⚠ No image_url provided for deal — using placeholder");
}

if (storedUrl) {
  console.log("Image stored:", storedUrl);
  deal.image_url = storedUrl;
}


    // 4. Generate flyer (PNG buffer → Base64)
    console.log("Generating flyer...");
    const flyer = await generateFlyer(deal);
    const flyerBase64 = flyer.toString("base64");

    // --- SOCIAL MEDIA PUBLISHING ---
    let xResult = null;
    let telegramResult = null;
    let facebookResult = null;
    let instagramResult = null;

 /*   // 5. Post to X (Twitter)
    try {
      console.log("Posting to X...");
      xResult = await publishToX(caption.text, flyerBase64);
      console.log("X posted:", xResult.id);
    } catch (err) {
      console.error("X POST ERROR:", err);
    }
*/
    // 6. Post to Telegram
    try {
      console.log("Posting to Telegram...");
      telegramResult = await publishToTelegram(caption.text, flyerBase64);
      console.log("Telegram posted");
    } catch (err) {
      console.error("TELEGRAM POST ERROR:", err);
    }
/*
    // 7. Post to Facebook Page
   try {
      console.log("Posting to Facebook...");
      facebookResult = await publishToFacebook(caption.text, flyerBase64);
      console.log("Facebook posted:", facebookResult);
    } catch (err) {
      console.error("FACEBOOK POST ERROR:", err);
    }

    // 8. Post to Instagram Business Account
    try {
      console.log("Posting to Instagram...");
      instagramResult = await publishToInstagram(caption.text, flyerBase64);
      console.log("Instagram posted:", instagramResult);
    } catch (err) {
      console.error("INSTAGRAM POST ERROR:", err);
    }
*/
    console.log("### HOURLY POST COMPLETE ###");

    return NextResponse.json({
      success: true,
      data: {
        xResult,
        telegramResult,
        facebookResult,
        instagramResult,
        usedImage: deal.image_url
      }
    });

  } catch (err) {
    console.error("Hourly social post error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
