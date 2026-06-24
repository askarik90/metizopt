"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import LeadFormModal from "@/components/LeadFormModal";
import CategoryCharacteristics from "@/components/CategoryCharacteristics";
import TypeSizePicker from "@/components/TypeSizePicker";
import { getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getCategoryImage, getTypeImage, heroBg, type ImgPos } from "@/lib/categoryImages";

export interface TypeLink {
  slug: string;
  name: string;
  count: number;
  sizes: { label: string }[];
  summary?: string;
}

interface CategoryClientProps {
  title: string;
  desc: string;
  slug: string;
  standards: readonly string[];
  classes: readonly string[];
  whatsappText: string;
  fullDescription?: string;
  sidebar?: React.ReactNode;
  types?: TypeLink[];
  sizes?: { label: string; code: string }[];
  imgPos?: Record<string, ImgPos>;
}

export default function CategoryClient({
  title,
  desc,
  slug,
  standards,
  classes,
  whatsappText,
  fullDescription,
  sidebar,
  types = [],
  sizes = [],
  imgPos,
}: CategoryClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { trackWhatsAppClick, trackLeadFormOpen } = useAnalytics();

  const openModal = () => {
    setModalOpen(true);
    trackLeadFormOpen(title);
  };

  const heroImg = getCategoryImage(slug);

  return (
    <>
      {/* Hero — full width, фон = картинка категории с L→R градиентом */}
      {heroImg && <link rel="preload" as="image" href={heroImg} fetchPriority="high" />}
      <section className="bg-slate-900 py-16" style={heroBg(heroImg, imgPos?.[slug])}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              {title}
            </h1>
            <p className="text-slate-300 text-lg mb-4">{desc}</p>
            {standards.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {standards.map((s) => (
                  <span key={s} className="bg-slate-800 border border-slate-600 text-slate-300 text-sm px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(title)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 font-medium transition-colors"
              >
                <MessageCircle size={20} />
                Запросить в WhatsApp
              </a>
              <button
                onClick={openModal}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 font-medium transition-colors"
              >
                Запросить наличие и цену
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content area: sidebar + description + classes */}
      {(sizes.length > 0 || types.length > 0 || fullDescription || classes.length > 0 || sidebar) && (
        <div className="bg-slate-50 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-8">

              {/* Left sidebar — desktop only */}
              {sidebar && (
                <aside className="hidden lg:block w-52 flex-shrink-0">
                  {sidebar}
                </aside>
              )}

              {/* Main column */}
              <div className="flex-1 min-w-0 space-y-6">
                {/* Выбор размера (для подкатегорий = одного типа) */}
                {sizes.length > 0 && (
                  <TypeSizePicker typeName={title} sizes={sizes} category={title} />
                )}

                {/* Виды (типы) с выбором размера */}
                {types.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-tight text-slate-900">
                      Виды — выберите для размеров
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {types.map((t) => {
                        const img = getTypeImage(t.slug);
                        const cp = imgPos?.[t.slug];
                        return (
                        <Link
                          key={t.slug}
                          href={`/catalog/${slug}/${t.slug}`}
                          className="group relative overflow-hidden flex flex-col rounded border border-slate-200 bg-white p-4 transition-all hover:border-orange-400 hover:shadow-md"
                        >
                          {img && (
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 45%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0) 100%), url('${img}')`,
                                backgroundSize: `cover, ${cp?.size ?? "cover"}`,
                                backgroundPosition: `right center, ${cp?.x ?? 100}% ${cp?.y ?? 50}%`,
                                backgroundRepeat: "no-repeat, no-repeat",
                              }}
                            />
                          )}
                          <div className="relative z-10 flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold uppercase leading-tight text-slate-900 transition-colors group-hover:text-orange-600">
                              {t.name}
                            </h3>
                            <ArrowRight size={16} className="mt-0.5 shrink-0 text-orange-600 transition-transform group-hover:translate-x-1" />
                          </div>
                          {t.summary && (
                            <p className="relative z-10 mt-2 line-clamp-1 text-xs text-slate-500">
                              {t.summary.replace(/^В наличии /, "")}
                            </p>
                          )}
                        </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Characteristics from index */}
                <CategoryCharacteristics slug={slug} />

                {/* Full Description */}
                {fullDescription && (
                  <div className="rounded-lg border border-slate-200 bg-white p-8">
                    <div
                      className="prose prose-slate max-w-none text-slate-600"
                      dangerouslySetInnerHTML={{ __html: fullDescription }}
                    />
                  </div>
                )}

                {/* Strength Classes */}
                {classes.length > 0 && (
                  <div className="rounded-lg border border-slate-200 bg-white p-8">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">
                      Классы прочности
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {classes.map((cls) => (
                        <div key={cls} className="border border-slate-200 px-6 py-4 text-center">
                          <div className="text-2xl font-black text-orange-600">{cls}</div>
                          <div className="text-slate-500 text-xs mt-1">класс прочности</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analogue — full width */}
      <section className="bg-orange-50 border-y border-orange-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-black text-slate-900 text-lg">Не нашли нужную позицию?</div>
            <div className="text-slate-600">Подберём аналог по ГОСТ/DIN/ISO без потери характеристик</div>
          </div>
          <button
            onClick={openModal}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 font-medium transition-colors whitespace-nowrap"
          >
            Запросить подбор аналога
          </button>
        </div>
      </section>

      <StickyMobileCTA onQuoteClick={() => setModalOpen(true)} />
      <LeadFormModal open={modalOpen} onClose={() => setModalOpen(false)} category={title} />
    </>
  );
}
