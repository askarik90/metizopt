"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import catalogDb from "@/data/catalog-db.json";
import characteristicsIndex from "@/data/characteristics-index.json";
import { useAnalytics } from "@/hooks/useAnalytics";

// Словарь синонимов: что пишет клиент → что ищем
const SYNONYMS: Record<string, string[]> = {
  // Нержавейка
  "нерж":         ["нержавейка", "нержав", "a2", "а2"],
  "нержавейка":   ["нержав", "a2", "а2", "nerzhav"],
  "а2":           ["a2", "нержавейка", "нержав"],
  "a2":           ["а2", "нержавейка", "нержав"],
  "а4":           ["a4", "нержавейка"],
  "a4":           ["а4", "нержавейка"],
  // Покрытия
  "оц":           ["оцинков", "цинк", "zinc"],
  "цинк":         ["оцинков", "zinc"],
  "оцинковка":    ["оцинков", "цинк"],
  "гц":           ["горячий цинк", "горяч"],
  // Типы крепежа
  "саморез":      ["шуруп"],
  "шуруп":        ["саморез"],
  "болт":         ["болты"],
  "гайка":        ["гайки"],
  "шайба":        ["шайбы"],
  "анкер":        ["анкера"],
  "дюбель":       ["дюбеля"],
  // Стандарты (латиница ↔ кириллица)
  "гост":         ["gost", "гост"],
  "gost":         ["гост"],
  "дин":          ["din", "DIN"],
  "din":          ["дин", "DIN"],
  // Размеры — м/M → числа
  "м6":           ["m6", "6мм"],
  "м8":           ["m8", "8мм"],
  "м10":          ["m10", "10мм", "10*"],
  "м12":          ["m12", "12мм", "12*"],
  "м16":          ["m16", "16*"],
  "м20":          ["m20", "20*"],
  "м24":          ["m24", "24*"],
  "m6":           ["м6"],
  "m8":           ["м8"],
  "m10":          ["м10", "10*"],
  "m12":          ["м12", "12*"],
  // Такелаж
  "трос":         ["канат", "трос"],
  "канат":        ["трос"],
  "строп":        ["стропы", "такелаж"],
  // Инструмент
  "сверло":       ["бур", "перфо"],
  "бур":          ["сверло"],
};

// Расширяет запрос синонимами, возвращает массив вариантов для поиска
function expandQuery(q: string): string[] {
  const terms = new Set<string>([q]);
  const syns = SYNONYMS[q.toLowerCase()];
  if (syns) syns.forEach((s) => terms.add(s.toLowerCase()));
  return Array.from(terms);
}

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { trackSearch, trackSearchResultClick } = useAnalytics();

  // Сохраняем поисковый запрос — форма заявки подхватит его
  const saveSearchQuery = (q: string) => {
    if (typeof window !== "undefined" && q.trim()) {
      sessionStorage.setItem("lastSearchQuery", q.trim());
    }
  };

  // Поиск вынесен в отдельную функцию — вызывается с дебаунсом
  const runSearch = useCallback((rawQuery: string) => {
    const trimmed = rawQuery.trim();

    // Минимум 3 символа для запуска поиска и аналитики
    if (!trimmed || trimmed.length < 3) {
      setResults([]);
      return;
    }

    const q = trimmed.toLowerCase();
    const seen = new Set<string>();
    const all: SearchResult[] = [];

    const queries = expandQuery(q);
    const matchesAny = (text: string) => queries.some((qv) => text.toLowerCase().includes(qv));

    // 1. Поиск по характеристикам (DIN, ГОСТ, размер, покрытие, класс прочности, синонимы)
    Object.entries(charIndex).forEach(([slug, data]) => {
      const matched =
        data.standards.some((s) => matchesAny(s)) ||
        data.sizes.some((s) => matchesAny(s)) ||
        data.coatings.some((s) => matchesAny(s)) ||
        data.strengthClasses.some((s) => matchesAny(s)) ||
        data.searchTerms.some((s) => matchesAny(s)) ||
        matchesAny(CATEGORY_LABELS[slug] ?? "");

      if (matched && !seen.has(slug)) {
        seen.add(slug);
        const matchedStd = data.standards.find((s) => matchesAny(s));
        const matchedSize = data.sizes.find((s) => matchesAny(s));
        const hint = matchedStd ?? matchedSize ?? `${data.inStockCount} в наличии`;
        all.push({ slug, label: CATEGORY_LABELS[slug] ?? slug, hint, source: "category" });
      }
    });

    // 2. Поиск по названию/коду товара (старая база)
    Object.entries(catalogDb).forEach(([oldSlug, types]) => {
      const slug = SLUG_MAP[oldSlug] ?? oldSlug;
      types.forEach((typeObj: any) => {
        typeObj.items.forEach((item: any) => {
          if (matchesAny(item.name) || matchesAny(item.code)) {
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

    const final = all.slice(0, 8);
    setResults(final);
    setOpen(true);

    // Аналитика — один раз после дебаунса (не на каждый символ)
    if (final.length > 0) {
      trackSearch(trimmed, final.length);
    } else {
      // search_no_results — отдельное событие для анализа пробелов
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "search_no_results", { search_term: trimmed });
      }
    }

    saveSearchQuery(trimmed);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Сбрасываем старый таймер при каждом нажатии
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    // 500мс дебаунс — аналитика и поиск срабатывают только когда пользователь остановился
    debounceRef.current = setTimeout(() => {
      runSearch(query);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

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
              onClick={() => trackSearchResultClick(query.trim(), r.slug)}
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

      {open && query.trim().length >= 3 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-sm z-50 px-3 py-2 text-sm text-slate-400">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}
