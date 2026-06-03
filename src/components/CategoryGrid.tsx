"use client";
import { COMPANY } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  bolty: "🔩",
  gayki: "⚙️",
  ankera: "⚓",
  shayby: "🪙",
  shpilki: "📌",
  "samoреzy": "🪛",
  takelazh: "⛓️",
  elektrody: "⚡",
  "krepezh-gost": "🏷️",
  "krepezh-din-iso": "🌐",
};

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const { trackCategoryClick } = useAnalytics();

  const handleClick = (title: string) => {
    trackCategoryClick(title);
    onCategoryClick?.(title);
  };

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Каталог крепежа
          </h2>
          <p className="text-slate-500">
            Выберите категорию — запросим наличие и подготовим КП
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {COMPANY.categories.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => handleClick(cat.title)}
              className="group bg-white hover:bg-slate-900 cursor-pointer p-6 transition-colors duration-150"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-150">
                {categoryIcons[cat.slug] || "🔧"}
              </div>
              <h3 className="font-black text-slate-900 group-hover:text-white text-lg uppercase tracking-tight mb-1">
                {cat.title}
              </h3>
              <p className="text-slate-500 group-hover:text-slate-300 text-sm leading-snug mb-3">
                {cat.desc}
              </p>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
