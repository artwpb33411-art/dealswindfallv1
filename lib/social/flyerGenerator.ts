import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "./types";
import path from "path";

// Load fonts
registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});

const WIDTH = 1080;
const HEIGHT = 1350;

function formatPrice(val: number | null) {
  if (val == null) return "$0.00";
  return `$${val.toFixed(2)}`;
}

function getEmoji(percent: number) {
  if (percent >= 60) return "🔥🔥";
  if (percent >= 40) return "⚡";
  if (percent >= 25) return "💥";
  return "";
}

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

  // ------------------------------------------------------------------
  // PREMIUM GRADIENT BACKGROUND
  // ------------------------------------------------------------------
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#f7f9fc");
  gradient.addColorStop(1, "#eaf0f6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ------------------------------------------------------------------
  // TITLE (get best size)
  // ------------------------------------------------------------------
  ctx.fillStyle = "#111827";
  let fontSize = 58;
  let lines: string[] = [];

  while (fontSize >= 36) {
    ctx.font = `700 ${fontSize}px Inter`;
    lines = wrapLines(ctx, deal.title, 900);
    if (lines.length <= 3) break;
    fontSize -= 2;
  }

  if (lines.length > 3) {
    lines = lines.slice(0, 3);
    lines[2] += "...";
  }

  ctx.textAlign = "center";
  let y = 120;
  const lineHeight = fontSize + 10;

  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  }

  // ------------------------------------------------------------------
  // PRODUCT IMAGE ZONE – PREMIUM GLASS CARD
  // ------------------------------------------------------------------
  const imgTop = y + 40;
  const boxW = 900;
  const boxH = 600;
  const boxX = (WIDTH - boxW) / 2;

  // Card shadow
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.roundRect(boxX + 6, imgTop + 6, boxW, boxH, 40);
  ctx.fill();

  // Glass frame
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.roundRect(boxX, imgTop, boxW, boxH, 40);
  ctx.fill();

  // Premium shadow behind image (compatible with node-canvas)
ctx.save();
ctx.shadowColor = "rgba(0,0,0,0.15)";
ctx.shadowBlur = 60;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 20;

ctx.fillStyle = "rgba(255,255,255,0.0001)";
ctx.roundRect(boxX + 40, imgTop + 40, boxW - 80, boxH - 80, 32);
ctx.fill();
ctx.restore();


  // ------------------------------------------------------------------
  // LOAD PRODUCT IMAGE (with fallback!)
  // ------------------------------------------------------------------
  let safeImageUrl =
    deal.image_link ||
    "https://www.dealswindfall.com/dealswindfall-logoA.png";

  let loadedImage = null;

  try {
    console.log("Loading image:", safeImageUrl);
    loadedImage = await loadImage(safeImageUrl);
  } catch (err) {
    console.error("Product image fail → using fallback logo.", err);
    safeImageUrl = "https://www.dealswindfall.com/dealswindfall-logoA.png";
    loadedImage = await loadImage(safeImageUrl);
  }

  const ratio = Math.min(boxW / loadedImage.width, boxH / loadedImage.height);
  const w = loadedImage.width * ratio;
  const h = loadedImage.height * ratio;
  const imgX = boxX + (boxW - w) / 2;
  const imgY = imgTop + (boxH - h) / 2;

  ctx.drawImage(loadedImage, imgX, imgY, w, h);

  // ------------------------------------------------------------------
  // PREMIUM PRICE BADGE – Glass pill style
  // ------------------------------------------------------------------
  const priceBoxY = imgTop + boxH + 80;
  const badgeW = 650;
  const badgeH = 200;
  const badgeX = (WIDTH - badgeW) / 2;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.09)";
  ctx.roundRect(badgeX + 6, priceBoxY + 8, badgeW, badgeH, 42);
  ctx.fill();

  // Glass badge
  ctx.fillStyle = "rgba(34,197,94,0.9)"; // green premium
  ctx.roundRect(badgeX, priceBoxY, badgeW, badgeH, 42);
  ctx.fill();

  const price = formatPrice(deal.price);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  ctx.font = "700 80px Inter";
  ctx.fillText(price, WIDTH / 2, priceBoxY + 95);

  ctx.font = "700 42px Inter";
  ctx.fillText(`${percent}% OFF ${getEmoji(percent)}`, WIDTH / 2, priceBoxY + 155);

  // ------------------------------------------------------------------
  // FOOTER LOGO
  // ------------------------------------------------------------------
  try {
    const logo = await loadImage("https://www.dealswindfall.com/dealswindfall-logoA.png");
    const logoH = 90;
    const logoW = (logo.width / logo.height) * logoH;

    ctx.drawImage(logo, (WIDTH - logoW) / 2, HEIGHT - 210, logoW, logoH);
  } catch (err) {
    console.error("Footer logo failed:", err);
  }

  // URL
  ctx.font = "400 36px Inter";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("www.dealswindfall.com", WIDTH / 2, HEIGHT - 110);

  return canvas.toBuffer("image/png");
}
