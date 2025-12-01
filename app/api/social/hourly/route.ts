import { NextResponse } from "next/server";
import { pickDealFromLastHour } from "@/lib/social/dealSelector";
import { buildCaption } from "@/lib/social/captionBuilder";
import { generateFlyer } from "@/lib/social/flyerGenerator";

import { publishToX } from "@/lib/social/publishers/x";
import { publishToTelegram } from "@/lib/social/publishers/telegram";
import { publishToFacebook } from "@/lib/social/publishers/facebook";
import { publishToInstagram } from "@/lib/social/publishers/instagram";
import { uploadTempImage, deleteTempImage } from "@/lib/social/tempStorage";

export async function POST() {
  try {
    const deal = await pickDealFromLastHour();
    if (!deal) {
      return NextResponse.json({ error: "No deal found" }, { status: 404 });
    }

    const caption = buildCaption(deal);
    const flyer = await generateFlyer(deal);
    const flyerBase64 = flyer.toString("base64");

    let facebook: any = null;
    let xResult: any = null;
    let telegram: any = null;
    let instagram: any = null;

    console.log("### SOCIAL POST START — deal:", deal.id);

    // 1️⃣ Upload flyer temporarily for Instagram
    const upload = await uploadTempImage(
      flyer,
      `flyer_${deal.id}_${Date.now()}`
    );

    if (!upload) {
      console.error("Temp upload failed – Instagram will be skipped.");
    }

    // --- Facebook (image via base64 → /photos) ---
    try {
      console.log("Posting to Facebook...");
      facebook = await publishToFacebook(caption.text, flyerBase64);
      console.log("FB RESULT:", facebook);
    } catch (err) {
      console.error("FACEBOOK ERROR:", err);
    }

    // --- X (Twitter) ---
    try {
      console.log("Posting to X...");
      xResult = await publishToX(caption.text, flyerBase64);
      console.log("X RESULT:", xResult);
    } catch (err) {
      console.error("X ERROR:", err);
    }

    // --- Telegram ---
    try {
      console.log("Posting to Telegram...");
      telegram = await publishToTelegram(caption.text, flyerBase64);
      console.log("TELEGRAM RESULT:", telegram);
    } catch (err) {
      console.error("TELEGRAM ERROR:", err);
    }

    // --- Instagram (requires public URL) ---
    if (upload?.publicUrl) {
      try {
        console.log("Posting to Instagram with URL:", upload.publicUrl);
        instagram = await publishToInstagram(
          caption.text,
          upload.publicUrl
        );
        console.log("INSTAGRAM RESULT:", instagram);
      } catch (err) {
        console.error("INSTAGRAM ERROR:", err);
      }

      // Delete temp image after posting attempt
      try {
        await deleteTempImage(upload.filePath);
        console.log("Deleted temp image:", upload.filePath);
      } catch (err) {
        console.error("Temp image delete error:", err);
      }
    } else {
      console.log("Skipping Instagram – no temp image URL.");
    }

    return NextResponse.json({
      success: true,
      platforms: {
        facebook,
        x: xResult,
        telegram,
        instagram,
      },
    });
  } catch (err) {
    console.error("Hourly social post error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
