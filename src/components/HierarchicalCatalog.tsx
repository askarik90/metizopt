"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { COMPANY } from "@/config/company";
import { ChevronDown } from "lucide-react";
import {
  Wrench, Wind, BarChart3, Star, Link2, Zap, Droplet,
} from "lucide-react";

const GROUP_ICONS: Record<string, React.ElementType> = {
  krepezh: Wrench,
  ventilatsiya: Wind,
  perfo: BarChart3,
  nerzhaveyushchiy: Star,
  takelazh: Link2,
  kanaty: Link2,
  elektrody: Zap,
  shlangi: Droplet,
};

export default function HierarchicalCatalog() {
  const [expandedGroup, setExpandedGroup] = useState<string>("krepezh");
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={sectionRef} className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10" id="catalog-title">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Каталог товаров
          </h2>
          <p className="text-slate-500">
            Выберите группу, затем категорию для просмотра всех товаров и цен
          </p>
        </div>

        {/* Иерархический каталог */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Группы слева столбцом (фиксированная ширина на десктопе) */}
          <div className="w-full lg:w-72 flex flex-col gap-3">
            {COMPANY.groups.map((group) => {
              const Icon = GROUP_ICONS[group.slug] || Wrench;
              const isActive = expandedGroup === group.slug;
              const groupSlugs = new Set(group.categories as readonly string[]);
              const groupCategories = COMPANY.categories.filter((cat) =>
                groupSlugs.has(cat.slug)
              );

              return (
                <button
                  key={group.slug}
                  onClick={() => {
                    setExpandedGroup(isActive ? "" : group.slug);
                    if (!isActive) {
                      setTimeout(() => {
                        sectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 0);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 bg-white border transition-all rounded ${
                    isActive
                      ? "border-orange-400 bg-orange-50 shadow-md"
                      : "border-slate-200 hover:border-orange-400 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded transition-colors ${
                    isActive ? "bg-orange-200" : "bg-orange-100 group-hover:bg-orange-200"
                  }`}>
                    <Icon size={16} className="text-orange-600" />
                  </div>
                  <div className="flex-grow text-left min-w-0">
                    <h3 className={`font-bold text-sm uppercase tracking-tight truncate ${
                      isActive ? "text-orange-600" : "text-slate-900"
                    }`}>
                      {group.shortTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {groupCategories.length}{" "}
                      {groupCategories.length === 1 ? "кат." : "кат."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Подкатегории раскрытой группы справа */}
          <div className="flex-1 min-w-0">
            {expandedGroup && (
              <div
                ref={(el) => {
                  if (el) groupRefs.current[expandedGroup] = el;
                }}
                className="bg-slate-50 border border-orange-400 p-6 rounded-lg"
              >
                {COMPANY.groups.map((group) => {
                  if (group.slug !== expandedGroup) return null;

                  const groupSlugs = new Set(group.categories as readonly string[]);
                  const groupCategories = COMPANY.categories.filter((cat) =>
                    groupSlugs.has(cat.slug)
                  );

                  return (
                    <div key={group.slug}>
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                        {group.title}
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {groupCategories.map((cat, index) => (
                          <Link
                            key={cat.slug}
                            href={`/catalog/${cat.slug}`}
                            className="flex flex-col p-4 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all group/cat rounded"
                          >
                            {/* Номер и стрелка */}
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                {index + 1}
                              </span>
                              <span className="text-orange-600 font-bold text-lg group-hover/cat:translate-x-1 transition-transform">
                                →
                              </span>
                            </div>

                            {/* Название */}
                            <h4 className="font-bold text-slate-900 text-sm uppercase group-hover/cat:text-orange-600 transition-colors mb-2">
                              {cat.title}
                            </h4>

                            {/* Описание */}
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-grow">
                              {cat.desc}
                            </p>

                            {/* Стандарты */}
                            {cat.standards.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cat.standards.slice(0, 2).map((s) => (
                                  <span
                                    key={s}
                                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                                  >
                                    {s}
                                  </span>
                                ))}
                                {cat.standards.length > 2 && (
                                  <span className="text-xs text-slate-500">
                                    +{cat.standards.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Подсказка */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Совет:</strong> Каждая категория содержит полное описание, технические характеристики, стандарты и возможность заказать товары оптом.
          </p>
        </div>
      </div>
    </section>
  );
}
