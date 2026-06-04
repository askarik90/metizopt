"use client";
import { useState } from "react";
import { Package, Check, ChevronDown } from "lucide-react";
import catalogDb from "@/data/catalog-db.json";
import TYPES from "@/data/catalog-types.json";

interface CatalogListProps {
  slug?: string;
}

export default function CatalogList({ slug }: CatalogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(slug || "bolty");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const toggleType = (type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  };

  // Все уникальные подкатегории
  const allCategories = Object.keys(catalogDb).sort();

  // Товары выбранной подкатегории
  const categoryData = (catalogDb as any)[selectedCategory] || [];

  // Фильтруем товары по поиску
  const filtered = categoryData.flatMap((typeObj: any) =>
    typeObj.items
      .filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((item: any) => ({
        ...item,
        type: typeObj.type,
        typeCount: typeObj.items.length,
      }))
  );

  // Группируем по типам для отображения
  const groupedByType: { [key: string]: any[] } = {};
  filtered.forEach((item: any) => {
    if (!groupedByType[item.type]) groupedByType[item.type] = [];
    groupedByType[item.type].push(item);
  });

  return (
    <div className="grid lg:grid-cols-4 gap-6 bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:col-span-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* ── ЛЕВАЯ ПАНЕЛЬ: ФИЛЬТРЫ ── */}
          <div className="lg:col-span-1">
            <h3 className="font-black text-slate-900 uppercase text-sm mb-4">
              Категории
            </h3>
            <div className="space-y-2 border-l-2 border-orange-500 pl-4">
              {allCategories.map((cat) => {
                const catData = (catalogDb as any)[cat];
                const itemCount = catData.reduce(
                  (sum: number, t: any) => sum + t.items.length,
                  0
                );
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-sm py-2 px-0 transition-colors ${
                      selectedCategory === cat
                        ? "font-bold text-orange-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="font-medium">{cat.replace(/_/g, " ").toUpperCase()}</div>
                    <div className="text-xs text-slate-500">{itemCount} товаров</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── ПРАВАЯ ПАНЕЛЬ: ТОВАРЫ ── */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или коду..."
                className="w-full border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                Товары не найдены
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedByType).map(([type, items]: [string, any[]]) => {
                  const isExpanded = expandedTypes.has(type);
                  return (
                    <div key={type} className="border border-slate-200">
                      {/* ЗАГОЛОВОК (Accordion trigger) */}
                      <button
                        onClick={() => toggleType(type)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="text-left">
                          <h4 className="font-bold text-slate-900 text-sm uppercase">
                            {type}
                          </h4>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {items.length} размеров
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-slate-600 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* СОДЕРЖАНИЕ (Expand/collapse) */}
                      {isExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white">
                          {items.map((item) => (
                            <div
                              key={item.code}
                              className="border border-slate-200 hover:border-orange-400 transition-colors"
                            >
                              {/* Фото */}
                              <div className="bg-slate-100 h-32 flex items-center justify-center">
                                <Package size={48} className="text-slate-400" />
                              </div>

                              {/* Содержание */}
                              <div className="p-4">
                                {/* Статус */}
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Check size={16} className="text-green-600" />
                                  <span className="text-xs font-semibold text-green-600">
                                    В наличии
                                  </span>
                                </div>

                                {/* Название */}
                                <h5 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">
                                  {item.name}
                                </h5>

                                {/* Код и стандарт */}
                                <div className="text-xs text-slate-500 mb-3">
                                  <div>Код: {item.code}</div>
                                  <div>Ед: {item.unit}</div>
                                </div>

                                {/* Кнопка */}
                                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 text-sm transition-colors">
                                  Заказать сейчас
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
