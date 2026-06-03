"use client";
import { Wrench, Settings, Circle, Anchor, Minus, Plug, Hammer, AlignJustify, Wind, Grid3x3, Star, Link2, Rope, Zap, Waves, Tag, Globe } from "lucide-react";
import { COMPANY } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

// Lucide-иконки для всех категорий — без эмодзи
const categoryIconsLucide: Record<string, React.ElementType> = {
  bolty:              Settings,
  gayki:              Settings,
  shayby:             Circle,
  vinty:              Wrench,
  ankera:             Anchor,
  shplinty:           Minus,
  dyubelya:           Plug,
  shurupy:            Wrench,
  shpilki:            AlignJustify,
  zaklepki:           Hammer,
  gvozdi:             Minus,
  ventilatsiya:       Wind,
  perfo:              Grid3x3,
  nerzhaveyushchiy:   Star,
  takelazh:           Link2,
  kanaty:             Rope,
  elektrody:          Zap,
  shlangi:            Waves,
  "krepezh-gost":     Tag,
  "krepezh-din-iso":  Globe,
};

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const { trackCategoryClick } = useAnalytics();

  const handleClick = (title: string) => {
    trackCategoryClick(title);
    onCategoryClick?.(title);
  };

  const krepezhItems = COMPANY.categories.filter((c) => (c as any).group === "krepezh");
  const standaloneItems = COMPANY.categories.filter((c) => !(c as any).group);

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Каталог
          </h2>
          <p className="text-slate-500">
            Выберите категорию — менеджер свяжется для уточнения деталей
          </p>
        </div>

        {/* ── Группа КРЕПЕЖ ── */}
        <div className="mb-8 overflow-hidden border border-slate-200">
          {/* Заголовок группы */}
          <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
            <Settings size={20} className="text-orange-500" />
            <span className="font-black text-white uppercase tracking-widest text-sm">
              Крепеж
            </span>
            <span className="hidden sm:inline text-slate-500 text-sm">
              — болты, гайки, шайбы, анкера и другой крепёж
            </span>
          </div>

          {/* Сетка подкатегорий */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-slate-100">
            {krepezhItems.map((cat) => {
              const Icon = categoryIconsLucide[cat.slug] ?? Wrench;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleClick(cat.title)}
                  className="group flex flex-col items-center justify-center gap-2 p-4 bg-white hover:bg-orange-600 transition-colors duration-150 text-center min-h-[90px]"
                >
                  <Icon
                    size={22}
                    className="text-slate-400 group-hover:text-white transition-colors"
                  />
                  <span className="font-semibold text-slate-800 group-hover:text-white text-xs uppercase tracking-tight leading-tight transition-colors">
                    {cat.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Самостоятельные категории ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {standaloneItems.map((cat) => {
            const Icon = categoryIconsLucide[cat.slug] ?? Wrench;
            return (
              <div
                key={cat.slug}
                onClick={() => handleClick(cat.title)}
                className="group bg-white hover:bg-slate-900 cursor-pointer p-6 transition-colors duration-150"
              >
                <Icon
                  size={28}
                  className="text-orange-500 group-hover:text-orange-400 mb-3 transition-colors"
                />
                <h3 className="font-black text-slate-900 group-hover:text-white text-base uppercase tracking-tight mb-1 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-slate-500 group-hover:text-slate-300 text-sm leading-snug mb-3 transition-colors">
                  {cat.desc}
                </p>
                {cat.standards.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cat.standards.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="bg-slate-100 group-hover:bg-slate-700 text-slate-600 group-hover:text-slate-300 text-xs px-2 py-0.5 transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
