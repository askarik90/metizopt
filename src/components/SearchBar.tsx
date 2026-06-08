"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import catalogDb from "@/data/catalog-db.json";
import characteristicsIndex from "@/data/characteristics-index.json";

// Маппинг старых slug из catalog-db → актуальные slug каталога
const SLUG_MAP: Record<string, string> = {
  ankera:           "krepezh-ankera",
  dyubelya:         "krepezh-dyubela",
  zaklepki:         "krepezh-zaklepki",
  shpilki:          "krepezh-shpilki",
  shurupy:          "krepezh-samorezi",
  vinty:            "krepezh-vintyi",
  bolty:            "krepezh-bolty",
  gayki:            "krepezh-gayki",
  shayby:           "krepezh-shayby",
  shplinty:         "krepezh-shplinty",
  gvozdi:           "krepezh-gvozdi",
  kanaty:           "kanaty",
  nerzhaveyushchiy: "nerzhaveyushchiy",
  perfo:            "perfo",
  takelazh:         "takelazh",
  ventilatsiya:     "ventilatsiya",
  shlangi:          "ventilatsiya",
  elektrody:        "elektrody",
};

// Человекочитаемые названия категорий для результатов по характеристикам
const CATEGORY_LABELS: Record<string, string> = {
  "krepezh-bolty":    "Болты",
  "krepezh-gayki":    "Гайки",
  "krepezh-shayby":   "Шайбы",
  "krepezh-vintyi":   "Винты",
  "krepezh-ankera":   "Анкера",
  "krepezh-shpilki":  "Шпильки",
  "krepezh-dyubela":  "Дюбеля",
  "krepezh-samorezi": "Саморезы",
  "krepezh-zaklepki": "Заклёпки",
  "krepezh-gvozdi":   "Гвозди",
  "krepezh-shplinty": "Шплинты",
  "nerzhav-bolty":    "Болты нержавейка",
  "nerzhav-gayki":    "Гайки нержавейка",
  "nerzhav-shayby":   "Шайбы нержавейка",
  "nerzhav-vintyi":   "Винты нержавейка",
  "nerzhav-shpilki":  "Шпильки нержавейка",
  "nerzhaveyushchiy": "Нержавеющий крепёж",
  "takelazh":         "Такелаж",
  "kanaty":           "Канаты",
  "perfo":            "Перфорация и инструмент",
  "ventilatsiya":     "Вентиляция",
  "ventil-khomut":    "Хомуты",
  "ventil-shina":     "Шины вентиляционные",
  "elektrody":        "Электроды",
  "krepezh":          "Крепёж",
};

type IndexEntry = {
  itemCount: number;
  inStockCount: number;
  standards: string[];
  sizes: string[];
  coatings: string[];
  strengthClasses: string[];
  searchTerms: string[];
};

const charIndex = characteristicsIndex as Record<string, IndexEntry>;

interface SearchResult {
  slug: string;
  label: string;
  hint: string;
  source: "product" | "category";
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    const q = query.toLowerCase().trim();
    const seen = new Set<string>();
    const all: SearchResult[] = [];

    // 1. Поиск по характеристикам (DIN, ГОСТ, размер, покрытие, класс прочности)
    Object.entries(charIndex).forEach(([slug, data]) => {
      const matched =
        data.standards.some((s) => s.toLowerCase().includes(q)) ||
        data.sizes.some((s) => s.toLowerCase().includes(q)) ||
        data.coatings.some((s) => s.toLowerCase().includes(q)) ||
        data.strengthClasses.some((s) => s.toLowerCase().includes(q)) ||
        data.searchTerms.some((s) => s.toLowerCase().includes(q)) ||
        (CATEGORY_LABELS[slug] ?? "").toLowerCase().includes(q);

      if (matched && !seen.has(slug)) {
        seen.add(slug);
        const matchedStd = data.standards.find((s) => s.toLowerCase().includes(q));
        const matchedSize = data.sizes.find((s) => s.toLowerCase().includes(q));
        const hint = matchedStd ?? matchedSize ?? `${data.inStockCount} в наличии`;
        all.push({
          slug,
          label: CATEGORY_LABELS[slug] ?? slug,
          hint,
          source: "category",
        });
      }
    });

    // 2. Поиск по названию/коду товара (старая база)
    Object.entries(catalogDb).forEach(([oldSlug, types]) => {
      const slug = SLUG_MAP[oldSlug] ?? oldSlug;
      types.forEach((typeObj: any) => {
        typeObj.items.forEach((item: any) => {
          if (
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q)
          ) {
            if (!seen.has(slug)) {
              seen.add(slug);
              all.push({
                slug,
                label: CATEGORY_LABELS[slug] ?? typeObj.type,
                hint: item.name,
                source: "product",
              });
            }
          }
        });
      });
    });

    setResults(all.slice(0, 8));
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
          placeholder="Болт DIN 933, М10, канат…"
          className="w-full bg-slate-800 border border-slate-700 text-white text-sm pl-8 pr-8 py-2 focus:outline-none focus:border-orange-500 placeholder-slate-500"
        />
        {query && (
          <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-sm z-50 max-h-72 overflow-y-auto">
          {results.map((r, i) => (
            <a
              key={i}
              href={`/catalog/${r.slug}`}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{r.label}</div>
                <div className="text-xs text-slate-400 truncate">{r.hint}</div>
              </div>
              {r.source === "category" && (
                <span className="flex-shrink-0 text-xs text-orange-400 border border-orange-800 px-1.5 py-0.5 rounded">
                  категория
                </span>
              )}
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
