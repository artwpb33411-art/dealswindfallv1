import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "./dealSelector";
import path from "path";

// Register Inter (Regular and Bold)
registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
  weight: "400",
});

registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});


const WIDTH = 1080;
const HEIGHT = 1350; // Taller layout like real ads

function drawWrappedText(ctx: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 2) {
  const words = text.split(" ");
  let line = "";
  let lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + " ";
      if (lines.length === maxLines) break;
    } else {
      line = testLine;
    }
  }

  if (lines.length < maxLines) {
    lines.push(line.trim());
  } else {
    // Add ellipsis to last line
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.substring(0, last.length - 3) + "...";
  }

  // Draw lines
  lines.forEach((l, i) => {
    ctx.fillText(l, x, y + i * lineHeight);
  });
}

type FlyerResult = {
  buffer: Buffer;
  base64: string;
};

export async function generateFlyer(
  deal: SelectedDeal,
  logoUrl: string
): Promise<FlyerResult> {

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // ----------------------
  // Background
  // ----------------------
  ctx.fillStyle = "#FFFFFF"; // Clean white background
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ----------------------
  // Title
  // ----------------------
  ctx.fillStyle = "#111827";
  ctx.font = "700 60px Inter";

  ctx.textAlign = "center";

  const title = deal.title ? deal.title.substring(0, 80) : "Hot Deal!";
  ctx.textAlign = "center";
ctx.fillStyle = "#111827";
ctx.font = "700 60px Inter";

drawWrappedText(
  ctx,
  title,
  WIDTH / 2,
  120,
  900,      // max width before wrapping
  70,       // line height
  2         // max number of lines
);


  // ----------------------
  // Product Image
  // ----------------------
  if (deal.image_url) {
    try {
      const productImg = await loadImage(deal.image_url);

      const maxImgWidth = 900;
      const maxImgHeight = 800;

      // Maintain aspect ratio
      let drawWidth = maxImgWidth;
      let drawHeight = (productImg.height / productImg.width) * maxImgWidth;

      if (drawHeight > maxImgHeight) {
        drawHeight = maxImgHeight;
        drawWidth = (productImg.width / productImg.height) * maxImgHeight;
      }

      const x = (WIDTH - drawWidth) / 2;
      const y = 180;

      // Soft shadow
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 20;
      ctx.drawImage(productImg, x, y, drawWidth, drawHeight);
      ctx.shadowBlur = 0;

    } catch (err) {
      console.error("Failed to load product image:", err);
    }
  }

  // ----------------------
  // Price + Discount Badge
  // ----------------------
  ctx.textAlign = "center";

  const price = deal.price ? `$${deal.price}` : "";
  const discount =
    deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : null;

  const discountText = discount ? `${discount}% OFF` : "";

  // Price badge background
  ctx.fillStyle = "#FACC15"; // Brand yellow
  ctx.beginPath();
  ctx.roundRect(WIDTH / 2 - 200, 1050, 400, 120, 50);
  ctx.fill();

  // Price text
  ctx.fillStyle = "#111827";
  ctx.font = "700 70px Inter";
  ctx.fillText(price, WIDTH / 2, 1110);

  // Discount text
  if (discountText) {
 ctx.font = "700 40px Inter";

    ctx.fillStyle = "#DC2626";
    ctx.fillText(discountText, WIDTH / 2, 1160);
  }

  // ----------------------
  // Footer: Logo + Website
  // ----------------------
  ctx.fillStyle = "#111827";
 ctx.font = "400 50px Inter";


  // Website
  ctx.textAlign = "right";
  ctx.font = "400 40px Inter";

  ctx.fillText("www.dealswindfall.com", WIDTH - 40, HEIGHT - 50);

  // Logo bottom-left
  try {
    const logoImg = await loadImage(logoUrl);
    const logoWidth = 240;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;

    ctx.drawImage(logoImg, 40, HEIGHT - 50 - logoHeight, logoWidth, logoHeight);
  } catch (err) {
    console.error("Failed to load logo:", err);
  }

  // ----------------------
  // Output
  // ----------------------
  const buffer = canvas.toBuffer("image/png");
  const base64 = buffer.toString("base64");

  return { buffer, base64 };
}
