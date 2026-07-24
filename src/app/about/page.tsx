import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COMPANY } from "@/config/company";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "https://krp.kz/about" },
  openGraph: { url: "https://krp.kz/about" },
  title: "О компании — KRP",
  description: "Оптовый поставщик крепежа и метизов в Казахстане. Склад в Алматы, работа с юрлицами, документы.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-6">
              О компании KRP
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              {COMPANY.legalName} — оптовый поставщик крепежа, метизов и такелажного оборудования
              для строительных и производственных компаний Казахстана.
            </p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
                Что мы предлагаем
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-slate-600">
                <div className="border border-slate-200 p-6">
                  <h3 className="font-black text-slate-900 mb-2">5000+ позиций на складе</h3>
                  <p className="text-sm leading-relaxed">
                    Широкий ассортимент крепежа всегда в наличии в Алматы. Болты, гайки, анкера,
                    шайбы, шпильки, саморезы, такелаж, сварочные электроды.
                  </p>
                </div>
                <div className="border border-slate-200 p-6">
                  <h3 className="font-black text-slate-900 mb-2">Подбор аналогов</h3>
                  <p className="text-sm leading-relaxed">
                    Специализируемся на подборе аналогов по ГОСТ/DIN/ISO. Если нужной позиции
                    нет — предложим замену с сопоставимыми характеристиками.
                  </p>
                </div>
                <div className="border border-slate-200 p-6">
                  <h3 className="font-black text-slate-900 mb-2">Работа с юрлицами</h3>
                  <p className="text-sm leading-relaxed">
                    Основной формат работы — поставки для юридических лиц. Договор, безналичная
                    оплата, ЭСФ, накладные, сертификаты соответствия.
                  </p>
                </div>
                <div className="border border-slate-200 p-6">
                  <h3 className="font-black text-slate-900 mb-2">Доставка по Казахстану</h3>
                  <p className="text-sm leading-relaxed">
                    Отгружаем со склада в Алматы. Доставляем во все регионы РК: фурами,
                    железной дорогой, сборными грузами.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                Контакты
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Адрес склада</div>
                    <div className="text-sm">{COMPANY.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Телефон</div>
                    <a href={`tel:${COMPANY.phoneRaw}`} className="text-sm hover:text-orange-600">
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Email</div>
                    <a href={`mailto:${COMPANY.email}`} className="text-sm hover:text-orange-600">
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Режим работы</div>
                    <div className="text-sm">{COMPANY.workingHours}</div>
                    <div className="text-sm">{COMPANY.workingHoursSat}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
