import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { COMPANY } from "@/config/company";
import DesignToggle from "@/components/DesignToggle";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Крепеж оптом в Алматы — ${COMPANY.name}`,
    template: `%s | ${COMPANY.name}`,
  },
  description:
    "Оптовые поставки крепежа, метизов и такелажа в Казахстане. Болты, гайки, анкера, шайбы, шпильки. Пришлите список — подготовим КП за 30 минут.",
  openGraph: {
    title: `Крепеж оптом в Алматы — ${COMPANY.name}`,
    description: "Оптовые поставки крепежа для компаний в Казахстане. Работаем с юрлицами.",
    locale: "ru_KZ",
    type: "website",
  },
  keywords: [
    "крепеж оптом Алматы",
    "болты оптом",
    "гайки оптом",
    "метизы Казахстан",
    "анкера оптом",
    "крепеж для строительства",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className="font-sans bg-white text-slate-900 antialiased">
        {children}
        <DesignToggle />
      </body>
    </html>
  );
}
