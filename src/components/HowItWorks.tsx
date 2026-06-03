import { Upload, Search, RefreshCw, Send } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      num: "01",
      title: "Отправьте список",
      desc: "Файл Excel, PDF, фото бумажной заявки или просто текстом в форму или WhatsApp",
    },
    {
      icon: Search,
      num: "02",
      title: "Менеджер проверяет наличие",
      desc: "Разбираем каждую позицию, проверяем остатки на складе в Алматы",
    },
    {
      icon: RefreshCw,
      num: "03",
      title: "Подбираем аналоги",
      desc: "Если позиции нет — предлагаем аналог по ГОСТ/DIN/ISO без потери характеристик",
    },
    {
      icon: Send,
      num: "04",
      title: "Получаете КП",
      desc: "Коммерческое предложение в WhatsApp или на email за 30 минут",
    },
  ];

  return (
    <section id="how" className="bg-white py-16 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Как заказать
          </h2>
          <p className="text-slate-500">
            Без регистрации, без корзины — просто пришлите список
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-white p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-orange-500 font-black text-3xl leading-none">{step.num}</span>
                  <Icon size={24} className="text-slate-400" />
                </div>
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
