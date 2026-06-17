"use client";
import { useState } from "react";
import Link from "next/link";
import { useGroups, useCategories } from "@/hooks/useCatalog";
import {
  Wrench, Wind, BarChart3, Star, Link2, Zap, Droplets, ChevronDown,
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

// Локальные фото для категорий (public/images/categories/*.jpg)
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
  "svarka-kitay":    C("elektrody"),
  "svarka-prinadlezhnosti": C("svarka"),
  "shlangi-armirovannyi": C("shlangi"),
  "shlangi-mbs": C("shlangi"),
  "shlangi-polivochnyi": C("shlangi"),
};

function displayName(title: string) {
  return title
    .replace(/ в Алматы$/i, "")
    .replace(/ оптом в Алматы$/i, "")
    .replace(/ оптом$/i, "")
    .replace(/ — полный каталог.*$/i, "")
    .replace(/ — .*$/i, "")
    .trim();
}

interface Cat { slug: string; title: string; standards: string[] }

function CatCard({ cat }: { cat: Cat }) {
  const imgUrl = CATEGORY_IMAGES[cat.slug];
  return (
    <Link
      href={`/catalog/${cat.slug}`}
      className="relative overflow-hidden flex flex-col justify-between p-4 bg-slate-50 border border-slate-100 hover:border-orange-400 hover:shadow-md transition-all group/cat rounded min-h-[90px]"
    >
      {imgUrl && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(248,250,252,1) 0%, rgba(248,250,252,1) 40%, rgba(248,250,252,0.5) 65%, rgba(248,250,252,0) 100%), url('${imgUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
          }}
        />
      )}
      <div className="relative z-10 flex items-start justify-between gap-1 mb-3">
        <h4 className="font-black text-slate-900 text-xs uppercase group-hover/cat:text-orange-600 transition-colors leading-snug">
          {displayName(cat.title)}
        </h4>
        <span className="text-orange-500 font-bold text-base group-hover/cat:translate-x-0.5 transition-transform flex-shrink-0 leading-none">
          →
        </span>
      </div>
      {cat.standards.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1">
          {cat.standards.slice(0, 2).map((s) => (
            <span key={s} className="text-xs bg-white/80 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
              {s}
            </span>
          ))}
          {cat.standards.length > 2 && (
            <span className="text-xs text-slate-400">+{cat.standards.length - 2}</span>
          )}
        </div>
      )}
    </Link>
  );
}

export default function HierarchicalCatalog() {
  const { groups } = useGroups();
  const { categories } = useCategories();
  // По умолчанию свёрнуто (моб. аккордеон ничего не раскрывает; на десктопе панель
  // подхватит первую группу через activeGroup-fallback).
  const [expandedGroup, setExpandedGroup] = useState<string>("");

  const catsOf = (group: { categories: readonly string[] }) => {
    const set = new Set(group.categories as string[]);
    return categories.filter((c) => set.has(c.slug)) as Cat[];
  };

  // Для десктопа всегда показываем какую-то группу
  const activeGroup = groups.find((g) => g.slug === expandedGroup) || groups[0];

  return (
    <section className="bg-slate-50 py-16 scroll-mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10" id="catalog-title">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Каталог товаров
          </h2>
          <p className="text-slate-500">
            Выберите группу, затем категорию для просмотра всех товаров и цен
          </p>
        </div>

        {/* ── ДЕСКТОП: две колонки (сайдбар групп + панель категорий) ── */}
        <div className="hidden lg:flex gap-4">
          <div className="w-64 flex-shrink-0 flex flex-col gap-2">
            {groups.map((group) => {
              const Icon = GROUP_ICONS[group.slug] || Wrench;
              const isActive = activeGroup?.slug === group.slug;
              const count = (group.categories as string[]).length;
              return (
                <button
                  key={group.slug}
                  onClick={() => setExpandedGroup(group.slug)}
                  className={`relative overflow-hidden flex items-center gap-3 px-4 py-3 bg-white border transition-all rounded group/sidebar ${
                    isActive ? "border-orange-400 bg-orange-50 shadow-md" : "border-slate-100 hover:border-orange-400 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-grow z-10 min-w-0">
                    <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded transition-colors ${
                      isActive ? "bg-orange-200" : "bg-orange-100 group-hover/sidebar:bg-orange-200"
                    }`}>
                      <Icon size={16} className="text-orange-600" />
                    </div>
                    <div className="text-left min-w-0">
                      <span className={`font-bold text-xs uppercase tracking-tight leading-snug ${isActive ? "text-orange-600" : "text-slate-900"}`}>
                        {group.shortTitle || displayName(group.title)}
                      </span>
                      <p className="text-xs text-slate-400">{count} кат.</p>
                    </div>
                  </div>
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

          <div className="flex-1 min-w-0">
            {activeGroup && (
              <div className="bg-white border border-orange-400 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {activeGroup.shortTitle || displayName(activeGroup.title)}
                  </h3>
                  <Link href={`/catalog/${activeGroup.slug}`} className="text-xs text-orange-600 hover:text-orange-700 font-bold uppercase tracking-wide">
                    Все товары →
                  </Link>
                </div>
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
                  {catsOf(activeGroup).map((cat) => <CatCard key={cat.slug} cat={cat} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── МОБИЛЬНЫЙ: аккордеон — категории раскрываются под нажатой группой ── */}
        <div className="lg:hidden flex flex-col gap-2">
          {groups.map((group) => {
            const Icon = GROUP_ICONS[group.slug] || Wrench;
            const isOpen = expandedGroup === group.slug;
            const count = (group.categories as string[]).length;
            return (
              <div key={group.slug} className="bg-white border border-slate-200 rounded overflow-hidden">
                <button
                  onClick={() => setExpandedGroup(isOpen ? "" : group.slug)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${isOpen ? "bg-orange-50" : "hover:bg-slate-50"}`}
                >
                  <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded ${isOpen ? "bg-orange-200" : "bg-orange-100"}`}>
                    <Icon size={16} className="text-orange-600" />
                  </div>
                  <div className="text-left flex-grow min-w-0">
                    <span className={`font-bold text-sm uppercase tracking-tight leading-snug ${isOpen ? "text-orange-600" : "text-slate-900"}`}>
                      {group.shortTitle || displayName(group.title)}
                    </span>
                    <p className="text-xs text-slate-400">{count} категорий</p>
                  </div>
                  <ChevronDown size={20} className={`flex-shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 p-3">
                    <div className="grid grid-cols-2 gap-3">
                      {catsOf(group).map((cat) => <CatCard key={cat.slug} cat={cat} />)}
                    </div>
                    <Link
                      href={`/catalog/${group.slug}`}
                      className="mt-3 block text-center text-xs text-orange-600 hover:text-orange-700 font-bold uppercase tracking-wide py-1"
                    >
                      Все товары {group.shortTitle || ""} →
                    </Link>
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
