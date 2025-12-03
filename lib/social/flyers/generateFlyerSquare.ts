import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "../types";
import path from "path";

const SIZE = 1080;

// Fonts
registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});

function formatPrice(val: number | null) {
  if (val == null) return "$0.00";
  return `$${val.toFixed(2)}`;
}

export async function generateFlyerSquare(deal: SelectedDeal): Promise<Buffer> {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Title (top center)
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.font = "700 52px Inter";
  ctx.fillText(deal.title.slice(0, 60), SIZE / 2, 120);

  // Load product image
  const safeUrl =
    deal.image_link ||
    "https://www.dealswindfall.com/dealswindfall-logoA.png";

  try {
    const img = await loadImage(safeUrl);

    const maxW = 800;
    const maxH = 600;

    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;

    const x = (SIZE - w) / 2;
    const y = 180;

    ctx.drawImage(img, x, y, w, h);
  } catch (e) {
    console.error("Square image load error:", e);
  }

  // Price badge
  const badgeY = 850;
  const badgeW = 700;
  const badgeH = 180;
  const badgeX = (SIZE - badgeW) / 2;
  const r = 50;

  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(badgeX + r, badgeY);
  ctx.lineTo(badgeX + badgeW - r, badgeY);
  ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + r);
  ctx.lineTo(badgeX + badgeW, badgeY + badgeH - r);
  ctx.quadraticCurveTo(
    badgeX + badgeW,
    badgeY + badgeH,
    badgeX + badgeW - r,
    badgeY + badgeH
  );
  ctx.lineTo(badgeX + r, badgeY + badgeH);
  ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - r);
  ctx.lineTo(badgeX, badgeY + r);
  ctx.quadraticCurveTo(badgeX, badgeY, badgeX + r, badgeY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 80px Inter";
  ctx.fillText(formatPrice(deal.price), SIZE / 2, badgeY + 100);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.font = "700 40px Inter";
  ctx.fillText(`${percent}% OFF`, SIZE / 2, badgeY + 160);

  return canvas.toBuffer("image/png");
}
