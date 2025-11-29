import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "./dealSelector";
import path from "path";

// Load Inter Fonts (Regular + Bold)
registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
  weight: "400",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});

// --- Helper: Text Wrapping ---
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
  let lines: string[] = [];

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
    // Add ellipsis to last line
    lines[maxLines - 1] = lines[maxLines - 1] + "...";
  }

  lines.forEach((l, idx) => {
    ctx.fillText(l, x, y + idx * lineHeight);
  });

  return lines.length;
}

// --- MAIN FLYER GENERATOR ---
export async function generateFlyer(deal: SelectedDeal): Promise<Buffer> {
  const WIDTH = 1080;
  const HEIGHT = 1350;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ---- Title Rendering ----
  ctx.textAlign = "center";
  ctx.fillStyle = "#111827";
  ctx.font = "700 60px Inter";

  const titleLines = drawWrappedText(
    ctx,
    deal.title,
    WIDTH / 2,
    100,   // Title top padding
    900,   // Max width
    70,    // Line height
    2      // Max lines
  );

  // ---- Product Image ----
  let imgY = 100 + titleLines * 70 + 60; // Dynamically push image down
  const imgHeight = 600;
  const imgWidth = 900;

  try {
    const image = await loadImage(deal.imageUrl);
    const imgX = (WIDTH - imgWidth) / 2;

    // White background frame
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(imgX - 10, imgY - 10, imgWidth + 20, imgHeight + 20);

    // Draw main product image (contain mode)
    const ratio = Math.min(imgWidth / image.width, imgHeight / image.height);
    const finalW = image.width * ratio;
    const finalH = image.height * ratio;

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

  // ---- PRICE + DISCOUNT BOX ----
  const boxY = imgY + imgHeight + 60;
  ctx.fillStyle = "#facc15"; // Yellow
  ctx.roundRect(300, boxY, 480, 150, 50);
  ctx.fill();

  // Price
  ctx.fillStyle = "#000000";
  ctx.font = "700 70px Inter";
  ctx.textAlign = "center";
  ctx.fillText(`$${deal.currentPrice}`, WIDTH / 2, boxY + 70);

  // Discount %
  ctx.font = "700 40px Inter";
  ctx.fillStyle = "#d00000";
  ctx.fillText(`${deal.percentOff}% OFF`, WIDTH / 2, boxY + 130);

  // ---- Logo + Website ----
  const logoUrl = "https://www.dealswindfall.com/dealswindfall-logoA.png";

  try {
    const logo = await loadImage(logoUrl);
    const logoHeight = 80;
    const logoWidth = (logo.width / logo.height) * logoHeight;

    ctx.drawImage(logo, 60, HEIGHT - 150, logoWidth, logoHeight);
  } catch {}

  ctx.fillStyle = "#111827";
  ctx.font = "400 40px Inter";
  ctx.textAlign = "right";
  ctx.fillText("www.dealswindfall.com", WIDTH - 60, HEIGHT - 80);

  return canvas.toBuffer("image/png");
}
