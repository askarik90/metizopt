"use client";
import { useState } from "react";
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

          {/* ── ПОДКАТЕГОРИИ (вставляются между Крепежом и остальными) ── */}
          {open && krepezhItems.map((cat) => {
            const Icon = ICONS[cat.slug] ?? Wrench;
            return (
              <button
                key={cat.slug}
                onClick={() => handleClick(cat.title)}
                className="group flex flex-col items-start gap-2 p-5 bg-slate-800 hover:bg-orange-600 transition-colors duration-150 text-left"
              >
                <Icon size={22} className="text-slate-400 group-hover:text-white transition-colors" />
                <span className="font-bold text-slate-200 group-hover:text-white text-sm uppercase tracking-tight transition-colors">
                  {cat.shortTitle}
                </span>
              </button>
            );
          })}

          {/* ── ОСТАЛЬНЫЕ КАТЕГОРИИ (уходят вниз автоматически) ── */}
          {standalone.map((cat) => {
            const Icon = ICONS[cat.slug] ?? Wrench;
            return (
              <div
                key={cat.slug}
                onClick={() => handleClick(cat.title)}
                className="group bg-white hover:bg-slate-900 cursor-pointer p-6 transition-colors duration-150"
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
      </div>
    </section>
  );
}
