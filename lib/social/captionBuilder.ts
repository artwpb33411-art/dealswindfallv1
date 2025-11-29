import type { SelectedDeal } from "./types";

export type SocialContent = {
  text: string;
  url: string;
};

export function buildCaption(deal: SelectedDeal): SocialContent {
  // Discount calculation
  const discount =
    deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : null;

  const pricePart = deal.price ? `$${deal.price}` : "Great price";
  const discountPart = discount ? ` (${discount}% OFF)` : "";
  const storePart = deal.store_name ? ` at ${deal.store_name}` : "";

  // Correct English URL
  const url = `https://www.dealswindfall.com/deals/${deal.id}-${deal.slug}`;

  const caption = `🔥 Deal Alert: ${deal.title}
${pricePart}${discountPart}${storePart}

👇 Grab it now:
${url}

#DealsWindfall #Deals #SaveMoney #Offers #Coupons`;

  return {
    text: caption,
    url,
  };
}
