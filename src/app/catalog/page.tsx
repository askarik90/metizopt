"use client";
import Header from "@/components/Header";
import HierarchicalCatalog from "@/components/HierarchicalCatalog";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import { useState, Suspense } from "react";
import LeadFormModal from "@/components/LeadFormModal";

export default function CatalogPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<string | undefined>();

  const openModal = (category?: string) => {
    setModalCategory(category);
    setModalOpen(true);
  };

  return (
    <main className="pb-20 lg:pb-0">
      <Header onQuoteClick={() => openModal()} />

      {/* Hero section для каталога */}
      <section className="bg-slate-900 py-12 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Каталог товаров
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Полный каталог крепежа, комплектующих и материалов для строительства и производства. Выберите нужную категорию и ознакомьтесь со всеми товарами и ценами.
            </p>
          </div>
        </div>
      </section>

      {/* Основной каталог */}
      <HierarchicalCatalog />

      <HowItWorks />

      <TrustSection />

      <FAQ />

      <Footer />

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
