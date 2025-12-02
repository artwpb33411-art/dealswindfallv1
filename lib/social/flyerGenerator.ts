import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "./types";
import path from "path";

// Fonts
registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});

const WIDTH = 1080;
const HEIGHT = 1350;

// Format price
function formatPrice(val: number | null) {
  if (val == null) return "$0.00";
  return `$${val.toFixed(2)}`;
}

// Emoji helper
function getEmoji(percent: number) {
  if (percent >= 60) return "🔥🔥";
  if (percent >= 40) return "⚡";
  if (percent >= 25) return "💥";
  return "";
}

// Title wrap
function wrapLines(ctx: any, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (let w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      lines.push(line.trim());
      line = w + " ";
    } else {
      line = test;
    }
  }

  lines.push(line.trim());
  return lines;
}

export async function generateFlyer(deal: SelectedDeal): Promise<Buffer> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // TITLE
  ctx.fillStyle = "#111827";
  let fontSize = 60;
  let lines: string[] = [];

  while (fontSize >= 40) {
    ctx.font = `700 ${fontSize}px Inter`;
    lines = wrapLines(ctx, deal.title, 900);
    if (lines.length <= 3) break;
    fontSize -= 4;
  }

  if (lines.length > 3) {
    lines = lines.slice(0, 3);
    lines[2] = lines[2] + "...";
  }

  ctx.textAlign = "center";
  let y = 120;
  const lineHeight = fontSize + 10;

  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  }

  // IMAGE BOX
  const imgTop = y + 40;
  const boxW = 900;
  const boxH = 600;
  const boxX = (WIDTH - boxW) / 2;

  ctx.fillStyle = "#f3f4f6";
  ctx.roundRect(boxX, imgTop, boxW, boxH, 32);
  ctx.fill();

  // LOAD PRODUCT IMAGE
try {
  if (!deal.image_link) {
    console.error("No product image — using fallback logo.");
  }

  const safeImageUrl =
    deal.image_link || "https://www.dealswindfall.com/dealswindfall-logoA.png";

  console.log("Loading image:", safeImageUrl);

  const image = await loadImage(safeImageUrl);

  const ratio = Math.min(boxW / image.width, boxH / image.height);
  const w = image.width * ratio;
  const h = image.height * ratio;

  const imgX = boxX + (boxW - w) / 2;
  const imgY = imgTop + (boxH - h) / 2;

  ctx.drawImage(image, imgX, imgY, w, h);
} catch (err) {
  console.error("Flyer image load failed:", err);
}


  // PRICE BADGE (bigger)
  const priceBoxY = imgTop + boxH + 60;
  const badgeW = 520;     // wider
  const badgeH = 200;     // taller
  const badgeX = (WIDTH - badgeW) / 2;

  ctx.fillStyle = "#2ecc71";
  ctx.roundRect(badgeX, priceBoxY, badgeW, badgeH, 40);
  ctx.fill();

  const price = formatPrice(deal.price);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  // Price text
  ctx.font = "700 72px Inter";
  ctx.fillText(price, WIDTH / 2, priceBoxY + 95);

  // Percent OFF text
  ctx.font = "700 44px Inter";
  const percentLabel = `${percent}% OFF ${getEmoji(percent)}`;
  ctx.fillText(percentLabel, WIDTH / 2, priceBoxY + 155);

  // FOOTER LOGO
  try {
    const logo = await loadImage("https://www.dealswindfall.com/dealswindfall-logoA.png");
    const logoH = 90;
    const logoW = (logo.width / logo.height) * logoH;

    ctx.drawImage(logo, (WIDTH - logoW) / 2, HEIGHT - 210, logoW, logoH);
  } catch (err) {
    console.error("Logo load failed:", err);
  }

  // FOOTER URL
  ctx.font = "400 38px Inter";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("www.dealswindfall.com", WIDTH / 2, HEIGHT - 100);

  return canvas.toBuffer("image/png");
}
