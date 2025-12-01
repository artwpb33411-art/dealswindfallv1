import { NextResponse } from "next/server";
import { pickDealFromLastHour } from "@/lib/social/dealSelector";
import { buildCaption } from "@/lib/social/captionBuilder";
import { generateFlyer } from "@/lib/social/flyerGenerator";

import { publishToX } from "@/lib/social/publishers/x";
import { publishToTelegram } from "@/lib/social/publishers/telegram";
import { publishToFacebook } from "@/lib/social/publishers/facebook";

export async function POST() {
  try {
    const deal = await pickDealFromLastHour();
    if (!deal) {
      return NextResponse.json({ error: "No deal found" }, { status: 404 });
    }

    const caption = buildCaption(deal);
    const flyer = await generateFlyer(deal);
    const flyerBase64 = flyer.toString("base64");

    let resultX = null;
    let resultTelegram = null;
    let resultFacebook = null;

    console.log("### START SOCIAL POSTING");

    // --- Facebook ---
    try {
      console.log("Posting to Facebook...");
      resultFacebook = await publishToFacebook(caption.text, flyerBase64);
      console.log("FB RESULT:", resultFacebook);
    } catch (err) {
      console.error("FACEBOOK ERROR:", err);
    }

    // --- X (Twitter) ---
    try {
      console.log("Posting to X...");
      resultX = await publishToX(caption.text, flyerBase64);
      console.log("X RESULT:", resultX);
    } catch (err) {
      console.error("X ERROR:", err);
    }

    // --- Telegram ---
    try {
      console.log("Posting to Telegram...");
      resultTelegram = await publishToTelegram(caption.text, flyerBase64);
      console.log("TELEGRAM RESULT:", resultTelegram);
    } catch (err) {
      console.error("TELEGRAM ERROR:", err);
    }

    return NextResponse.json({
      success: true,
      platforms: {
        facebook: resultFacebook,
        x: resultX,
        telegram: resultTelegram,
      },
    });

  } catch (err) {
    console.error("Hourly social post error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
