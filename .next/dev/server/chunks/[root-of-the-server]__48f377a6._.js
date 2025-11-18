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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseAdmin.ts [app-route] (ecmascript)");
;
;
/* -------------------------------------------------------------------------- */ /* 🔧 Helpers                                                                  */ /* -------------------------------------------------------------------------- */ // Extract URLs from notes
function extractUrls(text) {
    return text?.match(/https?:\/\/[^\s]+/g) || [];
}
// Get base URL (VERY IMPORTANT!)
function getBaseUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
}
// Fetch title from internal route (safe server version)
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
async function POST(req) {
    try {
        const body = await req.json();
        // Parse prices
        const oldP = parseFloat(body.old_price || body.oldPrice || 0);
        const currP = parseFloat(body.current_price || body.currentPrice || 0);
        const priceDiff = oldP && currP ? oldP - currP : 0;
        const percentDiff = oldP ? Number((priceDiff / oldP * 100).toFixed(2)) : 0;
        // Determine deal heat level
        let dealLevel = "";
        if (percentDiff >= 40 && percentDiff < 51) dealLevel = "Blistering deal";
        else if (percentDiff >= 51 && percentDiff < 61) dealLevel = "Scorching deal";
        else if (percentDiff >= 61 && percentDiff < 71) dealLevel = "Searing deal";
        else if (percentDiff >= 71) dealLevel = "Flaming deal";
        /* --------------------------------------------- */ /* STEP 1 — Save the MAIN DEAL                  */ /* --------------------------------------------- */ const { data: deal, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deals").insert({
            description: body.description || "",
            current_price: currP || null,
            old_price: oldP || null,
            price_diff: priceDiff || null,
            percent_diff: percentDiff || null,
            image_link: body.imageLink || null,
            product_link: body.productLink || null,
            review_link: body.reviewLink || null,
            coupon_code: body.couponCode || null,
            shipping_cost: body.shippingCost ? Number(body.shippingCost) : null,
            notes: body.notes || null,
            expire_date: body.expireDate || null,
            category: body.category || null,
            store_name: body.storeName || null,
            deal_level: dealLevel,
            holiday_tag: body.holidayTag || null,
            published_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        /* --------------------------------------------- */ /* STEP 2 — Extract URLs from notes             */ /* --------------------------------------------- */ const urls = extractUrls(body.notes || "");
        if (urls.length > 0) {
            // Fetch all titles in parallel (MUCH faster)
            const titleResults = await Promise.all(urls.map((u)=>getTitle(u)));
            const rows = urls.map((url, i)=>({
                    deal_id: deal.id,
                    url,
                    title: titleResults[i] || null
                }));
            /* -------------------------------------------- */ /* STEP 3 — Insert related links               */ /* -------------------------------------------- */ const { error: relErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deal_related_links").insert(rows);
            if (relErr) console.error("❌ Related links insert failed:", relErr);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            deal
        }, {
            status: 201
        });
    } catch (e) {
        console.error("POST /deals error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message || "Unknown error"
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data || [], {
            status: 200
        });
    } catch (e) {
        console.error("GET /deals error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...updateFields } = body;
        if (!id) throw new Error("Missing deal ID for update.");
        // Recalculate discount if prices provided
        const oldP = parseFloat(updateFields.old_price || 0);
        const currP = parseFloat(updateFields.current_price || 0);
        if (!isNaN(oldP) && !isNaN(currP) && oldP > 0 && currP > 0) {
            const priceDiff = oldP - currP;
            const percentDiff = Number((priceDiff / oldP * 100).toFixed(2));
            let dealLevel = "";
            if (percentDiff >= 40 && percentDiff < 51) dealLevel = "Blistering deal";
            else if (percentDiff >= 51 && percentDiff < 61) dealLevel = "Scorching deal";
            else if (percentDiff >= 61 && percentDiff < 71) dealLevel = "Searing deal";
            else if (percentDiff >= 71) dealLevel = "Flaming deal";
            updateFields.price_diff = priceDiff;
            updateFields.percent_diff = percentDiff;
            updateFields.deal_level = dealLevel;
        }
        // Update in Supabase
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deals").update(updateFields).eq("id", id).select().single();
        if (error) throw error;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            updated: data
        }, {
            status: 200
        });
    } catch (e) {
        console.error("PUT /deals error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        const { id } = await req.json();
        if (!id) throw new Error("Missing deal ID");
        console.log("🗑 Deleting related links for deal:", id);
        // 1️⃣ Delete related links first (safe even if cascade exists)
        const relDelete = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deal_related_links").delete().eq("deal_id", id);
        if (relDelete.error) {
            console.error("❌ Failed deleting related links:", relDelete.error);
            throw relDelete.error;
        }
        console.log("🗑 Deleting deal:", id);
        // 2️⃣ Now delete the deal
        const dealDelete = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from("deals").delete().eq("id", id);
        if (dealDelete.error) {
            console.error("❌ Failed deleting deal:", dealDelete.error);
            throw dealDelete.error;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            message: "Deal deleted"
        }, {
            status: 200
        });
    } catch (err) {
        console.error("🔥 DELETE /deals crashed:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message || "Unknown delete error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__48f377a6._.js.map