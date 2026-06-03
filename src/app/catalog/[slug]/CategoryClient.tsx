"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import LeadFormModal from "@/components/LeadFormModal";
import { getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CategoryClientProps {
  title: string;
  desc: string;
  standards: readonly string[];
  classes: readonly string[];
  whatsappText: string;
}

export default function CategoryClient({ title, desc, standards, classes, whatsappText }: CategoryClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { trackWhatsAppClick } = useAnalytics();

  return (
    <>
      {/* Hero */}
      <section
        className="bg-slate-900 py-16"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              {title} оптом в Алматы
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
                onClick={() => setModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 font-medium transition-colors"
              >
                Запросить наличие и цену
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Classes */}
      {classes.length > 0 && (
        <section className="bg-white py-12 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
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
        </section>
      )}

      {/* Analogue */}
      <section className="bg-orange-50 border-y border-orange-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-black text-slate-900 text-lg">Не нашли нужную позицию?</div>
            <div className="text-slate-600">Подберём аналог по ГОСТ/DIN/ISO без потери характеристик</div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
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
