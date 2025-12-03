import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "./types";
import path from "path";

// Register fonts
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

function wrapLines(ctx: any, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const w of words) {
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

  // Plain white background (old flyer style)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ==== TITLE (top, centered, wrapped) ====
  ctx.fillStyle = "#111827";
  let fontSize = 56;
  let lines: string[] = [];

  while (fontSize >= 34) {
    ctx.font = `700 ${fontSize}px Inter`;
    lines = wrapLines(ctx, deal.title, 900);
    if (lines.length <= 2) break;
    fontSize -= 2;
  }

  if (lines.length > 2) {
    lines = lines.slice(0, 2);
    lines[1] += "...";
  }

  ctx.textAlign = "center";
  let y = 120;
  const lineHeight = fontSize + 10;

  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  }

  // ==== PRODUCT IMAGE (centered, no green box) ====
  const safeImageUrl =
    deal.image_link ||
    "https://www.dealswindfall.com/dealswindfall-logoA.png";

  try {
    const image = await loadImage(safeImageUrl);

    const maxImgW = 900;
    const maxImgH = 650;
    const ratio = Math.min(maxImgW / image.width, maxImgH / image.height);

    const w = image.width * ratio;
    const h = image.height * ratio;

    const imgX = (WIDTH - w) / 2;
    const imgY = y + 40; // a bit below title

    ctx.drawImage(image, imgX, imgY, w, h);

    // update y below image
    y = imgY + h;
  } catch (err) {
    console.error("❌ Flyer image load FAILED:", err);
    // if image fails, move y down anyway
    y += 500;
  }

  // ==== PRICE BADGE (yellow, old style) ====
  const priceBadgeY = y + 80;
  const badgeW = 650;
  const badgeH = 190;
  const badgeX = (WIDTH - badgeW) / 2;

  // Yellow rounded badge
  ctx.fillStyle = "#facc15"; // yellow
  ctx.beginPath();
  const radius = 60;
  ctx.moveTo(badgeX + radius, priceBadgeY);
  ctx.lineTo(badgeX + badgeW - radius, priceBadgeY);
  ctx.quadraticCurveTo(
    badgeX + badgeW,
    priceBadgeY,
    badgeX + badgeW,
    priceBadgeY + radius
  );
  ctx.lineTo(badgeX + badgeW, priceBadgeY + badgeH - radius);
  ctx.quadraticCurveTo(
    badgeX + badgeW,
    priceBadgeY + badgeH,
    badgeX + badgeW - radius,
    priceBadgeY + badgeH
  );
  ctx.lineTo(badgeX + radius, priceBadgeY + badgeH);
  ctx.quadraticCurveTo(
    badgeX,
    priceBadgeY + badgeH,
    badgeX,
    priceBadgeY + badgeH - radius
  );
  ctx.lineTo(badgeX, priceBadgeY + radius);
  ctx.quadraticCurveTo(
    badgeX,
    priceBadgeY,
    badgeX + radius,
    priceBadgeY
  );
  ctx.closePath();
  ctx.fill();

  const price = formatPrice(deal.price);
  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  // price
  ctx.font = "700 80px Inter";
  ctx.fillText(price, WIDTH / 2, priceBadgeY + 100);

  // percent text (orange/red-ish)
  ctx.font = "700 42px Inter";
  ctx.fillStyle = "#b91c1c"; // dark red, similar to old flyer
  ctx.fillText(`${percent}% OFF`, WIDTH / 2, priceBadgeY + 155);

  // ==== FOOTER: LOGO (bottom left) + URL (bottom right) ====
  try {
    const logo = await loadImage(
      "https://www.dealswindfall.com/dealswindfall-logoA.png"
    );
    const logoH = 90;
    const logoW = (logo.width / logo.height) * logoH;

    const logoX = 80;
    const logoY = HEIGHT - logoH - 80;

    ctx.drawImage(logo, logoX, logoY, logoW, logoH);
  } catch (err) {
    console.error("Footer logo failed:", err);
  }

  // URL on bottom right in red (like old flyer)
  ctx.textAlign = "right";
  ctx.font = "400 40px Inter";
  ctx.fillStyle = "#b91c1c";
  ctx.fillText("www.dealswindfall.com", WIDTH - 80, HEIGHT - 80);

  return canvas.toBuffer("image/png");
}
