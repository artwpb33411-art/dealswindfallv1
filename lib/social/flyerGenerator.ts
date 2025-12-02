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

function formatPrice(val: number | null) {
  if (!val) return "$0.00";
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
    if (ctx.measureText(test).width > maxWidth && line !== "") {
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

  // Title
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
    lines[2] += "...";
  }

  ctx.textAlign = "center";
  let y = 120;
  const lineHeight = fontSize + 10;
  lines.forEach((line) => {
    ctx.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  });

  // Product Image Box
  const imgTop = y + 40;
  const boxW = 900;
  const boxH = 600;
  const boxX = (WIDTH - boxW) / 2;

  ctx.fillStyle = "#f3f4f6";
  ctx.roundRect(boxX, imgTop, boxW, boxH, 32);
  ctx.fill();

  try {
    const image = await loadImage(deal.image_link || "");
    const ratio = Math.min(boxW / image.width, boxH / image.height);

    const w = image.width * ratio;
    const h = image.height * ratio;

    const imgX = boxX + (boxW - w) / 2;
    const imgY = imgTop + (boxH - h) / 2;

    ctx.drawImage(image, imgX, imgY, w, h);
  } catch (err) {
    console.error("Flyer image load failed:", err);
  }

  // Price Badge (green)
  const priceBoxY = imgTop + boxH + 60;
  const badgeW = 420;
  const badgeH = 160;
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

  ctx.font = "700 64px Inter";
  ctx.fillText(price, WIDTH / 2, priceBoxY + 80);

  ctx.font = "700 40px Inter";
  ctx.fillText(`${percent}% OFF ${getEmoji(percent)}`, WIDTH / 2, priceBoxY + 130);

  // Footer (logo + URL)
  try {
    const logo = await loadImage("https://www.dealswindfall.com/dealswindfall-logoA.png");
    const logoH = 80;
    const logoW = (logo.width / logo.height) * logoH;

    ctx.drawImage(logo, (WIDTH - logoW) / 2, HEIGHT - 190, logoW, logoH);
  } catch (err) {
    console.error("Logo load error:", err);
  }

  ctx.font = "400 36px Inter";
  ctx.fillStyle = "#6b7280";
  ctx.textAlign = "center";
  ctx.fillText("www.dealswindfall.com", WIDTH / 2, HEIGHT - 70);

  return canvas.toBuffer("image/png");
}
