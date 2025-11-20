import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";

  const { data: deals, error } = await supabaseAdmin
    .from("deals")
    .select("id, slug, slug_es, published_at, status")
    .eq("status", "Published");

  if (error) {
    console.error("Sitemap fetch error:", error);
  }

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/categories",
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  for (const p of staticPages) {
    xml += `
  <url>
    <loc>${baseUrl}${p}</loc>
    <priority>1.0</priority>
  </url>`;
  }

  // Deals (ID + slug pattern)
  if (deals) {
    for (const d of deals) {
      const lastmod = d.published_at || new Date().toISOString();

      // English URL: /deals/<id>-<slug>
      xml += `
  <url>
    <loc>${baseUrl}/deals/${d.id}-${d.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.80</priority>
  </url>`;

      // Spanish URL: /es/deals/<id>-<slug_es>
      if (d.slug_es) {
        xml += `
  <url>
    <loc>${baseUrl}/es/deals/${d.id}-${d.slug_es}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.70</priority>
  </url>`;
      }
    }
  }

  xml += `\n</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
