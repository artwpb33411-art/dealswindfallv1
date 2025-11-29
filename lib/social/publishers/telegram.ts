export async function publishToTelegram(caption: string, base64Image: string) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("caption", caption);
    formData.append("parse_mode", "HTML");

    const buffer = Buffer.from(base64Image, "base64");
    const file = new Blob([buffer], { type: "image/png" });

    formData.append("photo", file, "flyer.png");

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Telegram publish error:", err);
    return null;
  }
}
