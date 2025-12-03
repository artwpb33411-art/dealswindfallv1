import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "../types";
import path from "path";

const WIDTH = 1080;
const HEIGHT = 1920;

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

export async function generateFlyerStory(deal: SelectedDeal): Promise<Buffer> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Title
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.font = "700 60px Inter";
  ctx.fillText(deal.title.slice(0, 40), WIDTH / 2, 140);

  // Product image
  const safeUrl =
    deal.image_link ||
    "https://www.dealswindfall.com/dealswindfall-logoA.png";

  try {
    const img = await loadImage(safeUrl);

    const maxW = 900;
    const maxH = 900;
    const ratio = Math.min(maxW / img.width, maxH / img.height);

    const w = img.width * ratio;
    const h = img.height * ratio;

    const x = (WIDTH - w) / 2;
    const y = 220;

    ctx.drawImage(img, x, y, w, h);
  } catch (e) {
    console.error("Story image load fail:", e);
  }

  // Price badge bottom
  const badgeY = 1480;
  const badgeH = 220;
  const badgeW = 800;
  const badgeX = (WIDTH - badgeW) / 2;
  const r = 60;

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
  ctx.font = "700 90px Inter";
  ctx.fillText(formatPrice(deal.price), WIDTH / 2, badgeY + 120);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.font = "700 50px Inter";
  ctx.fillText(`${percent}% OFF`, WIDTH / 2, badgeY + 190);

  return canvas.toBuffer("image/png");
}
