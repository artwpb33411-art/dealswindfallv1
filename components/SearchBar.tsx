"use client";

import Image from "next/image";
import React from "react";
import { useLangStore } from "@/lib/languageStore";   // ⭐ ADD THIS
import { useEffect } from "react";

type SearchBarProps = {
  onSearch: (value: string) => void;
  onHome: () => void;
};

export default function SearchBar({ onSearch, onHome }: SearchBarProps) {
  const { lang, setLang, hydrated, hydrate } = useLangStore();

useEffect(() => {
  hydrate();
}, []);

if (!hydrated) return null;


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-screen-2xl px-0 py-3 flex items-center">
        
        {/* Left: Logo */}
        <div
          className="flex items-center gap-2 shrink-0 cursor-pointer"
          onClick={onHome}
        >
          <Image
            src="/dealswindfall-logoA.png"
            alt="DealsWindfall"
            width={160}
            height={40}
            className="ml-2 active:scale-95 transition"
            priority
          />
        </div>

        {/* Spacer */}
        <div className="w-4 md:w-8" />

        {/* Middle: Search Box */}
        <div className="flex-1 flex justify-start md:justify-center">
          <label htmlFor="site-search" className="sr-only">
            Search Deals
          </label>

          <input
            id="site-search"
            type="text"
            placeholder="Search deals, stores, or coupons…"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full max-w-xl rounded-md border border-gray-300 px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                       transition"
          />
        </div>

        {/* Right: Language Switcher */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          <div className="flex items-center gap-1 border rounded-md px-2 py-1">
            <button
              onClick={() => setLang("en")}
              className={`text-xs px-1 ${
                lang === "en" ? "text-blue-600 font-semibold" : "text-gray-600"
              }`}
            >
              EN
            </button>

            <span className="text-gray-400">|</span>

            <button
              onClick={() => setLang("es")}
              className={`text-xs px-1 ${
                lang === "es" ? "text-blue-600 font-semibold" : "text-gray-600"
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
