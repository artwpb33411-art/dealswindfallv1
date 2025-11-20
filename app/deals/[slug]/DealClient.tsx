"use client";

import { useEffect } from "react";
import { useLangStore } from "@/lib/languageStore";
import Image from "next/image";

export default function DealClient({ deal }) {
  const { lang, hydrated, hydrate } = useLangStore();

  useEffect(() => {
    hydrate();
  }, []);

  if (!hydrated) return null;
  if (!deal) return null;

  const title = lang === "en" ? deal.description : deal.description_es;
  const notes = lang === "en" ? deal.notes : deal.notes_es;

  return (
    <main className="mx-auto max-w-3xl p-4">

      <header className="flex items-center justify-between mb-6">
        <a href="/" className="flex items-center gap-2 group">
          <Image
            src="/dealswindfall-logoA.png"
            alt="DealsWindfall Logo"
            width={140}
            height={40}
            className="object-contain"
          />
        </a>

        <a
          href="/"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          ← Back to DealsWindfall
        </a>
      </header>

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4 text-gray-900">{title}</h1>

      {/* IMAGE */}
      {deal.image_link && (
        <div className="w-full bg-white p-4 rounded-md shadow mb-6 flex justify-center">
          <img
            src={deal.image_link}
            alt={title}
            className="max-h-96 w-auto object-contain"
          />
        </div>
      )}

      {/* NOTES / DESCRIPTION */}
      <p className="text-gray-800 leading-relaxed mb-8 whitespace-pre-line">
        {notes}
      </p>

      {/* ❌ Remove language links for Option A */}
    </main>
  );
}
