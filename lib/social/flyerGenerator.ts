import { createCanvas, loadImage, registerFont } from "canvas";
import type { SelectedDeal } from "./types";
import path from "path";
import QRCode from "qrcode";

registerFont(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"), {
  family: "Inter",
});
registerFont(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"), {
  family: "Inter",
  weight: "700",
});

const WIDTH = 1080;
const HEIGHT = 1920;

export async function generateFlyer(deal: SelectedDeal): Promise<Buffer> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background gradient (solid safe)
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#f7f9fc");
  gradient.addColorStop(1, "#eaf0f6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ----------------------------
  // TITLE
  // ----------------------------
  ctx.fillStyle = "#111827";
  let fontSize = 70;
  ctx.textAlign = "center";

  while (fontSize >= 34) {
    ctx.font = `700 ${fontSize}px Inter`;
    if (ctx.measureText(deal.title).width <= 900) break;
    fontSize -= 3;
  }

  ctx.fillText(deal.title, WIDTH / 2, 150);

  // ----------------------------
  // PRODUCT IMAGE CARD
  // ----------------------------
  const cardW = 900;
  const cardH = 900;
  const cardX = 90;
  const cardY = 240;

  ctx.fillStyle = "#ffffff"; // solid white, prevents green overlay
  ctx.roundRect(cardX, cardY, cardW, cardH, 50);
  ctx.fill();

  // Load product image
  const fallbackImg = "https://www.dealswindfall.com/dealswindfall-logoA.png";
  const imgUrl = deal.image_link || fallbackImg;
  let img;

  try {
    img = await loadImage(imgUrl);
  } catch {
    img = await loadImage(fallbackImg);
  }

  const ratio = Math.min(cardW / img.width, cardH / img.height);
  const newW = img.width * ratio;
  const newH = img.height * ratio;

  ctx.drawImage(
    img,
    cardX + (cardW - newW) / 2,
    cardY + (cardH - newH) / 2,
    newW,
    newH
  );

  // ----------------------------
  // PRICE BADGE
  // ----------------------------
  const badgeX = 150;
  const badgeY = 1200;
  const badgeW = 780;
  const badgeH = 250;

  ctx.fillStyle = "#22c55e"; // solid green
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 50);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  ctx.font = "700 120px Inter";
  ctx.fillText(`$${deal.price?.toFixed(2)}`, WIDTH / 2, badgeY + 150);

  const percent =
    deal.percent_diff ??
    (deal.old_price && deal.price
      ? Math.round(((deal.old_price - deal.price) / deal.old_price) * 100)
      : 0);

  ctx.font = "700 52px Inter";
  ctx.fillText(`${percent}% OFF`, WIDTH / 2, badgeY + 220);

  // ----------------------------
  // QR CODE (bottom-left)
  // ----------------------------
  const dealUrl = `https://www.dealswindfall.com/deals/${deal.id}-${deal.slug}`;
  const qrSize = 220;

  const qrDataUrl = await QRCode.toDataURL(dealUrl, {
    margin: 1,
    width: qrSize,
    color: { dark: "#111827", light: "#ffffff" },
  });

  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, 70, 1570, qrSize, qrSize);

  // ----------------------------
  // BRAND FOOTER (logo + URL)
  // ----------------------------
  const footerY = 1560;
  const footerH = 300;

  ctx.fillStyle = "#ffffff";
  ctx.roundRect(0, footerY, WIDTH, footerH, 0);
  ctx.fill();

  // Logo
  const logoSize = 170;
  const logo = await loadImage("https://www.dealswindfall.com/dealswindfall-logoA.png");

  ctx.drawImage(logo, WIDTH / 2 - logoSize / 2, footerY + 30, logoSize, logoSize);

  // Website text
  ctx.fillStyle = "#374151";
  ctx.font = "700 48px Inter";
  ctx.textAlign = "center";
  ctx.fillText("www.dealswindfall.com", WIDTH / 2, footerY + 240);

  // DONE
  return canvas.toBuffer("image/png");
}
