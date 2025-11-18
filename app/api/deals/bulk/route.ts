import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";


function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000"; // fallback for local dev
}

/* ----------------------------------------------- */
/* Extract URLs from text                          */
/* ----------------------------------------------- */
function extractUrls(text: string) {
  return text?.match(/https?:\/\/[^\s]+/g) || [];
}

/* ----------------------------------------------- */
/* Fetch title from internal endpoint              */
/* ----------------------------------------------- */
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
    console.error("Title fetch failed:", err);
    return null;
  }
}


/* ----------------------------------------------- */
/* 🟦 BULK UPLOAD ROUTE                             */
/* ----------------------------------------------- */
export async function POST(req: Request) {
  try {
    const { deals } = await req.json();

    if (!Array.isArray(deals) || deals.length === 0) {
      throw new Error("No deals provided.");
    }

    const finalDeals = [];
    const relatedLinksToInsert = [];

    /* ----------------------------------------------- */
    /* 🔁 Process each deal row                        */
    /* ----------------------------------------------- */
    for (const d of deals) {
      const oldP = parseFloat(d.old_price || "0") || 0;
      const currP = parseFloat(d.current_price || "0") || 0;

      const priceDiff = oldP > 0 && currP > 0 ? oldP - currP : 0;

      let percentDiff = 0;
      if (oldP > 0 && currP > 0) {
        percentDiff = Number(((priceDiff / oldP) * 100).toFixed(2));
      }

      // Deal level
      let dealLevel = "";
      if (percentDiff >= 40 && percentDiff < 51) dealLevel = "Blistering deal";
      else if (percentDiff >= 51 && percentDiff < 61) dealLevel = "Scorching deal";
      else if (percentDiff >= 61 && percentDiff < 71) dealLevel = "Searing deal";
      else if (percentDiff >= 71) dealLevel = "Flaming deal";

      // Clean up the deal row for insert
      const preparedDeal = {
        description: d.description || "",
        current_price: currP || null,
        old_price: oldP || null,
        price_diff: priceDiff,
        percent_diff: percentDiff,
        image_link: d.image_link || null,
        product_link: d.product_link || null,
        review_link: d.review_link || null,
        coupon_code: d.coupon_code || null,
        shipping_cost: d.shipping_cost || null,
        notes: d.notes || null,
        expire_date: d.expire_date?.trim() ? d.expire_date : null,
        category: d.category || null,
        store_name: d.store_name || null,
        deal_level: dealLevel,
        holiday_tag: d.holiday_tag || null,
        published_at: new Date().toISOString(),
      };

      finalDeals.push(preparedDeal);

      /* ----------------------------------------------- */
      /* Extract URLs from notes                         */
      /* ----------------------------------------------- */
      const urls = extractUrls(d.notes || "");

      for (const url of urls) {
        const title = await getTitle(url);

        relatedLinksToInsert.push({
          deal_id_placeholder: true, // temporary placeholder
          url,
          title,
        });
      }
    }

    /* ----------------------------------------------- */
    /* 1️⃣ Insert ALL deals first                       */
    /* ----------------------------------------------- */
    const { data: insertedDeals, error } = await supabaseAdmin
      .from("deals")
      .insert(finalDeals)
      .select();

    if (error) throw error;

    // Map deal IDs back to related links
    let idx = 0;
    for (let i = 0; i < insertedDeals.length; i++) {
      const deal = insertedDeals[i];

      // Count how many links belonged to this deal
      const urls = extractUrls(deals[i].notes || "");

      for (let u = 0; u < urls.length; u++) {
        relatedLinksToInsert[idx].deal_id = deal.id;
        delete relatedLinksToInsert[idx].deal_id_placeholder;
        idx++;
      }
    }

    /* ----------------------------------------------- */
    /* 2️⃣ Insert related links                        */
    /* ----------------------------------------------- */
    if (relatedLinksToInsert.length > 0) {
      const { error: relErr } = await supabaseAdmin
        .from("deal_related_links")
        .insert(relatedLinksToInsert);

      if (relErr) console.error("❌ Related links insert failed:", relErr);
    }

    /* ----------------------------------------------- */
    /* Return response                                 */
    /* ----------------------------------------------- */
    return NextResponse.json(
      {
        ok: true,
        insertedDeals: insertedDeals.length,
        insertedLinks: relatedLinksToInsert.length,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Bulk upload error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error during bulk upload." },
      { status: 500 }
    );
  }
}
