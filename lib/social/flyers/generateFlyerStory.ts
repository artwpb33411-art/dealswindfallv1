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
const HEIGHT = 1920;

export async function generateFlyerStory(deal: SelectedDeal): Promise<Buffer> {
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
  let fontSize = 64;
  ctx.textAlign = "center";

  while (fontSize >= 36) {
    ctx.font = `700 ${fontSize}px Inter`;
    if (ctx.measureText(deal.title).width <= 900) break;
    fontSize -= 3;
  }

  ctx.fillText(deal.title, WIDTH / 2, 175);

  // Image card (must be solid white)
  const cardW = 900;
  const cardH = 900;
  const cardX = 90;
  const cardY = 260;

  ctx.fillStyle = "#ffffff"; // Solid white
  ctx.roundRect(cardX, cardY, cardW, cardH, 50);
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

  // Price badge
  const badgeX = 150;
  const badgeY = 1270;
  const badgeW = 780;
  const badgeH = 260;

  ctx.fillStyle = "#22c55e"; // SOLID green
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 50);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  ctx.font = "700 110px Inter";
  ctx.fillText(`$${deal.price?.toFixed(2)}`, WIDTH / 2, badgeY + 145);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.font = "700 52px Inter";
  ctx.fillText(`${percent}% OFF`, WIDTH / 2, badgeY + 220);

  return canvas.toBuffer("image/png");
}
