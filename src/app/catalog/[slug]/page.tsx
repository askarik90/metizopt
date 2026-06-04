import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import CategoryClient from "./CategoryClient";
import { COMPANY } from "@/config/company";

export function generateStaticParams() {
  return COMPANY.categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = COMPANY.categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: cat.metaTitle,
    description: cat.metaDesc,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
