"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import catalogDb from "@/data/catalog-db.json";

interface SearchResult {
  slug: string;
  type: string;
  productName: string;
  code: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const all: SearchResult[] = [];

    Object.entries(catalogDb).forEach(([slug, types]) => {
      types.forEach((typeObj: any) => {
        typeObj.items.forEach((item: any) => {
          if (
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            typeObj.type.toLowerCase().includes(q)
          ) {
            all.push({
              slug,
              type: typeObj.type,
              productName: item.name,
              code: item.code,
            });
          }
        });
      });
    });

    setResults(all.slice(0, 8)); // макс 8 результатов
    setOpen(true);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-xs">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Поиск товаров..."
          className="w-full bg-slate-800 border border-slate-700 text-white text-sm pl-8 pr-8 py-2 focus:outline-none focus:border-orange-500 placeholder-slate-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown результатов */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-sm z-50 max-h-64 overflow-y-auto">
          {results.map((r, i) => (
            <a
              key={i}
              href={`/catalog/${r.slug}`}
              className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <div className="font-medium text-white">{r.productName}</div>
              <div className="text-xs text-slate-500">
                {r.type} • {r.code}
              </div>
            </a>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-sm z-50 px-3 py-2 text-sm text-slate-400">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}
