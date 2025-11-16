import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { deals } = await req.json();

    if (!deals || !Array.isArray(deals) || deals.length === 0)
      throw new Error("No deals provided.");

   const prepared = deals.map((d) => {
  const oldP = parseFloat(d.old_price || "0") || 0;
  const currP = parseFloat(d.current_price || "0") || 0;

  // price difference
  const priceDiff = oldP > 0 && currP > 0 ? oldP - currP : 0;

  // percent difference—always numeric, never null
  let percentDiff = 0;
  if (oldP > 0 && currP > 0) {
    percentDiff = Number(((priceDiff / oldP) * 100).toFixed(2));
  }

  // Determine deal level
  let dealLevel = "";
  if (percentDiff >= 40 && percentDiff < 51) dealLevel = "Blistering deal";
  else if (percentDiff >= 51 && percentDiff < 61) dealLevel = "Scorching deal";
  else if (percentDiff >= 61 && percentDiff < 71) dealLevel = "Searing deal";
  else if (percentDiff >= 71) dealLevel = "Flaming deal";

  return {
    ...d,
    old_price: oldP || null,
    current_price: currP || null,
    price_diff: priceDiff,
    percent_diff: percentDiff,
    deal_level: dealLevel,
    expire_date: d.expire_date?.trim() ? d.expire_date : null,
    published_at: new Date().toISOString(),
  };
});


    const { data, error } = await supabaseAdmin
      .from("deals")
      .insert(prepared)
      .select();

    if (error) throw error;

    return NextResponse.json({ ok: true, inserted: data.length });
  } catch (err: any) {
    console.error("Bulk upload error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error during bulk upload." },
      { status: 500 }
    );
  }
}
