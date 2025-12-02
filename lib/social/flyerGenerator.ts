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

const WIDTH = 1080;
const HEIGHT = 1350;

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

// Basic word-wrap into lines constrained by maxWidth
function wrapLines(ctx: any, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line + word + " ";
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

// Draw title with auto font-size control & ellipsis
function drawTitle(
  ctx: any,
  title: string,
  maxWidth: number,
  maxLines: number,
  startY: number
): { lastY: number } {
  let fontSize = 64;
  let lines: string[] = [];

  // Try shrinking font until we fit within maxLines
  while (fontSize >= 40) {
    ctx.font = `700 ${fontSize}px Inter`;
    lines = wrapLines(ctx, title, maxWidth);
    if (lines.length <= maxLines) break;
    fontSize -= 4;
  }

  // If still too many lines, trim and add ellipsis
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[maxLines - 1];
    // remove last word and add "..."
    const trimmed = last.replace(/\s+\S+$/, "");
    lines[maxLines - 1] = (trimmed || last).trimEnd() + "...";
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#111827";

  const lineHeight = fontSize + 10;
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y);
    y += lineHeight;
  }

  return { lastY: y - lineHeight }; // y of last line
}

export async function generateFlyer(deal: SelectedDeal): Promise<Buffer> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 1) TITLE
  const maxTitleWidth = 900;
  const titleStartY = 120;

  ctx.font = "700 64px Inter";
  const { lastY: titleLastY } = drawTitle(
    ctx,
    deal.title,
    maxTitleWidth,
    3, // max 3 lines
    titleStartY
  );

  // 2) PRODUCT IMAGE AREA
  const imgBoxMarginTop = 40;
  const imgTop = titleLastY + imgBoxMarginTop;
  const imgBoxW = 900;
  const imgBoxH = 600;
  const imgBoxX = (WIDTH - imgBoxW) / 2;

  // subtle card behind image
  ctx.fillStyle = "#f9fafb";
  ctx.roundRect(imgBoxX, imgTop, imgBoxW, imgBoxH, 32);
  ctx.fill();

  try {
    if (deal.image_url) {
      const image = await loadImage(deal.image_url);
      const ratio = Math.min(imgBoxW / image.width, imgBoxH / image.height);

      const newW = image.width * ratio;
      const newH = image.height * ratio;

      const imgX = imgBoxX + (imgBoxW - newW) / 2;
      const imgY = imgTop + (imgBoxH - newH) / 2;

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 10;

      ctx.drawImage(image, imgX, imgY, newW, newH);
      ctx.restore();
    }
  } catch (err) {
    console.log("Image load error:", err);
  }

  // 3) PRICE BADGE (rounded rectangle, green)
  const priceBoxMarginTop = 60;
  const priceBoxY = imgTop + imgBoxH + priceBoxMarginTop;
  const priceBoxW = 420;
  const priceBoxH = 160;
  const priceBoxX = (WIDTH - priceBoxW) / 2;

  ctx.fillStyle = "#2ecc71"; // green badge
  ctx.roundRect(priceBoxX, priceBoxY, priceBoxW, priceBoxH, 40);
  ctx.fill();

  const priceText = formatPrice(deal.price);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.textAlign = "center";

  // Price (big)
  ctx.font = "700 64px Inter";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(priceText, WIDTH / 2, priceBoxY + 80);

  // Percent (smaller, with emoji)
  ctx.font = "700 40px Inter";
  const percentLine = percent
    ? `${percent}% OFF ${getEmoji(percent)}`
    : "Great Deal";
  ctx.fillText(percentLine, WIDTH / 2, priceBoxY + 130);

  // 4) LOGO + WEBSITE (bottom center)
  const logoUrl = "https://www.dealswindfall.com/dealswindfall-logoA.png";

  try {
    const logo = await loadImage(logoUrl);
    const logoH = 80;
    const logoW = (logo.width / logo.height) * logoH;

    const logoX = (WIDTH - logoW) / 2;
    const logoY = HEIGHT - 180;

    ctx.drawImage(logo, logoX, logoY, logoW, logoH);
  } catch (err) {
    console.log("Logo load error:", err);
  }

  ctx.font = "400 36px Inter";
  ctx.textAlign = "center";
  ctx.fillStyle = "#4b5563";
  ctx.fillText("www.dealswindfall.com", WIDTH / 2, HEIGHT - 70);

  return canvas.toBuffer("image/png");
}
