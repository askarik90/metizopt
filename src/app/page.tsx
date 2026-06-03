"use client";
import { useState, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UploadRequestBlock from "@/components/UploadRequestBlock";
import CategoryGrid from "@/components/CategoryGrid";
import HowItWorks from "@/components/HowItWorks";
import QuickQuoteForm from "@/components/QuickQuoteForm";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import LeadFormModal from "@/components/LeadFormModal";
import { MessageCircle, Phone } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<string | undefined>();

  const openModal = (category?: string) => {
    setModalCategory(category);
    setModalOpen(true);
  };

  return (
    <main className="pb-20 lg:pb-0">
      <Header onQuoteClick={() => openModal()} />

      <Suspense>
        <Hero onQuoteClick={() => openModal()} onUploadClick={() => openModal()} />
      </Suspense>

      <UploadRequestBlock onUploadClick={() => openModal()} />

      <CategoryGrid />

      <HowItWorks />

      <Suspense>
        <QuickQuoteForm />
      </Suspense>

      <TrustSection />

      <FAQ />

      {/* Final CTA */}
      <section className="bg-slate-900 py-16 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
            Готовы обсудить поставку?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Пришлите список или позвоните — ответим быстро
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 font-medium text-base transition-colors"
            >
              <MessageCircle size={20} />
              Написать в WhatsApp
            </a>
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="flex items-center justify-center gap-2 border border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 font-medium text-base transition-colors"
            >
              <Phone size={20} />
              {COMPANY.phone}
            </a>
            <button
              onClick={() => openModal()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 font-medium text-base transition-colors"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <Suspense>
        <StickyMobileCTA onQuoteClick={() => openModal()} />
      </Suspense>

      <Suspense>
        <LeadFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          category={modalCategory}
        />
      </Suspense>
    </main>
  );
}
