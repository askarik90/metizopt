import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TypeSizePicker from "@/components/TypeSizePicker";
import { COMPANY } from "@/config/company";
import { getCategories, getGroups, getImagePositions, type CategoryItem, type GroupItem } from "@/lib/db";
import catalogTreeJson from "@/data/catalog-tree.json";
import { sanitizeRichText } from "@/lib/sanitize";
import { getCategoryImage, getTypeImage, heroBg, cardBg } from "@/lib/categoryImages";
import ImageEditOverlay from "@/components/edit/ImageEditOverlay";

export const revalidate = 86400; // ISR: контент в git, пересборка раз в сутки

type Size = { label: string; code: string };
type TypeNode = { slug: string; name: string; count: number; sizes: Size[]; description?: string; summary?: string };
const tree = catalogTreeJson as Record<string, { types?: TypeNode[]; sizes?: Size[] }>;

function findType(slug: string, typeSlug: string): TypeNode | undefined {
  return tree[slug]?.types?.find((t) => t.slug === typeSlug);
}

export function generateStaticParams() {
  const params: { slug: string; type: string }[] = [];
  for (const [slug, node] of Object.entries(tree)) {
    for (const t of node.types ?? []) params.push({ slug, type: t.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; type: string }>;
}): Promise<Metadata> {
  const { slug, type } = await params;
  const node = findType(slug, type);
  if (!node) return {};
  const canonical = `https://${COMPANY.domain}/catalog/${slug}/${type}`;
  const sizeList = node.sizes.slice(0, 6).map((s) => s.label).join(", ");
  const title = `${node.name} в Алматы — купить оптом и в розницу`;
  const description = `${node.name}${
    sizeList ? `: размеры ${sizeList}` : ""
  }. Со склада в Алматы, оптом и в розницу. Доставка по Казахстану.`.slice(0, 165);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ slug: string; type: string }>;
}) {
  const { slug, type } = await params;
  const node = findType(slug, type);
  if (!node) notFound();

  const [groups, categories, positions] = await Promise.all([getGroups(), getCategories(), getImagePositions()]);
  const pos = positions[type] ?? positions[slug];
  const heroImg = getTypeImage(type) ?? getCategoryImage(slug);
  const category = categories.find((c: CategoryItem) => c.slug === slug);
  const parentGroup = groups.find((g: GroupItem) => g.categories.includes(slug));
  const pageUrl = `https://${COMPANY.domain}/catalog/${slug}/${type}`;

  const jsonLd = {
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
          ...(category
            ? [{ "@type": "ListItem", position: parentGroup ? 4 : 3, name: category.title, item: `https://${COMPANY.domain}/catalog/${slug}` }]
            : []),
          { "@type": "ListItem", position: (parentGroup ? 4 : 3) + (category ? 1 : 0), name: node.name, item: pageUrl },
        ],
      },
      {
        "@type": "Product",
        name: node.name,
        category: category?.title,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <BreadcrumbNav
        crumbs={[
          { label: "Каталог", href: "/catalog" },
          ...(parentGroup ? [{ label: parentGroup.shortTitle || parentGroup.title, href: `/catalog/${parentGroup.slug}` }] : []),
          ...(category ? [{ label: category.title, href: `/catalog/${slug}` }] : []),
          { label: node.name },
        ]}
      />

      {heroImg && <link rel="preload" as="image" href={heroImg} fetchPriority="high" />}
      <section className="relative bg-slate-900 py-14" style={heroBg(heroImg, pos)}>
        {heroImg && <ImageEditOverlay slug={type} />}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center border border-orange-600/30 bg-orange-600/20 px-3 py-1.5 text-xs font-medium text-orange-400">
            {category?.title ?? "Каталог"} · оптом и в розницу
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white lg:text-4xl">
            {node.name}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            {node.summary
              ? `${node.summary} со склада в Алматы. Отметьте нужные — отправим наличие и цену.`
              : "Со склада в Алматы. Запросите наличие и цену — поможем подобрать размер."}
          </p>
        </div>
      </section>

      <div className="bg-slate-50 py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {node.description && (
            <div
              className="relative overflow-hidden rounded-lg border border-slate-200 bg-white"
              style={cardBg(getTypeImage(type) ?? getCategoryImage(slug), pos)}
            >
              <div
                className="prose prose-slate max-w-2xl p-6 text-slate-600"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(node.description) }}
              />
            </div>
          )}
          <TypeSizePicker typeName={node.name} sizes={node.sizes} category={category?.title ?? node.name} />
        </div>
      </div>

      <TrustSection />
      <FAQ />
      <Footer />
    </main>
  );
}
