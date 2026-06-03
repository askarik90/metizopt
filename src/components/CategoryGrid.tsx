"use client";
import { COMPANY } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  bolty: "🔩", gayki: "⚙️", shayby: "🪙", vinty: "🔧",
  ankera: "⚓", shplinty: "📎", dyubelya: "🔌", shurupy: "🪛",
  shpilki: "📌", zaklepki: "🔨", gvozdi: "🔨",
  ventilatsiya: "💨", perfo: "📐", nerzhaveyushchiy: "✨",
  takelazh: "⛓️", kanaty: "🧵", elektrody: "⚡", shlangi: "🌊",
  "krepezh-gost": "🏷️", "krepezh-din-iso": "🌐",
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
            Каталог крепежа
          </h2>
          <p className="text-slate-500">
            Выберите категорию — менеджер свяжется для уточнения деталей
          </p>
        </div>

        {/* ── Группа КРЕПЕЖ ── */}
        <div className="mb-6 border border-slate-200 bg-white">
          <div className="bg-slate-900 px-6 py-3 flex items-center gap-3">
            <span className="text-xl">🔩</span>
            <h3 className="font-black text-white uppercase tracking-tight text-lg">
              Крепеж
            </h3>
            <span className="text-slate-400 text-sm font-normal normal-case">
              — болты, гайки, шайбы и другой крепёж
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-100">
            {krepezhItems.map((cat) => (
              <div
                key={cat.slug}
                onClick={() => handleClick(cat.title)}
                className="group bg-white hover:bg-orange-600 cursor-pointer p-4 transition-colors duration-150"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-150">
                  {categoryIcons[cat.slug] || "🔧"}
                </div>
                <div className="font-bold text-slate-800 group-hover:text-white text-sm uppercase tracking-tight">
                  {cat.shortTitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Самостоятельные категории ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {standaloneItems.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => handleClick(cat.title)}
              className="group bg-white hover:bg-slate-900 cursor-pointer p-6 transition-colors duration-150"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-150">
                {categoryIcons[cat.slug] || "🔧"}
              </div>
              <h3 className="font-black text-slate-900 group-hover:text-white text-base uppercase tracking-tight mb-1">
                {cat.title}
              </h3>
              <p className="text-slate-500 group-hover:text-slate-300 text-sm leading-snug mb-3">
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
          ))}
        </div>
      </div>
    </section>
  );
}
