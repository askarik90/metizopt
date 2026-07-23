import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { COMPANY } from "@/config/company";

// Серверная обёртка: главная — client-компонент и не может экспортировать metadata.
// Здесь задаём self-canonical главной (раньше он приходил из рутового layout и «протекал»
// на все дочерние страницы, делая их дублями главной).
export const metadata: Metadata = {
  alternates: { canonical: "https://krp.kz" },
  openGraph: { url: "https://krp.kz" },
};

// Organization: помогает Google опознать домен как компанию ТОО Bugel (крепёж, Алматы),
// а не как прежний контент домена. sameAs связывает витрины одной компании.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://krp.kz/#organization",
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  url: "https://krp.kz",
  email: COMPANY.email,
  telephone: `+${COMPANY.phoneRaw}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Нарынкольская, 1А",
    addressLocality: COMPANY.city,
    addressCountry: "KZ",
  },
  areaServed: "KZ",
  sameAs: ["https://bugel.kz", "https://amc.kz"],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
