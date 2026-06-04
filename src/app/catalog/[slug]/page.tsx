import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import CategoryClient from "./CategoryClient";
import { COMPANY } from "@/config/company";

export function generateStaticParams() {
  const categories = COMPANY.categories.map((cat) => ({ slug: cat.slug }));
  const groups = COMPANY.groups.map((group) => ({ slug: group.slug }));
  return [...categories, ...groups];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Сначала проверяем группы
  const group = COMPANY.groups.find((g) => g.slug === slug);
  if (group) {
    return {
      title: group.metaTitle,
      description: group.metaDesc,
    };
  }

  // Потом категории
  const cat = COMPANY.categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: cat.metaTitle,
    description: cat.metaDesc,
  };
}

export default async function CatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Проверяем группы
  const group = COMPANY.groups.find((g) => g.slug === slug);
  if (group) {
    const groupSlugs = new Set(group.categories as readonly string[]);
    const groupCategories = COMPANY.categories.filter((cat) => groupSlugs.has(cat.slug));

    return (
      <main className="pb-20 lg:pb-0">
        <Header />

        {/* Hero */}
        <section
          className="bg-slate-900 py-16 relative overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-600/30 text-orange-400 text-xs font-medium px-3 py-1.5 mb-6">
                Оптовые поставки по всему Казахстану
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-6">
                {group.title}
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                {group.desc}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует ${group.shortTitle}. Подскажите наличие и цену.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 font-medium transition-colors"
                >
                  💬 Написать в WhatsApp
                </a>
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="flex items-center gap-2 border border-slate-500 text-slate-300 hover:border-slate-300 hover:text-white px-6 py-3.5 font-medium transition-colors"
                >
                  📞 Позвонить
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Full Description */}
        <section className="bg-white py-12 border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-slate-600 text-base leading-relaxed">{group.fullDescription}</p>
          </div>
        </section>

        {/* Подкатегории */}
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-10">
              Подкатегории
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/catalog/${cat.slug}`}
                  className="group block p-6 bg-white border border-slate-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-black text-slate-900 text-lg uppercase group-hover:text-orange-600 transition-colors">
                      {cat.title}
                    </h3>
                    <span className="text-orange-600 font-bold text-sm ml-2">→</span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {cat.desc}
                  </p>

                  {cat.standards.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cat.standards.slice(0, 3).map((s) => (
                        <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <TrustSection />
        <FAQ />
        <Footer />
      </main>
    );
  }

  // Проверяем категории
  const cat = COMPANY.categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  return (
    <main className="pb-20 lg:pb-0">
      <Header />
      <CategoryClient
        title={cat.title}
        desc={cat.desc}
        standards={cat.standards}
        classes={cat.classes}
        whatsappText={cat.whatsappText}
        fullDescription={cat.fullDescription}
      />
      <TrustSection />
      <FAQ />
      <Footer />
    </main>
  );
}
