module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/supabaseAdmin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-route] (ecmascript) <locals>");
;
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://kzcpmztlnlbwurcdycks.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        persistSession: false
    }
});
}),
"[project]/app/api/deals/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseAdmin.ts [app-route] (ecmascript)");
;
;
;
;
/* -------------------------------------------------------------
   OPENAI (try OPENAI_API_KEY, fallback CHATGPT_API_KEY)
------------------------------------------------------------- */ const openaiApiKey = process.env.OPENAI_API_KEY || process.env.CHATGPT_API_KEY || "";
const hasOpenAIKey = !!openaiApiKey;
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: openaiApiKey || "dummy"
});
/* -------------------------------------------------------------
   Supabase Clients
------------------------------------------------------------- */ const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://kzcpmztlnlbwurcdycks.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        persistSession: false
    }
});
/* -------------------------------------------------------------
   Helper: Slugify
------------------------------------------------------------- */ function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").substring(0, 120);
}
/* -------------------------------------------------------------
   Helper: Extract URLs from notes
------------------------------------------------------------- */ function extractUrls(text) {
    return text?.match(/https?:\/\/[^\s]+/g) || [];
}
/* -------------------------------------------------------------
   Helper: Get Page Title from URL
------------------------------------------------------------- */ function getBaseUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
}
async function getTitle(url) {
    try {
        const base = getBaseUrl();
        const res = await fetch(`${base}/api/fetch-title`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url
            })
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.title || null;
    } catch (err) {
        console.error("❌ getTitle failed:", err);
        return null;
    }
}
/* -------------------------------------------------------------
   Helper: Deal level & discount
------------------------------------------------------------- */ function computeDealMetrics(oldPrice, currentPrice) {
    if (!oldPrice || !currentPrice || oldPrice <= 0 || currentPrice <= 0) {
        return {
            price_diff: null,
            percent_diff: null,
            deal_level: null
        };
    }
    const priceDiff = oldPrice - currentPrice;
    const percentDiff = Number((priceDiff / oldPrice * 100).toFixed(2));
    let dealLevel = "";
    if (percentDiff >= 40 && percentDiff < 51) dealLevel = "Blistering deal";
    else if (percentDiff >= 51 && percentDiff < 61) dealLevel = "Scorching deal";
    else if (percentDiff >= 61 && percentDiff < 71) dealLevel = "Searing deal";
    else if (percentDiff >= 71) dealLevel = "Flaming deal";
    return {
        price_diff: priceDiff,
        percent_diff: percentDiff,
        deal_level: dealLevel || null
    };
}
async function POST(req) {
    try {
        const body = await req.json();
        const { description, notes, description_es, notes_es, category, storeName, currentPrice, oldPrice, shippingCost, couponCode, holidayTag, productLink, reviewLink, imageLink, expireDate } = body;
        if (!description || description.trim() === "") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing English title."
            }, {
                status: 400
            });
        }
        /* -------------------------------------------------------
       AI GENERATION — ONLY IF Spanish not provided
    ------------------------------------------------------- */ let finalTitleEs = description_es || "";
        let finalNotesEs = notes_es || "";
        if (hasOpenAIKey && (!finalTitleEs || !finalNotesEs)) {
            const productText = `
English Title: ${description}
English Description: ${notes || ""}
Category: ${category || ""}
Store: ${storeName || ""}
Price: ${currentPrice} (old: ${oldPrice})
Shipping: ${shippingCost || ""}
Coupon: ${couponCode || ""}
Holiday/Event: ${holidayTag || ""}
Product Link: ${productLink || ""}
`;
            try {
                const ai = await openai.responses.create({
                    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
                    input: `
Translate and rewrite the following product into professional Spanish SEO content.
Return ONLY this JSON:

{
  "title_es": "",
  "description_es": ""
}

${productText}
          `
                });
                const raw = ai.output_text || "";
                const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                finalTitleEs = parsed.title_es || description;
                finalNotesEs = parsed.description_es || notes || "";
            } catch (err) {
                console.error("AI ES generation failed, falling back:", err);
                // fallback: copy EN into ES fields
                finalTitleEs = description;
                finalNotesEs = notes || "";
            }
        } else {
            // if no key or Spanish already provided, just use what we have / copy EN
            if (!finalTitleEs) finalTitleEs = description;
            if (!finalNotesEs) finalNotesEs = notes || "";
        }
        /* -------------------------------------------------------
       Compute deal metrics
    ------------------------------------------------------- */ const oldNum = oldPrice ? Number(oldPrice) : 0;
        const currNum = currentPrice ? Number(currentPrice) : 0;
        const metrics = computeDealMetrics(oldNum, currNum);
        /* -------------------------------------------------------
       Create SLUGS
    ------------------------------------------------------- */ const slug = slugify(description);
        const slug_es = slugify(finalTitleEs);
        /* -------------------------------------------------------
       Prepare FINAL payload (snake_case)
    ------------------------------------------------------- */ const payload = {
            description,
            notes: notes || "",
            description_es: finalTitleEs,
            notes_es: finalNotesEs,
            current_price: currentPrice ? Number(currentPrice) : null,
            old_price: oldPrice ? Number(oldPrice) : null,
            store_name: storeName || null,
            image_link: imageLink || null,
            product_link: productLink || null,
            review_link: reviewLink || null,
            coupon_code: couponCode || null,
            shipping_cost: shippingCost || null,
            expire_date: expireDate || null,
            category: category || null,
            holiday_tag: holidayTag || null,
            slug,
            slug_es,
            published_at: new Date().toISOString(),
            price_diff: metrics.price_diff,
            percent_diff: metrics.percent_diff,
            deal_level: metrics.deal_level
        };
        /* -------------------------------------------------------
       Insert DEAL
    ------------------------------------------------------- */ const { data: deal, error } = await supabase.from("deals").insert(payload).select().single();
        if (error) throw error;
        /* -------------------------------------------------------
       Extract URLs from notes → related links
    ------------------------------------------------------- */ const urls = extractUrls(notes || "");
        if (urls.length > 0) {
            const titleResults = await Promise.all(urls.map((u)=>getTitle(u)));
            const rows = urls.map((url, i)=>({
                    deal_id: deal.id,
                    url,
                    title: titleResults[i] || null
                }));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deal_related_links").insert(rows);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(deal, {
            status: 200
        });
    } catch (err) {
        console.error("DEALS POST error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
async function GET() {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deals").select("*").order("published_at", {
            ascending: false
        });
        if (error) throw error;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
            status: 200
        });
    } catch (err) {
        console.error("GET /deals error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...updateFields } = body;
        if (!id) throw new Error("Missing deal ID.");
        // Map possible camelCase to snake_case if they come in that way
        if ("currentPrice" in updateFields) {
            updateFields.current_price = Number(updateFields.currentPrice);
            delete updateFields.currentPrice;
        }
        if ("oldPrice" in updateFields) {
            updateFields.old_price = Number(updateFields.oldPrice);
            delete updateFields.oldPrice;
        }
        if ("storeName" in updateFields) {
            updateFields.store_name = updateFields.storeName;
            delete updateFields.storeName;
        }
        if ("imageLink" in updateFields) {
            updateFields.image_link = updateFields.imageLink;
            delete updateFields.imageLink;
        }
        if ("productLink" in updateFields) {
            updateFields.product_link = updateFields.productLink;
            delete updateFields.productLink;
        }
        if ("reviewLink" in updateFields) {
            updateFields.review_link = updateFields.reviewLink;
            delete updateFields.reviewLink;
        }
        if ("couponCode" in updateFields) {
            updateFields.coupon_code = updateFields.couponCode;
            delete updateFields.couponCode;
        }
        if ("shippingCost" in updateFields) {
            updateFields.shipping_cost = updateFields.shippingCost;
            delete updateFields.shippingCost;
        }
        if ("expireDate" in updateFields) {
            updateFields.expire_date = updateFields.expireDate;
            delete updateFields.expireDate;
        }
        if ("holidayTag" in updateFields) {
            updateFields.holiday_tag = updateFields.holidayTag;
            delete updateFields.holidayTag;
        }
        // Recalculate discount if prices present
        const oldP = parseFloat(updateFields.old_price ?? body.old_price ?? 0);
        const currP = parseFloat(updateFields.current_price ?? body.current_price ?? 0);
        if (!isNaN(oldP) && !isNaN(currP) && oldP > 0 && currP > 0) {
            const metrics = computeDealMetrics(oldP, currP);
            updateFields.price_diff = metrics.price_diff;
            updateFields.percent_diff = metrics.percent_diff;
            updateFields.deal_level = metrics.deal_level;
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deals").update(updateFields).eq("id", id).select().single();
        if (error) throw error;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            updated: data
        });
    } catch (err) {
        console.error("PUT /deals error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        const { id } = await req.json();
        if (!id) throw new Error("Missing deal ID");
        // Delete related links
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deal_related_links").delete().eq("deal_id", id);
        // Delete main deal
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deals").delete().eq("id", id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            message: "Deal deleted"
        });
    } catch (err) {
        console.error("DELETE /deals error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__48f377a6._.js.map