const stats = [
  { value: "5 000+", label: "позиций в наличии" },
  { value: "30 мин", label: "время ответа на заявку" },
  { value: "DIN · GOST · ISO", label: "международные стандарты" },
  { value: "Весь Казахстан", label: "зона доставки" },
];

export default function Stats() {
  return (
    <section className="bg-blue-700 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
