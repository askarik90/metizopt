import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, CreditCard, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка и оплата — МетизОпт",
  description: "Условия доставки крепежа по Казахстану. Безналичная оплата, документы для юрлиц.",
};

export default function DeliveryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-slate-900 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">
              Доставка и оплата
            </h1>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border border-slate-200 p-6">
                <Truck size={32} className="text-orange-600 mb-4" />
                <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-3">
                  Доставка
                </h2>
                <ul className="text-slate-600 text-sm space-y-2 leading-relaxed">
                  <li>Самовывоз со склада в Алматы</li>
                  <li>Доставка по Алматы — договорная</li>
                  <li>Фурами по всему Казахстану</li>
                  <li>Железнодорожные перевозки</li>
                  <li>Сборные грузы в регионы</li>
                  <li>Сроки: 1–7 рабочих дней</li>
                </ul>
              </div>

              <div className="border border-slate-200 p-6">
                <CreditCard size={32} className="text-orange-600 mb-4" />
                <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-3">
                  Оплата
                </h2>
                <ul className="text-slate-600 text-sm space-y-2 leading-relaxed">
                  <li>Безналичный расчёт (основной)</li>
                  <li>Предоплата или отсрочка</li>
                  <li>Работаем по договору поставки</li>
                  <li>НДС в цене</li>
                </ul>
              </div>

              <div className="border border-slate-200 p-6">
                <FileText size={32} className="text-orange-600 mb-4" />
                <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-3">
                  Документы
                </h2>
                <ul className="text-slate-600 text-sm space-y-2 leading-relaxed">
                  <li>Счёт на оплату</li>
                  <li>Электронный счёт-фактура (ЭСФ)</li>
                  <li>Товарная накладная</li>
                  <li>Сертификаты соответствия</li>
                  <li>Паспорта качества</li>
                  <li>Договор поставки</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
