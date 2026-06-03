"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import LeadFormModal from "@/components/LeadFormModal";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

const categoryIcons: Record<string, string> = {
  bolty: "🔩", gayki: "⚙️", ankera: "⚓", shayby: "🪙",
  shpilki: "📌", "samoреzy": "🪛", takelazh: "⛓️",
  elektrody: "⚡", "krepezh-gost": "🏷️", "krepezh-din-iso": "🌐",
};

export default function CatalogPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<string | undefined>();
  const { trackWhatsAppClick } = useAnalytics();

  return (
    <main className="pb-20 lg:pb-0">
      <Header onQuoteClick={() => setModalOpen(true)} />

      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-4">
            Каталог крепежа
          </h1>
          <p className="text-slate-300 text-lg mb-6">
            Не нашли нужное? Пришлите список — подберём и рассчитаем КП.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick()}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-medium transition-colors"
          >
            <MessageCircle size={18} />
            Отправить список в WhatsApp
          </a>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANY.categories.map((cat) => (
              <div
                key={cat.slug}
                className="border border-slate-200 hover:border-orange-400 transition-colors group p-6"
              >
                <div className="text-3xl mb-3">{categoryIcons[cat.slug] || "🔧"}</div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  {cat.title}
                </h2>
                <p className="text-slate-500 text-sm mb-3 leading-relaxed">{cat.desc}</p>

                {cat.standards.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cat.standards.map((s) => (
                      <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5">{s}</span>
                    ))}
                  </div>
                )}

                {(cat.classes as readonly string[]).length > 0 && (
                  <p className="text-slate-400 text-xs mb-4">
                    Классы: {(cat.classes as readonly string[]).join(", ")}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => { setModalCategory(cat.title); setModalOpen(true); }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 text-sm font-medium transition-colors"
                  >
                    Запросить наличие и цену
                  </button>
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="border border-slate-300 hover:border-slate-500 text-slate-600 px-3 py-2.5 text-sm transition-colors"
                  >
                    →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <StickyMobileCTA onQuoteClick={() => setModalOpen(true)} />
      <LeadFormModal open={modalOpen} onClose={() => setModalOpen(false)} category={modalCategory} />
    </main>
  );
}
