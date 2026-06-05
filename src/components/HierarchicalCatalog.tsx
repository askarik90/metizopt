"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { COMPANY } from "@/config/company";
import { useGroups, useCategories } from "@/hooks/useCatalog";
import {
  Wrench, Wind, BarChart3, Star, Link2, Zap,
} from "lucide-react";

const GROUP_ICONS: Record<string, React.ElementType> = {
  krepezh: Wrench,
  ventilatsiya: Wind,
  perfo: BarChart3,
  nerzhaveyushchiy: Star,
  takelazh: Link2,
  kanaty: Link2,
  elektrody: Zap,
};

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=240&h=140&fit=crop&auto=format&q=75`;

// Реалистичные фото для каждой категории (Unsplash)
const CATEGORY_IMAGES: Record<string, string> = {
  // Крепеж
  "krepezh-bolty":    U("FDTEzCJ11fk"),  // bolts
  "krepezh-gayki":    U("p_hO3NOs9MI"),  // nuts pile
  "krepezh-shayby":   U("c71yQepDEjo"),  // washers/round metal
  "krepezh-vintyi":   U("wwZYL4BYFto"),  // screws on wood
  "krepezh-ankera":   U("rbRdQkD0qNI"),  // bolts on ground
  "krepezh-shplinty": U("b-x9iFcCkb8"),  // screw close-up
  "krepezh-dyubela":  U("yCyPRNLnFMM"),  // screws pile
  "krepezh-samorezi": U("TLAQRGh5kEY"),  // screw macro
  "krepezh-shpilki":  U("pvm5QvjFrJ8"),  // threaded rods
  "krepezh-zaklepki": U("CTcSmNvp7nM"),  // nuts/rivets box
  "krepezh-gvozdi":   U("JALUvPLUde8"),  // nails on yellow

  // Нержавейка
  "nerzhav-bolty":    U("1OpKbuJv1Wg"),  // stainless bolts
  "nerzhav-gayki":    U("SJNicnSjI-o"),  // metal objects
  "nerzhav-shayby":   U("wYKgV2SZMc8"),  // screws/washers
  "nerzhav-vintyi":   U("qHhJkxare7A"),  // silver tools
  "nerzhav-shpilki":  U("cMS2npIGV_g"),  // screw lot silver

  // Такелаж
  "takelazh-vertlyug":           U("YLUfVCk8ac4"),  // metal object on chain
  "takelazh-zazim-din741":       U("uf8ZcJi2TeY"),  // clamp on chain
  "takelazh-zazim-din3093":      U("t_Husb-EHyU"),  // chain with wrench
  "takelazh-zazim-dvoinoi":      U("uNoLmIjZaps"),  // chains bunch
  "takelazh-zazim-odinarnyi":    U("9GSIp9QU5R0"),  // gray chain
  "takelazh-karabin-5299c":      U("GZgsM-7MGgU"),  // carabiners
  "takelazh-karabin-5299d":      U("GZgsM-7MGgU"),
  "takelazh-koush-6899b":        U("0xT8SmrL-hc"),  // machinery close-up
  "takelazh-kryuk-320a":         U("ok905IdYhOE"),  // black hook
  "takelazh-kryuk-s":            U("M_EKk0FRIew"),  // metal hook
  "takelazh-rym-bolt":           U("Pptvfqdo_G0"),  // hook on rope
  "takelazh-rym-gayka":          U("h6E97ppQmaI"),  // trailer hook
  "takelazh-skoba-g209":         U("SQc0cSHruRY"),  // red metal hook
  "takelazh-skoba-g2130":        U("dTi44UH9MdY"),  // hook and chain
  "takelazh-skoba-g2150":        U("_vVqIVDzJ44"),  // metal bar
  "takelazh-soedinitel-tsepi":   U("OKe9eWEm3F8"),  // rusty chains
  "takelazh-talrep-1478":        U("vqEP1_mB0UE"),  // worker with chains
  "takelazh-talrep-1480-kk":     U("rW00Wu_CeYA"),  // hanging metal
  "takelazh-talrep-1480-kryuk-k": U("L62cy4YFoAM"), // cable grip
  "takelazh-talrep-1480-kryuk-kryuk": U("L62cy4YFoAM"),
  "takelazh-tros-din3055":       U("LMTyPzondZQ"),  // coil of wire
  "takelazh-tros-din3055-pvkh":  U("iKo_fTD5tMk"),  // brown rope close-up
  "takelazh-tsep-din763":        U("9GSIp9QU5R0"),
  "takelazh-tsep-din766":        U("uNoLmIjZaps"),

  // Канаты
  "kanat-din3059":  U("L62cy4YFoAM"),
  "kanat-gost2688": U("YGqDAQMVor0"),   // coils of wire on table
  "kanat-gost7668": U("iKo_fTD5tMk"),

  // Вентиляция
  "ventil-profil-l":       U("HBx7ix32U4o"),  // metal with holes
  "ventil-profil-u":       U("XI4m_uzRqXE"),  // metal pieces
  "ventil-skoba-flantsev": U("3175DpLKSus"),  // rusty metal pattern
  "ventil-strubtsiny":     U("FDTEzCJ11fk"),
  "ventil-traversa":       U("HBx7ix32U4o"),
  "ventil-trubki-kflex":   U("LMTyPzondZQ"),
  "ventil-ugolok":         U("XI4m_uzRqXE"),
  "ventil-khomut":         U("uf8ZcJi2TeY"),
  "ventil-shina":          U("3175DpLKSus"),
  "ventil-shpilka":        U("pvm5QvjFrJ8"),

  // Перфо
  "perfo-derzhatel-balki":     U("XI4m_uzRqXE"),
  "perfo-plastina-kp":         U("3175DpLKSus"),
  "perfo-ankernyi-ugol-kau":   U("HBx7ix32U4o"),
  "perfo-ugol-ku":             U("XI4m_uzRqXE"),
  "perfo-ugol-kuas":           U("HBx7ix32U4o"),
  "perfo-ugol-kus":            U("3175DpLKSus"),
  "perfo-ugol-kur":            U("XI4m_uzRqXE"),
  "perfo-ugol-kuu":            U("HBx7ix32U4o"),
  "perfo-ugol-kur-us":         U("3175DpLKSus"),
  "perfo-lenta":               U("vwHncGwScQc"),  // perforated pattern
  "perfo-opora-balki":         U("XI4m_uzRqXE"),
  "perfo-lenta-lm":            U("vwHncGwScQc"),
  "perfo-plastina-ps":         U("3175DpLKSus"),
  "perfo-prushina-pzp":        U("HBx7ix32U4o"),
  "perfo-uglovoy-soedinitel":  U("XI4m_uzRqXE"),
  "perfo-ugol-mebelnyi":       U("3175DpLKSus"),

  // Электроды
  "svarka-lez":     U("Wiu3w-99tNg"),  // welding in action
  "svarka-monolith": U("ZkvJnta6bAI"), // welder metalwork
  "svarka-rossiya": U("CrTTr9xF-w4"),  // welding sparks
  "svarka-kitay":   U("VW4xiLRr-do"),  // welding time-lapse
  "svarka-crown":   U("n1RJ7pXgGTE"),  // welder with helmet
};

// Убираем SEO-суффиксы из названия для отображения в каталоге
function displayName(title: string) {
  return title
    .replace(/ в Алматы$/i, "")
    .replace(/ оптом в Алматы$/i, "")
    .replace(/ оптом$/i, "")
    .replace(/ — полный каталог.*$/i, "")
    .replace(/ — .*$/i, "")
    .trim();
}

export default function HierarchicalCatalog() {
  const { groups } = useGroups();
  const { categories } = useCategories();
  const [expandedGroup, setExpandedGroup] = useState<string>(groups[0]?.slug || "");
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={sectionRef} className="bg-slate-50 py-16 scroll-mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10" id="catalog-title">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Каталог товаров
          </h2>
          <p className="text-slate-500">
            Выберите группу, затем категорию для просмотра всех товаров и цен
          </p>
        </div>

        {expandedGroup ? (
          <div className="flex gap-4 flex-col lg:flex-row">

            {/* Сайдбар групп */}
            <div className="w-4/5 lg:w-64 flex flex-col gap-2">
              {groups.map((group) => {
                const Icon = GROUP_ICONS[group.slug] || Wrench;
                const isActive = expandedGroup === group.slug;
                const count = (group.categories as string[]).length;

                return (
                  <button
                    key={group.slug}
                    onClick={() => {
                      setExpandedGroup(isActive ? "" : group.slug);
                      if (!isActive) {
                        setTimeout(() => {
                          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 0);
                      }
                    }}
                    className={`relative overflow-hidden flex items-center gap-3 px-4 py-3 bg-white border transition-all rounded group/sidebar ${
                      isActive
                        ? "border-orange-400 bg-orange-50 shadow-md"
                        : "border-slate-100 hover:border-orange-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-grow z-10 min-w-0">
                      <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded transition-colors ${
                        isActive ? "bg-orange-200" : "bg-orange-100 group-hover/sidebar:bg-orange-200"
                      }`}>
                        <Icon size={16} className="text-orange-600" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className={`font-bold text-xs uppercase tracking-tight leading-snug ${
                          isActive ? "text-orange-600" : "text-slate-900"
                        }`}>
                          {group.shortTitle || displayName(group.title)}
                        </span>
                        <p className="text-xs text-slate-400">{count} кат.</p>
                      </div>
                    </div>

                    {/* Фоновое изображение */}
                    <div
                      className="absolute right-0 top-0 h-full w-4/5 opacity-25 group-hover/sidebar:opacity-40 transition-opacity"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0) 100%), url('${group.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "right center",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Панель категорий */}
            <div className="flex-1 min-w-0">
              <div
                ref={(el) => { if (el) groupRefs.current[expandedGroup] = el; }}
                className="bg-white border border-orange-400 p-6 rounded-lg"
              >
                {groups.map((group) => {
                  if (group.slug !== expandedGroup) return null;

                  const groupSlugs = new Set(group.categories as string[]);
                  const groupCategories = categories.filter((cat) => groupSlugs.has(cat.slug));

                  return (
                    <div key={group.slug}>
                      {/* Заголовок раскрытой группы */}
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                          {group.shortTitle || displayName(group.title)}
                        </h2>
                        <Link
                          href={`/catalog/${group.slug}`}
                          className="text-xs text-orange-600 hover:text-orange-700 font-bold uppercase tracking-wide"
                        >
                          Все товары →
                        </Link>
                      </div>

                      {/* Сетка категорий */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {groupCategories.map((cat) => {
                          const imgUrl = CATEGORY_IMAGES[cat.slug];
                          return (
                            <Link
                              key={cat.slug}
                              href={`/catalog/${cat.slug}`}
                              className="relative overflow-hidden flex flex-col justify-between p-4 bg-slate-50 border border-slate-100 hover:border-orange-400 hover:shadow-md transition-all group/cat rounded min-h-[90px]"
                            >
                              {/* Фото справа с градиентом */}
                              {imgUrl && (
                                <div
                                  className="absolute inset-0 opacity-20 group-hover/cat:opacity-35 transition-opacity"
                                  style={{
                                    backgroundImage: `linear-gradient(to right, rgba(248,250,252,1) 0%, rgba(248,250,252,0.85) 30%, rgba(248,250,252,0.3) 65%, rgba(248,250,252,0) 100%), url('${imgUrl}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "right center",
                                  }}
                                />
                              )}

                              {/* Контент */}
                              <div className="relative z-10 flex items-start justify-between gap-1 mb-3">
                                <h4 className="font-black text-slate-900 text-xs uppercase group-hover/cat:text-orange-600 transition-colors leading-snug">
                                  {displayName(cat.title)}
                                </h4>
                                <span className="text-orange-500 font-bold text-base group-hover/cat:translate-x-0.5 transition-transform flex-shrink-0 leading-none">
                                  →
                                </span>
                              </div>

                              {/* Стандарты */}
                              {cat.standards.length > 0 && (
                                <div className="relative z-10 flex flex-wrap gap-1">
                                  {cat.standards.slice(0, 2).map((s) => (
                                    <span
                                      key={s}
                                      className="text-xs bg-white/80 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                  {cat.standards.length > 2 && (
                                    <span className="text-xs text-slate-400">
                                      +{cat.standards.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          // Свёрнутый вид — сетка групп
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const Icon = GROUP_ICONS[group.slug] || Wrench;
              const count = (group.categories as string[]).length;

              return (
                <button
                  key={group.slug}
                  onClick={() => {
                    setExpandedGroup(group.slug);
                    setTimeout(() => {
                      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 0);
                  }}
                  className="relative overflow-hidden flex items-center gap-4 px-6 py-4 bg-white border border-slate-100 hover:border-orange-400 transition-all rounded group/btn"
                >
                  <div className="flex items-center gap-3 flex-grow z-10 min-w-0">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-orange-100 rounded group-hover/btn:bg-orange-200 transition-colors">
                      <Icon size={18} className="text-orange-600" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight leading-tight">
                        {group.shortTitle || displayName(group.title)}
                      </h3>
                      <p className="text-xs text-slate-500">{count} категорий</p>
                    </div>
                  </div>

                  <div
                    className="absolute right-0 top-0 h-full w-3/4 opacity-40 group-hover/btn:opacity-60 transition-opacity"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0) 100%), url('${group.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "right center",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
