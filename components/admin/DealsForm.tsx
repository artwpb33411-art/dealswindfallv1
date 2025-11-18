"use client";
import { useState } from "react";

export default function DealsForm() {
  const [form, setForm] = useState({
    description: "",
    currentPrice: "",
    oldPrice: "",
    storeName: "",
    imageLink: "",
    productLink: "",
    reviewLink: "",
    couponCode: "",
    shippingCost: "",
    notes: "",
    expireDate: "",
    category: "",
    holidayTag: "",
  });

  const HOLIDAY_TAGS = [
    "",
    "Black Friday",
    "Cyber Monday",
    "Thanksgiving Week",
    "Christmas & Holiday",
    "New Year",
    "Back to School",
    "Prime Day",
    "Memorial Day",
    "Labor Day",
    "Independence Day",
    "Spring Sale",
    "Clearance Event",
  ];

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [fetching, setFetching] = useState(false);

  const onChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🧠 Auto-fetch logic (Amazon/Walmart/Target main product)
  const handleAutoFetch = async () => {
    if (!productUrl) return alert("Please paste a product link first.");
    setFetching(true);
    setMsg(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch product data");

      setForm((prev) => ({
        ...prev,
        description: data.title || prev.description,
        storeName: data.store || prev.storeName,
        category: data.category || prev.category,
        imageLink: data.image || prev.imageLink,
        productLink: productUrl,
        currentPrice:
          data.price?.replace(/[^0-9.]/g, "") || prev.currentPrice,
      }));

      setMsg("✅ Product info fetched successfully!");
    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      setMsg(`❌ ${err.message}`);
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          expireDate: form.expireDate ? form.expireDate : null,
          published_at: new Date().toISOString(),
          // ⚠️ The backend will parse `notes` and create rows in deal_related_links
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        console.error("API error:", data);
        setMsg(`❌ ${data.error || "Failed to save"}`);
      } else {
        console.log("✅ Deal saved:", data);
        setMsg("✅ Deal saved successfully!");
        setForm({
          description: "",
          currentPrice: "",
          oldPrice: "",
          storeName: "",
          imageLink: "",
          productLink: "",
          reviewLink: "",
          couponCode: "",
          shippingCost: "",
          notes: "",
          expireDate: "",
          category: "",
          holidayTag: "",
        });
        setProductUrl("");
      }
    } catch (err: any) {
      console.error("Network error:", err);
      setMsg("❌ Network error");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow p-6 rounded-md space-y-4 max-w-2xl border border-gray-300"
    >
      <h2 className="text-xl font-semibold text-blue-600 mb-2">
        Add New Deal
      </h2>
      {msg && <div className="text-sm">{msg}</div>}

      {/* 🆕 Smart Fetch Section */}
      <div className="flex gap-2 items-center">
        <input
          type="url"
          placeholder="Paste Amazon / Walmart / Target product link..."
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          type="button"
          onClick={handleAutoFetch}
          disabled={fetching}
          className={`px-4 py-2 rounded text-white ${
            fetching ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {fetching ? "Fetching..." : "Fetch"}
        </button>
      </div>

      <input
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="Description"
        className="input"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="currentPrice"
          value={form.currentPrice}
          onChange={onChange}
          placeholder="Current Price"
          className="input"
        />
        <input
          name="oldPrice"
          value={form.oldPrice}
          onChange={onChange}
          placeholder="Old Price"
          className="input"
        />
        <input
          name="storeName"
          value={form.storeName}
          onChange={onChange}
          placeholder="Store Name"
          className="input"
        />
      </div>

      <input
        name="imageLink"
        value={form.imageLink}
        onChange={onChange}
        placeholder="Image Link"
        className="input"
      />
      <input
        name="productLink"
        value={form.productLink}
        onChange={onChange}
        placeholder="Product Link"
        className="input"
      />
      <input
        name="reviewLink"
        value={form.reviewLink}
        onChange={onChange}
        placeholder="Review Link"
        className="input"
      />
      <input
        name="couponCode"
        value={form.couponCode}
        onChange={onChange}
        placeholder="Coupon Code"
        className="input"
      />
      <input
        name="shippingCost"
        value={form.shippingCost}
        onChange={onChange}
        placeholder="Shipping Cost"
        className="input"
      />

      {/* NOTES — admin can paste links here, backend will parse URLs */}
      <textarea
        name="notes"
        value={form.notes}
        onChange={onChange}
        placeholder="Notes (plain text + links to similar deals)"
        className="input"
      />

      <input
        name="expireDate"
        value={form.expireDate}
        onChange={onChange}
        placeholder="Deal Expiry Date"
        className="input"
      />
      <input
        name="category"
        value={form.category}
        onChange={onChange}
        placeholder="Category"
        className="input"
      />

      {/* Holiday / Event Tag */}
      <select
        name="holidayTag"
        value={form.holidayTag}
        onChange={onChange}
        className="input"
      >
        {HOLIDAY_TAGS.map((tag) => (
          <option key={tag} value={tag}>
            {tag === "" ? "No holiday / event" : tag}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
      >
        {saving ? "Saving..." : "Save Deal"}
      </button>
    </form>
  );
}
