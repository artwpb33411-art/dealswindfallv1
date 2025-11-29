import { NextResponse } from "next/server";
import { pickDealFromLastHour } from "@/lib/social/dealSelector";
import { buildCaption } from "@/lib/social/captionBuilder";
import { generateFlyer } from "@/lib/social/flyerGenerator";
import { publishToX } from "@/lib/social/publishers/x";

export async function POST() {
  try {
    const deal = await pickDealFromLastHour();

    if (!deal) {
      return NextResponse.json({ error: "No deal found" }, { status: 404 });
    }

    const caption = buildCaption(deal);

    const flyer = await generateFlyer(deal);
    const flyerBase64 = flyer.toString("base64");

    const tweet = await publishToX(caption.text, flyerBase64);

    return NextResponse.json({
      success: true,
      data: tweet,
    });
  } catch (err) {
    console.error("Hourly social post error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
