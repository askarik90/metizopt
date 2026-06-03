import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingCategoryPage from "@/components/LandingCategoryPage";

export const metadata: Metadata = {
  title: "Шайбы оптом в Алматы — DIN 125, DIN 127, гровер | МетизОпт",
  description: "Шайбы оптом со склада в Алматы. Плоские DIN 125, пружинные DIN 127. Пришлите список — подготовим КП.",
};

export default function ShaybyOptomPage() {
  return (
    <>
      <Header />
      <LandingCategoryPage
        h1="Шайбы оптом в Алматы"
        description="Шайбы плоские, пружинные (гровер), усиленные оптом со склада. DIN 125, DIN 127, ГОСТ 11371. Поставки для строительных и производственных компаний РК."
        category="Шайбы"
        whatsappText="Здравствуйте! Хочу запросить цену и наличие по категории: Шайбы."
        usp={[
          "Плоские DIN 125, пружинные DIN 127",
          "Усиленные и увеличенные шайбы",
          "ГОСТ 11371 и европейские стандарты",
          "Оцинкованные и нержавеющие",
          "Оптовые партии любого размера",
          "КП за 30 минут",
        ]}
      />
      <Footer />
    </>
  );
}
