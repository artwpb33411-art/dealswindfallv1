import { createCanvas, loadImage } from "canvas";
import type { SelectedDeal } from "./dealSelector";

const WIDTH = 1080;
const HEIGHT = 1350; // Taller layout like real ads

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
  ctx.font = "bold 60px Sans-serif";
  ctx.textAlign = "center";

  const title = deal.title ? deal.title.substring(0, 80) : "Hot Deal!";
  ctx.fillText(title, WIDTH / 2, 120);

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
  ctx.font = "bold 70px Sans-serif";
  ctx.fillText(price, WIDTH / 2, 1110);

  // Discount text
  if (discountText) {
    ctx.font = "bold 40px Sans-serif";
    ctx.fillStyle = "#DC2626";
    ctx.fillText(discountText, WIDTH / 2, 1160);
  }

  // ----------------------
  // Footer: Logo + Website
  // ----------------------
  ctx.fillStyle = "#111827";
  ctx.font = "bold 40px Sans-serif";

  // Website
  ctx.textAlign = "right";
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
