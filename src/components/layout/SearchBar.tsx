"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div className="relative">
      {open ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
            className="border border-lm-border px-3 py-1.5 rounded text-sm focus:outline-none focus:border-lm-blue w-48"
          />
          <button type="submit" className="text-lm-blue hover:text-blue-800 text-sm font-medium">
            OK
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-lm-muted hover:text-lm-text text-sm">
            ✕
          </button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-lm-muted hover:text-lm-blue transition-colors"
          aria-label="Ouvrir la recherche"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden md:inline">Rechercher</span>
        </button>
      )}
    </div>
  );
}
