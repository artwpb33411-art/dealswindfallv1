import type { SelectedDeal } from "./dealSelector";

export type SocialContent = {
  text: string;
  url: string;
};

export function buildCaption(deal: SelectedDeal): SocialContent {
  const discount =
    deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : null;

  const pricePart = deal.price ? `$${deal.price}` : "Great price";
  const discountPart = discount ? ` (${discount}% OFF)` : "";
  const storePart = deal.store_name ? ` at ${deal.store_name}` : "";

  const baseText = `🔥 Deal Alert: ${deal.title}
${pricePart}${discountPart}${storePart}

👇 Grab it on DealsWindfall:`;

  const url = `https://www.dealswindfall.com/deals/${deal.slug}`;

  const hashtags = [
    "#DealsWindfall",
    "#Deals",
    "#SaveMoney",
    "#Offers",
    "#Coupons",
  ].join(" ");

  return {
    text: `${baseText}\n${url}\n\n${hashtags}`,
    url,
  };
}
