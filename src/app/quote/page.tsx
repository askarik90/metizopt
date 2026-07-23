import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickQuoteForm from "@/components/QuickQuoteForm";

export const metadata: Metadata = {
  alternates: { canonical: "https://krp.kz/quote" },
  openGraph: { url: "https://krp.kz/quote" },
  title: "Запросить коммерческое предложение на крепеж — KRP",
  description:
    "Отправьте список крепежа в любом формате — Excel, PDF, фото. Подготовим КП за 30 минут.",
};

export default function QuotePage() {
  return (
    <>
      <Header />
      <QuickQuoteForm />
      <Footer />
    </>
  );
}
