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

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#f7f9fc");
  gradient.addColorStop(1, "#eaf0f6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Title
  ctx.fillStyle = "#111827";
  let fontSize = 50;
  ctx.textAlign = "center";

  while (fontSize >= 30) {
    ctx.font = `700 ${fontSize}px Inter`;
    if (ctx.measureText(deal.title).width <= 900) break;
    fontSize -= 2;
  }

  ctx.fillText(deal.title, WIDTH / 2, 110);

  // Image zone
  const boxW = 900;
  const boxH = 520;
  const boxX = 90;
  const boxY = 150;

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.roundRect(boxX, boxY, boxW, boxH, 40);
  ctx.fill();

  // Load product image
  let imgUrl = deal.image_link || "https://www.dealswindfall.com/dealswindfall-logoA.png";
  let img;
  try {
    img = await loadImage(imgUrl);
  } catch {
    img = await loadImage("https://www.dealswindfall.com/dealswindfall-logoA.png");
  }

  const ratio = Math.min(boxW / img.width, boxH / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  ctx.drawImage(img, boxX + (boxW - w) / 2, boxY + (boxH - h) / 2, w, h);

  // Price badge
  ctx.fillStyle = "rgba(34,197,94,0.9)";
  ctx.roundRect(240, 720, 600, 200, 40);
  ctx.fill();

  ctx.font = "700 72px Inter";
  ctx.fillStyle = "#fff";
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
