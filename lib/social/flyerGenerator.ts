import { createCanvas, loadImage } from "canvas";
import type { SelectedDeal } from "./dealSelector";

const WIDTH = 1080;
const HEIGHT = 1080;

type FlyerResult = {
  buffer: Buffer;
  base64: string;
};

export async function generateFlyer(
  deal: SelectedDeal,
  logoUrl: string
): Promise<FlyerResult> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background (brand yellow-ish)
  ctx.fillStyle = "#FDE047"; // adjust to your brand color
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Title box
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, WIDTH, 220);

  // "Deals Windfall" / "HOT DEAL"
  ctx.fillStyle = "#FDE047";
  ctx.font = "bold 60px Sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("HOT DEAL FROM DEALSWINDFALL", WIDTH / 2, 110);

  // Product image (center)
  if (deal.image_url) {
    try {
      const productImg = await loadImage(deal.image_url);
      const targetW = 700;
      const targetH = 500;
      const x = (WIDTH - targetW) / 2;
      const y = 240;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x - 10, y - 10, targetW + 20, targetH + 20);
      ctx.drawImage(productImg, x, y, targetW, targetH);
    } catch (e) {
      console.error("Failed to load product image:", e);
    }
  }

  // Price & discount
  const priceText =
    deal.price != null ? `$${deal.price.toFixed(2)}` : "Great price";

  const discount =
    deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : null;

  const discountText = discount ? `${discount}% OFF` : "";

  ctx.fillStyle = "#111827";
  ctx.font = "bold 70px Sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(priceText, WIDTH / 2, 820);

  if (discountText) {
    ctx.fillStyle = "#DC2626";
    ctx.font = "bold 50px Sans-serif";
    ctx.fillText(discountText, WIDTH / 2, 880);
  }

  // Website bottom-left
  ctx.fillStyle = "#111827";
  ctx.font = "bold 40px Sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("www.dealswindfall.com", 60, HEIGHT - 60);

  // Logo bottom-right
  try {
    const logoImg = await loadImage(logoUrl);
    const logoSize = 160;
    const x = WIDTH - logoSize - 60;
    const y = HEIGHT - logoSize - 80;
    ctx.drawImage(logoImg, x, y, logoSize, logoSize);
  } catch (e) {
    console.error("Failed to load logo:", e);
  }

  const buffer = canvas.toBuffer("image/png");
  const base64 = buffer.toString("base64");

  return { buffer, base64 };
}
