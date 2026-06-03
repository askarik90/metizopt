"use client";
import { useState } from "react";
import { MessageCircle, Upload, CheckCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";
import LeadFormModal from "./LeadFormModal";
import TrustSection from "./TrustSection";
import FAQ from "./FAQ";

interface LandingCategoryPageProps {
  h1: string;
  description: string;
  category: string;
  whatsappText?: string;
  usp: string[];
  faqItems?: { q: string; a: string }[];
}

export default function LandingCategoryPage({
  h1, description, category, whatsappText, usp,
}: LandingCategoryPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { trackWhatsAppClick } = useAnalytics();

  return (
    <main className="pb-20 lg:pb-0">
      {/* Hero */}
      <section
        className="bg-slate-900 py-16 lg:py-24"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              {h1}
            </h1>
            <p className="text-slate-300 text-lg mb-8">{description}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(category)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 font-medium transition-colors"
              >
                <MessageCircle size={20} />
                Написать в WhatsApp
              </a>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 font-medium transition-colors"
              >
                <Upload size={20} />
                Запросить наличие и цену
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {usp.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
            Запросить наличие и цену
          </h2>
          <p className="text-slate-300 mb-6">
            Пришлите список — менеджер проверит наличие и свяжется за 30 минут.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 font-medium text-base transition-colors w-full sm:w-auto"
          >
            Отправить заявку
          </button>
        </div>
      </section>

      <TrustSection />
      <FAQ />

      <LeadFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={category}
      />
    </main>
  );
}
