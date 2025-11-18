import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/* -------------------------------------------------------------------------- */
/* 🔧 Helpers                                                                  */
/* -------------------------------------------------------------------------- */

// Extract URLs from notes
function extractUrls(text: string) {
  return text?.match(/https?:\/\/[^\s]+/g) || [];
}

// Get base URL (VERY IMPORTANT!)
function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000"
  );
}

// Fetch title from internal route (safe server version)
async function getTitle(url: string) {
  try {
    const base = getBaseUrl();

    const res = await fetch(`${base}/api/fetch-title`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.title || null;
  } catch (err) {
    console.error("❌ getTitle failed:", err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* 🟢 CREATE a new deal (POST)                                                 */
/* -------------------------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Parse prices
    const oldP = parseFloat(body.old_price || body.oldPrice || 0);
    const currP = parseFloat(body.current_price || body.currentPrice || 0);
    const priceDiff = oldP && currP ? oldP - currP : 0;
    const percentDiff = oldP ? Number(((priceDiff / oldP) * 100).toFixed(2)) : 0;

    // Determine deal heat level
    let dealLevel = "";
    if (percentDiff >= 40 && percentDiff < 51) dealLevel = "Blistering deal";
    else if (percentDiff >= 51 && percentDiff < 61) dealLevel = "Scorching deal";
    else if (percentDiff >= 61 && percentDiff < 71) dealLevel = "Searing deal";
    else if (percentDiff >= 71) dealLevel = "Flaming deal";

    /* --------------------------------------------- */
    /* STEP 1 — Save the MAIN DEAL                  */
    /* --------------------------------------------- */

    const { data: deal, error } = await supabaseAdmin
      .from("deals")
      .insert({
        description: body.description || "",
        current_price: currP || null,
        old_price: oldP || null,
        price_diff: priceDiff || null,
        percent_diff: percentDiff || null,
        image_link: body.imageLink || null,
        product_link: body.productLink || null,
        review_link: body.reviewLink || null,
        coupon_code: body.couponCode || null,
        shipping_cost: body.shippingCost
          ? Number(body.shippingCost)
          : null,
        notes: body.notes || null,
        expire_date: body.expireDate || null,
        category: body.category || null,
        store_name: body.storeName || null,
        deal_level: dealLevel,
        holiday_tag: body.holidayTag || null,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    /* --------------------------------------------- */
    /* STEP 2 — Extract URLs from notes             */
    /* --------------------------------------------- */

    const urls = extractUrls(body.notes || "");

    if (urls.length > 0) {
      // Fetch all titles in parallel (MUCH faster)
      const titleResults = await Promise.all(urls.map((u) => getTitle(u)));

      const rows = urls.map((url, i) => ({
        deal_id: deal.id,
        url,
        title: titleResults[i] || null,
      }));

      /* -------------------------------------------- */
      /* STEP 3 — Insert related links               */
      /* -------------------------------------------- */

      const { error: relErr } = await supabaseAdmin
        .from("deal_related_links")
        .insert(rows);

      if (relErr) console.error("❌ Related links insert failed:", relErr);
    }

    return NextResponse.json({ ok: true, deal }, { status: 201 });
  } catch (e: any) {
    console.error("POST /deals error:", e);
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* 📋 GET all deals                                                            */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("deals")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (e: any) {
    console.error("GET /deals error:", e);
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
/* -------------------------------------------------------------------------- */
/* ✏️ UPDATE existing deal (PUT)                                               */
/* -------------------------------------------------------------------------- */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) throw new Error("Missing deal ID for update.");

    // Recalculate discount if prices provided
    const oldP = parseFloat(updateFields.old_price || 0);
    const currP = parseFloat(updateFields.current_price || 0);

    if (!isNaN(oldP) && !isNaN(currP) && oldP > 0 && currP > 0) {
      const priceDiff = oldP - currP;
      const percentDiff = Number(((priceDiff / oldP) * 100).toFixed(2));

      let dealLevel = "";
      if (percentDiff >= 40 && percentDiff < 51) dealLevel = "Blistering deal";
      else if (percentDiff >= 51 && percentDiff < 61)
        dealLevel = "Scorching deal";
      else if (percentDiff >= 61 && percentDiff < 71)
        dealLevel = "Searing deal";
      else if (percentDiff >= 71) dealLevel = "Flaming deal";

      updateFields.price_diff = priceDiff;
      updateFields.percent_diff = percentDiff;
      updateFields.deal_level = dealLevel;
    }

    // Update in Supabase
    const { data, error } = await supabaseAdmin
      .from("deals")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, updated: data }, { status: 200 });
  } catch (e: any) {
    console.error("PUT /deals error:", e);
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) throw new Error("Missing deal ID");

    console.log("🗑 Deleting related links for deal:", id);

    // 1️⃣ Delete related links first (safe even if cascade exists)
    const relDelete = await supabaseAdmin
      .from("deal_related_links")
      .delete()
      .eq("deal_id", id);

    if (relDelete.error) {
      console.error("❌ Failed deleting related links:", relDelete.error);
      throw relDelete.error;
    }

    console.log("🗑 Deleting deal:", id);

    // 2️⃣ Now delete the deal
    const dealDelete = await supabaseAdmin
      .from("deals")
      .delete()
      .eq("id", id);

    if (dealDelete.error) {
      console.error("❌ Failed deleting deal:", dealDelete.error);
      throw dealDelete.error;
    }

    return NextResponse.json(
      { ok: true, message: "Deal deleted" },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("🔥 DELETE /deals crashed:", err);
    return NextResponse.json(
      { error: err.message || "Unknown delete error" },
      { status: 500 }
    );
  }
}
