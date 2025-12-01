import { NextResponse } from "next/server";
import { pickDealFromLastHour } from "@/lib/social/dealSelector";
import { buildCaption } from "@/lib/social/captionBuilder";
import { generateFlyer } from "@/lib/social/flyerGenerator";
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

    let facebook = null;

    console.log("### FB TEST: Attempting to post to Facebook...");

    try {
      facebook = await publishToFacebook(caption.text, flyerBase64);
      console.log("### FB RESULT:", facebook);
    } catch (err) {
      console.error("FACEBOOK POST ERROR:", err);
    }

    return NextResponse.json({
      success: true,
      data: { facebook },
    });

  } catch (err) {
    console.error("Hourly social post error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
