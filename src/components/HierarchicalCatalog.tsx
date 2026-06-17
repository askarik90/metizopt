"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { COMPANY } from "@/config/company";
import { useGroups, useCategories } from "@/hooks/useCatalog";
import {
  Wrench, Wind, BarChart3, Star, Link2, Zap, Droplets,
} from "lucide-react";

const GROUP_ICONS: Record<string, React.ElementType> = {
  krepezh: Wrench,
  ventilatsiya: Wind,
  perfo: BarChart3,
  nerzhaveyushchiy: Star,
  takelazh: Link2,
  kanaty: Link2,
  elektrody: Zap,
  shlangi: Droplets,
};

// Локальные фото для категорий (скачаны из Pexels)
const C = (name: string) => `/images/categories/${name}.jpg`;

const CATEGORY_IMAGES: Record<string, string> = {
  // Крепеж
  "krepezh-bolty":    C("bolty"),
  "krepezh-gayki":    C("gayki"),
  "krepezh-shayby":   C("shayby"),
  "krepezh-vintyi":   C("vintyi"),
  "krepezh-ankera":   C("ankera"),
  "krepezh-shplinty": C("shplinty"),
  "krepezh-dyubela":  C("dyubela"),
  "krepezh-samorezi": C("samorezi"),
  "krepezh-shpilki":  C("shpilki"),
  "krepezh-zaklepki": C("zaklepki"),
  "krepezh-gvozdi":   C("gvozdi"),

  // Нержавейка
  "nerzhav-bolty":    C("nerzhav"),
  "nerzhav-gayki":    C("gayki"),
  "nerzhav-shayby":   C("shayby"),
  "nerzhav-vintyi":   C("vintyi"),
  "nerzhav-shpilki":  C("shpilki"),

  // Такелаж
  "takelazh-vertlyug":              C("kryuk"),
  "takelazh-zazim-din741":          C("tros"),
  "takelazh-zazim-din3093":         C("tros"),
  "takelazh-zazim-dvoinoi":         C("tsep"),
  "takelazh-zazim-odinarnyi":       C("tsep"),
  "takelazh-karabin-5299c":         C("karabin"),
  "takelazh-karabin-5299d":         C("karabin"),
  "takelazh-koush-6899b":           C("tros"),
  "takelazh-kryuk-320a":            C("kryuk"),
  "takelazh-kryuk-s":               C("kryuk"),
  "takelazh-rym-bolt":              C("kryuk"),
  "takelazh-rym-gayka":             C("kryuk"),
  "takelazh-skoba-g209":            C("zaklepki"),
  "takelazh-skoba-g2130":           C("zaklepki"),
  "takelazh-skoba-g2150":           C("zaklepki"),
  "takelazh-soedinitel-tsepi":      C("tsep"),
  "takelazh-talrep-1478":           C("talrep"),
  "takelazh-talrep-1480-kk":        C("talrep"),
  "takelazh-talrep-1480-kryuk-k":   C("talrep"),
  "takelazh-talrep-1480-kryuk-kryuk": C("talrep"),
  "takelazh-tros-din3055":          C("tros"),
  "takelazh-tros-din3055-pvkh":     C("tros"),
  "takelazh-tsep-din763":           C("tsep"),
  "takelazh-tsep-din766":           C("tsep"),

  // Канаты
  "kanat-din3059":  C("kanat"),
  "kanat-gost2688": C("tros"),
  "kanat-gost7668": C("kanat"),

  // Вентиляция
  "ventil-profil-l":       C("ventil"),
  "ventil-profil-u":       C("ventil"),
  "ventil-skoba-flantsev": C("perfo"),
  "ventil-strubtsiny":     C("perfo"),
  "ventil-traversa":       C("ventil"),
  "ventil-trubki-kflex":   C("ventil"),
  "ventil-ugolok":         C("ventil"),
  "ventil-khomut":         C("ventil"),
  "ventil-shina":          C("ventil"),
  "ventil-shpilka":        C("shpilki"),

  // Перфо
  "perfo-derzhatel-balki":    C("perfo"),
  "perfo-plastina-kp":        C("perfo"),
  "perfo-ankernyi-ugol-kau":  C("perfo"),
  "perfo-ugol-ku":            C("perfo"),
  "perfo-ugol-kuas":          C("perfo"),
  "perfo-ugol-kus":           C("perfo"),
  "perfo-ugol-kur":           C("perfo"),
  "perfo-ugol-kuu":           C("perfo"),
  "perfo-ugol-kur-us":        C("perfo"),
  "perfo-lenta":              C("perfo"),
  "perfo-opora-balki":        C("perfo"),
  "perfo-lenta-lm":           C("perfo"),
  "perfo-plastina-ps":        C("perfo"),
  "perfo-prushina-pzp":       C("perfo"),
  "perfo-uglovoy-soedinitel": C("perfo"),
  "perfo-ugol-mebelnyi":      C("perfo"),

  // Электроды
  "svarka-lez":      C("elektrody"),
  "svarka-monolith": C("svarka"),
  "svarka-rossiya":  C("svarka"),
  "svarka-kitay":    C("elektrody"),
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
                                  className="absolute inset-0 opacity-100 group-hover/cat:opacity-100 transition-opacity"
                                  style={{
                                    backgroundImage: `linear-gradient(to right, rgba(248,250,252,1) 0%, rgba(248,250,252,1) 40%, rgba(248,250,252,0.5) 65%, rgba(248,250,252,0) 100%), url('${imgUrl}')`,
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
