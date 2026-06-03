import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  title: "Крепеж оптом в Алматы — болты, гайки, анкера, шайбы | МетизОпт",
  description: "Оптовые поставки крепежа в Алматы и по Казахстану. Болты, гайки, анкера, шайбы, шпильки. Пришлите список — КП за 30 минут.",
};

export default function KrepezhOptomPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Крепеж оптом в Алматы"
        description="Полный ассортимент крепежа оптом со склада в Алматы. Болты, гайки, анкера, шайбы, шпильки, саморезы, такелаж. Поставки по всему Казахстану."
        category="Крепеж"
        usp={[
          "5000+ позиций на складе в Алматы",
          "Болты, гайки, анкера, шайбы, шпильки",
          "Такелаж, саморезы, электроды",
          "ГОСТ, DIN, ISO — любые стандарты",
          "Работаем с юридическими лицами",
          "Доставка по всем регионам РК",
        ]}
      />
      <Footer />
    </>
  );
}
