const steps = [
  {
    num: "01",
    title: "Отправьте список",
    desc: "Пришлите нам список нужных позиций — в Excel, PDF, фото или просто текстом. Можно через WhatsApp, форму на сайте или email.",
  },
  {
    num: "02",
    title: "Получите ответ за 30 мин",
    desc: "Менеджер свяжется с вами, уточнит детали, проверит наличие и предоставит актуальные цены по вашей заявке.",
  },
  {
    num: "03",
    title: "Оплата и доставка",
    desc: "Оформляем документы, принимаем оплату и доставляем по Алматы и всему Казахстану. Работаем по безналу с юрлицами.",
  },
];

export default function HowToOrder() {
  return (
    <section id="how-to-order" className="py-20 bg-gray-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Как сделать заказ</h2>
          <p className="text-lg text-gray-500">Просто отправьте список — мы сделаем остальное</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-5xl font-black text-blue-100 mb-4">{step.num}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
