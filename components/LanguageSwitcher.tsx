"use client";

import { useLangStore } from "@/lib/languageStore";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLangStore();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-md border ${
          lang === "en" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
        }`}
      >
        EN
      </button>

      <button
        onClick={() => setLang("es")}
        className={`px-3 py-1 rounded-md border ${
          lang === "es" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
        }`}
      >
        ES
      </button>
    </div>
  );
}
