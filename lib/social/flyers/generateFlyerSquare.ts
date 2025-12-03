import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "../types";
import path from "path";

registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});

const WIDTH = 1080;
const HEIGHT = 1080;

export async function generateFlyerSquare(deal: SelectedDeal): Promise<Buffer> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background gradient (solid final export)
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#f7f9fc");
  gradient.addColorStop(1, "#eaf0f6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Title
  ctx.fillStyle = "#111827";
  let fontSize = 50;
  ctx.textAlign = "center";

  while (fontSize >= 26) {
    ctx.font = `700 ${fontSize}px Inter`;
    if (ctx.measureText(deal.title).width <= 900) break;
    fontSize -= 2;
  }

  ctx.fillText(deal.title, WIDTH / 2, 120);

  // Image card (must be fully opaque)
  const cardW = 900;
  const cardH = 520;
  const cardX = 90;
  const cardY = 160;

  ctx.fillStyle = "#ffffff"; // SOLID white
  ctx.roundRect(cardX, cardY, cardW, cardH, 40);
  ctx.fill();

  // Load product image
  const imgUrl =
    deal.image_link || "https://www.dealswindfall.com/dealswindfall-logoA.png";
  let img;
  try {
    img = await loadImage(imgUrl);
  } catch {
    img = await loadImage("https://www.dealswindfall.com/dealswindfall-logoA.png");
  }

  const ratio = Math.min(cardW / img.width, cardH / img.height);
  const newW = img.width * ratio;
  const newH = img.height * ratio;

  ctx.drawImage(img, cardX + (cardW - newW) / 2, cardY + (cardH - newH) / 2, newW, newH);

  // Price badge (SOLID colors only)
  ctx.fillStyle = "#22c55e"; // green
  ctx.roundRect(240, 720, 600, 200, 40);
  ctx.fill();

  ctx.font = "700 72px Inter";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`$${deal.price?.toFixed(2)}`, WIDTH / 2, 810);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.font = "700 42px Inter";
  ctx.fillText(`${percent}% OFF`, WIDTH / 2, 880);

  return canvas.toBuffer("image/png");
}
