import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type SelectedDeal = {
  id: number;
  title: string;        // English title
  description: string;  // English notes/description
  price: number | null; // current price
  old_price: number | null;
  store_name: string | null;
  image_url: string | null;
  slug: string;
};

export async function pickDealFromLastHour(): Promise<SelectedDeal | null> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("deals")
    .select(`
      id,
      description,
      notes,
      current_price,
      old_price,
      store_name,
      image_link,
      slug,
      published_at
    `)
    .gte("published_at", oneHourAgo)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("pickDealFromLastHour error:", error);
    return null;
  }

  if (!data || data.length === 0) return null;

  // Choose 1 from the recent deals
  const deal = data[Math.floor(Math.random() * data.length)];

  return {
    id: deal.id,
    title: deal.description || "Hot Deal",
    description: deal.notes || "",
    price: deal.current_price || null,
    old_price: deal.old_price || null,
    store_name: deal.store_name || null,
    image_url: deal.image_link || null,
    slug: deal.slug,
  };
}
