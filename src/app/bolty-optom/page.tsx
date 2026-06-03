import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  title: "Болты оптом в Алматы — ГОСТ, DIN, высокопрочные | МетизОпт",
  description: "Болты оптом со склада в Алматы. DIN 933, DIN 931, ГОСТ 7798, классы прочности 4.8–12.9. Пришлите список — подберём и подготовим КП.",
};

export default function BoltyOptomPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Болты оптом в Алматы"
        description="Болты шестигранные, высокопрочные и специальные оптом со склада. DIN 933, DIN 931, ГОСТ 7798. Поставки для строительных и производственных компаний Казахстана."
        category="Болты"
        whatsappText="Здравствуйте! Хочу запросить цену и наличие по категории: Болты."
        usp={[
          "Широкий ассортимент на складе в Алматы",
          "Классы прочности 4.8, 8.8, 10.9, 12.9",
          "Стандарты DIN 933, DIN 931, ГОСТ 7798",
          "Работаем с юридическими лицами",
          "Безналичная оплата, полный пакет документов",
          "КП за 30 минут после получения списка",
        ]}
      />
      <Footer />
    </>
  );
}
