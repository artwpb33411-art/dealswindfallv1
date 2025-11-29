import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type SelectedDeal = {
  id: string;
  title: string;
  price: number | null;
  old_price: number | null;
  store_name: string | null;
  image_url: string | null;
  slug: string;
};

export async function pickDealFromLastHour(): Promise<SelectedDeal | null> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("deals")
    .select("id, title, price, old_price, store_name, image_url, slug, published_at")
    .gte("published_at", oneHourAgo)
    .order("published_at", { ascending: false })
    .limit(20); // safety

  if (error) {
    console.error("pickDealFromLastHour error:", error);
    return null;
  }

  if (!data || data.length === 0) return null;

  // Strategy: random pick among those (you can change later)
  const idx = Math.floor(Math.random() * data.length);
  const d = data[idx];

  return {
    id: d.id,
    title: d.title,
    price: d.price,
    old_price: d.old_price,
    store_name: d.store_name,
    image_url: d.image_url,
    slug: d.slug,
  };
}
