import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { COMPANY } from "@/config/company";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const BASE_URL = `https://${COMPANY.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `Крепеж оптом в Алматы — болты, гайки, анкера | ${COMPANY.name}`,
    template: `%s | ${COMPANY.name}`,
  },
  description:
    "Оптовые поставки крепежа, метизов и такелажа в Казахстане. Болты, гайки, анкера, шайбы, шпильки. Пришлите список — подготовим КП за 30 минут.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: `Крепеж оптом в Алматы — ${COMPANY.name}`,
    description: "Оптовые поставки крепежа для компаний в Казахстане. Работаем с юрлицами.",
    locale: "ru_KZ",
    type: "website",
    url: BASE_URL,
    siteName: COMPANY.name,
  },
  keywords: [
    "крепеж оптом Алматы",
    "болты оптом",
    "гайки оптом",
    "метизы Казахстан",
    "анкера оптом",
    "крепеж для строительства",
    "такелаж оптом",
    "нержавеющий крепеж",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "7b35de64a1799e4b",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // GTM-ID публичный (виден в HTML), поэтому держим в коде; env может переопределить
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PGLT62MT";
  return (
    <html lang="ru" className={`${manrope.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      </head>
      <body className="font-sans bg-white text-slate-900 antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>

      {/* Google Ads conversion + GA4 analytics (gtag.js универсален для обоих) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-949552136"
        strategy="afterInteractive"
      />
      <Script id="gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-949552136');
          gtag('config', 'G-TLDLTKY024');
        `}
      </Script>
    </html>
  );
}
