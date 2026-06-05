import { Metadata } from "next";
import ContactMap from "@/components/ContactMap";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: "Контакты | KRP.kz",
    description: `Контактная информация ТОО Bugel. Адрес: ${settings.address}. Телефон: ${settings.phone}`,
    openGraph: {
      title: "Контакты | KRP.kz",
      description: `Контактная информация ТОО Bugel. Адрес: ${settings.address}. Телефон: ${settings.phone}`,
    },
  };
}

export default async function ContactsPage() {
  const settings = await getSettings();

  return (
    <main>
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Контакты
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Свяжитесь с нами для оптовых заказов крепежа и метизов
          </p>
        </div>
      </section>

      <ContactMap settings={settings} />

      <section className="bg-orange-50 py-12 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Хотите сделать заказ?
          </h2>
          <p className="text-slate-700 mb-6">
            Отправьте список товаров и мы ответим быстро с прайс-листом
          </p>
          <a
            href="tel:+77088003150"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Позвонить сейчас
          </a>
        </div>
      </section>
    </main>
  );
}
