"use client";
import { useState } from "react";
import { Wrench, Settings, Circle, Anchor, Scissors, Package, Hammer, FileText, Wind, BarChart3, Star, Link2, Link, Zap, Droplet, Tag, Globe, Pin, ChevronDown } from "lucide-react";
import { COMPANY } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

const categoryIconsLucide: Record<string, React.ElementType> = {
  bolty:               Settings,
  gayki:               Settings,
  shayby:              Circle,
  vinty:               Wrench,
  ankera:              Anchor,
  shplinty:            Scissors,
  dyubelya:            Package,
  shurupy:             Wrench,
  shpilki:             FileText,
  zaklepki:            Hammer,
  gvozdi:              Pin,
  ventilatsiya:        Wind,
  perfo:               BarChart3,
  nerzhaveyushchiy:    Star,
  takelazh:            Link2,
  kanaty:              Link,
  elektrody:           Zap,
  shlangi:             Droplet,
  "krepezh-gost":      Tag,
  "krepezh-din-iso":   Globe,
};

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const { trackCategoryClick } = useAnalytics();
  const [krepezhOpen, setKrepezhOpen] = useState(false);

  const krepezhItems = COMPANY.categories.filter((c) => (c as any).group === "krepezh");
  const standaloneItems = COMPANY.categories.filter((c) => !(c as any).group);

  const handleClick = (title: string) => {
    trackCategoryClick(title);
    onCategoryClick?.(title);
  };

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

        {/* ── Основная сетка категорий ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">

          {/* Крепеж — раскрывается по клику */}
          <div
            onClick={() => setKrepezhOpen(!krepezhOpen)}
            className={`group cursor-pointer p-6 transition-colors duration-150 ${
              krepezhOpen ? "bg-slate-900" : "bg-white hover:bg-slate-900"
            }`}
          >
            <Settings
              size={28}
              className={`mb-3 transition-colors ${
                krepezhOpen ? "text-orange-400" : "text-orange-500 group-hover:text-orange-400"
              }`}
            />
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-black text-base uppercase tracking-tight transition-colors ${
                krepezhOpen ? "text-white" : "text-slate-900 group-hover:text-white"
              }`}>
                Крепеж
              </h3>
              <ChevronDown
                size={16}
                className={`transition-all duration-200 ${
                  krepezhOpen
                    ? "text-slate-300 rotate-180"
                    : "text-slate-400 group-hover:text-slate-300"
                }`}
              />
            </div>
            <p className={`text-sm leading-snug mb-3 transition-colors ${
              krepezhOpen ? "text-slate-300" : "text-slate-500 group-hover:text-slate-300"
            }`}>
              Болты, гайки, шайбы, анкера и другой крепёж
            </p>
            <div className="flex flex-wrap gap-1">
              {["DIN", "ГОСТ", "ISO"].map((s) => (
                <span
                  key={s}
                  className={`text-xs px-2 py-0.5 transition-colors ${
                    krepezhOpen
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-700 group-hover:text-slate-300"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Остальные категории */}
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

        {/* ── Раскрытые подгруппы Крепежа ── */}
        {krepezhOpen && (
          <div className="border border-t-0 border-slate-200 bg-white">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
                Подгруппы крепежа — выберите нужную
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-slate-100">
              {krepezhItems.map((cat) => {
                const Icon = categoryIconsLucide[cat.slug] ?? Wrench;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleClick(cat.title)}
                    className="group flex flex-col items-center justify-center gap-2 p-4 hover:bg-orange-600 transition-colors duration-150 text-center min-h-[90px]"
                  >
                    <Icon
                      size={20}
                      className="text-slate-400 group-hover:text-white transition-colors"
                    />
                    <span className="font-semibold text-slate-700 group-hover:text-white text-xs uppercase tracking-tight leading-tight transition-colors">
                      {cat.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
