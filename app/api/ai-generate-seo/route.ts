import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY!,
});

/**
 * Fallback if AI unavailable or returns invalid JSON
 */
function fallbackSEO(title: string, notes: string) {
  const cleanDesc = notes?.trim()
    ? notes
    : `${title || "This product"} is available now. Don’t miss this offer!`;

  return {
    title_en: title,
    description_en: cleanDesc,
    title_es: title,
    description_es: cleanDesc,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const englishTitle = body.title || body.description || "";
    const englishNotes = body.notes || "";

    if (!englishTitle.trim()) {
      return NextResponse.json(
        { error: "Missing English Title" },
        { status: 400 }
      );
    }

    const productInfo = `
English Title: ${englishTitle}
English Description: ${englishNotes}
Category: ${body.category || "N/A"}
Store: ${body.storeName || "N/A"}
Price: ${body.currentPrice || "N/A"} (old: ${body.oldPrice || "N/A"})
Shipping: ${body.shippingCost || "N/A"}
Coupon: ${body.couponCode || "None"}
Holiday/Event: ${body.holidayTag || "None"}
Product Link: ${body.productLink || "None"}
`.trim();

    // -------------------------------
    //  GPT-4.1-MINI RESPONSE
    // -------------------------------
    const ai = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: `
Rewrite this product for a deals website and return JSON:

{
  "title_en": "",
  "description_en": "",
  "title_es": "",
  "description_es": ""
}

Product Data:
${productInfo}
`,
      max_output_tokens: 900,
    });

    // Prefer ai.output_text ALWAYS (cleanest string output)
    let raw = ai.output_text || "";

    if (!raw || typeof raw !== "string") {
      console.error("AI raw output missing:", ai);
      return NextResponse.json(fallbackSEO(englishTitle, englishNotes));
    }

    // Remove Markdown wrappers
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed: any = null;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parsing failed:", raw);
      return NextResponse.json(fallbackSEO(englishTitle, englishNotes));
    }

    return NextResponse.json(parsed, { status: 200 });

  } catch (err: any) {
    console.error("AI ERROR:", err);
    return NextResponse.json(
      { error: err.message || "AI generation failed" },
      { status: 500 }
    );
  }
}
