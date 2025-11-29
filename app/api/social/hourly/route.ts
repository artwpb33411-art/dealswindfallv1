import { NextResponse } from "next/server";
import { pickDealFromLastHour } from "@/lib/social/dealSelector";
import { buildCaption } from "@/lib/social/captionBuilder";
import { generateFlyer } from "@/lib/social/flyerGenerator";
import { publishToX } from "@/lib/social/publishers/x";

const LOGO_URL = "https://www.dealswindfall.com/dealswindfall-logoA.png"; // or Supabase storage URL

export async function POST() {
  try {
    const deal = await pickDealFromLastHour();

    if (!deal) {
      console.log("No deals found in last hour; skipping social post.");
      return NextResponse.json({ skipped: true });
    }

    const caption = buildCaption(deal);
    const flyer = await generateFlyer(deal);


    // For now: only X. Later: publishToFacebook, publishToInstagram, etc.
    const tweet = await publishToX(caption.text, flyer.base64);

    return NextResponse.json({
      success: true,
      dealId: deal.id,
      tweetId: tweet.data.id,
    });
  } catch (error: any) {
    console.error("Hourly social post error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
    }
}
