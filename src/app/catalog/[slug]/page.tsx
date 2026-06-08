import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import CategoryClient from "./CategoryClient";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CatalogSidebar from "@/components/CatalogSidebar";
import { COMPANY } from "@/config/company";
import {
  getCategories,
  getGroups,
  type CategoryItem,
  type GroupItem,
} from "@/lib/db";
import { sanitizeRichText } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [groups, categories] = await Promise.all([getGroups(), getCategories()]);
  const canonical = `https://${COMPANY.domain}/catalog/${slug}`;

  const group = groups.find((item: GroupItem) => item.slug === slug);
  if (group) {
    return {
      title: group.metaTitle,
      description: group.metaDesc,
      alternates: { canonical },
      openGraph: {
        title: group.metaTitle,
        description: group.metaDesc,
        url: canonical,
        type: "website",
      },
    };
  }

  const category = categories.find((item: CategoryItem) => item.slug === slug);
  if (category) {
    return {
      title: category.metaTitle,
      description: category.metaDesc,
      alternates: { canonical },
      openGraph: {
        title: category.metaTitle,
        description: category.metaDesc,
        url: canonical,
        type: "website",
      },
    };
  }

  return {};
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [groups, categories] = await Promise.all([getGroups(), getCategories()]);
  const pageUrl = `https://${COMPANY.domain}/catalog/${slug}`;

  // ── GROUP PAGE ─────────────────────────────────────────────────────────
  const group = groups.find((item: GroupItem) => item.slug === slug);
  if (group) {
    const groupSlugs = new Set(group.categories);
    const groupCategories = categories.filter((item) => groupSlugs.has(item.slug));

    const groupJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: `https://${COMPANY.domain}` },
            { "@type": "ListItem", position: 2, name: "Каталог", item: `https://${COMPANY.domain}/catalog` },
            { "@type": "ListItem", position: 3, name: group.title, item: pageUrl },
          ],
        },
        {
          "@type": "Organization",
          name: COMPANY.name,
          url: `https://${COMPANY.domain}`,
          telephone: COMPANY.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Алматы",
            addressCountry: "KZ",
          },
        },
      ],
    };

    return (
      <main className="pb-20 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(groupJsonLd) }}
        />
        <Header />

        {/* Breadcrumbs */}
        <BreadcrumbNav
          crumbs={[
            { label: "Каталог", href: "/catalog" },
            { label: group.title },
          ]}
        />

        {/* Hero */}
        <section
          className="relative overflow-hidden bg-slate-900 py-16"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 border border-orange-600/30 bg-orange-600/20 px-3 py-1.5 text-xs font-medium text-orange-400">
                Оптовые поставки по всему Казахстану
              </div>
              <h1 className="mb-6 text-4xl font-black uppercase tracking-tighter text-white lg:text-5xl">
                {group.title}
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-300">
                {group.desc}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
                    `Здравствуйте! Интересует ${group.shortTitle}. Подскажите наличие и цену.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 px-6 py-3.5 font-medium text-white transition-colors hover:bg-green-700"
                >
                  💬 Написать в WhatsApp
                </a>
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="flex items-center gap-2 border border-slate-500 px-6 py-3.5 font-medium text-slate-300 transition-colors hover:border-slate-300 hover:text-white"
                >
                  📞 Позвонить
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Main content: sidebar + categories + description */}
        <div className="bg-slate-50 py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-8">

              {/* Left sidebar — desktop only */}
              <aside className="hidden lg:block w-52 flex-shrink-0">
                <CatalogSidebar groups={groups} categories={categories} currentSlug={slug} />
              </aside>

              {/* Main column */}
              <div className="flex-1 min-w-0">

                {/* 1. CATEGORIES FIRST */}
                {groupCategories.length > 0 && (
                  <div className="mb-8">
                    <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-slate-900">
                      Категории
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {groupCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/catalog/${category.slug}`}
                          className="group flex flex-col rounded border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-orange-400 hover:shadow-lg"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <h3 className="flex-1 pr-2 text-sm font-black uppercase leading-tight text-slate-900 transition-colors group-hover:text-orange-600">
                              {category.title}
                            </h3>
                            <span className="flex-shrink-0 text-lg font-bold text-orange-600 transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                          <p className="mb-3 line-clamp-3 flex-grow text-xs leading-relaxed text-slate-500">
                            {category.desc}
                          </p>
                          {category.standards && category.standards.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {category.standards.slice(0, 2).map((standard) => (
                                <span
                                  key={standard}
                                  className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                >
                                  {standard}
                                </span>
                              ))}
                              {category.standards.length > 2 && (
                                <span className="text-xs text-slate-400">
                                  +{category.standards.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. FULL DESCRIPTION AFTER categories */}
                {group.fullDescription && (
                  <div className="rounded-lg border border-slate-200 bg-white p-8">
                    <div
                      className="prose prose-slate max-w-none text-slate-600"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeRichText(group.fullDescription),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <TrustSection />
        <FAQ />
        <Footer />
      </main>
    );
  }

  // ── CATEGORY PAGE ──────────────────────────────────────────────────────
  const category = categories.find((item: CategoryItem) => item.slug === slug);
  if (!category) notFound();

  const parentGroup = groups.find((g: GroupItem) => g.categories.includes(slug));

  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `https://${COMPANY.domain}` },
          { "@type": "ListItem", position: 2, name: "Каталог", item: `https://${COMPANY.domain}/catalog` },
          ...(parentGroup
            ? [{ "@type": "ListItem", position: 3, name: parentGroup.title, item: `https://${COMPANY.domain}/catalog/${parentGroup.slug}` }]
            : []),
          {
            "@type": "ListItem",
            position: parentGroup ? 4 : 3,
            name: category.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Product",
        name: category.title,
        description: category.desc,
        brand: { "@type": "Brand", name: COMPANY.name },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "KZT",
          seller: { "@type": "Organization", name: COMPANY.name },
        },
      },
    ],
  };

  return (
    <main className="pb-20 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <Header />

      {/* Breadcrumbs */}
      <BreadcrumbNav
        crumbs={[
          { label: "Каталог", href: "/catalog" },
          ...(parentGroup
            ? [{ label: parentGroup.shortTitle || parentGroup.title.split(" оптом")[0], href: `/catalog/${parentGroup.slug}` }]
            : []),
          { label: category.title },
        ]}
      />

      <CategoryClient
        title={category.title}
        desc={category.desc}
        slug={slug}
        standards={(category.standards ?? []) as readonly string[]}
        classes={(category.classes ?? []) as readonly string[]}
        whatsappText={category.whatsappText ?? ""}
        fullDescription={sanitizeRichText(category.fullDescription)}
        sidebar={
          <CatalogSidebar groups={groups} categories={categories} currentSlug={slug} />
        }
      />
      <TrustSection />
      <FAQ />
      <Footer />
    </main>
  );
}
