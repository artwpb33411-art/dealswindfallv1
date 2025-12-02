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
    console.log("#####################################");
    console.log("### HOURLY SOCIAL POST STARTED ###");
    console.log("#####################################");

    // 1. Pick deal
    const deal = await pickDealFromLastHour();
    if (!deal) {
      console.log("❌ No deal found in last hour.");
      return NextResponse.json({ error: "No deal found" }, { status: 404 });
    }

    console.log("🛒 Deal Selected:", deal.title);

    // 2. Build caption
    const caption = buildCaption(deal);

    // 3. Store image to Supabase
    console.log("⬇ Downloading & storing image:", deal.image_link);

    let storedUrl: string | null = null;

    if (deal.image_link) {
      try {
        storedUrl = await saveImageToSupabase(deal.image_link);
        console.log("🟢 Stored to Supabase:", storedUrl);
      } catch (err) {
        console.error("❌ Image store error:", err);
      }
    } else {
      console.warn("⚠ No image_link found for this deal.");
    }

    const finalImage = storedUrl ?? deal.image_link;
    console.log("🖼 FINAL IMAGE USED FOR FLYER:", finalImage);

    // --- 4. Generate flyer ---
    console.log("🖨 Generating flyer...");
    const flyer = await generateFlyer({
      ...deal,
      image_link: finalImage,
    });

    const flyerBase64 = flyer.toString("base64");

    // --- 5. Publish posts ---
    let xResult = null;
    let telegramResult = null;
    let facebookResult = null;
    let instagramResult = null;

    // X / Twitter
    try {
      xResult = await publishToX(caption.text, flyerBase64);
      console.log("🐦 Posted to X:", xResult?.data?.id);
    } catch (err) {
      console.error("❌ X ERROR:", err);
    }

    // Telegram
    try {
      telegramResult = await publishToTelegram(caption.text, flyerBase64);
      console.log("📩 Posted to Telegram");
    } catch (err) {
      console.error("❌ TELEGRAM ERROR:", err);
    }

    // Facebook
    try {
      facebookResult = await publishToFacebook(caption.text, flyerBase64);
      console.log("📘 Posted to Facebook");
    } catch (err) {
      console.error("❌ FACEBOOK ERROR:", err);
    }

    // Instagram
    try {
      instagramResult = await publishToInstagram(caption.text, flyerBase64);
      console.log("📸 Posted to Instagram");
    } catch (err) {
      console.error("❌ INSTAGRAM ERROR:", err);
    }

    console.log("### SOCIAL POST COMPLETE ###");

    return NextResponse.json({
      success: true,
      data: {
        xResult,
        telegramResult,
        facebookResult,
        instagramResult,
        usedImage: finalImage,
      },
    });

  } catch (err) {
    console.error("❌ HOURLY POST ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
