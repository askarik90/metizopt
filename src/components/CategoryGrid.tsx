"use client";
import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import {
  Wrench, Settings, Circle, Anchor, Scissors, Package,
  Hammer, FileText, Wind, BarChart3, Star, Link2, Link,
  Zap, Droplet, Tag, Globe, Pin, ChevronDown,
} from "lucide-react";
import { COMPANY } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

const ICONS: Record<string, React.ElementType> = {
  bolty: Settings,       gayki: Settings,    shayby: Circle,
  vinty: Wrench,         ankera: Anchor,     shplinty: Scissors,
  dyubelya: Package,     shurupy: Wrench,    shpilki: FileText,
  zaklepki: Hammer,      gvozdi: Pin,
  ventilatsiya: Wind,    perfo: BarChart3,   nerzhaveyushchiy: Star,
  takelazh: Link2,       kanaty: Link,       elektrody: Zap,
  shlangi: Droplet,      "krepezh-gost": Tag, "krepezh-din-iso": Globe,
};

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const { trackCategoryClick } = useAnalytics();
  const [open, setOpen] = useState(false);

  const krepezhItems = COMPANY.categories.filter((c) => (c as any).group === "krepezh");
  const standalone   = COMPANY.categories.filter((c) => !(c as any).group);

  const SUBCOLS = 3;
  const fillerCount = krepezhItems.length % SUBCOLS === 0
    ? 0 : SUBCOLS - (krepezhItems.length % SUBCOLS);

  // ── ВРЕМЕННО: переключатель вариантов ──
  const [variant, setVariant] = useState<1 | 2 | 3>(1);
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const DEMO_SIZES = ["М6", "М8", "М10", "М12", "М16", "М20", "М24"];

  const handleSubcatClick = (title: string) => {
    setSelectedSubcat(prev => prev === title ? null : title);
    setSelectedSize(null);
  };

  const handleClick = (title: string) => {
    trackCategoryClick(title);
    onCategoryClick?.(title);
  };

  const waUrl = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
    `Здравствуйте! Хочу запросить наличие: ${selectedSubcat ?? ""}${selectedSize ? ` ${selectedSize}` : ""}`
  )}`;

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-wrap items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Каталог
            </h2>
            <p className="text-slate-500">
              Выберите категорию — менеджер свяжется для уточнения деталей
            </p>
          </div>

          {/* ── ВРЕМЕННО: переключатель вариантов ── */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 uppercase tracking-widest">вариант:</span>
            {([1, 2, 3] as const).map((v) => (
              <button
                key={v}
                onClick={() => { setVariant(v); setSelectedSubcat(null); }}
                className={`w-8 h-8 rounded-full text-sm font-bold border-2 transition-colors ${
                  variant === v
                    ? "bg-orange-600 border-orange-600 text-white"
                    : "border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {v}
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-1">
              {variant === 1 ? "модальное окно" : variant === 2 ? "раскрытие внизу" : "теги на странице"}
            </span>
          </div>
        </div>

        {/*
          Один общий grid 4 колонки.
          Когда Крепеж открыт:
            — карточка Крепеж растягивается на 4 строки (krepezh-expanded)
            — 11 подкатегорий заполняют правые 3 колонки (4 строки)
            — все остальные карточки автоматически уходят ниже
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">

          {/* ── КРЕПЕЖ ── */}
          <div
            onClick={() => setOpen(!open)}
            className={[
              "group cursor-pointer p-6 transition-colors duration-150",
              open ? "krepezh-expanded bg-slate-900" : "bg-white hover:bg-slate-900",
            ].join(" ")}
          >
            <Settings
              size={28}
              className={`mb-3 transition-colors ${open ? "text-orange-400" : "text-orange-500 group-hover:text-orange-400"}`}
            />
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-black text-base uppercase tracking-tight transition-colors ${open ? "text-white" : "text-slate-900 group-hover:text-white"}`}>
                Крепеж
              </h3>
              <ChevronDown
                size={16}
                className={`transition-all duration-200 ${open ? "text-slate-400 rotate-180" : "text-slate-400 group-hover:text-slate-300"}`}
              />
            </div>
            <p className={`text-sm leading-snug mb-3 transition-colors ${open ? "text-slate-400" : "text-slate-500 group-hover:text-slate-300"}`}>
              {open
                ? "Болты, гайки, шайбы, анкера — выберите подгруппу →"
                : "Болты, гайки, шайбы, анкера и другой крепёж"}
            </p>
            <div className="flex flex-wrap gap-1">
              {["DIN", "ГОСТ", "ISO"].map((s) => (
                <span
                  key={s}
                  className={`text-xs px-2 py-0.5 transition-colors ${open ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600 group-hover:bg-slate-700 group-hover:text-slate-300"}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── ПОДКАТЕГОРИИ ── */}
          {open && krepezhItems.map((cat) => {
            const Icon = ICONS[cat.slug] ?? Wrench;
            const isSelected = selectedSubcat === cat.title;
            return (
              <button
                key={cat.slug}
                onClick={() => handleSubcatClick(cat.title)}
                className={`group flex flex-col items-start gap-2 p-5 transition-colors duration-150 text-left ${
                  isSelected ? "bg-orange-600" : "bg-slate-800 hover:bg-orange-600"
                }`}
              >
                <Icon size={22} className="text-slate-400 group-hover:text-white text-white transition-colors" />
                <span className="font-bold text-slate-200 group-hover:text-white text-white text-sm uppercase tracking-tight transition-colors">
                  {cat.shortTitle}
                </span>
              </button>
            );
          })}

          {/* Заполняем пустые ячейки до конца строки чтобы следующие группы не залезали */}
          {open && Array.from({ length: fillerCount }).map((_, i) => (
            <div key={`filler-${i}`} className="bg-slate-800" />
          ))}

          {/* ── ОСТАЛЬНЫЕ КАТЕГОРИИ (уходят вниз автоматически) ── */}
          {standalone.map((cat, i) => {
            const Icon = ICONS[cat.slug] ?? Wrench;
            // Первая карточка принудительно с колонки 1 — чтобы начать новую строку
            const forceNewRow = open && i === 0 ? "lg:col-start-1" : "";
            return (
              <div
                key={cat.slug}
                onClick={() => handleClick(cat.title)}
                className={`group bg-white hover:bg-slate-900 cursor-pointer p-6 transition-colors duration-150 ${forceNewRow}`}
              >
                <Icon size={28} className="text-orange-500 group-hover:text-orange-400 mb-3 transition-colors" />
                <h3 className="font-black text-slate-900 group-hover:text-white text-base uppercase tracking-tight mb-1 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-slate-500 group-hover:text-slate-300 text-sm leading-snug mb-3 transition-colors">
                  {cat.desc}
                </p>
                {cat.standards.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cat.standards.slice(0, 3).map((s) => (
                      <span key={s} className="bg-slate-100 group-hover:bg-slate-700 text-slate-600 group-hover:text-slate-300 text-xs px-2 py-0.5 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* ════════════════════════════════════════
            ВАРИАНТ 1 — Модальное окно
        ════════════════════════════════════════ */}
        {variant === 1 && selectedSubcat && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
                <h3 className="text-white font-black uppercase tracking-tight">{selectedSubcat}</h3>
                <button onClick={() => setSelectedSubcat(null)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">Выберите размер</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {DEMO_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-sm font-bold border-2 transition-colors ${
                        selectedSize === s
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-slate-200 text-slate-700 hover:border-orange-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold transition-colors"
                >
                  <MessageCircle size={18} />
                  Запросить в WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            ВАРИАНТ 2 — Раскрытие под каталогом
        ════════════════════════════════════════ */}
        {variant === 2 && selectedSubcat && (
          <div className="mt-px border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">{selectedSubcat}</h3>
              <button onClick={() => setSelectedSubcat(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">Выберите размер</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {DEMO_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-sm font-bold border-2 transition-colors ${
                      selectedSize === s
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-slate-200 text-slate-700 hover:border-orange-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold transition-colors"
              >
                <MessageCircle size={18} />
                Запросить в WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            ВАРИАНТ 3 — Теги прямо на странице
        ════════════════════════════════════════ */}
        {variant === 3 && selectedSubcat && (
          <div className="mt-6 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black uppercase tracking-tight text-lg">{selectedSubcat}</h3>
              <button onClick={() => setSelectedSubcat(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {DEMO_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${
                    selectedSize === s
                      ? "bg-orange-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-orange-600 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold transition-colors"
            >
              <MessageCircle size={18} />
              Запросить в WhatsApp
            </a>
          </div>
        )}

      </div>
    </section>
  );
}
