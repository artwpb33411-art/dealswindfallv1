import { NextResponse } from "next/server";

import { pickDealFromLastHour } from "@/lib/social/dealSelector";
import { buildCaption } from "@/lib/social/captionBuilder";
import { saveImageToSupabase } from "@/lib/social/saveImage";

import { generateFlyer } from "@/lib/social/flyerGenerator";
import { generateFlyerSquare } from "@/lib/social/flyers/generateFlyerSquare";
import { generateFlyerStory } from "@/lib/social/flyers/generateFlyerStory";

import { publishToX } from "@/lib/social/publishers/x";
import { publishToTelegram } from "@/lib/social/publishers/telegram";
import { publishToFacebook } from "@/lib/social/publishers/facebook";
import { publishToInstagram } from "@/lib/social/publishers/instagram";

export async function POST() {
  try {
    console.log("###################################");
    console.log("### HOURLY AUTOPOST STARTED #######");
    console.log("###################################");

    // 1️⃣ PICK DEAL
    const deal = await pickDealFromLastHour();
    if (!deal) {
      console.log("❌ No deal found in the last hour.");
      return NextResponse.json({ error: "No deal found" }, { status: 404 });
    }

    console.log("🛒 Deal Selected:", deal.title);

    // 2️⃣ BUILD CAPTION
    const caption = buildCaption(deal);

    // 3️⃣ STORE ORIGINAL PRODUCT IMAGE (makes it public)
    let finalImage: string | null = null;

    if (deal.image_link) {
      try {
        console.log("⬇ Downloading product image:", deal.image_link);

        finalImage = await saveImageToSupabase(deal.image_link);

        if (!finalImage) {
          console.warn("⚠ Could not store product image in Supabase. Using original URL.");
          finalImage = deal.image_link;
        } else {
          console.log("🟢 Product image stored:", finalImage);
        }
      } catch (err) {
        console.error("❌ Error storing product image:", err);
        finalImage = deal.image_link;
      }
    } else {
      console.warn("⚠ Deal has no image_link.");
      finalImage = "https://www.dealswindfall.com/dealswindfall-logoA.png";
    }

    // 4️⃣ GENERATE ALL FLYER FORMATS
    console.log("🖨 Generating flyers (portrait, square, story)...");

    const flyerPortrait = await generateFlyer({
      ...deal,
      image_link: finalImage,
    });

    const flyerSquare = await generateFlyerSquare({
      ...deal,
      image_link: finalImage,
    });

    const flyerStory = await generateFlyerStory({
      ...deal,
      image_link: finalImage,
    });

    const portraitBase64 = flyerPortrait.toString("base64");
    const squareBase64 = flyerSquare.toString("base64");
    const storyBase64 = flyerStory.toString("base64");

    // 5️⃣ PUBLISH TO ALL NETWORKS
    let xResult = null;
    let telegramResult = null;
    let facebookResult = null;
    let instagramResult = null;

    // -------------------------------------------------------
    // 🐦 X / Twitter → USE SQUARE
    // -------------------------------------------------------
    try {
      xResult = await publishToX(caption.text, squareBase64);
      console.log("🐦 Posted to X:", xResult?.data?.id);
    } catch (err) {
      console.error("❌ X POST ERROR:", err);
    }

    // -------------------------------------------------------
    // 📩 Telegram → USE SQUARE
    // -------------------------------------------------------
    try {
      telegramResult = await publishToTelegram(caption.text, squareBase64);
      console.log("📩 Posted to Telegram");
    } catch (err) {
      console.error("❌ TELEGRAM POST ERROR:", err);
    }

    // -------------------------------------------------------
    // 📘 Facebook → USE PORTRAIT
    // -------------------------------------------------------
    try {
      facebookResult = await publishToFacebook(caption.text, portraitBase64);
      console.log("📘 Posted to Facebook");
    } catch (err) {
      console.error("❌ FACEBOOK POST ERROR:", err);
    }

    // -------------------------------------------------------
    // 📸 Instagram → FEED (portrait) + STORY (story)
    // -------------------------------------------------------
    try {
      instagramResult = await publishToInstagram({
        caption: caption.text,
        feedImage: portraitBase64,
        storyImage: storyBase64,
      });

      console.log("📸 Posted to Instagram (Feed + Story)");
    } catch (err) {
      console.error("❌ INSTAGRAM POST ERROR:", err);
    }

    console.log("### SOCIAL POST COMPLETE ###");

    return NextResponse.json({
      success: true,
      data: {
        usedImage: finalImage,
        xResult,
        telegramResult,
        facebookResult,
        instagramResult,
      },
    });
  } catch (err) {
    console.error("❌ HOURLY POST ERROR:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
