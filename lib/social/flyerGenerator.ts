import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "./types";
import path from "path";

// Load Inter Fonts
registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
  weight: "400",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});

// Format price like $12.99
function formatPrice(value: number | null): string {
  if (value == null) return "$0.00";
  return `$${value.toFixed(2)}`;
}

function getEmoji(percent: number): string {
  if (percent >= 60) return "🔥🔥";
  if (percent >= 40) return "⚡";
  if (percent >= 25) return "💥";
  return "";
}

// Text wrapping
function drawWrappedText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2
): number {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + " ";
      if (lines.length === maxLines) break;
    } else {
      line = testLine;
    }
  }

  if (lines.length < maxLines) {
    lines.push(line.trim());
  } else {
    lines[maxLines - 1] += "...";
  }

  lines.forEach((l, idx) => ctx.fillText(l, x, y + idx * lineHeight));

  return lines.length;
}

export async function generateFlyer(deal: SelectedDeal): Promise<Buffer> {
  const WIDTH = 1080;
  const HEIGHT = 1350;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#111827";
  ctx.font = "700 60px Inter";

  const titleLines = drawWrappedText(
    ctx,
    deal.title,
    WIDTH / 2,
    100,
    900,
    70,
    2
  );

  // Image
  const imgY = 100 + titleLines * 70 + 60;
  const imgWidth = 900;
  const imgHeight = 600;
  const imgX = (WIDTH - imgWidth) / 2;

  try {
    const image = await loadImage(deal.image_url || "");
    const ratio = Math.min(imgWidth / image.width, imgHeight / image.height);
    const finalW = image.width * ratio;
    const finalH = image.height * ratio;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(imgX - 10, imgY - 10, imgWidth + 20, imgHeight + 20);

    ctx.drawImage(
      image,
      imgX + (imgWidth - finalW) / 2,
      imgY + (imgHeight - finalH) / 2,
      finalW,
      finalH
    );
  } catch (err) {
    console.log("Image load error:", err);
  }

  // Price Box
  const boxY = imgY + imgHeight + 60;
  ctx.fillStyle = "#facc15";
  ctx.roundRect(300, boxY, 480, 150, 50);
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.font = "700 70px Inter";
  ctx.fillText(formatPrice(deal.price), WIDTH / 2, boxY + 70);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.font = "700 40px Inter";
  ctx.fillStyle = "#d00000";
  ctx.fillText(`${percent}% OFF ${getEmoji(percent)}`, WIDTH / 2, boxY + 130);

  // Logo
  const logoUrl = "https://www.dealswindfall.com/dealswindfall-logoA.png";

  try {
    const logo = await loadImage(logoUrl);
    const h = 80;
    const w = (logo.width / logo.height) * h;
    ctx.drawImage(logo, 60, HEIGHT - 150, w, h);
  } catch {}

  ctx.font = "400 40px Inter";
  ctx.textAlign = "right";
  ctx.fillText("www.dealswindfall.com", WIDTH - 60, HEIGHT - 80);

  return canvas.toBuffer("image/png");
}
