import { Truck, FileText, Wrench, Package, BarChart3, Zap } from "lucide-react";

export default function TrustSection() {
  const items = [
    {
      icon: Truck,
      title: "Логистика по РК",
      desc: "Склад в Алматы. Доставка фурами, железной дорогой и сборными грузами по всем регионам Казахстана.",
    },
    {
      icon: FileText,
      title: "Документы для юрлиц",
      desc: "ЭСФ, товарные накладные, сертификаты соответствия, паспорта качества. Работаем по договору.",
    },
    {
      icon: Wrench,
      title: "Подбор аналогов",
      desc: "Нет нужной позиции — подберём аналог по ГОСТ/DIN/ISO без потери характеристик прочности.",
    },
    {
      icon: Package,
      title: "5000+ позиций на складе",
      desc: "Широкий ассортимент крепежа всегда в наличии. Болты, гайки, анкера, шайбы, шпильки и многое другое.",
    },
    {
      icon: BarChart3,
      title: "Крупные оптовые заявки",
      desc: "Основной профиль — поставки для строительных и производственных компаний. Чем больше объём, тем лучше условия.",
    },
    {
      icon: Zap,
      title: "Ответ за 30 минут",
      desc: "Пришлите список — менеджер разберёт позиции и отправит коммерческое предложение в течение 30 минут.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Почему выбирают МетизОпт
          </h2>
          <p className="text-slate-500">
            Работаем с компаниями по всему Казахстану
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white p-8">
                <div className="w-10 h-10 bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-orange-600" />
                </div>
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
