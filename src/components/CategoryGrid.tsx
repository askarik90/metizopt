"use client";
import { useState } from "react";
import {
  Wrench, Settings, Circle, Anchor, Scissors, Package,
  Hammer, FileText, Wind, BarChart3, Star, Link2, Link,
  Zap, Droplet, Pin, ChevronDown, X, MessageCircle, Check,
} from "lucide-react";
import { COMPANY } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";
import catalogTypes from "@/data/catalog-types.json";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

const TYPES = catalogTypes as Record<string, string[]>;

const ICONS: Record<string, React.ElementType> = {
  bolty: Settings,       gayki: Settings,    shayby: Circle,
  vinty: Wrench,         ankera: Anchor,     shplinty: Scissors,
  dyubelya: Package,     shurupy: Wrench,    shpilki: FileText,
  zaklepki: Hammer,      gvozdi: Pin,
  ventilatsiya: Wind,    perfo: BarChart3,   nerzhaveyushchiy: Star,
  takelazh: Link2,       kanaty: Link,       elektrody: Zap,
  shlangi: Droplet,
};

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const { trackCategoryClick } = useAnalytics();
  const [open, setOpen] = useState(false);

  // Модалка выбора типов
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  // Показываем только подкатегории, для которых есть реальные товары
  const krepezhItems = COMPANY.categories.filter(
    (c) => (c as any).group === "krepezh" && TYPES[c.slug]?.length
  );
  const standalone = COMPANY.categories.filter(
    (c) => !(c as any).group && TYPES[c.slug]?.length
  );

  const openModal = (slug: string, title: string) => {
    trackCategoryClick(title);
    onCategoryClick?.(title);
    setModalSlug(slug);
    setModalTitle(title);
    setPicked([]);
  };

  const closeModal = () => setModalSlug(null);

  const togglePick = (t: string) =>
    setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const waUrl = (() => {
    const lines = picked.length
      ? picked.map((t) => `• ${t}`).join("\n")
      : modalTitle;
    const msg = `Здравствуйте! Интересует ${modalTitle}.\nНужны позиции:\n${lines}\n\nПодскажите наличие и цену, пожалуйста.`;
    return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`;
  })();

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">

          {/* ── КРЕПЕЖ (аккордеон) ── */}
          <div
            onClick={() => setOpen(!open)}
            className={[
              "group cursor-pointer p-6 transition-colors duration-150",
              open ? "krepezh-expanded bg-slate-900" : "bg-white hover:bg-slate-900",
            ].join(" ")}
          >
            <Settings size={28} className={`mb-3 transition-colors ${open ? "text-orange-400" : "text-orange-500 group-hover:text-orange-400"}`} />
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-black text-base uppercase tracking-tight transition-colors ${open ? "text-white" : "text-slate-900 group-hover:text-white"}`}>
                Крепеж
              </h3>
              <ChevronDown size={16} className={`transition-all duration-200 ${open ? "text-slate-400 rotate-180" : "text-slate-400 group-hover:text-slate-300"}`} />
            </div>
            <p className={`text-sm leading-snug mb-3 transition-colors ${open ? "text-slate-400" : "text-slate-500 group-hover:text-slate-300"}`}>
              {open ? "Выберите подгруппу →" : "Болты, гайки, шайбы, анкера и другой крепёж"}
            </p>
            <div className="flex flex-wrap gap-1">
              {["DIN", "ГОСТ", "ISO"].map((s) => (
                <span key={s} className={`text-xs px-2 py-0.5 transition-colors ${open ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600 group-hover:bg-slate-700 group-hover:text-slate-300"}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── ПОДГРУППЫ КРЕПЕЖА ── */}
          {open && krepezhItems.map((cat) => {
            const Icon = ICONS[cat.slug] ?? Wrench;
            return (
              <button
                key={cat.slug}
                onClick={() => openModal(cat.slug, cat.title)}
                className="group flex flex-col items-start gap-2 p-5 bg-slate-800 hover:bg-orange-600 transition-colors duration-150 text-left"
              >
                <Icon size={22} className="text-slate-400 group-hover:text-white transition-colors" />
                <span className="font-bold text-slate-200 group-hover:text-white text-sm uppercase tracking-tight transition-colors">
                  {cat.shortTitle}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-orange-100">
                  {TYPES[cat.slug].length} видов
                </span>
              </button>
            );
          })}

          {/* Филлер чтобы остальные категории начались с новой строки */}
          {open && Array.from({
            length: (3 - (krepezhItems.length % 3)) % 3,
          }).map((_, i) => <div key={`f-${i}`} className="bg-slate-800" />)}

          {/* ── ОТДЕЛЬНЫЕ КАТЕГОРИИ ── */}
          {standalone.map((cat, i) => {
            const Icon = ICONS[cat.slug] ?? Wrench;
            const forceNewRow = open && i === 0 ? "lg:col-start-1" : "";
            return (
              <div
                key={cat.slug}
                onClick={() => openModal(cat.slug, cat.title)}
                className={`group bg-white hover:bg-slate-900 cursor-pointer p-6 transition-colors duration-150 ${forceNewRow}`}
              >
                <Icon size={28} className="text-orange-500 group-hover:text-orange-400 mb-3 transition-colors" />
                <h3 className="font-black text-slate-900 group-hover:text-white text-base uppercase tracking-tight mb-1 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-slate-500 group-hover:text-slate-300 text-sm leading-snug mb-3 transition-colors">
                  {cat.desc}
                </p>
                <span className="text-xs text-slate-400 group-hover:text-slate-500">
                  {TYPES[cat.slug].length} видов
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════ МОДАЛКА ВЫБОРА ТИПОВ ════════ */}
      {modalSlug && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

            {/* Шапка */}
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 shrink-0">
              <div>
                <h3 className="text-white font-black uppercase tracking-tight text-lg">{modalTitle}</h3>
                <p className="text-slate-400 text-xs">Отметьте нужные виды — отправим в WhatsApp</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X size={22} />
              </button>
            </div>

            {/* Список типов */}
            <div className="overflow-y-auto p-4 flex flex-wrap gap-2 content-start">
              {TYPES[modalSlug]?.map((t) => {
                const active = picked.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => togglePick(t)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm border-2 transition-colors text-left ${
                      active
                        ? "border-orange-600 bg-orange-50 text-orange-700"
                        : "border-slate-200 text-slate-700 hover:border-orange-400"
                    }`}
                  >
                    {active && <Check size={14} className="shrink-0" />}
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Подвал */}
            <div className="border-t border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row gap-3 items-center">
              <span className="text-sm text-slate-500 sm:mr-auto">
                {picked.length > 0 ? `Выбрано: ${picked.length}` : "Можно выбрать несколько или отправить всю категорию"}
              </span>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold transition-colors"
              >
                <MessageCircle size={18} />
                Запросить в WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
